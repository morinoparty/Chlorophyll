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
        // radii はファクトリ関数なので、呼び出した結果(default/l1/l2/l3)をマージする
        radii: radii(radius),
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
                // 開閉系コンポーネント(Accordion など)の表示アニメーション。
                // レシピ側からは animationName: "<キー名>" で参照する
                keyframes: {
                    // 開いたときに上から滑り込みながらフェードインする
                    slideDownIn: {
                        from: { opacity: "0", transform: "translateY(-4px)" },
                        to: { opacity: "1", transform: "translateY(0)" },
                    },
                    // Spinner / Toast の loading インジケーターが回り続ける
                    spin: {
                        to: { transform: "rotate(360deg)" },
                    },
                    // Skeleton がゆっくり明滅してロード中を示す
                    pulse: {
                        "0%, 100%": { opacity: "1" },
                        "50%": { opacity: "0.5" },
                    },
                    // Drawer: 背後の暗幕がフェードインする
                    drawerFadeIn: {
                        from: { opacity: "0" },
                        to: { opacity: "1" },
                    },
                    // Drawer: パネルが画面左端から滑り込む(placement="start")
                    drawerSlideInFromStart: {
                        from: { transform: "translateX(-100%)" },
                        to: { transform: "translateX(0)" },
                    },
                    // Drawer: パネルが画面右端から滑り込む(placement="end")
                    drawerSlideInFromEnd: {
                        from: { transform: "translateX(100%)" },
                        to: { transform: "translateX(0)" },
                    },
                    // ModalDialog: 暗幕とダイアログの入場フェード
                    modalDialogFadeIn: {
                        from: { opacity: "0" },
                        to: { opacity: "1" },
                    },
                    // ModalDialog: 退場フェード。この完了(animationend)がクローズ処理の合図になるため必須
                    modalDialogFadeOut: {
                        from: { opacity: "1" },
                        to: { opacity: "0" },
                    },
                    // ModalDialog: ダイアログがわずかに拡大しながら現れる
                    modalDialogScaleIn: {
                        from: { transform: "scale(0.96)" },
                        to: { transform: "scale(1)" },
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
