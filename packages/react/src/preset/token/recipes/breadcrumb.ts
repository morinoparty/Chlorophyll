import { defineSlotRecipe } from "@pandacss/dev";

export const breadcrumb = defineSlotRecipe({
    className: "breadcrumb",
    jsx: ["Breadcrumb"],
    description: "The breadcrumb component",
    // nav > ol > li の階層に対応したスロット。separator と ellipsis は読み上げ対象外の li
    slots: ["root", "list", "item", "link", "page", "separator", "ellipsis"],
    base: {
        root: {
            // <nav> landmark。幅は親に委ね、余計な見た目は持たせない
            display: "block",
        },
        list: {
            // 段(li)を横一列に並べる。幅が足りなければ折り返し、
            // 長いラベルは overflowWrap で単語の途中でも折るはみ出しを防ぐ
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1.5",
            listStyle: "none",
            margin: "0",
            padding: "0",
            fontSize: "sm",
            lineHeight: "normal",
            color: "fg.muted",
            overflowWrap: "anywhere",
        },
        item: {
            // 段ひとつ。中身(リンクや現在ページ)を縦中央に揃える。
            // minWidth: 0 で flex 子要素が内容幅を主張して親からはみ出すのを防ぐ
            display: "inline-flex",
            alignItems: "center",
            gap: "1",
            minWidth: "0",
        },
        link: {
            // 祖先ページへのリンク。既定では下線なしで控えめに見せ、
            // hover で文字を濃くして下線を出し押せることを伝える
            color: "fg.muted",
            textDecoration: "none",
            borderRadius: "sm",
            transitionDuration: "fast",
            transitionProperty: "color",
            transitionTimingFunction: "easeOut",
            _hover: {
                color: "fg",
                textDecoration: "underline",
                textUnderlineOffset: "0.2em",
            },
            // outline: "none" + ringWidth の組み合わせだと outline-style が none のまま
            // 残り、利用側でフォーカスリングが一切描かれない。longhand で style まで指定する
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "2px",
                outlineColor: "colorPalette.focus.ring",
                outlineOffset: "2px",
            },
        },
        page: {
            // 現在地。リンクではないので色を濃くし、太さでも区別する
            color: "fg",
            fontWeight: "medium",
        },
        separator: {
            // 段の区切り(chevron や "/")。読み上げ対象外の装飾なので文字色は最も薄くする。
            // アイコンは文字サイズに追従させる(1em)
            display: "inline-flex",
            alignItems: "center",
            flexShrink: "0",
            color: "fg.subtle",
            userSelect: "none",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
            },
        },
        ellipsis: {
            // 省略記号(畳んだ段の代わりに置く li)。押せないので cursor もフォーカスも持たせない
            display: "inline-flex",
            alignItems: "center",
            flexShrink: "0",
            color: "fg.muted",
            userSelect: "none",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
            },
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
