import { defineSlotRecipe } from "@pandacss/dev";

export const list = defineSlotRecipe({
    className: "list",
    jsx: ["List", "ListItem"],
    description: "The list component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "item", "label", "icon"],
    base: {
        root: {
            // 行を縦に並べたナビゲーション用リスト。背景色は variant で切り替える
            display: "flex",
            flexDirection: "column",
            // 16px = radii.2xl。角丸でカード状に見せる
            borderRadius: "2xl",
            // パネル端の余白は item 側に含めるため root には padding を持たせない。
            // 角丸からはみ出した行の hover 背景を切り取る
            overflow: "hidden",
            width: "full",
        },
        item: {
            // 行: ラベルを左・シェブロンを右に振り分ける。
            // サイズ依存(余白・行高・文字サイズ)は variants.size 側で指定する
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "full",
            // ボタン要素のデフォルト見た目をリセットして行として見せる
            bg: "transparent",
            border: "none",
            textAlign: "start",
            color: "colorPalette.fg",
            fontWeight: "medium",
            cursor: "pointer",
            transitionDuration: "normal",
            transitionProperty: "background",
            transitionTimingFunction: "easeInOut",
            // 押せる行であることを伝えるため hover で淡く背景を敷く
            "&:not(:disabled):not([data-disabled]):hover": {
                bg: "colorPalette.surface",
            },
            _focusVisible: {
                outline: "none",
                ringWidth: "2",
                ringColor: "colorPalette.a4",
                ringOffset: "0",
            },
            _disabled: {
                cursor: "not-allowed",
                // 文字(と currentColor を継承する chevron)を弱めて無効状態を伝える
                color: "colorPalette.fg.muted",
            },
        },
        label: {
            // 折り返さず 1 行で表示する
            whiteSpace: "nowrap",
            wordBreak: "break-word",
        },
        icon: {
            // lucide/chevron-right。色は item の color を継承し、
            // disabled 時に文字と一緒に弱まるようにする。大きさは variants.size で指定
            display: "flex",
            flexShrink: "0",
            color: "currentColor",
        },
    },
    variants: {
        // 背景の見せ方。白いカードにまとめる panel と、
        // 背景を透過してページ地の上に直接並べる ghost を用意する
        variant: {
            panel: {
                root: { bg: "bg.panel" },
            },
            ghost: {
                root: { bg: "transparent" },
            },
        },
        size: {
            // Figma 準拠の標準サイズ
            md: {
                item: {
                    gap: "component.gap.md",
                    // touchTarget(44px) で最低の行高を保証してタップ領域も確保する
                    minHeight: "touchTarget",
                    // Figma: 左 20px / 右 16px / 上下 12px。
                    // pr/py/gap は semantic token に対応。pl の 20px に当たる
                    // semantic token が無いため reference token(spacing.5)を使う
                    pl: "5",
                    pr: "component.padding.lg",
                    py: "component.padding.md",
                    fontSize: "md",
                },
                // 24px = sizes.6
                icon: { "& :where(svg)": { width: "6", height: "6" } },
            },
            // md を一回り小さくしたコンパクトサイズ
            sm: {
                item: {
                    gap: "component.gap.sm",
                    // 40px = sizes.10。md(44px)より一回り低くする
                    minHeight: "10",
                    // 左 16px / 右 12px / 上下 8px
                    pl: "component.padding.lg",
                    pr: "component.padding.md",
                    py: "component.padding.sm",
                    fontSize: "sm",
                },
                // 20px = sizes.5
                icon: { "& :where(svg)": { width: "5", height: "5" } },
            },
        },
    },
    defaultVariants: {
        variant: "panel",
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
