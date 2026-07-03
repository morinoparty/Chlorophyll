"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { minecraftItem } from "styled-system/recipes";
import { MINECRAFT_ITEMS, type MinecraftItemId } from "./minecraft-items";

interface MinecraftItemProps extends HTMLArkProps<"div"> {
    /** 表示するアイテムの ID。既知の ID は補完対象になるが、未収録の ID も文字列として受け付ける */
    id: MinecraftItemId | (string & {});
    /** テクスチャのファイル名から実際に表示する URL を解決する関数。ライブラリ側はテクスチャ画像を同梱しないため必須 */
    resolveTexture: (fileName: string) => string;
    /** アイテムスロットの大きさ */
    size?: "sm" | "md" | "lg";
}

// Minecraft のインベントリ GUI と同じ見た目でアイテム/ブロックを描画するコンポーネント。
// MINECRAFT_ITEMS のメタデータから種別を判定し、
// 平面アイテムは 1 枚絵、ブロックは 3 面等角図として自動で描き分ける
const MinecraftItem = ({ className, id, resolveTexture, size, ...props }: MinecraftItemProps) => {
    const styles = minecraftItem({ size });
    // 未収録の ID は定義が見つからないため、何も描画せず穏やかに諦める
    const definition = MINECRAFT_ITEMS[id as MinecraftItemId];

    if (!definition) {
        return null;
    }

    if (definition.type === "flat") {
        return (
            <ark.div {...props} className={styles.root.concat(" ", className || "")}>
                <img className={styles.flat} src={resolveTexture(definition.texture)} alt={id} />
            </ark.div>
        );
    }

    return (
        <ark.div {...props} className={styles.root.concat(" ", className || "")}>
            {/* 上面: もっとも明るい面 */}
            <div className={styles.top} style={{ backgroundImage: `url(${resolveTexture(definition.top)})` }} />
            {/* 左面(西向き): もっとも暗い面 */}
            <div className={styles.left} style={{ backgroundImage: `url(${resolveTexture(definition.left)})` }} />
            {/* 右面(南向き): 中間の明るさの面 */}
            <div className={styles.right} style={{ backgroundImage: `url(${resolveTexture(definition.right)})` }} />
        </ark.div>
    );
};

export { MinecraftItem };
export type { MinecraftItemProps };
export type { MinecraftItemDefinition, MinecraftItemId, MinecraftItemType } from "./minecraft-items";
export { MINECRAFT_ITEMS } from "./minecraft-items";
