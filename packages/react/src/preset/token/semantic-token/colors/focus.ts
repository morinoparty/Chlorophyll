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
            // エラー時のフォーカスリング。パレット側の focus.ring と同じく APCA(Lc)で評価し、
            // 非テキスト要素の目安 Lc 45 以上を白と red.bg の両方で満たす red.9 を使う
            // (計測値: 白 Lc 65.0 / bg Lc 56.3。red.8 は bg に対して Lc 41.4 で届かない)
            error: {
                value: "{colors.red.9}",
            },
        },
    },
});
