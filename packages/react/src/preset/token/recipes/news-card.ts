import { defineSlotRecipe } from "@pandacss/dev";

export const newsCard = defineSlotRecipe({
    className: "news-card",
    jsx: ["NewsCard"],
    description: "The news card component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "thumbnail", "image", "content", "category", "title", "footer", "date"],
    base: {
        root: {
            position: "relative",
            display: "grid",
            gap: "4",
            height: "fit-content",
            color: "colorPalette.fg",
            textDecoration: "none",
            cursor: "pointer",
            zIndex: "[1]",
            // hover 時にカード全体の背後へふわっと広がるハイライト。
            // カードより一回り(12px)大きい角丸の面を after 疑似要素で敷く
            _after: {
                content: '""',
                position: "absolute",
                top: "-3",
                left: "-3",
                width: "[calc(100% + token(spacing.6))]",
                height: "[calc(100% + token(spacing.6))]",
                bg: "colorPalette.a3",
                borderRadius: "[token(radii.3xl) token(radii.3xl) token(radii.xl) token(radii.xl)]",
                zIndex: "[-1]",
                opacity: "0",
                transitionProperty: "opacity",
                transitionDuration: "normal",
                transitionTimingFunction: "easeInOut",
            },
            _hover: {
                _after: { opacity: "1" },
            },
        },
        thumbnail: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "wide",
            width: "full",
            overflow: "hidden",
            borderRadius: "2xl",
            // 画像がない場合のプレースホルダー面。淡い colorPalette の面で塗る
            bg: "colorPalette.3",
            color: "colorPalette.8",
        },
        image: {
            width: "full",
            height: "full",
            objectFit: "cover",
        },
        content: {
            display: "grid",
            gap: "0.5",
        },
        category: {
            textStyle: "sm",
            color: "colorPalette.fg",
        },
        title: {
            textStyle: "xl",
            fontWeight: "bold",
            color: "colorPalette.fg",
            // タイトルは 1 行に収め、あふれた分は省略記号にする
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2",
        },
        date: {
            textStyle: "sm",
            color: "colorPalette.fg",
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
