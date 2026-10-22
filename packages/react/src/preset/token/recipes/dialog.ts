import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

// 入場は少しだけ拡大しながらフェードイン、退場はフェードアウト。
// Ark は data-state=open/closed を付け、closed のアニメーションが終わるまでアンマウントを待つ(Presence)
const enterAnimation = {
    animationName: "modalDialogFadeIn, modalDialogScaleIn",
    animationDuration: "normal",
    animationTimingFunction: "easeOut",
} as const;

// 退場は入場より短く引く。終わった瞬間に一度元の不透明度へ戻ってちらつかないよう forwards で止める
const exitAnimation = {
    animationName: "modalDialogFadeOut",
    animationDuration: "fast",
    animationTimingFunction: "easeIn",
    animationFillMode: "forwards",
} as const;

export const dialog = defineSlotRecipe({
    className: "dialog",
    jsx: ["Dialog"],
    description: "The dialog component. A general-purpose modal dialog built on Ark UI Dialog.",
    // Ark UI Dialog の anatomy(Root は DOM を持たないため含めない)に、
    // レイアウト用の header / body / footer を足したスロット構成
    slots: [
        "trigger",
        "backdrop",
        "positioner",
        "content",
        "header",
        "title",
        "description",
        "body",
        "footer",
        "closeTrigger",
    ],
    base: {
        trigger: {
            // 素の見た目は最低限のリセットのみ。asChild で Button などに差し替えて使うのが基本
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            bg: "transparent",
            border: "none",
            borderRadius: "item",
            color: "colorPalette.fg",
            cursor: "pointer",
            // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
            // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
            _focusVisible: focusRing,
            _disabled: {
                cursor: "not-allowed",
                color: "colorPalette.fg.muted",
            },
        },
        backdrop: {
            // 画面全体を覆う半透明の暗転レイヤー
            position: "fixed",
            inset: "0",
            bg: "overlay",
            // zag の dialog は positioner / backdrop に `--z-index` 変数を配るだけで、
            // menu / select のように z-index をインラインで当てないため、クラス側の指定がそのまま効く
            zIndex: "overlay",
            _open: {
                animationName: "modalDialogFadeIn",
                animationDuration: "normal",
                animationTimingFunction: "easeOut",
            },
            _closed: exitAnimation,
        },
        positioner: {
            // Content を画面中央に置くためだけのレイヤー。
            // 自身はクリックを奪わず、Content の外側は下の Backdrop までクリックを通す
            position: "fixed",
            inset: "0",
            zIndex: "modal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // 狭い画面でも Content が画面端に貼り付かないよう、ページと同じ余白を残す
            p: "layout.gutter",
            pointerEvents: "none",
        },
        content: {
            position: "relative",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "component.gap.lg",
            // 横幅は size variant の maxWidth で決まる。縦は画面に収め、溢れた分は body がスクロールする
            width: "full",
            maxHeight: "full",
            p: "component.padding.2xl",
            bg: "bg.panel",
            borderRadius: "panel",
            // ページ内容から一段浮かせる。Drawer / Menu と同じ floating の影
            boxShadow: "floating",
            // 既定の文字色を colorPalette に追従させる
            // (colorPalette.fg の計測値: 白(bg.panel) Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            color: "colorPalette.fg",
            // 開いた直後のフォーカスは内側の最初の操作要素に移り、操作要素が一つも無いときだけ
            // Content 自身(tabIndex=-1)が受け皿になる。その場合も枠全体にリングを出すと煩いため出さない
            outline: "none",
            transformOrigin: "center",
            _open: enterAnimation,
            _closed: exitAnimation,
        },
        header: {
            // Title と Description を縦に積む見出し領域
            display: "flex",
            flexDirection: "column",
            gap: "component.gap.xs",
            // 右上の CloseTrigger(32px)に見出しの文字が潜り込まないよう余白を空けておく
            pe: "8",
        },
        title: {
            color: "colorPalette.fg",
            fontSize: "lg",
            fontWeight: "semibold",
            lineHeight: "normal",
        },
        description: {
            // 補足テキスト(colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg(mori) Lc 71.6)
            color: "colorPalette.fg.muted",
            fontSize: "sm",
            lineHeight: "normal",
        },
        body: {
            // 本文。長文やフォームが画面に収まらないときは、ここだけをスクロールさせて header / footer を残す
            flex: "1",
            minHeight: "0",
            overflowY: "auto",
            // overflow-y: auto にすると overflow-x も auto になり、内側の Field.Input などが外側に描く
            // フォーカスリング(太さ focus.ring 2px + 余白 focus.ring.offset 2px = 4px)の端が切れる。
            // リングが収まる 4px の余白を内側に取り、同じ量の負のマージンで見た目の位置を相殺する
            p: "1",
            m: "-1",
            color: "colorPalette.fg",
            fontSize: "md",
            lineHeight: "relaxed",
        },
        footer: {
            // 操作ボタンは右寄せが既定。狭い画面では折り返す
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "component.gap.md",
        },
        closeTrigger: {
            position: "absolute",
            insetBlockStart: "4",
            insetInlineEnd: "4",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "8",
            height: "8",
            px: "2",
            bg: "transparent",
            border: "none",
            borderRadius: "full",
            // ×アイコンは意味のある非テキスト要素(目安 Lc 45 以上)。
            // colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / hover の bg.muted(gray.3) Lc 71.1
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            transitionProperty: "background",
            transitionDuration: "fast",
            _hover: {
                bg: "bg.muted",
            },
            _focusVisible: focusRing,
            "& :where(svg)": {
                width: "icon.sm",
                height: "icon.sm",
            },
        },
    },
    variants: {
        // Content の最大幅。sm = 確認ダイアログ、md = 標準、lg = フォームや長文
        size: {
            sm: {
                content: { maxWidth: "sm" }, // 24rem = 384px
            },
            md: {
                content: { maxWidth: "lg" }, // 32rem = 512px
            },
            lg: {
                content: { maxWidth: "2xl" }, // 42rem = 672px
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
