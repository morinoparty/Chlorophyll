import { defineSlotRecipe } from "@pandacss/dev";

export const playerCard = defineSlotRecipe({
    className: "player-card",
    jsx: ["PlayerCard"],
    description: "The player card component (Card + PlayerAvatar)",
    // カードの面と余白は Card(#40)に任せ、ここでは中身の並びと文字だけを定義する
    slots: ["layout", "body", "name", "description"],
    base: {
        layout: {
            display: "grid",
            // 左にアバター、右にテキスト。アバターは自身の size で幅が決まるので auto で受ける
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: "component.gap.md",
        },
        body: {
            // Name と Description を縦に積む。長い名前で 1fr の列からあふれないよう minWidth を 0 にする
            display: "flex",
            flexDirection: "column",
            gap: "0.5",
            minWidth: "0",
        },
        name: {
            textStyle: "md",
            fontWeight: "bold",
            lineHeight: "[1.2]",
            // プレイヤー名は本文と同じ濃さで読ませる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg.subtle(mori.1) Lc 81.0 /
            //  hover 時の colorPalette.surface(mori.3) Lc 74.6)
            color: "colorPalette.fg",
            // プレイヤー名は 1 行に収め、あふれた分は省略記号にする
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        description: {
            textStyle: "sm",
            lineHeight: "[1.4]",
            // 名前を補足する一言。本文より一段引いた補助テキスト
            // (colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg.subtle(mori.1) Lc 78.8 /
            //  hover 時の colorPalette.surface(mori.3) Lc 72.3。補助テキストの目安 Lc 60 を満たす)
            color: "colorPalette.fg.muted",
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
