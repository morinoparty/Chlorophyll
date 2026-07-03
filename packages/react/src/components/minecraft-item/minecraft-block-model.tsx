"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Color, MathUtils, NearestFilter, RepeatWrapping, SRGBColorSpace, type Texture, TextureLoader } from "three";
import type { MinecraftFace, ResolvedElement, ResolvedFace } from "./resolve-minecraft-item";

interface MinecraftBlockModelProps {
    /** ブロックを構成する直方体の集まり(階段・フェンス等は複数個になる) */
    elements: ResolvedElement[];
    /** GUI 表示時の回転角(度)。モデルの display.gui.rotation そのもの */
    rotation: [number, number, number];
    /** テクスチャのファイル名から実際に表示する URL を解決する関数 */
    resolveTexture: (fileName: string) => string;
    /** Canvas の一辺の実ピクセル数。正投影カメラの zoom(px 基準)を決めるのに使う */
    pixelSize: number;
}

// Minecraft の GUI ブロック描画は動的なライティングを行わず、面ごとに固定の明るさ
// (getShade 相当: 上=1.0, 下=0.5, 北/南=0.8, 東/西=0.6)をテクスチャに掛け合わせるだけ。
// MeshBasicMaterial は光源なしで color がテクスチャに乗算されるため、そのまま再現できる
const FACE_BRIGHTNESS: Record<MinecraftFace, number> = {
    up: 1,
    down: 0.5,
    north: 0.8,
    south: 0.8,
    east: 0.6,
    west: 0.6,
};

// BoxGeometry の material 配列に対応する面の並び(+X, -X, +Y, -Y, +Z, -Z)。
// Minecraft のワールド座標(X+=east, Y+=up, Z+=south)は three.js の座標系にそのまま対応する
const FACE_BY_MATERIAL_INDEX: MinecraftFace[] = ["east", "west", "up", "down", "south", "north"];

// 面が定義されていない箇所(他の直方体に隠れて Minecraft 側でも描画されない内部面)は
// 何も貼らず透明にする
const InvisibleFaceMaterial = ({ attach }: { attach: string }) => (
    <meshBasicMaterial attach={attach} transparent opacity={0} depthWrite={false} />
);

// テクスチャの一部だけを切り出して 1 面に貼る。同じテクスチャ画像を複数の面が
// 異なる範囲で参照するため、base テクスチャをそのまま使わず面ごとに clone してから
// offset/repeat を設定する(共有インスタンスを直接書き換えると他の面まで影響してしまう)
const CroppedFaceMaterial = ({
    attach,
    url,
    face,
    brightness,
}: {
    attach: string;
    url: string;
    face: ResolvedFace;
    brightness: number;
}) => {
    const base = useLoader(TextureLoader, url);

    const texture = useMemo<Texture>(() => {
        const [x1, y1, x2, y2] = face.uv;
        // Minecraft の uv は画像上端を y=0 とする px 座標(0-16)。
        // three.js のデフォルト UV(flipY 済み)は下端が v=0 になるため、縦方向だけ反転する
        const u1 = x1 / 16;
        const u2 = x2 / 16;
        const v1 = 1 - y1 / 16;
        const v2 = 1 - y2 / 16;

        const cropped = base.clone();
        cropped.needsUpdate = true;
        cropped.wrapS = RepeatWrapping;
        cropped.wrapT = RepeatWrapping;
        cropped.magFilter = NearestFilter;
        cropped.minFilter = NearestFilter;
        cropped.colorSpace = SRGBColorSpace;
        cropped.offset.set(u1, Math.min(v1, v2));
        cropped.repeat.set(u2 - u1, Math.abs(v2 - v1));
        return cropped;
    }, [base, face.uv[0], face.uv[1], face.uv[2], face.uv[3]]);

    const color = useMemo(() => new Color(brightness, brightness, brightness), [brightness]);

    return <meshBasicMaterial attach={attach} map={texture} color={color} toneMapped={false} />;
};

interface ElementMeshProps {
    element: ResolvedElement;
    resolveTexture: (fileName: string) => string;
}

// 直方体 1 個分。Minecraft のブロックローカル座標(0-16 が 1 ブロック分)を
// three.js のワールド単位(1 ブロック = 1 unit、中心が原点)に変換する
const ElementMesh = ({ element, resolveTexture }: ElementMeshProps) => {
    const { from, to, faces } = element;
    const size: [number, number, number] = [(to[0] - from[0]) / 16, (to[1] - from[1]) / 16, (to[2] - from[2]) / 16];
    const position: [number, number, number] = [
        (from[0] + to[0]) / 32 - 0.5,
        (from[1] + to[1]) / 32 - 0.5,
        (from[2] + to[2]) / 32 - 0.5,
    ];

    return (
        <mesh position={position}>
            <boxGeometry args={size} />
            {FACE_BY_MATERIAL_INDEX.map((face, index) => {
                const faceDef = faces[face];
                return faceDef ? (
                    <CroppedFaceMaterial
                        key={face}
                        attach={`material-${index}`}
                        url={resolveTexture(faceDef.texture)}
                        face={faceDef}
                        brightness={FACE_BRIGHTNESS[face]}
                    />
                ) : (
                    <InvisibleFaceMaterial key={face} attach={`material-${index}`} />
                );
            })}
        </mesh>
    );
};

const BlockModel = ({
    elements,
    rotation,
    resolveTexture,
}: Pick<MinecraftBlockModelProps, "elements" | "rotation" | "resolveTexture">) => {
    // モデルの display.gui.rotation(例: [30, 225, 0])は Minecraft の座標系そのままで、
    // three.js の Euler(XYZ 順)にも変換なしで一致する(検証済み)
    const [rx, ry, rz] = rotation.map(MathUtils.degToRad);

    return (
        <group rotation={[rx, ry, rz]}>
            {elements.map((element, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: 要素の並びはモデル JSON 由来で安定している
                <ElementMesh key={index} element={element} resolveTexture={resolveTexture} />
            ))}
        </group>
    );
};

// 等角回転した 1x1x1 ブロックの投影像はおよそ 1.8 ワールド単位分の大きさになる。
// react-three-fiber の既定正投影カメラは resize のたびに left/right/top/bottom を
// Canvas の実ピクセルサイズへ強制的に合わせ直すため、見た目の大きさは
// zoom(1 ワールド単位あたりの px 数)でしか調整できない
const PROJECTED_EXTENT = 1.8;
const FILL_RATIO = 0.9;

// Minecraft のインベントリ GUI と同じ、正投影(パースなし)のブロックを
// react-three-fiber で実際に立体として描画するコンポーネント。
// 立方体 1 個とは限らず、階段やフェンスのように複数の直方体からなる形状にも対応する
const MinecraftBlockModel = ({ elements, rotation, resolveTexture, pixelSize }: MinecraftBlockModelProps) => {
    const zoom = (pixelSize * FILL_RATIO) / PROJECTED_EXTENT;

    return (
        <Canvas
            orthographic
            flat
            camera={{ position: [0, 0, 10], zoom, near: 0.1, far: 100 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%" }}
        >
            <Suspense fallback={null}>
                <BlockModel elements={elements} rotation={rotation} resolveTexture={resolveTexture} />
            </Suspense>
        </Canvas>
    );
};

export { MinecraftBlockModel };
export type { MinecraftBlockModelProps };
