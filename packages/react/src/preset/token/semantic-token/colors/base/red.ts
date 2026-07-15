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
            DEFAULT: {
                value: "{colors.red.2}",
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
    },
});
