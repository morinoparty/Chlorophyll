import { defineSemanticTokens } from "@pandacss/dev";

export const gray = defineSemanticTokens.colors({
    gray: {
        1: {
            value: "{colors.gray.light.1}",
        },
        2: {
            value: "{colors.gray.light.2}",
        },
        3: {
            value: "{colors.gray.light.3}",
        },
        4: {
            value: "{colors.gray.light.4}",
        },
        5: {
            value: "{colors.gray.light.5}",
        },
        6: {
            value: "{colors.gray.light.6}",
        },
        7: {
            value: "{colors.gray.light.7}",
        },
        8: {
            value: "{colors.gray.light.8}",
        },
        9: {
            value: "{colors.gray.light.9}",
        },
        10: {
            value: "{colors.gray.light.10}",
        },
        11: {
            value: "{colors.gray.light.11}",
        },
        12: {
            value: "{colors.gray.light.12}",
        },
        a1: {
            value: "{colors.gray.light.a1}",
        },
        a2: {
            value: "{colors.gray.light.a2}",
        },
        a3: {
            value: "{colors.gray.light.a3}",
        },
        a4: {
            value: "{colors.gray.light.a4}",
        },
        a5: {
            value: "{colors.gray.light.a5}",
        },
        a6: {
            value: "{colors.gray.light.a6}",
        },
        a7: {
            value: "{colors.gray.light.a7}",
        },
        a8: {
            value: "{colors.gray.light.a8}",
        },
        a9: {
            value: "{colors.gray.light.a9}",
        },
        a10: {
            value: "{colors.gray.light.a10}",
        },
        a11: {
            value: "{colors.gray.light.a11}",
        },
        a12: {
            value: "{colors.gray.light.a12}",
        },
        // Background semantic tokens
        bg: {
            DEFAULT: {
                value: "{colors.gray.2}",
            },
            subtle: {
                value: "{colors.gray.1}",
            },
        },
        // Surface semantic tokens (component backgrounds)
        surface: {
            DEFAULT: {
                value: "{colors.gray.3}",
            },
            hover: {
                value: "{colors.gray.4}",
            },
            active: {
                value: "{colors.gray.5}",
            },
        },
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: "color-mix(in oklch, {colors.gray.12}, {colors.gray.11} 70%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.gray.11}, transparent 25%)",
            },
        },
        // Solid background
        solid: {
            DEFAULT: {
                value: "{colors.gray.9}",
            },
            emphasized: {
                value: "{colors.gray.10}",
            },
        },
        // Text on solid background
        contrast: {
            value: "{colors.white}",
        },
    },
});
