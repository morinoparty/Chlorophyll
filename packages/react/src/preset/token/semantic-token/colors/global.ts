import { defineSemanticTokens } from "@pandacss/dev";

/**
 * グローバルセマンティックカラートークン
 * Brand color に依存しない、アプリケーション全体で使用する共通トークン。
 * gray ベースで中立的な背景・文字色を提供する。
 *
 * 注意: bg / bg.subtle の向きはパレット側(colorPalette.bg / colorPalette.bg.subtle)と逆になっている。
 *   - グローバル: bg(gray.1) < bg.subtle(gray.2) < bg.muted(gray.3) < bg.emphasized(gray.4) と暗くなっていく
 *   - パレット  : bg.subtle(step1) < bg(step3 に gray を混ぜた地色) で、subtle は「bg を薄めたもの」
 *   パレット側の bg はページの地色として調整済み(#73)のため、こちらの並びを Radix 流のまま据え置いている
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
        // 反転面(Tooltip など)。ダークランプの最も暗いステップ
        inverted: {
            value: "{colors.gray.dark.1}",
        },
        // 白いパネル・カードの面。ページの地色(colorPalette.bg)から浮かせたい面に使う
        panel: {
            DEFAULT: {
                value: "{colors.white}",
            },
            // 白いパネル状のコントロール(button.secondary など)の hover。
            // 白からほんの僅かに沈める(gray.1 = #fcfcfd)。立体感の変化は shadows.inset.raised.subtle.hover が担う
            hover: {
                value: "{colors.gray.1}",
            },
        },
        // disabled なコントロールの背景。明るいまま沈んで見せる
        disabled: {
            value: "{colors.gray.4}",
        },
        // ステータス面(アラートやバナーの地色)。各パレットの surface(step3)を指す。
        // 文字色は同名の fg.* を組み合わせる(例: bg.error + fg.error。計測値: red.fg on red.3 Lc 73.1)
        error: {
            value: "{colors.red.surface}",
        },
        warning: {
            value: "{colors.yellow.surface}",
        },
        success: {
            value: "{colors.mori.surface}",
        },
        info: {
            value: "{colors.blue.surface}",
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
        // 入力欄・Select が未入力のときに表示するプレースホルダーの文字色。
        // fg.subtle(75% 透過)は白地で Lc が足りないため、不透明な gray.11 で fg.muted と同じ濃さにする
        // (計測値: 白 Lc 79.8 / bg.disabled(gray.4) Lc 66.3。プレースホルダーの目安 Lc 30 を大きく上回る)
        placeholder: {
            value: "{colors.gray.11}",
        },
        // bg.inverted の上に載せる文字色(計測値: 白 on gray.dark.1 Lc 107.4)
        inverted: {
            value: "{colors.white}",
        },
        // disabled なコントロールの文字色。bg.disabled の上で控えめに読ませる。
        // 無効状態の目安 Lc 30 以上を、白 / bg.disabled(gray.4) / colorPalette.bg のどこに置いても満たすステップを選ぶ
        // (gray.9 の計測値: 白 Lc 60.4 / gray.4 Lc 46.9 / mori.bg Lc 52.2。
        //  gray.8 は白 Lc 36.5 は通るが gray.4 Lc 22.9 / mori.bg Lc 28.3 で届かない)
        disabled: {
            value: "{colors.gray.9}",
        },
        // ステータス文字色(エラーメッセージなど)。各パレットの fg を指す。
        // 白の上で Lc 80 以上、colorPalette.bg の上で Lc 71 以上(計測値: red 81.8 / 73.6、yellow 80.6 / 72.4、
        // mori 82.1 / 73.8、blue 80.1 / 71.9)
        error: {
            value: "{colors.red.fg}",
        },
        warning: {
            value: "{colors.yellow.fg}",
        },
        success: {
            value: "{colors.mori.fg}",
        },
        info: {
            value: "{colors.blue.fg}",
        },
    },
});
