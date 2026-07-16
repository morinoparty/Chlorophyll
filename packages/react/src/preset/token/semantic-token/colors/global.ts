import { defineSemanticTokens } from "@pandacss/dev";

/**
 * グローバルセマンティックカラートークン
 * Brand colorに依存しない、アプリケーション全体で使用する共通トークン
 * grayベースで中立的な背景を提供
 */
export const global = defineSemanticTokens.colors({
    // Background tokens
    bg: {
        DEFAULT: {
            value: "{colors.gray.1}",
        },
        subtle: {
            value: "{colors.gray.2}",
        },
        muted: {
            value: "{colors.gray.3}",
        },
        emphasized: {
            value: "{colors.gray.4}",
        },
        inverted: {
            value: "{colors.gray.dark.1}",
        },
        panel: {
            value: "{colors.white}",
        },
        // disabled なコントロールの背景。明るいまま沈んで見せる
        disabled: {
            value: "{colors.gray.4}",
        },
    },
    // Foreground tokens
    // gray パレットの fg 系トークンと同じ規約で、グローバルな文字色を提供する
    fg: {
        DEFAULT: {
            value: "{colors.gray.12}",
        },
        muted: {
            value: "{colors.gray.11}",
        },
        subtle: {
            value: "color-mix(in oklch, {colors.gray.11}, transparent 25%)",
        },
        // disabled なコントロールの文字色。bg.disabled の上で控えめに読ませる
        disabled: {
            value: "{colors.gray.8}",
        },
    },
});
