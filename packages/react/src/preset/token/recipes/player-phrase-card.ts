import { defineSlotRecipe } from "@pandacss/dev";

export const playerPhraseCard = defineSlotRecipe({
    className: "player-phrase-card",
    jsx: ["PlayerPhraseCard"],
    description: "The player phrase card component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "body", "phrase", "name"],
    base: {
        root: {
            display: "grid",
            gap: "3",
        },
        body: {
            display: "flex",
            flexDirection: "column",
        },
        phrase: {
            textStyle: "sm",
            color: "colorPalette.fg/70",
            fontWeight: "medium",
            lineHeight: "[1.2]",
        },
        name: {
            textStyle: "lg",
            marginTop: "1.5",
            color: "colorPalette.fg",
            fontWeight: "extrabold",
            fontVariationSettings: "'wght' 800",
            lineHeight: "[1.2]",
        },
    },
    // グリッド 1 列目の幅は PlayerAvatar(#48)の一辺の大きさに合わせる
    variants: {
        size: {
            sm: {
                root: { gridTemplateColumns: "32px 1fr" },
            },
            md: {
                root: { gridTemplateColumns: "48px 1fr" },
            },
            lg: {
                root: { gridTemplateColumns: "64px 1fr" },
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
