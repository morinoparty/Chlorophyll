import { defineSemanticTokens } from "@pandacss/dev";

/**
 * Size semantic tokens
 * width / height / minHeight など「大きさ」を受け取るプロパティから参照するトークン。
 * 以前は spacing に置いていたが、Panda は minHeight などの解決に sizes カテゴリしか見ないため、
 * `minHeight: "touchTarget"` が `min-height: touchTarget` とそのまま出力されて効いていなかった。
 * 大きさのトークンはこのファイルにまとめ、余白のトークンは spacing.ts に置く
 */
export const sizes = defineSemanticTokens.sizes({
    // フォームコントロールの高さ。Button / Select の trigger / Table の見出し行が同じ段を参照し、
    // 横に並べたときに高さが揃うことを保証する(park-ui md 40px / shadcn default 36px に近いスケール)
    control: {
        sm: { value: "{sizes.9}" }, // 36px
        md: { value: "{sizes.10}" }, // 40px
        lg: { value: "{sizes.11}" }, // 44px
    },
    // Icon sizes
    icon: {
        xs: { value: "{sizes.3}" }, // 12px
        sm: { value: "{sizes.4}" }, // 16px
        md: { value: "{sizes.5}" }, // 20px
        lg: { value: "{sizes.6}" }, // 24px
        xl: { value: "{sizes.8}" }, // 32px
    },
    // Avatar sizes
    avatar: {
        xs: { value: "{sizes.6}" }, // 24px
        sm: { value: "{sizes.8}" }, // 32px
        md: { value: "{sizes.10}" }, // 40px
        lg: { value: "{sizes.12}" }, // 48px
        xl: { value: "{sizes.16}" }, // 64px
    },
    // Minimum touch target (44px for accessibility)
    touchTarget: { value: "{sizes.11}" },
});
