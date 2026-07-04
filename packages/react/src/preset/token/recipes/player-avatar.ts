import { defineSlotRecipe } from "@pandacss/dev";

export const playerAvatar = defineSlotRecipe({
    className: "player-avatar",
    jsx: ["PlayerAvatar"],
    description: "The player avatar component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "image", "fallback"],
    base: {
        root: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: "lg",
            bg: "bg.muted",
        },
        image: {
            width: "full",
            height: "full",
            // ドット絵をぼかさずクッキリ表示する
            imageRendering: "pixelated",
        },
        fallback: {
            fontSize: "xs",
            fontWeight: "medium",
            color: "fg.muted",
        },
    },
    variants: {
        size: {
            sm: {
                root: { width: "[32px]", height: "[32px]" },
            },
            md: {
                root: { width: "[48px]", height: "[48px]" },
            },
            lg: {
                root: { width: "[64px]", height: "[64px]" },
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
