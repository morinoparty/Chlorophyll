import { defineSemanticTokens } from "@pandacss/dev";

export const shadows = defineSemanticTokens.shadows({
    xs: {
        value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    },
    sm: {
        value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
    md: {
        value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    lg: {
        value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
    xl: {
        value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
    "2xl": {
        value: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    inner: {
        value: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    },
    // Elevation-based aliases (Atlassian style)
    raised: {
        value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
    overlay: {
        value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
    floating: {
        value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
    // ボタンなどの面に立体感を出す、内側のベベル(上辺ハイライト + 下辺シャドウ)
    inset: {
        // 濃い solid 面用。上から光が当たって隆起しているように見せる
        raised: {
            DEFAULT: {
                value: "inset 0 1.5px 0 0 rgba(255,255,255,0.34), inset 0 -2.5px 5px 0 rgba(0,0,0,0.27)",
            },
            // hover 時は隆起感を少し強め、押し上がる印象にする
            hover: {
                value: "inset 0 1.5px 0 0 rgba(255,255,255,0.38), inset 0 -3px 6px 0 rgba(0,0,0,0.3)",
            },
            // 白い面用の控えめなベベル。濃い影だと汚れて見えるため薄くする
            subtle: {
                DEFAULT: {
                    value: "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 -2px 4px 0 rgba(0,0,0,0.08)",
                },
                // hover 時は下辺の影を少し深め、立体感を強める
                hover: {
                    value: "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 -3px 5px 0 rgba(0,0,0,0.1)",
                },
            },
        },
    },
});
