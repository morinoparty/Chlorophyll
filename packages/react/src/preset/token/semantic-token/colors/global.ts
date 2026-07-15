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
    },
});
