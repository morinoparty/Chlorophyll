import { defineRecipe } from "@pandacss/dev";

export const spinner = defineRecipe({
    className: "spinner",
    jsx: ["Spinner"],
    description: "The spinner component",
    // size は実行時に動的指定されるため、全 variant の CSS を常に生成する
    staticCss: ["*"],
    base: {
        display: "inline-block",
        flexShrink: "0",
        borderRadius: "full",
        borderStyle: "solid",
        // 円のベースは薄いグレー。上辺だけ colorPalette で塗り、回転する弧に見せる
        borderColor: "border.subtle",
        borderTopColor: "colorPalette.solid",
        // spin keyframes は create-preset.ts の theme.extend.keyframes に定義してある
        animationName: "spin",
        animationDuration: "600ms",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
    },
    variants: {
        size: {
            sm: { width: "4", height: "4", borderWidth: "1" },
            md: { width: "6", height: "6", borderWidth: "2" },
            lg: { width: "8", height: "8", borderWidth: "4" },
        },
    },
    defaultVariants: {
        size: "md",
    },
});
