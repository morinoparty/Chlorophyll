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
            DEFAULT: {
                value: "{colors.umi.2}",
            },
            subtle: {
                value: "{colors.umi.1}",
            },
            // secondary スタイルの塗り面として使う白背景
            secondary: {
                value: "{colors.white}",
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
                value: "color-mix(in oklch, {colors.umi.12}, {colors.umi.11} 70%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.umi.11}, transparent 25%)",
            },
            // bg.secondary（白）の上に載せる、umi ブルーの前景色
            secondary: {
                value: "{colors.umi.10}",
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
