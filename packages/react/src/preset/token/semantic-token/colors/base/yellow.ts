import { defineSemanticTokens } from "@pandacss/dev";

export const yellow = defineSemanticTokens.colors({
    yellow: {
        1: {
            value: "{colors.yellow.light.1}",
        },
        2: {
            value: "{colors.yellow.light.2}",
        },
        3: {
            value: "{colors.yellow.light.3}",
        },
        4: {
            value: "{colors.yellow.light.4}",
        },
        5: {
            value: "{colors.yellow.light.5}",
        },
        6: {
            value: "{colors.yellow.light.6}",
        },
        7: {
            value: "{colors.yellow.light.7}",
        },
        8: {
            value: "{colors.yellow.light.8}",
        },
        9: {
            value: "{colors.yellow.light.9}",
        },
        10: {
            value: "{colors.yellow.light.10}",
        },
        11: {
            value: "{colors.yellow.light.11}",
        },
        12: {
            value: "{colors.yellow.light.12}",
        },
        a1: {
            value: "{colors.yellow.light.a1}",
        },
        a2: {
            value: "{colors.yellow.light.a2}",
        },
        a3: {
            value: "{colors.yellow.light.a3}",
        },
        a4: {
            value: "{colors.yellow.light.a4}",
        },
        a5: {
            value: "{colors.yellow.light.a5}",
        },
        a6: {
            value: "{colors.yellow.light.a6}",
        },
        a7: {
            value: "{colors.yellow.light.a7}",
        },
        a8: {
            value: "{colors.yellow.light.a8}",
        },
        a9: {
            value: "{colors.yellow.light.a9}",
        },
        a10: {
            value: "{colors.yellow.light.a10}",
        },
        a11: {
            value: "{colors.yellow.light.a11}",
        },
        a12: {
            value: "{colors.yellow.light.a12}",
        },
        // Background semantic tokens
        bg: {
            // ページの地色。白いパネル(bg.panel)が浮いて見えるよう step3 の明度まで沈めつつ、
            // gray.3 を半分混ぜて彩度を落とす。step3 と明度は同じでも彩度差が残るため、
            // 同じ step3 を使う surface とは分離したまま沈められる。
            // 補間空間は oklab 固定: oklch だと色相が gray の 277.7 に向かって回り青く濁る
            DEFAULT: {
                value: "color-mix(in oklab, {colors.yellow.3}, {colors.gray.3} 50%)",
            },
            subtle: {
                value: "{colors.yellow.1}",
            },
        },
        // Surface semantic tokens (component backgrounds)
        surface: {
            DEFAULT: {
                value: "{colors.yellow.3}",
            },
            hover: {
                value: "{colors.yellow.4}",
            },
            active: {
                value: "{colors.yellow.5}",
            },
        },
        // Border semantic tokens (Step 7: コンポーネントの枠線)
        border: {
            DEFAULT: {
                value: "{colors.yellow.7}",
            },
        },
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: "color-mix(in oklch, {colors.yellow.12}, {colors.yellow.11} 70%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.yellow.11}, transparent 25%)",
            },
        },
        // Solid background
        solid: {
            DEFAULT: {
                value: "{colors.yellow.9}",
            },
            emphasized: {
                value: "{colors.yellow.10}",
            },
        },
        // Text on solid background (yellow needs dark text for contrast).
        // yellow.solid(scale 9) は明るいため、暗いインク(light ランプの 12)を
        // 重ねてコントラストを確保する。
        contrast: {
            value: "{colors.yellow.light.12}",
        },
        // フォーカスリング。colorPalette.focus.ring として各レシピから参照する。
        // WCAG 2.4.11 / 1.4.11 の 3:1 を白(bg.panel)と colorPalette.bg の両方で満たす
        // 最も明るいステップを採用する(計測値: 白 4.85:1 / bg 4.33:1)。
        // 半透明の a ステップは合成先によって比率が変わるので、不透明ステップで固定する
        // yellow は 9/10 が明るい塗り色(白に対して約 1.3:1)なので、他パレットと同じ 10 では
        // リングがほぼ見えない。3:1 を満たす最初のステップである 11 を使う
        focus: {
            ring: {
                value: "{colors.yellow.11}",
            },
        },
    },
});
