import { defineSlotRecipe } from "@pandacss/dev";

export const playerMap = defineSlotRecipe({
    className: "player-map",
    jsx: ["PlayerMap"],
    description: "The player map marker chip component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "name"],
    base: {
        root: {
            display: "inline-flex",
            alignItems: "center",
            boxSizing: "border-box",
            // 名前が長くてもチップ自体は中身に合わせて縮む
            flexShrink: 0,
            minWidth: 0,
            overflow: "hidden",
            borderRadius: "lg",
            // 地図上のどんな背景に載せても浮いて見えるよう、白フチで縁取る
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "white",
            // 薄い緑の下地(leaf/50 相当)
            bg: "colorPalette.surface",
        },
        name: {
            flexShrink: 0,
            whiteSpace: "nowrap",
            lineHeight: "1",
            fontWeight: "bold",
            fontVariationSettings: "'wght' 700",
            // 中間トーンの緑(leaf/600 相当)で名前を読ませる
            color: "colorPalette.solid",
        },
    },
    variants: {
        // size は PlayerAvatar のサイズとそのまま対応させる
        size: {
            sm: {
                // gap 6px / 左 4px・右 10px / 上下 4px
                root: { gap: "1.5", pl: "1", pr: "2.5", py: "1" },
                name: { fontSize: "sm" },
            },
            md: {
                // gap 8px / 左 6px・右 12px / 上下 6px
                root: { gap: "2", pl: "1.5", pr: "3", py: "1.5" },
                name: { fontSize: "lg" },
            },
            lg: {
                // gap 10px / 左 8px・右 14px / 上下 8px
                root: { gap: "2.5", pl: "2", pr: "3.5", py: "2" },
                name: { fontSize: "xl" },
            },
        },
    },
    defaultVariants: {
        size: "sm",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
