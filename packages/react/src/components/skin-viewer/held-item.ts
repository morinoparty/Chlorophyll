import type { SkinObject } from "skinview3d";
import {
    BoxGeometry,
    Color,
    Group,
    InstancedMesh,
    Matrix4,
    MeshStandardMaterial,
    PointLight,
    SRGBColorSpace,
} from "three";
import {
    fetchModel,
    MAX_PARENT_HOPS,
    type MinecraftModelTransform,
    stripNamespace,
    toTextureFileName,
} from "../minecraft-item/resolve-minecraft-item";

type Hand = "right" | "left";

interface ResolvedTransform {
    rotation: [number, number, number];
    translation: [number, number, number];
    scale: [number, number, number];
}

interface ResolvedHeldItem {
    /** resolveTexture に渡す layer0 のテクスチャファイル名 */
    texture: string;
    /** display.thirdperson_righthand の変換 */
    transform: ResolvedTransform;
}

interface HeldItemResolvers {
    resolveModel: (path: string) => string;
    resolveTexture: (fileName: string) => string;
}

interface HeldItem {
    /** 腕に取り付けるルートオブジェクト */
    object: Group;
    /** 腕から外し、GPU リソースを解放する */
    dispose: () => void;
}

// item/generated.json の thirdperson_righthand。連鎖のどこにも display が無い場合に使う
const DEFAULT_THIRD_PERSON_TRANSFORM: ResolvedTransform = {
    rotation: [0, 0, 0],
    translation: [0, 3, 1],
    scale: [0.55, 0.55, 0.55],
};

// 手に持つと周囲を照らすアイテム。色は炎の色味に合わせる
const LIGHT_EMITTING_ITEMS: Record<string, number> = {
    torch: 0xffa040,
    soul_torch: 0x60d0ff,
    redstone_torch: 0xff4020,
};

// Minecraft の cutout 描画と同じく、アルファが 0.1 未満のピクセルは描画しない
const ALPHA_CUTOFF = 0.1 * 255;

const DEG_TO_RAD = Math.PI / 180;

const toVector3 = (values: number[] | undefined, fallback: [number, number, number]): [number, number, number] =>
    values?.length === 3 && values.every((value) => typeof value === "number")
        ? [values[0], values[1], values[2]]
        : fallback;

const toResolvedTransform = (transform: MinecraftModelTransform): ResolvedTransform => ({
    rotation: toVector3(transform.rotation, [0, 0, 0]),
    translation: toVector3(transform.translation, [0, 0, 0]),
    scale: toVector3(transform.scale, [1, 1, 1]),
});

// item/<id>.json から parent 連鎖をたどり、layer0 テクスチャと三人称の右手 display を集める。
// 葉に近いモデルの値を優先する。block/ を親に持つブロックアイテムは平面スプライトではないため非対応(null)
const resolveHeldItem = async (
    id: string,
    resolveModel: (path: string) => string,
): Promise<ResolvedHeldItem | null> => {
    let texture: string | null = null;
    let transform: ResolvedTransform | null = null;
    let currentPath = `item/${id}`;

    for (let hop = 0; hop < MAX_PARENT_HOPS; hop += 1) {
        const model = await fetchModel(resolveModel(`${currentPath}.json`));
        if (!model) {
            return null;
        }

        const layer0 = model.textures?.layer0;
        if (texture === null && layer0) {
            texture = toTextureFileName(layer0);
        }
        const thirdPerson = model.display?.thirdperson_righthand;
        if (transform === null && thirdPerson) {
            transform = toResolvedTransform(thirdPerson);
        }

        const parent = model.parent ? stripNamespace(model.parent) : null;
        // builtin/generated が平面スプライトを押し出す組み込みモデルの根
        if (!parent || parent === "builtin/generated") {
            break;
        }
        if (parent.startsWith("block/")) {
            return null;
        }
        currentPath = parent;
    }

    if (!texture) {
        return null;
    }
    return { texture, transform: transform ?? DEFAULT_THIRD_PERSON_TRANSFORM };
};

const loadImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        // ピクセルを読み出すため、別オリジンの画像は CORS 付きで読み込む
        image.crossOrigin = "anonymous";
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });

// スプライトの各ピクセルを 1x1x1 のボクセルにした InstancedMesh を作る(Minecraft の generated モデルと同じ押し出し)。
// 座標はモデル空間(0-16 の y 上向き)で、厚みは z=7.5〜8.5
const createSpriteMesh = (image: HTMLImageElement): InstancedMesh => {
    // アニメーションするテクスチャは縦に連なっているので、先頭の正方形 1 コマだけを使う
    const size = image.width;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Failed to get 2D context for item texture.");
    }
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, size, size);

    // 高解像度リソースパックでも 16 単位に収まるよう、1 ピクセルの大きさを合わせる
    const pixelSize = 16 / size;
    const opaquePixels: { u: number; v: number; color: Color }[] = [];
    for (let v = 0; v < size; v += 1) {
        for (let u = 0; u < size; u += 1) {
            const offset = (v * size + u) * 4;
            if (data[offset + 3] < ALPHA_CUTOFF) {
                continue;
            }
            const color = new Color().setRGB(
                data[offset] / 255,
                data[offset + 1] / 255,
                data[offset + 2] / 255,
                SRGBColorSpace,
            );
            opaquePixels.push({ u, v, color });
        }
    }

    const mesh = new InstancedMesh(
        new BoxGeometry(pixelSize, pixelSize, 1),
        new MeshStandardMaterial(),
        opaquePixels.length,
    );
    const matrix = new Matrix4();
    opaquePixels.forEach(({ u, v, color }, index) => {
        // テクスチャの v は下向き、モデル空間の y は上向きなので反転する
        matrix.makeTranslation((u + 0.5) * pixelSize, 16 - (v + 0.5) * pixelSize, 8);
        mesh.setMatrixAt(index, matrix);
        mesh.setColorAt(index, color);
    });
    return mesh;
};

// skinview3d の腕の原点(肩)から、手に持ったアイテムのモデル空間までの変換を Group の入れ子で組み立てる。
// Minecraft の ItemInHandLayer と ItemTransform.apply の処理順をそのまま再現している
const createHandTransform = (hand: Hand, transform: ResolvedTransform, sprite: InstancedMesh) => {
    const sign = hand === "left" ? -1 : 1;

    // Minecraft のモデル空間は y が下向き・正面が -z。skinview3d は y が上向き・正面が +z なので、
    // x 軸まわりに 180 度回すと座標系が一致する(原点はどちらも腕の付け根)
    const root = new Group();
    root.name = `${hand}-hand-item`;
    root.rotation.x = Math.PI;

    // ItemInHandLayer: X 軸 -90 度、Y 軸 180 度回してから手の位置へ移動する(単位は px)
    const hold = new Group();
    hold.rotation.set(-Math.PI / 2, Math.PI, 0, "XYZ");
    const handOffset = new Group();
    handOffset.position.set(sign * 1, 2, -10);

    // ItemTransform.apply: 左手は x の平行移動と y/z の回転を反転して右手の変換を鏡映する
    const display = new Group();
    const [tx, ty, tz] = transform.translation;
    const [rx, ry, rz] = transform.rotation;
    display.position.set(sign * tx, ty, tz);
    display.rotation.set(rx * DEG_TO_RAD, sign * ry * DEG_TO_RAD, sign * rz * DEG_TO_RAD, "XYZ");
    display.scale.set(...transform.scale);

    // モデル空間(0-16)の中心を原点に合わせる
    const center = new Group();
    center.position.set(-8, -8, -8);

    center.add(sprite);
    display.add(center);
    handOffset.add(display);
    hold.add(handOffset);
    root.add(hold);
    return root;
};

// 光るアイテムにゆらぐ点光源を付ける。ライトの位置はスプライト上部(炎のあたり)
const attachLight = (sprite: InstancedMesh, color: number) => {
    const light = new PointLight(color, 0, 24, 1);
    light.position.set(8, 12, 8);
    sprite.parent?.add(light);

    // skinview3d の描画ループに合わせて毎フレーム呼ばれる。周期の異なる sin を重ねて不規則にゆらす
    sprite.onBeforeRender = () => {
        const t = performance.now() / 1000;
        light.intensity = 12 + Math.sin(t * 7) * 2 + Math.sin(t * 13) * 1.5;
    };
    return light;
};

// アイテム ID のモデルとテクスチャを読み込み、指定した手に持たせる。
// 平面スプライトとして解決できないアイテム(ブロックなど)は null を返す
const loadHeldItem = async (
    skin: SkinObject,
    hand: Hand,
    id: string,
    { resolveModel, resolveTexture }: HeldItemResolvers,
): Promise<HeldItem | null> => {
    const resolved = await resolveHeldItem(id, resolveModel);
    if (!resolved) {
        return null;
    }
    const image = await loadImage(resolveTexture(resolved.texture));

    const sprite = createSpriteMesh(image);
    const object = createHandTransform(hand, resolved.transform, sprite);
    const lightColor = LIGHT_EMITTING_ITEMS[id];
    const light = lightColor === undefined ? null : attachLight(sprite, lightColor);

    // slim(3px 腕)は腕の中心が内側に 0.5px ずれるので、Minecraft と同じく持つ位置も寄せる。
    // スキンの読み込みで modelType が後から変わるため、描画のたびに追従させる
    const followModelType = sprite.onBeforeRender;
    sprite.onBeforeRender = (...args) => {
        object.position.x = skin.modelType === "slim" ? (hand === "left" ? -0.5 : 0.5) : 0;
        followModelType.apply(sprite, args);
    };

    const arm = hand === "left" ? skin.leftArm : skin.rightArm;
    arm.add(object);

    return {
        object,
        dispose: () => {
            object.removeFromParent();
            sprite.geometry.dispose();
            (sprite.material as MeshStandardMaterial).dispose();
            sprite.dispose();
            light?.dispose();
        },
    };
};

export { loadHeldItem };
export type { Hand, HeldItem, HeldItemResolvers };
