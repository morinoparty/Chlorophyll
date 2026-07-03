import { defineRecipe } from "@pandacss/dev";

export const badge = defineRecipe({
    className: "badge",
    jsx: ["Badge"],
    description: "The badge component",
    // variant/size は実行時に動的指定されるため、全 variant の CSS を常に生成する
    staticCss: ["*"],
    base: {
        // ラベルとアイコンを横並びにした小さなタグ。中身に合わせて幅が縮む
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1",
        // 角丸でピル状に見せる
        borderRadius: "md",
        fontWeight: "medium",
        // 折り返さず 1 行で表示する
        whiteSpace: "nowrap",
        verticalAlign: "middle",
        // 行内に置いてもベースラインで沈まないよう中身は中央寄せ
        lineHeight: "1",
        // アイコンは文字サイズに追従させる
        "& :where(svg)": {
            width: "1em",
            height: "1em",
        },
    },
    variants: {
        variant: {
            // 塗りつぶし: 強調したいステータス向け
            solid: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
            },
            // 淡い背景: 主張を抑えたタグ向け
            subtle: {
                bg: "colorPalette.surface",
                color: "colorPalette.fg",
            },
            // 枠線のみ: 背景を持たせたくない場面向け
            outline: {
                borderWidth: "1px",
                borderColor: "colorPalette.solid",
                color: "colorPalette.fg",
            },
            // 淡い背景 + 枠線: subtle よりも輪郭を出しつつ outline より主張を抑えたい場面向け
            surface: {
                bg: "colorPalette.surface",
                borderWidth: "1px",
                borderColor: "colorPalette.7",
                color: "colorPalette.fg",
            },
        },
        size: {
            // 12px 相当のコンパクトなタグ
            sm: {
                // 左右 6px / 上下 2px
                px: "1.5",
                py: "0.5",
                fontSize: "xs",
            },
            // 標準サイズ
            md: {
                // 左右 8px / 上下 4px
                px: "2",
                py: "1",
                fontSize: "sm",
            },
        },
    },
    defaultVariants: {
        variant: "solid",
        size: "md",
    },
});
