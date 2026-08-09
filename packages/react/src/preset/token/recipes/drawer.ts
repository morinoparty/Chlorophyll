import { defineSlotRecipe } from "@pandacss/dev";

export const drawer = defineSlotRecipe({
    className: "drawer",
    jsx: ["Drawer"],
    description: "The drawer component. A dialog that slides in from a screen edge.",
    // Ark UI Dialog の anatomy に合わせたスロット名(Root はDOMを持たないため含めない)
    slots: ["trigger", "backdrop", "positioner", "content", "closeTrigger", "title"],
    base: {
        trigger: {
            // 素の見た目は最低限のリセットのみ。asChild で差し替えて使うのが基本
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            bg: "transparent",
            border: "none",
            borderRadius: "md",
            color: "colorPalette.fg",
            cursor: "pointer",
            _focusVisible: {
                outline: "none",
                ringWidth: "2",
                ringColor: "colorPalette.focus.ring",
                ringOffset: "0",
            },
            _disabled: {
                cursor: "not-allowed",
                color: "colorPalette.fg.muted",
            },
        },
        backdrop: {
            // 画面全体を覆う半透明の暗転レイヤー
            position: "fixed",
            inset: "0",
            bg: "overlay",
            zIndex: "overlay",
            // 開いたときにフェードインする
            _open: {
                animationName: "drawerFadeIn",
                animationDuration: "normal",
                animationTimingFunction: "easeOut",
            },
        },
        positioner: {
            // Content を画面端に配置するためだけのレイヤー。
            // 自身はクリックを奪わず、Content の外側は下の Backdrop までクリックを通す
            position: "fixed",
            inset: "0",
            zIndex: "modal",
            display: "flex",
            alignItems: "stretch",
            pointerEvents: "none",
        },
        content: {
            position: "relative",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            // Positioner が inset:0 + alignItems:stretch のため、Content の高さは自然にビューポート全体になる
            height: "full",
            maxHeight: "full",
            width: "full",
            maxWidth: "sm",
            bg: "bg.panel",
            boxShadow: "floating",
            outline: "none",
            overflow: "auto",
        },
        closeTrigger: {
            position: "absolute",
            insetBlockStart: "4",
            insetInlineEnd: "4",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "8",
            height: "8",
            px: "2",
            bg: "transparent",
            border: "none",
            borderRadius: "full",
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            transitionProperty: "background",
            transitionDuration: "fast",
            _hover: {
                bg: "bg.muted",
            },
            _focusVisible: {
                outline: "none",
                ringWidth: "2",
                ringColor: "colorPalette.focus.ring",
                ringOffset: "0",
            },
        },
        title: {
            color: "colorPalette.fg",
            fontSize: "lg",
            fontWeight: "semibold",
            lineHeight: "normal",
            px: "component.padding.xl",
            pt: "component.padding.xl",
        },
    },
    variants: {
        // スライド方向とアンカー位置。start = 画面左、end = 画面右
        placement: {
            start: {
                positioner: { justifyContent: "flex-start" },
                content: {
                    _open: {
                        animationName: "drawerSlideInFromStart",
                        animationDuration: "normal",
                        animationTimingFunction: "easeOut",
                    },
                },
            },
            end: {
                positioner: { justifyContent: "flex-end" },
                content: {
                    _open: {
                        animationName: "drawerSlideInFromEnd",
                        animationDuration: "normal",
                        animationTimingFunction: "easeOut",
                    },
                },
            },
        },
    },
    defaultVariants: {
        placement: "end",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
