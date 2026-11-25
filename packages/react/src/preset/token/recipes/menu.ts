import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const menu = defineSlotRecipe({
    className: "menu",
    jsx: ["Menu", "MenuItem", "MenuCheckboxItem", "MenuRadioItem"],
    description: "The menu component",
    // zag/Ark の anatomy に合わせたスロット名
    // CheckboxItem / RadioItem は item の見た目を共有し、選択状態の印だけ itemIndicator で描く
    slots: ["trigger", "positioner", "content", "item", "itemGroup", "itemGroupLabel", "itemIndicator", "separator"],
    base: {
        trigger: {
            // asChild で任意の要素(IconButton など)に差し替えられる想定の最低限のフォールバック見た目
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "component.gap.xs",
            bg: "transparent",
            border: "none",
            borderRadius: "control",
            color: "colorPalette.fg",
            cursor: "pointer",
            // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
            // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
            _focusVisible: focusRing,
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
            borderRadius: "popover",
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
            borderRadius: "item",
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
        itemIndicator: {
            // CheckboxItem / RadioItem の選択状態を示すチェックの印。項目の先頭に置く
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            width: "4",
            height: "4",
            // アイコンは意味のある非テキスト要素。colorPalette.fg は白(bg.panel)の上で Lc 82.1(mori)で、目安 Lc 45 を満たす
            color: "colorPalette.fg",
            // 未選択のときは幅を確保したまま見えなくし、選択を切り替えてもラベルの位置がずれないようにする。
            // (Ark が付ける hidden 属性はコンポーネント側で外している。preflight の [hidden] は !important の display: none で、
            // レシピからは上書きできないため。visibility: hidden なので支援技術からも隠れ、選択状態は aria-checked で伝わる)
            "&[data-state=unchecked]": {
                visibility: "hidden",
            },
            "& svg": {
                width: "full",
                height: "full",
            },
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
