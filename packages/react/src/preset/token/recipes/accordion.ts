import { defineSlotRecipe } from "@pandacss/dev";

export const accordion = defineSlotRecipe({
    className: "accordion",
    jsx: ["Accordion", "AccordionItem"],
    description: "The accordion component",
    // zag/Ark の anatomy に合わせたスロット名
    slots: ["root", "item", "itemTrigger", "itemContent", "itemIndicator"],
    base: {
        root: {
            // List と同じく白いパネルにまとめ、角丸でカード状に見せる
            display: "flex",
            flexDirection: "column",
            bg: "bg.panel",
            borderRadius: "2xl",
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
            // 左右 20px(semantic token が無いため reference token)/上下 12px
            px: "5",
            py: "component.padding.md",
            // button のデフォルト見た目をリセットする
            bg: "transparent",
            border: "none",
            textAlign: "start",
            color: "colorPalette.fg",
            fontSize: "md",
            fontWeight: "medium",
            cursor: "pointer",
            _focusVisible: {
                outline: "none",
                ringWidth: "2",
                ringColor: "colorPalette.a4",
                ringOffset: "0",
            },
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
            px: "5",
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
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
