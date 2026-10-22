import { defineRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

// hover / active は disabled のときに効かせない
const enabledHover = "&:not(:disabled):not([data-disabled]):hover";
const enabledActive = "&:not(:disabled):not([data-disabled]):active";

export const iconButton = defineRecipe({
    className: "iconButton",
    jsx: ["IconButton"],
    description: "The icon button component",
    // variant/size/shape は実行時に動的指定されるため、全 variant の CSS を常に生成する
    staticCss: ["*"],
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        padding: "0",
        borderWidth: "1px",
        borderStyle: "solid",
        // 枠線の有無で大きさが変わらないよう、全 variant で 1px の枠を確保しておく
        borderColor: "transparent",
        cursor: "pointer",
        userSelect: "none",
        verticalAlign: "middle",
        transitionDuration: "normal",
        transitionProperty: "background, border-color, color",
        transitionTimingFunction: "easeInOut",
        // フォーカスリングは outline のロングハンドで明示する(#78)
        _focusVisible: focusRing,
        // 無効時の色は各 variant 側で指定する。base は variant より前の層(_base)に出力され、
        // variant の color に負けてしまうため
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        variant: {
            // 地を持たないフラットなボタン。ツールバーやヘッダーで背景になじませる
            ghost: {
                bg: "transparent",
                // アイコンは意味のある非テキスト要素なので Lc 45 以上を目安にする
                // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8 / colorPalette.surface Lc 74.6)
                color: "colorPalette.fg",
                [enabledHover]: {
                    bg: "colorPalette.surface",
                },
                [enabledActive]: {
                    bg: "colorPalette.surface.hover",
                },
                _disabled: {
                    // 無効状態の目安 Lc 30 以上を満たす(fg.disabled = gray.9 の計測値: 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2)
                    color: "fg.disabled",
                },
            },
            // 白い面と控えめな枠線で輪郭を出す。Field / Select と並べても馴染むよう同じ枠線を使う
            outline: {
                bg: "bg.panel",
                // ライブラリ方針: 枠線は控えめに(Field / Select と同じ border.subtle)。
                // border.subtle(gray.4)自体は白 Lc 11.1 と低いが、白い面(bg.panel)がページの地色(colorPalette.bg)から
                // 浮くことでボタンの輪郭を伝え、意味はアイコン(colorPalette.fg: 白 Lc 82.1)が担う
                borderColor: "border.subtle",
                color: "colorPalette.fg",
                [enabledHover]: {
                    bg: "bg.panel.hover",
                    borderColor: "border.interactive",
                },
                [enabledActive]: {
                    bg: "colorPalette.surface",
                },
                _disabled: {
                    bg: "bg.panel",
                    // 計測値は ghost と同じ(fg.disabled: 白 Lc 60.4)
                    color: "fg.disabled",
                },
            },
            // パレット色で塗りつぶした強調ボタン。Button の primary と違い影や隆起は付けずフラットにする
            // (colorPalette.solid = mori.9 の面の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5)
            solid: {
                bg: "colorPalette.solid",
                // solid の上のアイコン(colorPalette.contrast = 白 on mori.9 の計測値: Lc 79.1)
                color: "colorPalette.contrast",
                [enabledHover]: {
                    bg: "colorPalette.solid.emphasized",
                },
                [enabledActive]: {
                    bg: "colorPalette.solid.active",
                },
                _disabled: {
                    // 明るいままの背景に控えめな色を載せ、無効状態を読ませる
                    // (fg.disabled on bg.disabled(gray.4) の計測値: Lc 46.9)
                    bg: "bg.disabled",
                    color: "fg.disabled",
                },
            },
        },
        // アイコンだけを載せる正方形のボタンなので、高さは sizes.control(36/40/44px)ではなく 32/40/48px の段で持つ。
        // md(40px)は Button / Select の md と同じ高さで、横に並べたときに揃う。
        // アイコンはボタンの半分の大きさ(sizes.icon の sm 16 / md 20 / lg 24px)にする
        size: {
            sm: {
                width: "8",
                height: "8",
                "& :where(svg)": { width: "icon.sm", height: "icon.sm" },
            },
            md: {
                width: "10",
                height: "10",
                "& :where(svg)": { width: "icon.md", height: "icon.md" },
            },
            lg: {
                width: "12",
                height: "12",
                "& :where(svg)": { width: "icon.lg", height: "icon.lg" },
            },
        },
        shape: {
            // md / lg は Button / Select と同じ角丸で、フォーム部品と並べても形がそろう
            square: { borderRadius: "control" },
            circle: { borderRadius: "full" },
        },
    },
    compoundVariants: [
        // sm(32px)に control の角丸を使うと正円に近づき circle と見分けにくいため、
        // radii の役割どおり「小さなアイコンボタン」として item を使う
        {
            size: "sm",
            shape: "square",
            css: { borderRadius: "item" },
        },
    ],
    defaultVariants: {
        variant: "ghost",
        size: "md",
        shape: "square",
    },
});
