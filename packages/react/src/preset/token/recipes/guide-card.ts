import { defineSlotRecipe } from "@pandacss/dev";

export const guideCard = defineSlotRecipe({
    className: "guide-card",
    jsx: ["GuideCard"],
    description: "The guide card component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "image", "content", "title", "description"],
    base: {
        root: {
            display: "grid",
            // 左に正方形の画像、右にテキストを並べる横長カード
            gridTemplateColumns: "[128px 1fr]",
            alignItems: "center",
            overflow: "hidden",
            borderRadius: "3xl",
            // 白背景・淡色背景のどちらに置いても面が見えるよう、UI 面用の surface で塗る
            bg: "colorPalette.surface",
            color: "colorPalette.fg",
            textDecoration: "none",
            transitionProperty: "background, box-shadow",
            transitionDuration: "normal",
            transitionTimingFunction: "easeInOut",
            // リンクとして使われるカードなので、hover / active で面の色を 1 段ずつ濃くして反応を返す
            _hover: {
                bg: "colorPalette.surface.hover",
            },
            _active: {
                bg: "colorPalette.surface.active",
            },
        },
        image: {
            width: "full",
            height: "full",
            aspectRatio: "square",
            objectFit: "cover",
        },
        content: {
            display: "grid",
            gap: "0.5",
            paddingY: "2",
            paddingX: "4",
            height: "fit-content",
        },
        title: {
            // 先頭にアイコン(svg)を置けるよう flex で並べる
            display: "flex",
            alignItems: "center",
            gap: "1",
            textStyle: "md",
            fontWeight: "bold",
            color: "colorPalette.fg",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
                flexShrink: 0,
            },
        },
        description: {
            textStyle: "xs",
            lineHeight: "[1.5]",
            color: "colorPalette.fg",
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
