import { defineTokens } from "@pandacss/dev";

// フォントファミリーのリファレンストークン。
// sans は textStyles.body と同じスタックを一元管理し、
// mono はトークン名や CSS 変数などコード表示に使う
export const fonts = defineTokens.fonts({
    sans: {
        value: "'Satoshi', 'GenJyuuGothicLP', BlinkMacSystemFont, 'Noto Sans JP', -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    },
    mono: {
        value: "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    },
});
