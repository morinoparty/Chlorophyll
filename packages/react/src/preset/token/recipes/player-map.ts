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
            overflow: "hidden",
            // 外側の白枠 2px。box-sizing: border-box なので枠は外形(例: 32px)に含まれ、
            // 内側の頭は「外形 - 4px」(例: 28px)ちょうどになる
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "white",
            // チップ(角丸 8px)と同心になるよう、一段小さい 4px にする
            borderRadius: "sm",
        },
        avatarImage: {
            width: "full",
            height: "full",
            objectFit: "cover",
            // ドット絵をぼかさずクッキリ表示する
            imageRendering: "pixelated",
            // 白枠と頭の間に薄緑 2px のリングを重ねる。outline を内側(offset -2px)に引くことで
            // レイアウトを増やさずに「白 2px → 薄緑 2px → 頭」の重なりを作る
            outlineWidth: "2px",
            outlineStyle: "solid",
            outlineColor: "colorPalette.surface",
            outlineOffset: "-2px",
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
                // gap 6px / 左 4px・右 10px / 上下 2px
                root: { gap: "1.5", pl: "1", pr: "2.5", py: "0.5" },
                // アバター全体 32px(白 2 + 薄緑 2 + 頭 28)。チップ高さは 32 + 上下 4 = 36px
                avatar: { width: "[32px]", height: "[32px]" },
                name: { fontSize: "sm" },
            },
            md: {
                // gap 8px / 左 6px・右 12px / 上下 4px
                root: { gap: "2", pl: "1.5", pr: "3", py: "1" },
                // アバター全体 44px(頭 40)
                avatar: { width: "[44px]", height: "[44px]" },
                name: { fontSize: "md" },
            },
            lg: {
                // gap 10px / 左 8px・右 14px / 上下 6px
                root: { gap: "2.5", pl: "2", pr: "3.5", py: "1.5" },
                // アバター全体 56px(頭 52)
                avatar: { width: "[56px]", height: "[56px]" },
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
