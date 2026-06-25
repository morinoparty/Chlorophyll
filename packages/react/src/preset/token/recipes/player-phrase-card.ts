import { defineSlotRecipe } from "@pandacss/dev";

export const playerPhraseCard = defineSlotRecipe({
    className: "player-phrase-card",
    jsx: ["PlayerPhraseCard"],
    description: "The player phrase card component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "item", "phrase", "name"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
        },
        item: {
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            gap: "3",
            "& img": {
                width: "[48px]",
                height: "[48px]",
                borderRadius: "lg",
            },
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
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
