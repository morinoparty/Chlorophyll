import { defineSlotRecipe } from "@pandacss/dev";

// MoriPath の player-map コンポーネントをそのまま移植したもの。
// Chakra の CSS 変数を Chlorophyll(Panda)のトークンに置き換えているだけで、
// 構造・数値・バリアントは MoriPath 版に一致させている
export const playerMap = defineSlotRecipe({
    className: "player-map",
    jsx: ["PlayerMap"],
    description: "The player map marker chip component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "avatar", "name"],
    base: {
        root: {
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "lg",
            boxSizing: "border-box",
            bg: "colorPalette.bg.subtle",
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "bg.panel",
            flexShrink: 0,
            minWidth: 0,
            overflow: "hidden",
        },
        avatar: {
            flexShrink: 0,
            borderRadius: "md",
            objectFit: "cover",
            borderWidth: "0.5px",
            borderStyle: "solid",
            borderColor: "border/40",
        },
        name: {
            fontVariationSettings: "'wght' 600",
            fontWeight: "600",
            fontSize: "sm",
            color: "colorPalette.fg",
            flexShrink: 0,
            lineHeight: "1",
        },
    },
    variants: {
        size: {
            xl: {
                root: { gap: "2", height: "[52px]", pr: "3" },
                avatar: { width: "[48px]", height: "[48px]" },
                name: { fontSize: "xl" },
            },
            lg: {
                root: { gap: "1.5", height: "[36px]", pr: "2" },
                avatar: { width: "[36px]", height: "[36px]" },
                name: { fontSize: "sm", fontWeight: "bold" },
            },
            md: {
                root: { gap: "1.5", height: "[36px]", pr: "2" },
                avatar: { width: "[32px]", height: "[32px]" },
                name: { fontSize: "sm" },
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
