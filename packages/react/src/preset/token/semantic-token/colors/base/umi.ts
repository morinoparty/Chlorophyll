import { defineSemanticTokens } from "@pandacss/dev";

export const umi = defineSemanticTokens.colors({
    umi: {
        1: {
            value: "{colors.umi.light.1}",
        },
        2: {
            value: "{colors.umi.light.2}",
        },
        3: {
            value: "{colors.umi.light.3}",
        },
        4: {
            value: "{colors.umi.light.4}",
        },
        5: {
            value: "{colors.umi.light.5}",
        },
        6: {
            value: "{colors.umi.light.6}",
        },
        7: {
            value: "{colors.umi.light.7}",
        },
        8: {
            value: "{colors.umi.light.8}",
        },
        9: {
            value: "{colors.umi.light.9}",
        },
        10: {
            value: "{colors.umi.light.10}",
        },
        11: {
            value: "{colors.umi.light.11}",
        },
        12: {
            value: "{colors.umi.light.12}",
        },
        a1: {
            value: "{colors.umi.light.a1}",
        },
        a2: {
            value: "{colors.umi.light.a2}",
        },
        a3: {
            value: "{colors.umi.light.a3}",
        },
        a4: {
            value: "{colors.umi.light.a4}",
        },
        a5: {
            value: "{colors.umi.light.a5}",
        },
        a6: {
            value: "{colors.umi.light.a6}",
        },
        a7: {
            value: "{colors.umi.light.a7}",
        },
        a8: {
            value: "{colors.umi.light.a8}",
        },
        a9: {
            value: "{colors.umi.light.a9}",
        },
        a10: {
            value: "{colors.umi.light.a10}",
        },
        a11: {
            value: "{colors.umi.light.a11}",
        },
        a12: {
            value: "{colors.umi.light.a12}",
        },
        // Background semantic tokens
        bg: {
            // ページの地色。白いパネル(bg.panel)が浮いて見えるよう step3 の明度まで沈めつつ、
            // gray.3 を半分混ぜて彩度を落とす。step3 と明度は同じでも彩度差が残るため、
            // 同じ step3 を使う surface とは分離したまま沈められる。
            // 補間空間は oklab 固定: oklch だと色相が gray の 277.7 に向かって回り青く濁る
            DEFAULT: {
                value: "color-mix(in oklab, {colors.umi.3}, {colors.gray.3} 50%)",
            },
            subtle: {
                value: "{colors.umi.1}",
            },
            // secondary スタイルの塗り面として使う、umi を効かせた背景色
            secondary: {
                value: "{colors.umi.10}",
            },
        },
        // Surface semantic tokens (component backgrounds)
        surface: {
            DEFAULT: {
                value: "{colors.umi.3}",
            },
            hover: {
                value: "{colors.umi.4}",
            },
            active: {
                value: "{colors.umi.5}",
            },
        },
        // Border semantic tokens (Step 7: コンポーネントの枠線)
        border: {
            DEFAULT: {
                value: "{colors.umi.7}",
            },
        },
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: "color-mix(in oklch, {colors.umi.12}, {colors.umi.11} 70%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.umi.11}, transparent 25%)",
            },
            // bg.secondary（濃い umi）の上に載せる前景色。白抜きで読ませる
            secondary: {
                value: "{colors.white}",
            },
        },
        // Solid background
        solid: {
            DEFAULT: {
                value: "{colors.umi.9}",
            },
            emphasized: {
                value: "{colors.umi.10}",
            },
        },
        // Text on solid background
        contrast: {
            value: "{colors.white}",
        },
        // フォーカスリング。colorPalette.focus.ring として各レシピから参照する。
        // WCAG 2.4.11 / 1.4.11 の 3:1 を白(bg.panel)と colorPalette.bg の両方で満たす
        // 最も明るいステップを採用する(計測値: 白 5.95:1 / bg 5.28:1)。
        // 半透明の a ステップは合成先によって比率が変わるので、不透明ステップで固定する
        focus: {
            ring: {
                value: "{colors.umi.10}",
            },
        },
    },
});
