import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const card = defineSlotRecipe({
    className: "card",
    jsx: ["Card"],
    description: "The generic card component (header / title / description / body / footer / image)",
    // Chakra UI の Card と同じ anatomy に、全幅の画像を置く image を足したスロット構成
    slots: ["root", "header", "title", "description", "body", "footer", "image"],
    base: {
        root: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minWidth: "0",
            // 先頭・末尾に置いた Image の角を、カードの角丸で切り取る
            overflow: "hidden",
            borderRadius: "panel",
            // 既定の文字色を colorPalette に追従させる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg.subtle(mori.1) Lc 81.0)
            color: "colorPalette.fg",
            textAlign: "start",
            // asChild で <a> に差し替えたときに下線が付かないようにする
            textDecoration: "none",
            transitionDuration: "normal",
            transitionProperty: "background, border-color, box-shadow",
            transitionTimingFunction: "easeInOut",
        },
        header: {
            // Title と Description を縦に積む
            display: "flex",
            flexDirection: "column",
            gap: "1",
        },
        title: {
            fontWeight: "bold",
            color: "colorPalette.fg",
            lineHeight: "heading",
        },
        description: {
            // 本文より一段引いた補助テキスト
            // (colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg.subtle(mori.1) Lc 78.8 /
            //  hover 時の colorPalette.surface.subtle(mori.2) Lc 76.6。補助テキストの目安 Lc 60 を満たす)
            color: "colorPalette.fg.muted",
        },
        body: {
            // 本文領域。カードの高さが揃えられたときに余白を吸収し、Footer を下端へ押しやる
            display: "flex",
            flexDirection: "column",
            flex: "1",
            gap: "component.gap.sm",
        },
        footer: {
            // ボタンやメタ情報を横に並べる
            display: "flex",
            alignItems: "center",
            gap: "component.gap.sm",
        },
        image: {
            // カードの横幅いっぱいに広げる全幅の画像。比率は利用側(aspectRatio など)に任せる
            display: "block",
            width: "full",
            objectFit: "cover",
        },
    },
    variants: {
        variant: {
            // 白いパネルを影で浮かせる。ページの地色(colorPalette.bg)の上に置く標準のカード
            elevated: {
                root: {
                    bg: "bg.panel",
                    boxShadow: "raised",
                },
            },
            // 白いパネルを枠線で囲む。白い面の上など、地色との差で輪郭が出ない場所で使う。
            // 枠線は情報を持たない装飾的な輪郭なので、ライブラリ方針どおり控えめな border(gray.6、カード向けの step6)にする
            // (計測値: 白 Lc 19.3 / colorPalette.bg(mori) Lc 11.1。中身の文字が意味を担うため非テキストの目安 Lc 45 は適用しない)
            outline: {
                root: {
                    bg: "bg.panel",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "border",
                },
            },
            // colorPalette の最も淡い地色(colorPalette.bg.subtle = step1)で塗る、影も枠線も無い控えめなカード。
            // ページの地色(colorPalette.bg)より明るく、白い面の上ではほんのり色が差して見える
            subtle: {
                root: {
                    bg: "colorPalette.bg.subtle",
                },
            },
        },
        // 余白と文字サイズ。Header / Body / Footer は Chakra UI と同じく、
        // Header は上と左右、Body は四方、Footer は下と左右に余白を持ち、隣り合ったときの間隔が余白 1 つ分になる。
        // Header だけ・Footer だけのカード(Body を置かない)でも下端・上端の余白が欠けないよう、末尾 / 先頭のときは補う
        size: {
            sm: {
                header: {
                    px: "component.padding.lg",
                    pt: "component.padding.lg",
                    _last: { pb: "component.padding.lg" },
                },
                body: { p: "component.padding.lg", textStyle: "sm" },
                footer: {
                    px: "component.padding.lg",
                    pb: "component.padding.lg",
                    _first: { pt: "component.padding.lg" },
                },
                title: { textStyle: "md" },
                description: { textStyle: "xs" },
            },
            md: {
                header: {
                    px: "component.padding.xl",
                    pt: "component.padding.xl",
                    _last: { pb: "component.padding.xl" },
                },
                body: { p: "component.padding.xl", textStyle: "md" },
                footer: {
                    px: "component.padding.xl",
                    pb: "component.padding.xl",
                    _first: { pt: "component.padding.xl" },
                },
                title: { textStyle: "lg" },
                description: { textStyle: "sm" },
            },
            lg: {
                header: {
                    px: "component.padding.2xl",
                    pt: "component.padding.2xl",
                    _last: { pb: "component.padding.2xl" },
                },
                body: { p: "component.padding.2xl", textStyle: "md" },
                footer: {
                    px: "component.padding.2xl",
                    pb: "component.padding.2xl",
                    _first: { pt: "component.padding.2xl" },
                },
                title: { textStyle: "xl" },
                description: { textStyle: "md" },
            },
        },
        // リンクやボタンとして押せるカード(asChild で <a> / <button> に差し替えて使う)。
        // NewsCard / GuideCard と同じく、hover / active で面に colorPalette の色を差して反応を返す
        interactive: {
            true: {
                root: {
                    cursor: "pointer",
                    // 白からいきなり surface(step3)まで濃くすると主張が強いので、
                    // hover は surface.subtle(step2)のごく淡い色に留め、押し込んだ active で 1 段濃くする
                    _hover: {
                        bg: "colorPalette.surface.subtle",
                    },
                    _active: {
                        bg: "colorPalette.surface",
                    },
                    // キーボード操作時のフォーカスリング。outline-style が消えないようロングハンドで指定する(#78)
                    // (colorPalette.focus.ring = mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5)
                    _focusVisible: focusRing,
                },
            },
            false: {},
        },
    },
    compoundVariants: [
        // 影で浮かせたカードは、hover で影を一段深くして持ち上がるように見せる
        {
            variant: "elevated",
            interactive: true,
            css: {
                root: {
                    _hover: {
                        boxShadow: "md",
                    },
                },
            },
        },
        // 枠線のカードは、hover で枠線を一段濃くして押せることを示す
        {
            variant: "outline",
            interactive: true,
            css: {
                root: {
                    _hover: {
                        borderColor: "border.interactive",
                    },
                },
            },
        },
    ],
    defaultVariants: {
        variant: "elevated",
        size: "md",
        interactive: false,
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
