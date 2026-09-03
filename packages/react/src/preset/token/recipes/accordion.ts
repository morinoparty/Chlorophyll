import { defineSlotRecipe } from "@pandacss/dev";
import { focusRingInset } from "./shared/focus-ring";

export const accordion = defineSlotRecipe({
    className: "accordion",
    jsx: ["Accordion", "AccordionItem"],
    description: "The accordion component",
    // zag/Ark の anatomy に合わせたスロット名
    slots: ["root", "item", "itemTrigger", "itemContent", "itemIndicator"],
    base: {
        root: {
            // 角丸でカード状に見せる。背景色は variant(panel/ghost)で切り替える
            display: "flex",
            flexDirection: "column",
            borderRadius: "panel",
            // 角丸からはみ出す trigger の hover 背景を切り取る
            overflow: "hidden",
            width: "full",
        },
        item: {
            // 項目同士は薄い区切り線で分ける。最後の項目は線を消す
            borderBottomWidth: "1px",
            borderBottomColor: "border.subtle",
            _last: {
                borderBottomWidth: "0",
            },
        },
        itemTrigger: {
            // 見出し行: タイトルを左・インジケーターを右に振り分ける押せる行
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "component.gap.md",
            width: "full",
            // touchTarget(44px) で押せる行高を確保する
            minHeight: "touchTarget",
            // 左右 20px / 上下 12px
            px: "component.padding.xl",
            py: "component.padding.md",
            // button のデフォルト見た目をリセットする
            bg: "transparent",
            border: "none",
            textAlign: "start",
            color: "colorPalette.fg",
            fontSize: "md",
            fontWeight: "medium",
            cursor: "pointer",
            // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
            // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
            // root が overflow:hidden で角丸を切り取るため、外側に出すリングは端が消える。
            // 行の内側に描く(負のオフセット)ことで全周が見えるようにする
            _focusVisible: focusRingInset,
            _disabled: {
                cursor: "not-allowed",
                color: "colorPalette.fg.muted",
            },
        },
        itemIndicator: {
            // chevron-down: 開閉に合わせて 180 度回転する
            display: "flex",
            flexShrink: "0",
            color: "colorPalette.fg.muted",
            transitionDuration: "normal",
            transitionProperty: "transform",
            transitionTimingFunction: "easeInOut",
            // 20px = sizes.5
            "& :where(svg)": {
                width: "5",
                height: "5",
            },
            // Ark が付与する data-state=open で上向きに反転させる
            _open: {
                transform: "rotate(180deg)",
            },
        },
        itemContent: {
            // 本文: 見出しと左を揃え、下に余白を取る
            px: "component.padding.xl",
            pb: "component.padding.lg",
            color: "colorPalette.fg.muted",
            fontSize: "sm",
            lineHeight: "relaxed",
            // 開いたときだけ滑り込みアニメーションを再生する
            _open: {
                animationName: "slideDownIn",
                animationDuration: "normal",
                animationTimingFunction: "easeOut",
            },
        },
    },
    variants: {
        // 背景の見せ方。白いカードにまとめる panel と、
        // 背景を透過してページ地の上に直接並べる ghost を用意する
        variant: {
            panel: {
                root: { bg: "bg.panel" },
            },
            ghost: {
                // 親の背景をそのまま透かし、区切り線だけで項目を仕切る
                root: { bg: "transparent" },
            },
        },
    },
    defaultVariants: {
        variant: "panel",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
