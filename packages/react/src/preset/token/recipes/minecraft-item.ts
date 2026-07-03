import { defineSlotRecipe } from "@pandacss/dev";

// Minecraft のインベントリ GUI と同じ見た目で、平面アイテム(剣・食料等)と
// ブロック(石・丸太等)の両方を描画するためのスロットレシピ。
//
// ブロックは CSS の skew による疑似立体ではなく react-three-fiber で実際の
// 立方体として描画する(このレシピはその Canvas を収めるスロットの大きさだけを持つ)。
// 回転角・面テクスチャ・明るさは Minecraft のモデル JSON から動的に読むため、
// ビルド時に静的な CSS へ落とし込む Panda のレシピには含められない
export const minecraftItem = defineSlotRecipe({
    className: "minecraft-item",
    jsx: ["MinecraftItem"],
    description: "The minecraft item component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "flat"],
    base: {
        root: {
            // アイテムスロット自体は正方形。中に平面画像 or 立方体の Canvas を重ねて配置する
            position: "relative",
            display: "inline-block",
        },
        flat: {
            // 平面アイテムはルート全面を占める 1 枚絵。等角変換は行わない
            display: "block",
            width: "full",
            height: "full",
            // ドット絵をぼかさずクッキリ表示する
            imageRendering: "pixelated",
        },
    },
    variants: {
        size: {
            sm: {
                root: { width: "[32px]", height: "[32px]" },
            },
            md: {
                root: { width: "[48px]", height: "[48px]" },
            },
            lg: {
                root: { width: "[64px]", height: "[64px]" },
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
