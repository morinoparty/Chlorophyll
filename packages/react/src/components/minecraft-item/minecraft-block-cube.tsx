"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Color, MathUtils, NearestFilter, SRGBColorSpace, TextureLoader } from "three";

interface MinecraftBlockFaces {
    up: string;
    down: string;
    north: string;
    south: string;
    east: string;
    west: string;
}

interface MinecraftBlockCubeProps {
    /** 6 面それぞれのテクスチャ URL(resolveTexture で解決済みのもの) */
    faces: MinecraftBlockFaces;
    /** GUI 表示時の回転角(度)。block/block.json の display.gui.rotation そのもの */
    rotation: [number, number, number];
    /** Canvas の一辺の実ピクセル数。正投影カメラの zoom(px 基準)を決めるのに使う */
    pixelSize: number;
}

// Minecraft の GUI ブロック描画は動的なライティングを行わず、面ごとに固定の明るさ
// (getShade 相当: 上=1.0, 下=0.5, 北/南=0.8, 東/西=0.6)をテクスチャに掛け合わせるだけ。
// MeshBasicMaterial は光源なしで color がテクスチャに乗算されるため、そのまま再現できる
const FACE_BRIGHTNESS: Record<keyof MinecraftBlockFaces, number> = {
    up: 1,
    down: 0.5,
    north: 0.8,
    south: 0.8,
    east: 0.6,
    west: 0.6,
};

// BoxGeometry の material 配列に対応する面の並び(+X, -X, +Y, -Y, +Z, -Z)。
// Minecraft のワールド座標(X+=east, Y+=up, Z+=south)は three.js の座標系にそのまま対応する
const FACE_BY_MATERIAL_INDEX: (keyof MinecraftBlockFaces)[] = ["east", "west", "up", "down", "south", "north"];

// 1 面分のテクスチャを読み込み、ドット絵をぼかさず(pixelated 相当)明るさを乗せて貼る
const CubeFaceMaterial = ({ attach, url, brightness }: { attach: string; url: string; brightness: number }) => {
    const texture = useLoader(TextureLoader, url);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.colorSpace = SRGBColorSpace;
    const color = useMemo(() => new Color(brightness, brightness, brightness), [brightness]);

    return <meshBasicMaterial attach={attach} map={texture} color={color} toneMapped={false} />;
};

const CubeMesh = ({ faces, rotation }: Pick<MinecraftBlockCubeProps, "faces" | "rotation">) => {
    // block/block.json の display.gui.rotation ([30, 225, 0]) は Minecraft の座標系そのままで、
    // three.js の Euler(XYZ 順)にも変換なしで一致する(検証済み)
    const [rx, ry, rz] = rotation.map(MathUtils.degToRad);

    return (
        <mesh rotation={[rx, ry, rz]}>
            <boxGeometry args={[1, 1, 1]} />
            {FACE_BY_MATERIAL_INDEX.map((face, index) => (
                <CubeFaceMaterial
                    key={face}
                    attach={`material-${index}`}
                    url={faces[face]}
                    brightness={FACE_BRIGHTNESS[face]}
                />
            ))}
        </mesh>
    );
};

// react-three-fiber の既定正投影カメラは resize のたびに
// left/right/top/bottom を Canvas の実ピクセルサイズへ強制的に合わせ直すため、
// 見た目の大きさは zoom(1 ワールド単位あたりの px 数)でしか調整できない。
// 等角回転した 1x1x1 立方体の投影像はおよそ 1.8 ワールド単位分の大きさになるため、
// スロットの 90% 程度を占めるように zoom を Canvas の実ピクセルサイズから逆算する
const PROJECTED_CUBE_EXTENT = 1.8;
const FILL_RATIO = 0.9;

// Minecraft のインベントリ GUI と同じ、正投影(パースなし)のブロック等角図を
// react-three-fiber で実際の立方体として描画するコンポーネント
const MinecraftBlockCube = ({ faces, rotation, pixelSize }: MinecraftBlockCubeProps) => {
    const zoom = (pixelSize * FILL_RATIO) / PROJECTED_CUBE_EXTENT;

    return (
        <Canvas
            orthographic
            flat
            camera={{ position: [0, 0, 10], zoom, near: 0.1, far: 100 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: "100%", height: "100%" }}
        >
            <Suspense fallback={null}>
                <CubeMesh faces={faces} rotation={rotation} />
            </Suspense>
        </Canvas>
    );
};

export { MinecraftBlockCube };
export type { MinecraftBlockCubeProps, MinecraftBlockFaces };
