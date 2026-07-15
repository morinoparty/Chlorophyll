import { defineSemanticTokens } from "@pandacss/dev";

export const mori = defineSemanticTokens.colors({
    mori: {
        1: {
            value: "{colors.mori.light.1}",
        },
        2: {
            value: "{colors.mori.light.2}",
        },
        3: {
            value: "{colors.mori.light.3}",
        },
        4: {
            value: "{colors.mori.light.4}",
        },
        5: {
            value: "{colors.mori.light.5}",
        },
        6: {
            value: "{colors.mori.light.6}",
        },
        7: {
            value: "{colors.mori.light.7}",
        },
        8: {
            value: "{colors.mori.light.8}",
        },
        9: {
            value: "{colors.mori.light.9}",
        },
        10: {
            value: "{colors.mori.light.10}",
        },
        11: {
            value: "{colors.mori.light.11}",
        },
        12: {
            value: "{colors.mori.light.12}",
        },
        a1: {
            value: "{colors.mori.light.a1}",
        },
        a2: {
            value: "{colors.mori.light.a2}",
        },
        a3: {
            value: "{colors.mori.light.a3}",
        },
        a4: {
            value: "{colors.mori.light.a4}",
        },
        a5: {
            value: "{colors.mori.light.a5}",
        },
        a6: {
            value: "{colors.mori.light.a6}",
        },
        a7: {
            value: "{colors.mori.light.a7}",
        },
        a8: {
            value: "{colors.mori.light.a8}",
        },
        a9: {
            value: "{colors.mori.light.a9}",
        },
        a10: {
            value: "{colors.mori.light.a10}",
        },
        a11: {
            value: "{colors.mori.light.a11}",
        },
        a12: {
            value: "{colors.mori.light.a12}",
        },
        bg: {
            DEFAULT: {
                value: "{colors.mori.2}",
            },
            subtle: {
                value: "{colors.mori.1}",
            },
            // button.secondary などのセカンダリ面が使う、mori を効かせた背景色
            secondary: {
                value: "{colors.mori.10}",
            },
        },
        surface: {
            DEFAULT: {
                value: "{colors.mori.3}",
            },
            hover: {
                value: "{colors.mori.4}",
            },
            active: {
                value: "{colors.mori.5}",
            },
        },
        // Border semantic tokens (Step 7: コンポーネントの枠線)
        border: {
            DEFAULT: {
                value: "{colors.mori.7}",
            },
        },
        fg: {
            DEFAULT: {
                value: "color-mix(in oklch, {colors.mori.12}, {colors.mori.11} 70%)",
            },
            subtle: {
                value: "color-mix(in oklch, {colors.mori.11}, transparent 30%)",
            },
            muted: {
                value: "{colors.gray.11}",
            },
            // bg.secondary（濃い mori）の上に載せる前景色。白抜きで読ませる
            secondary: {
                value: "{colors.white}",
            },
        },
        solid: {
            DEFAULT: {
                value: "{colors.mori.9}",
            },
            emphasized: {
                value: "{colors.mori.10}",
            },
        },
        contrast: {
            value: "{colors.white}",
        },
    },
});
