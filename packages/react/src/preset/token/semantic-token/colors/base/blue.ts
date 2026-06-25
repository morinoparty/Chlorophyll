import { defineSemanticTokens } from "@pandacss/dev";

export const blue = defineSemanticTokens.colors({
    blue: {
        1: {
            value: {
                _light: "{colors.blue.light.1}",
                _dark: "{colors.blue.dark.1}",
            },
        },
        2: {
            value: {
                _light: "{colors.blue.light.2}",
                _dark: "{colors.blue.dark.2}",
            },
        },
        3: {
            value: {
                _light: "{colors.blue.light.3}",
                _dark: "{colors.blue.dark.3}",
            },
        },
        4: {
            value: {
                _light: "{colors.blue.light.4}",
                _dark: "{colors.blue.dark.4}",
            },
        },
        5: {
            value: {
                _light: "{colors.blue.light.5}",
                _dark: "{colors.blue.dark.5}",
            },
        },
        6: {
            value: {
                _light: "{colors.blue.light.6}",
                _dark: "{colors.blue.dark.6}",
            },
        },
        7: {
            value: {
                _light: "{colors.blue.light.7}",
                _dark: "{colors.blue.dark.7}",
            },
        },
        8: {
            value: {
                _light: "{colors.blue.light.8}",
                _dark: "{colors.blue.dark.8}",
            },
        },
        9: {
            value: {
                _light: "{colors.blue.light.9}",
                _dark: "{colors.blue.dark.9}",
            },
        },
        10: {
            value: {
                _light: "{colors.blue.light.10}",
                _dark: "{colors.blue.dark.10}",
            },
        },
        11: {
            value: {
                _light: "{colors.blue.light.11}",
                _dark: "{colors.blue.dark.11}",
            },
        },
        12: {
            value: {
                _light: "{colors.blue.light.12}",
                _dark: "{colors.blue.dark.12}",
            },
        },
        a1: {
            value: {
                _light: "{colors.blue.light.a1}",
                _dark: "{colors.blue.dark.a1}",
            },
        },
        a2: {
            value: {
                _light: "{colors.blue.light.a2}",
                _dark: "{colors.blue.dark.a2}",
            },
        },
        a3: {
            value: {
                _light: "{colors.blue.light.a3}",
                _dark: "{colors.blue.dark.a3}",
            },
        },
        a4: {
            value: {
                _light: "{colors.blue.light.a4}",
                _dark: "{colors.blue.dark.a4}",
            },
        },
        a5: {
            value: {
                _light: "{colors.blue.light.a5}",
                _dark: "{colors.blue.dark.a5}",
            },
        },
        a6: {
            value: {
                _light: "{colors.blue.light.a6}",
                _dark: "{colors.blue.dark.a6}",
            },
        },
        a7: {
            value: {
                _light: "{colors.blue.light.a7}",
                _dark: "{colors.blue.dark.a7}",
            },
        },
        a8: {
            value: {
                _light: "{colors.blue.light.a8}",
                _dark: "{colors.blue.dark.a8}",
            },
        },
        a9: {
            value: {
                _light: "{colors.blue.light.a9}",
                _dark: "{colors.blue.dark.a9}",
            },
        },
        a10: {
            value: {
                _light: "{colors.blue.light.a10}",
                _dark: "{colors.blue.dark.a10}",
            },
        },
        a11: {
            value: {
                _light: "{colors.blue.light.a11}",
                _dark: "{colors.blue.dark.a11}",
            },
        },
        a12: {
            value: {
                _light: "{colors.blue.light.a12}",
                _dark: "{colors.blue.dark.a12}",
            },
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
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: {
                    _light: "color-mix(in oklch, {colors.blue.12}, {colors.blue.11} 70%)",
                    _dark: "{colors.white}",
                },
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
    },
});
