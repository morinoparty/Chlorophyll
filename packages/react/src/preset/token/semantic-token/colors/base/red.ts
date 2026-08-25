import { defineSemanticTokens } from "@pandacss/dev";

export const red = defineSemanticTokens.colors({
    red: {
        1: {
            value: "{colors.red.light.1}",
        },
        2: {
            value: "{colors.red.light.2}",
        },
        3: {
            value: "{colors.red.light.3}",
        },
        4: {
            value: "{colors.red.light.4}",
        },
        5: {
            value: "{colors.red.light.5}",
        },
        6: {
            value: "{colors.red.light.6}",
        },
        7: {
            value: "{colors.red.light.7}",
        },
        8: {
            value: "{colors.red.light.8}",
        },
        9: {
            value: "{colors.red.light.9}",
        },
        10: {
            value: "{colors.red.light.10}",
        },
        11: {
            value: "{colors.red.light.11}",
        },
        12: {
            value: "{colors.red.light.12}",
        },
        a1: {
            value: "{colors.red.light.a1}",
        },
        a2: {
            value: "{colors.red.light.a2}",
        },
        a3: {
            value: "{colors.red.light.a3}",
        },
        a4: {
            value: "{colors.red.light.a4}",
        },
        a5: {
            value: "{colors.red.light.a5}",
        },
        a6: {
            value: "{colors.red.light.a6}",
        },
        a7: {
            value: "{colors.red.light.a7}",
        },
        a8: {
            value: "{colors.red.light.a8}",
        },
        a9: {
            value: "{colors.red.light.a9}",
        },
        a10: {
            value: "{colors.red.light.a10}",
        },
        a11: {
            value: "{colors.red.light.a11}",
        },
        a12: {
            value: "{colors.red.light.a12}",
        },
        // Background semantic tokens
        bg: {
            // ページの地色。白いパネル(bg.panel)が浮いて見えるよう step3 の明度まで沈めつつ、
            // gray.3 を半分混ぜて彩度を落とす。step3 と明度は同じでも彩度差が残るため、
            // 同じ step3 を使う surface とは分離したまま沈められる。
            // 補間空間は oklab 固定: oklch だと色相が gray の 277.7 に向かって回り青く濁る
            DEFAULT: {
                value: "color-mix(in oklab, {colors.red.3}, {colors.gray.3} 50%)",
            },
            subtle: {
                value: "{colors.red.1}",
            },
        },
        // Surface semantic tokens (component backgrounds)
        surface: {
            DEFAULT: {
                value: "{colors.red.3}",
            },
            hover: {
                value: "{colors.red.4}",
            },
            active: {
                value: "{colors.red.5}",
            },
        },
        // Border semantic tokens (Step 7: コンポーネントの枠線)
        border: {
            DEFAULT: {
                value: "{colors.red.7}",
            },
        },
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: "color-mix(in oklch, {colors.red.12}, {colors.red.11} 70%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.red.11}, transparent 25%)",
            },
        },
        // Solid background
        solid: {
            DEFAULT: {
                value: "{colors.red.9}",
            },
            emphasized: {
                value: "{colors.red.10}",
            },
        },
        // Text on solid background
        contrast: {
            value: "{colors.white}",
        },
        // フォーカスリング。colorPalette.focus.ring として各レシピから参照する。
        // コントラストはこのプロジェクトの基準である APCA(Lc)で評価し、非テキスト要素の目安 Lc 45 以上を
        // 白(bg.panel)と colorPalette.bg の両方で満たす最も明るいステップを採用する
        // (計測値: 白 Lc 65.0 / bg Lc 56.3。step 8 は bg に対して Lc 41.4 で届かない)。
        // 半透明の a ステップは合成先によって値が変わるので、不透明ステップで固定する
        focus: {
            ring: {
                value: "{colors.red.9}",
            },
        },
    },
});
