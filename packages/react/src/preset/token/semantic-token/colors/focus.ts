import { defineSemanticTokens } from "@pandacss/dev";

/**
 * Focus Ring セマンティックトークン
 * フォーカスリング用のカラー
 * CSS変数を直接参照し、テーマに応じて動的に変化
 */
export const focus = defineSemanticTokens.colors({
    focus: {
        ring: {
            // デフォルトのフォーカスリングは定義しない。
            // セマンティックトークンからは仮想の colorPalette を参照できないため、
            // 各レシピで ringColor: "colorPalette.a4" のように直接指定している
            // エラー時のフォーカスリング
            error: {
                value: "{colors.red.8}",
            },
        },
    },
});
