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
            // エラー時のフォーカスリング。red.8 は白に対して 2.56:1 しかなく
            // WCAG 2.4.11 / 1.4.11 の 3:1 を満たさないため、パレット側の focus.ring と
            // 同じ考え方で 10 を使う(計測値: 白 4.36:1 / red.bg 3.82:1)
            error: {
                value: "{colors.red.10}",
            },
        },
    },
});
