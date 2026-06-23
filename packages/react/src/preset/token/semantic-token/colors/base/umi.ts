import { defineSemanticTokens } from "@pandacss/dev";

export const umi = defineSemanticTokens.colors({
    umi: {
        1: {
            value: {
                _light: "{colors.umi.light.1}",
                _dark: "{colors.umi.dark.1}",
            },
        },
        2: {
            value: {
                _light: "{colors.umi.light.2}",
                _dark: "{colors.umi.dark.2}",
            },
        },
        3: {
            value: {
                _light: "{colors.umi.light.3}",
                _dark: "{colors.umi.dark.3}",
            },
        },
        4: {
            value: {
                _light: "{colors.umi.light.4}",
                _dark: "{colors.umi.dark.4}",
            },
        },
        5: {
            value: {
                _light: "{colors.umi.light.5}",
                _dark: "{colors.umi.dark.5}",
            },
        },
        6: {
            value: {
                _light: "{colors.umi.light.6}",
                _dark: "{colors.umi.dark.6}",
            },
        },
        7: {
            value: {
                _light: "{colors.umi.light.7}",
                _dark: "{colors.umi.dark.7}",
            },
        },
        8: {
            value: {
                _light: "{colors.umi.light.8}",
                _dark: "{colors.umi.dark.8}",
            },
        },
        9: {
            value: {
                _light: "{colors.umi.light.9}",
                _dark: "{colors.umi.dark.9}",
            },
        },
        10: {
            value: {
                _light: "{colors.umi.light.10}",
                _dark: "{colors.umi.dark.10}",
            },
        },
        11: {
            value: {
                _light: "{colors.umi.light.11}",
                _dark: "{colors.umi.dark.11}",
            },
        },
        12: {
            value: {
                _light: "{colors.umi.light.12}",
                _dark: "{colors.umi.dark.12}",
            },
        },
        a1: {
            value: {
                _light: "{colors.umi.light.a1}",
                _dark: "{colors.umi.dark.a1}",
            },
        },
        a2: {
            value: {
                _light: "{colors.umi.light.a2}",
                _dark: "{colors.umi.dark.a2}",
            },
        },
        a3: {
            value: {
                _light: "{colors.umi.light.a3}",
                _dark: "{colors.umi.dark.a3}",
            },
        },
        a4: {
            value: {
                _light: "{colors.umi.light.a4}",
                _dark: "{colors.umi.dark.a4}",
            },
        },
        a5: {
            value: {
                _light: "{colors.umi.light.a5}",
                _dark: "{colors.umi.dark.a5}",
            },
        },
        a6: {
            value: {
                _light: "{colors.umi.light.a6}",
                _dark: "{colors.umi.dark.a6}",
            },
        },
        a7: {
            value: {
                _light: "{colors.umi.light.a7}",
                _dark: "{colors.umi.dark.a7}",
            },
        },
        a8: {
            value: {
                _light: "{colors.umi.light.a8}",
                _dark: "{colors.umi.dark.a8}",
            },
        },
        a9: {
            value: {
                _light: "{colors.umi.light.a9}",
                _dark: "{colors.umi.dark.a9}",
            },
        },
        a10: {
            value: {
                _light: "{colors.umi.light.a10}",
                _dark: "{colors.umi.dark.a10}",
            },
        },
        a11: {
            value: {
                _light: "{colors.umi.light.a11}",
                _dark: "{colors.umi.dark.a11}",
            },
        },
        a12: {
            value: {
                _light: "{colors.umi.light.a12}",
                _dark: "{colors.umi.dark.a12}",
            },
        },
        // Background semantic tokens
        bg: {
            DEFAULT: {
                value: "{colors.umi.2}",
            },
            subtle: {
                value: "{colors.umi.1}",
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
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: {
                    _light: "color-mix(in oklch, {colors.umi.12}, {colors.umi.11} 70%)",
                    _dark: "{colors.white}",
                },
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.umi.11}, transparent 25%)",
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
    },
});
