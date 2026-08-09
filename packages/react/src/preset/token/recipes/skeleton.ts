import { defineRecipe } from "@pandacss/dev";

export const skeleton = defineRecipe({
    className: "skeleton",
    jsx: ["Skeleton"],
    description: "The skeleton component",
    // variant は実行時に動的指定されるため、全 variant の CSS を常に生成する
    staticCss: ["*"],
    base: {
        display: "block",
        bg: "bg.emphasized",
        // pulse keyframes は create-preset.ts の theme.extend.keyframes に定義してある
        animationName: "pulse",
        animationDuration: "2s",
        animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
        animationIterationCount: "infinite",
    },
    variants: {
        variant: {
            // テキスト1行分のプレースホルダ
            text: {
                width: "full",
                height: "4",
                borderRadius: "sm",
            },
            // カード画像やバナーなどの矩形プレースホルダ。大きさは呼び出し側で指定する
            rect: {
                width: "full",
                height: "full",
                borderRadius: "lg",
            },
            // アバターなどの円形プレースホルダ
            circle: {
                width: "10",
                height: "10",
                borderRadius: "full",
            },
        },
    },
    defaultVariants: {
        variant: "text",
    },
});
