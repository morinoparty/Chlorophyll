import { defineSemanticTokens } from "@pandacss/dev";

/**
 * Focus Ring セマンティックトークン
 * フォーカスリング用のカラー
 * CSS変数を直接参照し、テーマに応じて動的に変化
 */
export const focus = defineSemanticTokens.colors({
    focus: {
        ring: {
            // パレット追従のフォーカスリングは各パレット側の focus.ring
            // （colorPalette.focus.ring）で定義している。ここではパレットに
            // 依存しない状態別のリングのみを持つ
            // エラー時のフォーカスリング
            error: {
                value: "{colors.red.8}",
            },
        },
    },
});
