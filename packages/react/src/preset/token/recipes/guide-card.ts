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
            // カードはページの地色(colorPalette.bg)から浮かせたいので、白いパネル面で塗る
            bg: "bg.panel",
            color: "colorPalette.fg",
            textDecoration: "none",
            transitionProperty: "background, box-shadow",
            transitionDuration: "normal",
            transitionTimingFunction: "easeInOut",
            // リンクとして使われるカードなので、hover / active で面に色を差して反応を返す。
            // 白からいきなり surface(step3)まで濃くすると主張が強いので、
            // hover は surface.subtle(step2)のごく淡い色に留め、押し込んだ active で 1 段濃くする
            _hover: {
                bg: "colorPalette.surface.subtle",
            },
            _active: {
                bg: "colorPalette.surface",
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
