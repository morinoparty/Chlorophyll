import { defineSemanticTokens } from "@pandacss/dev";

export const border = defineSemanticTokens.colors({
    border: {
        // Step 6: 非インタラクティブなコンポーネント向け（カード、セパレータなど）
        DEFAULT: {
            value: "{colors.gray.6}",
        },
        // Step 5: より微妙なボーダー
        muted: {
            value: "{colors.gray.5}",
        },
        // Step 4: 最も微妙なボーダー
        subtle: {
            value: "{colors.gray.4}",
        },
        // Step 7: インタラクティブなコンポーネント向け
        interactive: {
            value: "{colors.gray.7}",
        },
        // Step 8: フォーカスリング、強調ボーダー
        emphasized: {
            value: "{colors.gray.8}",
        },
        // ステータスカラー（Step 7相当）
        error: {
            DEFAULT: {
                value: "{colors.red.7}",
            },
            // 入力欄の invalid など、枠線だけでエラーを伝える箇所向けの濃い赤。
            // 非テキスト要素の目安 Lc 45 以上を白とページの地色の両方で満たす red.9 を使う
            // (計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8。red.7 は 37.4 / 29.2、red.8 は 50.1 / 41.9 で届かない)
            emphasized: {
                value: "{colors.red.9}",
            },
        },
        warning: {
            value: "{colors.yellow.7}",
        },
        success: {
            value: "{colors.mori.7}",
        },
        info: {
            value: "{colors.blue.7}",
        },
    },
});
