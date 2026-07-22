import { defineSlotRecipe } from "@pandacss/dev";

export const newsCard = defineSlotRecipe({
    className: "news-card",
    jsx: ["NewsCard"],
    description: "The news card component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "thumbnail", "image", "content", "category", "title", "footer", "date", "authors", "author"],
    base: {
        root: {
            display: "grid",
            gap: "4",
            height: "fit-content",
            color: "colorPalette.fg",
            textDecoration: "none",
            cursor: "pointer",
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
            bg: "colorPalette.surface",
            color: "colorPalette.fg.subtle",
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
        authors: {
            display: "flex",
            alignItems: "center",
            // 重なり順(z-index)がカード外のレイヤーに影響しないよう閉じ込める
            isolation: "isolate",
        },
        author: {
            position: "relative",
            display: "inline-flex",
            transitionProperty: "margin, transform",
            transitionDuration: "normal",
            transitionTimingFunction: "easeInOut",
            // 2 人目以降は前の人へがっつり重ね、奥の人ほど少し傾けてトランプを扇状に持つような見た目にする。
            // アバター群(authors = group)に hover したら左へスライドして広がり、gap を空けて各人の顔が見えるようになる
            "&:not(:first-child)": {
                marginLeft: "-6",
                _groupHover: {
                    marginLeft: "1",
                },
            },
            "&:nth-child(1)": { zIndex: "[5]" },
            "&:nth-child(2)": { zIndex: "[4]", transform: "rotate(8deg)", _groupHover: { transform: "rotate(0deg)" } },
            "&:nth-child(3)": {
                zIndex: "[3]",
                transform: "rotate(16deg)",
                _groupHover: { transform: "rotate(0deg)" },
            },
            "&:nth-child(4)": {
                zIndex: "[2]",
                transform: "rotate(24deg)",
                _groupHover: { transform: "rotate(0deg)" },
            },
            // 5 人目以降はこれ以上傾けず、いちばん奥へ揃えて置く
            "&:nth-child(n+5)": {
                zIndex: "[1]",
                transform: "rotate(32deg)",
                _groupHover: { transform: "rotate(0deg)" },
            },
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
