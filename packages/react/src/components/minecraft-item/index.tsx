"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { useEffect, useState } from "react";
import { minecraftItem } from "styled-system/recipes";
import { MinecraftBlockCube } from "./minecraft-block-cube";
import { type ResolvedMinecraftItem, resolveMinecraftItem } from "./resolve-minecraft-item";

interface MinecraftItemProps extends HTMLArkProps<"div"> {
    /** 表示するアイテムの ID(例: "stone" / "diamond_sword")。Minecraft のアイテム ID とそのまま対応する */
    id: string;
    /** モデル JSON のファイルパス(例: "item/stone.json" / "block/stone.json")から実際の URL を解決する関数 */
    resolveModel: (path: string) => string;
    /** テクスチャのファイル名から実際に表示する URL を解決する関数。ライブラリ側はテクスチャ画像を同梱しないため必須 */
    resolveTexture: (fileName: string) => string;
    /** アイテムスロットの大きさ */
    size?: "sm" | "md" | "lg";
}

// レシピの size variant(sm/md/lg) と一致させる、Canvas に渡す実ピクセルサイズ
const CANVAS_PIXEL_SIZE: Record<NonNullable<MinecraftItemProps["size"]>, number> = {
    sm: 32,
    md: 48,
    lg: 64,
};

// Minecraft のインベントリ GUI と同じ見た目でアイテム/ブロックを描画するコンポーネント。
// id からモデル JSON (item/*.json -> block/*.json) を実際にたどって種別・面テクスチャ・
// GUI 回転角を判定するため、このコンポーネント自身はどのアイテムが平面でどれがブロックか、
// ブロックをどの角度で見せるかを一切決め打ちしない。
// ブロックは react-three-fiber で実際の立方体として描画する(CSS の skew による疑似立体だと
// テクスチャの中身まで一緒に回転してしまい、木目のような方向性のあるテクスチャの向きが
// 崩れてしまうため、本物の 3D 回転を使う)。
// 単一立方体に帰着しない形状(階段・柵・植物など)は非対応として何も描画しない
const MinecraftItem = ({ className, id, resolveModel, resolveTexture, size, ...props }: MinecraftItemProps) => {
    const styles = minecraftItem({ size });
    const [resolved, setResolved] = useState<ResolvedMinecraftItem | null>(null);

    useEffect(() => {
        // id が変わっている間に前回の解決結果が残らないよう、まず一旦クリアする
        setResolved(null);
        let cancelled = false;

        resolveMinecraftItem(id, { resolveModel }).then((result) => {
            if (!cancelled) {
                setResolved(result);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [id, resolveModel]);

    // 解決中、または非対応の形状だった場合は何も描画しない
    if (!resolved) {
        return null;
    }

    if (resolved.type === "flat") {
        return (
            <ark.div {...props} className={styles.root.concat(" ", className || "")}>
                <img className={styles.flat} src={resolveTexture(resolved.texture)} alt={id} />
            </ark.div>
        );
    }

    return (
        <ark.div {...props} className={styles.root.concat(" ", className || "")}>
            <MinecraftBlockCube
                rotation={resolved.rotation}
                pixelSize={CANVAS_PIXEL_SIZE[size ?? "md"]}
                faces={{
                    up: resolveTexture(resolved.up),
                    down: resolveTexture(resolved.down),
                    north: resolveTexture(resolved.north),
                    south: resolveTexture(resolved.south),
                    east: resolveTexture(resolved.east),
                    west: resolveTexture(resolved.west),
                }}
            />
        </ark.div>
    );
};

export { MinecraftItem };
export type { MinecraftItemProps };
export type { ResolvedMinecraftItem } from "./resolve-minecraft-item";
