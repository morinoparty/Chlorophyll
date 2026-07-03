import { defineSlotRecipe } from "@pandacss/dev";

// Minecraft のインベントリ GUI と同じ見た目で、平面アイテム(剣・食料等)と
// 3 面等角図のブロック(石・丸太等)の両方を描画するためのスロットレシピ。
//
// ブロックの等角投影は正六角形の外形(外接半径 = 辺の長さ S)になるよう
// rotate → skewX → scaleY を合成して導出した値を使用する。
// 3 つの面の rotate は 120° ずつ(210deg / 90deg / -30deg)ずれており、
// skewX と scaleY はすべての面で共通 -> 真の等角投影であることの検算にもなる
export const minecraftItem = defineSlotRecipe({
    className: "minecraft-item",
    jsx: ["MinecraftItem"],
    description: "The minecraft item component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "top", "left", "right", "flat"],
    base: {
        root: {
            // アイテムスロット自体は正方形。中に平面画像 or 立方体シーンを重ねて配置する
            position: "relative",
            display: "inline-block",
        },
        // 立方体の各面に共通する土台のスタイル。
        // 面の中心となる頂点をルートの中央(50%, 50%)に合わせ、
        // transform-origin をその頂点(左上角)に固定してから回転・せん断・拡縮する
        top: {
            position: "absolute",
            top: "[50%]",
            left: "[50%]",
            transformOrigin: "0 0",
            backgroundRepeat: "no-repeat",
            // テクスチャを面いっぱいに引き伸ばす(タイリングさせない)
            backgroundSize: "100% 100%",
            // ドット絵をぼかさずクッキリ表示する
            imageRendering: "pixelated",
            // 上面: もっとも明るい(Minecraft の UP 面相当)
            transform: "rotate(210deg) skewX(-30deg) scaleY(0.866)",
            filter: "brightness(1)",
        },
        left: {
            position: "absolute",
            top: "[50%]",
            left: "[50%]",
            transformOrigin: "0 0",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            imageRendering: "pixelated",
            // 左面(西向き): もっとも暗い(Minecraft の WEST/EAST 面相当)
            transform: "rotate(90deg) skewX(-30deg) scaleY(0.866)",
            filter: "brightness(0.6)",
        },
        right: {
            position: "absolute",
            top: "[50%]",
            left: "[50%]",
            transformOrigin: "0 0",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            imageRendering: "pixelated",
            // 右面(南向き): 中間の明るさ(Minecraft の NORTH/SOUTH 面相当)
            transform: "rotate(-30deg) skewX(-30deg) scaleY(0.866)",
            filter: "brightness(0.8)",
        },
        flat: {
            // 平面アイテムはルート全面を占める 1 枚絵。等角変換は行わない
            display: "block",
            width: "full",
            height: "full",
            imageRendering: "pixelated",
        },
    },
    variants: {
        size: {
            // 立方体の辺の長さ S はルートの半分(N/2)。
            // 六角形の外接ボックスは幅 S*√3・高さ 2S になるため、
            // 高さ 2S をルートの一辺 N に一致させることで各面がスロット内に収まる
            sm: {
                root: { width: "[32px]", height: "[32px]" },
                top: { width: "[16px]", height: "[16px]" },
                left: { width: "[16px]", height: "[16px]" },
                right: { width: "[16px]", height: "[16px]" },
            },
            md: {
                root: { width: "[48px]", height: "[48px]" },
                top: { width: "[24px]", height: "[24px]" },
                left: { width: "[24px]", height: "[24px]" },
                right: { width: "[24px]", height: "[24px]" },
            },
            lg: {
                root: { width: "[64px]", height: "[64px]" },
                top: { width: "[32px]", height: "[32px]" },
                left: { width: "[32px]", height: "[32px]" },
                right: { width: "[32px]", height: "[32px]" },
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
