import { defineSemanticTokens } from "@pandacss/dev";

export const red = defineSemanticTokens.colors({
    red: {
        1: {
            value: {
                _light: "{colors.red.light.1}",
                _dark: "{colors.red.dark.1}",
            },
        },
        2: {
            value: {
                _light: "{colors.red.light.2}",
                _dark: "{colors.red.dark.2}",
            },
        },
        3: {
            value: {
                _light: "{colors.red.light.3}",
                _dark: "{colors.red.dark.3}",
            },
        },
        4: {
            value: {
                _light: "{colors.red.light.4}",
                _dark: "{colors.red.dark.4}",
            },
        },
        5: {
            value: {
                _light: "{colors.red.light.5}",
                _dark: "{colors.red.dark.5}",
            },
        },
        6: {
            value: {
                _light: "{colors.red.light.6}",
                _dark: "{colors.red.dark.6}",
            },
        },
        7: {
            value: {
                _light: "{colors.red.light.7}",
                _dark: "{colors.red.dark.7}",
            },
        },
        8: {
            value: {
                _light: "{colors.red.light.8}",
                _dark: "{colors.red.dark.8}",
            },
        },
        9: {
            value: {
                _light: "{colors.red.light.9}",
                _dark: "{colors.red.dark.9}",
            },
        },
        10: {
            value: {
                _light: "{colors.red.light.10}",
                _dark: "{colors.red.dark.10}",
            },
        },
        11: {
            value: {
                _light: "{colors.red.light.11}",
                _dark: "{colors.red.dark.11}",
            },
        },
        12: {
            value: {
                _light: "{colors.red.light.12}",
                _dark: "{colors.red.dark.12}",
            },
        },
        a1: {
            value: {
                _light: "{colors.red.light.a1}",
                _dark: "{colors.red.dark.a1}",
            },
        },
        a2: {
            value: {
                _light: "{colors.red.light.a2}",
                _dark: "{colors.red.dark.a2}",
            },
        },
        a3: {
            value: {
                _light: "{colors.red.light.a3}",
                _dark: "{colors.red.dark.a3}",
            },
        },
        a4: {
            value: {
                _light: "{colors.red.light.a4}",
                _dark: "{colors.red.dark.a4}",
            },
        },
        a5: {
            value: {
                _light: "{colors.red.light.a5}",
                _dark: "{colors.red.dark.a5}",
            },
        },
        a6: {
            value: {
                _light: "{colors.red.light.a6}",
                _dark: "{colors.red.dark.a6}",
            },
        },
        a7: {
            value: {
                _light: "{colors.red.light.a7}",
                _dark: "{colors.red.dark.a7}",
            },
        },
        a8: {
            value: {
                _light: "{colors.red.light.a8}",
                _dark: "{colors.red.dark.a8}",
            },
        },
        a9: {
            value: {
                _light: "{colors.red.light.a9}",
                _dark: "{colors.red.dark.a9}",
            },
        },
        a10: {
            value: {
                _light: "{colors.red.light.a10}",
                _dark: "{colors.red.dark.a10}",
            },
        },
        a11: {
            value: {
                _light: "{colors.red.light.a11}",
                _dark: "{colors.red.dark.a11}",
            },
        },
        a12: {
            value: {
                _light: "{colors.red.light.a12}",
                _dark: "{colors.red.dark.a12}",
            },
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
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: {
                    _light: "color-mix(in oklch, {colors.red.12}, {colors.red.11} 70%)",
                    _dark: "{colors.white}",
                },
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
