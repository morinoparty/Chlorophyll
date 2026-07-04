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
            // PlayerAvatar(#48)は md 固定(48px)なので、グリッド 1 列目もそれに合わせる
            gridTemplateColumns: "48px 1fr",
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
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
