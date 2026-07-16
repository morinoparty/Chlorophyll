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
        // 完全な角丸でピル状にし、ステータス/ラベルのタグとして読ませる
        borderRadius: "full",
        // button 一家と揃えたセミボールド。小さな文字でもくっきり読ませる
        fontWeight: "semibold",
        // 短いラベルを詰まって見せないよう、わずかに字間を開ける
        letterSpacing: "wide",
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
                // border ロールトークン(scale 7)で、solid(scale 9)ほど枠線が主張しないようにする
                borderColor: "colorPalette.border",
                color: "colorPalette.fg",
            },
            // 淡い背景 + 枠線: subtle よりも輪郭を出しつつ outline より主張を抑えたい場面向け
            surface: {
                bg: "colorPalette.surface",
                borderWidth: "1px",
                borderColor: "colorPalette.border",
                color: "colorPalette.fg",
            },
        },
        size: {
            // コンパクトなタグ
            sm: {
                // ピル状に見せるため左右をやや広めに。左右 8px / 上下 2px
                px: "2",
                py: "0.5",
                fontSize: "xs",
            },
            // 標準サイズ
            md: {
                // ピル状に見せるため左右をやや広めに。左右 10px / 上下 4px
                px: "2.5",
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
