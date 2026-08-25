import { defineRecipe } from "@pandacss/dev";

export const separator = defineRecipe({
    className: "separator",
    jsx: ["Separator"],
    description: "The separator component",
    // orientation は実行時に動的指定されるため、全 variant の CSS を常に生成する
    staticCss: ["*"],
    base: {
        // flex コンテナ内で他の要素に押しつぶされて 1px の線が消えないようにする
        flexShrink: 0,
        // hr 相当の要素でも既定の枠線が出ないようにし、背景色だけで線を描く
        border: "none",
        // 控えめな区切り線として、最も薄い border トークンを使う。
        // menu の separator スロットと同じ色にして、アプリ内で線の濃さを揃える
        bg: "border.subtle",
    },
    variants: {
        orientation: {
            // 横線: 親の幅いっぱいに広がる 1px の線
            horizontal: {
                width: "100%",
                height: "1px",
            },
            // 縦線: flex ツールバー内では alignSelf: stretch で親の高さいっぱいに伸びる。
            // flex の外(高さが決まらない文脈)に置かれた場合でも線が消えないよう、
            // minHeight に 1em を与えて文字 1 行分の高さを確保する
            vertical: {
                width: "1px",
                alignSelf: "stretch",
                minHeight: "1em",
            },
        },
    },
    defaultVariants: {
        orientation: "horizontal",
    },
});
