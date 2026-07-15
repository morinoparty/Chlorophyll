import { defineSemanticTokens } from "@pandacss/dev";

export const blue = defineSemanticTokens.colors({
    blue: {
        1: {
            value: "{colors.blue.light.1}",
        },
        2: {
            value: "{colors.blue.light.2}",
        },
        3: {
            value: "{colors.blue.light.3}",
        },
        4: {
            value: "{colors.blue.light.4}",
        },
        5: {
            value: "{colors.blue.light.5}",
        },
        6: {
            value: "{colors.blue.light.6}",
        },
        7: {
            value: "{colors.blue.light.7}",
        },
        8: {
            value: "{colors.blue.light.8}",
        },
        9: {
            value: "{colors.blue.light.9}",
        },
        10: {
            value: "{colors.blue.light.10}",
        },
        11: {
            value: "{colors.blue.light.11}",
        },
        12: {
            value: "{colors.blue.light.12}",
        },
        a1: {
            value: "{colors.blue.light.a1}",
        },
        a2: {
            value: "{colors.blue.light.a2}",
        },
        a3: {
            value: "{colors.blue.light.a3}",
        },
        a4: {
            value: "{colors.blue.light.a4}",
        },
        a5: {
            value: "{colors.blue.light.a5}",
        },
        a6: {
            value: "{colors.blue.light.a6}",
        },
        a7: {
            value: "{colors.blue.light.a7}",
        },
        a8: {
            value: "{colors.blue.light.a8}",
        },
        a9: {
            value: "{colors.blue.light.a9}",
        },
        a10: {
            value: "{colors.blue.light.a10}",
        },
        a11: {
            value: "{colors.blue.light.a11}",
        },
        a12: {
            value: "{colors.blue.light.a12}",
        },
        // Background semantic tokens
        bg: {
            DEFAULT: {
                value: "{colors.blue.2}",
            },
            subtle: {
                value: "{colors.blue.1}",
            },
        },
        // Surface semantic tokens (component backgrounds)
        surface: {
            DEFAULT: {
                value: "{colors.blue.3}",
            },
            hover: {
                value: "{colors.blue.4}",
            },
            active: {
                value: "{colors.blue.5}",
            },
        },
        // Border semantic tokens (Step 7: コンポーネントの枠線)
        border: {
            DEFAULT: {
                value: "{colors.blue.7}",
            },
        },
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: "color-mix(in oklch, {colors.blue.12}, {colors.blue.11} 70%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.blue.11}, transparent 25%)",
            },
        },
        // Solid background
        solid: {
            DEFAULT: {
                value: "{colors.blue.9}",
            },
            emphasized: {
                value: "{colors.blue.10}",
            },
        },
        // Text on solid background
        contrast: {
            value: "{colors.white}",
        },
        // フォーカスリング。colorPalette.focus.ring として各レシピから参照する
        focus: {
            ring: {
                value: "{colors.blue.a4}",
            },
        },
    },
});
