"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { useEffect, useState } from "react";
import { minecraftItem } from "styled-system/recipes";
import { MinecraftBlockModel } from "./minecraft-block-model";
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
// id からモデル JSON (item/*.json -> block/*.json) を実際にたどって種別・形状(1 つ以上の
// 直方体)・GUI 回転角を判定するため、このコンポーネント自身はどのアイテムが平面でどれが
// ブロックか、ブロックがどんな形かを一切決め打ちしない。
// ブロックは react-three-fiber で実際の立体として描画する(CSS の skew による疑似立体だと
// テクスチャの中身まで一緒に回転してしまい、木目のような方向性のあるテクスチャの向きが
// 崩れてしまうため、本物の 3D 回転を使う)。
// モデル JSON の parent 連鎖のどこにも elements が見つからない形状は非対応として描画しない
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
            <MinecraftBlockModel
                elements={resolved.elements}
                rotation={resolved.rotation}
                resolveTexture={resolveTexture}
                pixelSize={CANVAS_PIXEL_SIZE[size ?? "md"]}
            />
        </ark.div>
    );
};

export { MinecraftItem };
export type { MinecraftItemProps };
export type { ResolvedMinecraftItem } from "./resolve-minecraft-item";
