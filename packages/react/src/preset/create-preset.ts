import { definePreset, type SemanticTokens } from "@pandacss/dev";
import { breakpoints } from "./breakpoints";
import { recipes, slotRecipes } from "./token/recipes";
import { globalFontFace, textStyles, tokens } from "./token/reference-tokens";
import { semanticTokens as defaultSemanticToken } from "./token/semantic-token";
import { radii } from "./token/semantic-token/radii";

export interface ColorPalette {
    name: string;
    semanticTokens: SemanticTokens["colors"];
}

export interface PresetOptions {
    brandColor: "mori" | "umi";
    grayColor: ColorPalette;
    radius: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const createPreset = (option: PresetOptions) => {
    const { radius } = option;

    // // セマンティックトークンを定義
    const semanticTokens: SemanticTokens = {
        ...defaultSemanticToken,
        radii: {
            ...radii,
            ...radii(radius),
        },
    };

    return definePreset({
        name: "@moripa/panda-preset",
        presets: ["@pandacss/preset-base"],
        globalFontface: globalFontFace,
        globalCss: {
            "::selection": {
                backgroundColor: "colorPalette.5",
            },
        },
        theme: {
            extend: {
                tokens,
                semanticTokens,
                breakpoints,
                textStyles,
                // 開閉系コンポーネント(Accordion など)の表示アニメーション
                keyframes: {
                    // 開いたときに上から滑り込みながらフェードインする
                    slideDownIn: {
                        from: { opacity: "0", transform: "translateY(-4px)" },
                        to: { opacity: "1", transform: "translateY(0)" },
                    },
                },
                recipes: {
                    ...recipes,
                },
                slotRecipes: {
                    ...slotRecipes,
                },
            },
        },
    });
};
