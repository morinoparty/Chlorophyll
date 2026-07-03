"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { useEffect, useState } from "react";
import { minecraftItem } from "styled-system/recipes";
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

// Minecraft のインベントリ GUI と同じ見た目でアイテム/ブロックを描画するコンポーネント。
// id からモデル JSON (item/*.json -> block/*.json) を実際にたどって種別と面テクスチャを判定するため、
// このコンポーネント自身はどのアイテムが平面でどのアイテムがブロックかを一切決め打ちしない。
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
            {/* 上面: もっとも明るい面 */}
            <div className={styles.top} style={{ backgroundImage: `url(${resolveTexture(resolved.top)})` }} />
            {/* 左面(east 相当): もっとも暗い面 */}
            <div className={styles.left} style={{ backgroundImage: `url(${resolveTexture(resolved.left)})` }} />
            {/* 右面(north 相当): 中間の明るさの面 */}
            <div className={styles.right} style={{ backgroundImage: `url(${resolveTexture(resolved.right)})` }} />
        </ark.div>
    );
};

export { MinecraftItem };
export type { MinecraftItemProps };
export type { ResolvedMinecraftItem } from "./resolve-minecraft-item";
