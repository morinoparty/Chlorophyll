import { defineSlotRecipe } from "@pandacss/dev";

export const playerMap = defineSlotRecipe({
    className: "player-map",
    jsx: ["PlayerMap"],
    description: "The player map marker chip component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "avatar", "avatarImage", "name"],
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
        avatar: {
            boxSizing: "border-box",
            flexShrink: 0,
            display: "flex",
            // 外から順に「白 2px の枠 → 薄緑 2px のリング → 内側の頭」を作る。
            // 枠は白、リングは padding に下地の薄緑を覗かせて表現する
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "white",
            padding: "2px",
            bg: "colorPalette.surface",
            // チップ(角丸 8px)と同心になるよう、左パディング 4px 分だけ小さい 4px にする
            borderRadius: "sm",
        },
        avatarImage: {
            width: "full",
            height: "full",
            objectFit: "cover",
            // ドット絵をぼかさずクッキリ表示する
            imageRendering: "pixelated",
            // 頭は枠より一段小さい角丸にして角をそろえる
            borderRadius: "xs",
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
        size: {
            sm: {
                // gap 6px / 左 4px・右 10px / 上下 4px
                root: { gap: "1.5", pl: "1", pr: "2.5", py: "1" },
                // 外枠 28px(白 2 + 薄緑 2 + 頭 20)。チップ高さは 28 + 上下 8 = 36px
                avatar: { width: "[28px]", height: "[28px]" },
                name: { fontSize: "sm" },
            },
            md: {
                // gap 8px / 左 6px・右 12px / 上下 6px
                root: { gap: "2", pl: "1.5", pr: "3", py: "1.5" },
                // 外枠 40px(頭 32)
                avatar: { width: "[40px]", height: "[40px]" },
                name: { fontSize: "md" },
            },
            lg: {
                // gap 10px / 左 8px・右 14px / 上下 8px
                root: { gap: "2.5", pl: "2", pr: "3.5", py: "2" },
                // 外枠 52px(頭 44)
                avatar: { width: "[52px]", height: "[52px]" },
                name: { fontSize: "lg" },
            },
        },
    },
    defaultVariants: {
        size: "sm",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
