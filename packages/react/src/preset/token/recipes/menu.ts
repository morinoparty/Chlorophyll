import { defineSlotRecipe } from "@pandacss/dev";

export const menu = defineSlotRecipe({
    className: "menu",
    jsx: ["Menu", "MenuItem"],
    description: "The menu component",
    // zag/Ark の anatomy に合わせたスロット名
    slots: ["trigger", "positioner", "content", "item", "itemGroup", "itemGroupLabel", "separator"],
    base: {
        trigger: {
            // asChild で任意の要素(IconButton など)に差し替えられる想定の最低限のフォールバック見た目
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "component.gap.xs",
            bg: "transparent",
            border: "none",
            borderRadius: "lg",
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
        positioner: {
            // 実際の位置決めは zag のインラインスタイルが担う。重なり順だけここで持つ。
            // ただし zag は `z-index: var(--z-index)` を **インラインで** 当てるため、
            // クラス側の zIndex は必ず負ける。変数そのものを与えて重なり順を通す
            // zag は positioner に `--z-index: auto; z-index: var(--z-index)` を
            // **インラインで** 当てるため、クラス側の指定は !important でないと勝てない
            zIndex: "popover!",
        },
        content: {
            // ポップオーバー風カード: 白背景・角丸・浮き上がる影
            display: "flex",
            flexDirection: "column",
            minWidth: "48",
            maxHeight: "96",
            overflowY: "auto",
            bg: "bg.panel",
            borderWidth: "1px",
            borderColor: "border.subtle",
            borderRadius: "xl",
            boxShadow: "floating",
            p: "1.5",
            outline: "none",
            // Ark が付与する data-state=open で開閉アニメーションを再生する
            _open: {
                animationName: "slideDownIn",
                animationDuration: "fast",
                animationTimingFunction: "easeOut",
            },
        },
        item: {
            display: "flex",
            alignItems: "center",
            gap: "component.gap.sm",
            borderRadius: "md",
            px: "component.padding.md",
            py: "component.padding.sm",
            fontSize: "sm",
            color: "colorPalette.fg",
            cursor: "pointer",
            userSelect: "none",
            outline: "none",
            transitionDuration: "fast",
            transitionProperty: "background, color",
            transitionTimingFunction: "easeInOut",
            // キーボード操作 / ポインター両方で Ark が付与する data-highlighted な行の見た目
            _highlighted: {
                bg: "colorPalette.surface",
                color: "colorPalette.fg",
            },
            _disabled: {
                cursor: "not-allowed",
                color: "fg.disabled",
                _highlighted: {
                    bg: "transparent",
                },
            },
        },
        itemGroup: {
            display: "flex",
            flexDirection: "column",
        },
        itemGroupLabel: {
            px: "component.padding.md",
            pt: "component.padding.sm",
            pb: "1",
            fontSize: "xs",
            fontWeight: "semibold",
            letterSpacing: "wide",
            textTransform: "uppercase",
            color: "fg.muted",
        },
        separator: {
            height: "1px",
            border: "none",
            bg: "border.subtle",
            mx: "1",
            my: "1.5",
        },
    },
    variants: {
        // 通常項目(colorPalette 追従)と、削除/ログアウトなど危険な操作向けの danger を用意
        variant: {
            default: {
                item: {},
            },
            danger: {
                item: {
                    color: "red.fg",
                    _highlighted: {
                        bg: "red.surface",
                        color: "red.fg",
                    },
                },
            },
        },
    },
    defaultVariants: {
        variant: "default",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
