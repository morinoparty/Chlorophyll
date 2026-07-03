// Minecraft のアイテム/ブロックモデル JSON (assets/minecraft/models/**) を実際に読み、
// 平面(flat)かブロック(block)か、ブロックならどんな形状(1つ以上の直方体の集まり)で
// どのテクスチャをどう貼るか、GUI でどの角度に回すかを機械的に導出する。
// 手動でアイテムごとに種別・形状・回転角を決め打ちしない(= 実データに追従する)ためのモジュール

type MinecraftFace = "up" | "down" | "north" | "south" | "east" | "west";

const FACES: MinecraftFace[] = ["up", "down", "north", "south", "east", "west"];

interface MinecraftModelFace {
    texture: string;
    /** テクスチャ上の切り出し範囲(px, 0-16)。省略時は要素の座標から機械的に決まる */
    uv?: [number, number, number, number];
}

interface MinecraftModelElement {
    /** 直方体の始点(0-16 のブロックローカル座標) */
    from: [number, number, number];
    /** 直方体の終点(0-16 のブロックローカル座標) */
    to: [number, number, number];
    faces?: Partial<Record<MinecraftFace, MinecraftModelFace>>;
}

interface MinecraftModel {
    parent?: string;
    textures?: Record<string, string>;
    elements?: MinecraftModelElement[];
    display?: {
        gui?: {
            rotation?: number[];
        };
    };
}

// 1 面分の、解決済みテクスチャファイル名と切り出し範囲(px, 0-16)
interface ResolvedFace {
    texture: string;
    uv: [number, number, number, number];
}

// モデルを構成する直方体 1 つ分。from/to は 0-16 のブロックローカル座標のまま保持する
interface ResolvedElement {
    from: [number, number, number];
    to: [number, number, number];
    faces: Partial<Record<MinecraftFace, ResolvedFace>>;
}

type ResolvedMinecraftItem =
    | { type: "flat"; texture: string }
    | {
          type: "block";
          /** 立方体 1 個とは限らない(階段・フェンス等は複数の直方体からなる) */
          elements: ResolvedElement[];
          /** GUI 表示時にブロックを回す角度(度)。定義しているモデルがなければ block/block.json の既定値 */
          rotation: [number, number, number];
      };

// GUI 表示時の回転(display.gui.rotation)がどのモデルにも見つからない場合のフォールバック値。
// block/block.json(全ブロックの根)で定義されている既定値そのもの
const DEFAULT_GUI_ROTATION: [number, number, number] = [30, 225, 0];

// 連鎖をたどる parent の最大ホップ数。無限ループの安全弁
const MAX_PARENT_HOPS = 8;

// モデル JSON の取得結果をキャッシュする。同じアイテムが複数箇所(sm/md/lg など)で
// 描画されても、また共通の親モデルも fetch は 1 回だけで済む
const modelCache = new Map<string, Promise<MinecraftModel | null>>();

const fetchModel = (url: string): Promise<MinecraftModel | null> => {
    let cached = modelCache.get(url);
    if (!cached) {
        cached = fetch(url)
            .then((res) => (res.ok ? (res.json() as Promise<MinecraftModel>) : null))
            .catch(() => null);
        modelCache.set(url, cached);
    }
    return cached;
};

// "minecraft:block/oak_log" のような namespace 付き参照から namespace を取り除く
const stripNamespace = (ref: string): string => ref.replace(/^minecraft:/, "");

// テクスチャ参照("minecraft:block/oak_log_top" 等)から resolveTexture に渡すファイル名を作る
const toTextureFileName = (ref: string): string => {
    const stripped = stripNamespace(ref);
    const name = stripped.split("/").pop() ?? stripped;
    return name.endsWith(".png") ? name : `${name}.png`;
};

// "#side" のような変数参照を、蓄積したテクスチャ変数マップから解決する。
// 変数がさらに別の変数を指すケースにも対応するため、具体値になるまでたどる
const resolveTextureVariable = (value: string, textures: Record<string, string>): string | null => {
    let current = value;
    let guard = 0;
    while (current.startsWith("#") && guard < 5) {
        const next = textures[current.slice(1)];
        if (!next) return null;
        current = next;
        guard += 1;
    }
    return current.startsWith("#") ? null : current;
};

// uv が省略された面のデフォルト切り出し範囲を、要素の座標から機械的に求める
// (Minecraft の仕様: 面に対応する 2 軸をそのまま uv に使う)
const defaultUv = (
    face: MinecraftFace,
    from: [number, number, number],
    to: [number, number, number],
): [number, number, number, number] => {
    const [x1, y1, z1] = from;
    const [x2, y2, z2] = to;
    switch (face) {
        case "up":
        case "down":
            return [x1, z1, x2, z2];
        case "north":
        case "south":
            return [x1, y1, x2, y2];
        default:
            return [z1, y1, z2, y2];
    }
};

// モデルの elements をテクスチャ変数まで解決した ResolvedElement[] に変換する。
// いずれかの面のテクスチャ参照が解決できない場合は非対応として null を返す
const resolveElements = (
    elements: MinecraftModelElement[],
    textures: Record<string, string>,
): ResolvedElement[] | null => {
    const resolved: ResolvedElement[] = [];

    for (const element of elements) {
        const faces: Partial<Record<MinecraftFace, ResolvedFace>> = {};

        for (const face of FACES) {
            const faceDef = element.faces?.[face];
            if (!faceDef) continue;

            const rawTexture = resolveTextureVariable(faceDef.texture, textures);
            if (!rawTexture) return null;

            faces[face] = {
                texture: toTextureFileName(rawTexture),
                uv: faceDef.uv ?? defaultUv(face, element.from, element.to),
            };
        }

        resolved.push({ from: element.from, to: element.to, faces });
    }

    return resolved;
};

// item/<id>.json が参照するブロックモデルの parent 連鎖をたどり、
// 直方体の集まり(elements)と GUI 回転角を導出する。
// elements を持つ最初の(= 葉に最も近い)モデルがそのブロックの実体の形状。
// display.gui.rotation も同様に、連鎖の中で最初に見つかったものを優先する
// (block/block.json の既定値のまま使えるブロックもあれば、階段やフェンスのように
// 独自の角度を定義するブロックもあるため)
const resolveBlockModel = async (
    itemParent: string,
    resolveModel: (path: string) => string,
): Promise<{ elements: ResolvedElement[]; rotation: [number, number, number] } | null> => {
    const textures: Record<string, string> = {};
    let guiRotation: [number, number, number] | null = null;
    let currentPath = itemParent;

    for (let hop = 0; hop < MAX_PARENT_HOPS; hop += 1) {
        const model = await fetchModel(resolveModel(`${currentPath}.json`));
        if (!model) return null;

        // 先(葉)に近い階層の値ほど具体的なので、後から見つかった同名キーでは上書きしない
        for (const [key, value] of Object.entries(model.textures ?? {})) {
            if (!(key in textures)) {
                textures[key] = value;
            }
        }

        if (guiRotation === null) {
            const rotation = model.display?.gui?.rotation;
            if (rotation?.length === 3 && rotation.every((value) => typeof value === "number")) {
                guiRotation = [rotation[0], rotation[1], rotation[2]];
            }
        }

        if (model.elements?.length) {
            const elements = resolveElements(model.elements, textures);
            if (!elements) return null;
            return { elements, rotation: guiRotation ?? DEFAULT_GUI_ROTATION };
        }

        const parent = model.parent ? stripNamespace(model.parent) : null;
        if (!parent?.startsWith("block/")) return null;
        currentPath = parent;
    }

    // ホップ上限に達した = 通常のブロックモデルとして解決できない -> 非対応
    return null;
};

interface ResolveMinecraftItemOptions {
    /** モデル JSON のファイルパス(例: "item/stone.json" / "block/stone.json")から実際の URL を解決する */
    resolveModel: (path: string) => string;
}

// id からモデル JSON を実際にたどり、平面/ブロックの種別・形状・GUI 回転角を導出する。
// モデルが見つからない、あるいは parent 連鎖のどこにも elements が現れない場合は
// null を返す(= 非対応として描画しない)
const resolveMinecraftItem = async (
    id: string,
    { resolveModel }: ResolveMinecraftItemOptions,
): Promise<ResolvedMinecraftItem | null> => {
    const itemModel = await fetchModel(resolveModel(`item/${id}.json`));
    if (!itemModel) return null;

    // layer0 を自分自身で持つモデルは、handheld/generated 系の平面アイテム
    const layer0 = itemModel.textures?.layer0;
    if (layer0) {
        return { type: "flat", texture: toTextureFileName(layer0) };
    }

    const itemParent = itemModel.parent ? stripNamespace(itemModel.parent) : null;
    if (!itemParent?.startsWith("block/")) return null;

    const block = await resolveBlockModel(itemParent, resolveModel);
    if (!block) return null;

    return { type: "block", ...block };
};

export { resolveMinecraftItem };
export type { ResolvedMinecraftItem, ResolvedElement, ResolvedFace, MinecraftFace };
