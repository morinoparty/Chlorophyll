import { defineSemanticTokens } from "@pandacss/dev";

/**
 * Spacing semantic tokens
 * padding / gap / margin など「余白」に使うトークン。
 * component.* は 4px 刻みの T シャツサイズ(xs 4 / sm 8 / md 12 / lg 16 / xl 20 / 2xl 24)。
 * アイコンやアバターの大きさ、タッチターゲットは sizes.ts 側にある
 */
export const spacing = defineSemanticTokens.spacing({
    component: {
        padding: {
            xs: { value: "{spacing.1}" },
            sm: { value: "{spacing.2}" },
            md: { value: "{spacing.3}" },
            lg: { value: "{spacing.4}" },
            xl: { value: "{spacing.5}" },
            "2xl": { value: "{spacing.6}" },
        },
        gap: {
            xs: { value: "{spacing.1}" },
            sm: { value: "{spacing.2}" },
            md: { value: "{spacing.3}" },
            lg: { value: "{spacing.4}" },
            xl: { value: "{spacing.5}" },
            "2xl": { value: "{spacing.6}" },
        },
    },
    layout: {
        gutter: { value: "{spacing.4}" },
        section: { value: "{spacing.16}" },
    },
    focus: {
        ring: {
            // フォーカスリングと要素の間の余白(2px)。recipes/shared/focus-ring.ts から outlineOffset として参照する
            offset: { value: "{spacing.0.5}" },
        },
    },
});
