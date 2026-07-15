import { defineSemanticTokens } from "@pandacss/dev";

export const yellow = defineSemanticTokens.colors({
    yellow: {
        1: {
            value: {
                _light: "{colors.yellow.light.1}",
                _dark: "{colors.yellow.dark.1}",
            },
        },
        2: {
            value: {
                _light: "{colors.yellow.light.2}",
                _dark: "{colors.yellow.dark.2}",
            },
        },
        3: {
            value: {
                _light: "{colors.yellow.light.3}",
                _dark: "{colors.yellow.dark.3}",
            },
        },
        4: {
            value: {
                _light: "{colors.yellow.light.4}",
                _dark: "{colors.yellow.dark.4}",
            },
        },
        5: {
            value: {
                _light: "{colors.yellow.light.5}",
                _dark: "{colors.yellow.dark.5}",
            },
        },
        6: {
            value: {
                _light: "{colors.yellow.light.6}",
                _dark: "{colors.yellow.dark.6}",
            },
        },
        7: {
            value: {
                _light: "{colors.yellow.light.7}",
                _dark: "{colors.yellow.dark.7}",
            },
        },
        8: {
            value: {
                _light: "{colors.yellow.light.8}",
                _dark: "{colors.yellow.dark.8}",
            },
        },
        9: {
            value: {
                _light: "{colors.yellow.light.9}",
                _dark: "{colors.yellow.dark.9}",
            },
        },
        10: {
            value: {
                _light: "{colors.yellow.light.10}",
                _dark: "{colors.yellow.dark.10}",
            },
        },
        11: {
            value: {
                _light: "{colors.yellow.light.11}",
                _dark: "{colors.yellow.dark.11}",
            },
        },
        12: {
            value: {
                _light: "{colors.yellow.light.12}",
                _dark: "{colors.yellow.dark.12}",
            },
        },
        a1: {
            value: {
                _light: "{colors.yellow.light.a1}",
                _dark: "{colors.yellow.dark.a1}",
            },
        },
        a2: {
            value: {
                _light: "{colors.yellow.light.a2}",
                _dark: "{colors.yellow.dark.a2}",
            },
        },
        a3: {
            value: {
                _light: "{colors.yellow.light.a3}",
                _dark: "{colors.yellow.dark.a3}",
            },
        },
        a4: {
            value: {
                _light: "{colors.yellow.light.a4}",
                _dark: "{colors.yellow.dark.a4}",
            },
        },
        a5: {
            value: {
                _light: "{colors.yellow.light.a5}",
                _dark: "{colors.yellow.dark.a5}",
            },
        },
        a6: {
            value: {
                _light: "{colors.yellow.light.a6}",
                _dark: "{colors.yellow.dark.a6}",
            },
        },
        a7: {
            value: {
                _light: "{colors.yellow.light.a7}",
                _dark: "{colors.yellow.dark.a7}",
            },
        },
        a8: {
            value: {
                _light: "{colors.yellow.light.a8}",
                _dark: "{colors.yellow.dark.a8}",
            },
        },
        a9: {
            value: {
                _light: "{colors.yellow.light.a9}",
                _dark: "{colors.yellow.dark.a9}",
            },
        },
        a10: {
            value: {
                _light: "{colors.yellow.light.a10}",
                _dark: "{colors.yellow.dark.a10}",
            },
        },
        a11: {
            value: {
                _light: "{colors.yellow.light.a11}",
                _dark: "{colors.yellow.dark.a11}",
            },
        },
        a12: {
            value: {
                _light: "{colors.yellow.light.a12}",
                _dark: "{colors.yellow.dark.a12}",
            },
        },
        // Background semantic tokens
        bg: {
            DEFAULT: {
                value: "{colors.yellow.2}",
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
        // Foreground semantic tokens
        fg: {
            DEFAULT: {
                value: {
                    _light: "color-mix(in oklch, {colors.yellow.12}, {colors.yellow.11} 70%)",
                    _dark: "{colors.white}",
                },
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
        // yellow.solid(scale 9) は明るく、ライト/ダーク両テーマでほぼ同じ明るさのため、
        // テーマ分岐する yellow.12 だとダーク時に淡いインクとなり文字が読めなくなる。
        // どちらのテーマでも常に暗いインク(light ランプの 12)を重ねてコントラストを確保する。
        contrast: {
            value: "{colors.yellow.light.12}",
        },
    },
});
