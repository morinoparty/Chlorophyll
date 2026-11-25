import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

// 開閉アニメーションの共通設定。入場は easeOut、退場は easeIn で、どちらも normal(200ms)
const enterAnimation = {
    animationDuration: "normal",
    animationTimingFunction: "easeOut",
} as const;

// 退場は終了フレームを保持(forwards)し、Ark の Presence が hidden を付けるまでの一瞬に元の位置が見えないようにする
const exitAnimation = {
    animationDuration: "normal",
    animationTimingFunction: "easeIn",
    animationFillMode: "forwards",
} as const;

// placement ごとのパネルの開閉アニメーションを組み立てる。
// _closed に animationName を与えると、Ark の Presence が退場アニメーションの終了(animationend)を待ってから隠す。
// prefers-reduced-motion: reduce の環境ではスライドをやめ、フェードだけにする
const slideAnimation = (slideIn: string, slideOut: string) => ({
    _open: {
        ...enterAnimation,
        animationName: slideIn,
        _motionReduce: { animationName: "drawerFadeIn" },
    },
    _closed: {
        ...exitAnimation,
        animationName: slideOut,
        _motionReduce: { animationName: "drawerFadeOut" },
    },
});

export const drawer = defineSlotRecipe({
    className: "drawer",
    jsx: ["Drawer"],
    description: "The drawer component. A dialog that slides in from a screen edge.",
    // Ark UI Dialog の anatomy に合わせたスロット名(Root はDOMを持たないため含めない)
    // handle は bottom / top のシートに置く見た目だけのつまみ(Ark の anatomy には無い独自スロット)
    slots: ["trigger", "backdrop", "positioner", "content", "handle", "closeTrigger", "title"],
    base: {
        trigger: {
            // 素の見た目は最低限のリセットのみ。asChild で差し替えて使うのが基本
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
            zIndex: "overlay",
            // 開いたときにフェードインし、閉じるときにフェードアウトする(動きを減らす設定でもフェードのまま)
            _open: {
                ...enterAnimation,
                animationName: "drawerFadeIn",
            },
            _closed: {
                ...exitAnimation,
                animationName: "drawerFadeOut",
            },
        },
        positioner: {
            // Content を画面端に配置するためだけのレイヤー。
            // 自身はクリックを奪わず、Content の外側は下の Backdrop までクリックを通す
            position: "fixed",
            inset: "0",
            zIndex: "modal",
            display: "flex",
            alignItems: "stretch",
            pointerEvents: "none",
        },
        content: {
            position: "relative",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            // Positioner が inset:0 + alignItems:stretch のため、Content の高さは自然にビューポート全体になる
            height: "full",
            maxHeight: "full",
            width: "full",
            maxWidth: "sm",
            bg: "bg.panel",
            boxShadow: "floating",
            outline: "none",
            overflow: "auto",
            // スクロールが端に達しても背後のページへ連鎖させない
            overscrollBehavior: "contain",
        },
        handle: {
            // ドラッグ操作は持たない、シートであることを示すだけのつまみ。支援技術には読ませない(aria-hidden)
            flexShrink: "0",
            alignSelf: "center",
            width: "10",
            height: "1",
            mt: "3",
            borderRadius: "full",
            // colorPalette.border.emphasized(step8)。白い面(bg.panel)の上でのみ使う。
            // calcAPCA 計測値: mori.8 on 白 Lc 46.7(非テキスト要素の目安 Lc 45 を満たす)/ gray.8 on 白 Lc 36.5(絶対下限 Lc 30 は満たす)
            bg: "colorPalette.border.emphasized",
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
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            transitionProperty: "background",
            transitionDuration: "fast",
            _hover: {
                bg: "bg.muted",
            },
            _focusVisible: focusRing,
        },
        title: {
            color: "colorPalette.fg",
            fontSize: "lg",
            fontWeight: "semibold",
            lineHeight: "normal",
            px: "component.padding.2xl",
            pt: "component.padding.2xl",
        },
    },
    variants: {
        // スライド方向とアンカー位置。start = 画面左、end = 画面右、bottom = 画面下(ボトムシート)、top = 画面上
        placement: {
            start: {
                positioner: { justifyContent: "flex-start" },
                content: slideAnimation("drawerSlideInFromStart", "drawerSlideOutToStart"),
            },
            end: {
                positioner: { justifyContent: "flex-end" },
                content: slideAnimation("drawerSlideInFromEnd", "drawerSlideOutToEnd"),
            },
            bottom: {
                // 縦方向に並べ替えて下端に寄せる。alignItems: stretch のままなので Content は横幅いっぱいになる
                positioner: { flexDirection: "column", justifyContent: "flex-end" },
                content: {
                    // 高さは中身なり。長いリストは 85dvh で止めて Content 内でスクロールさせる
                    height: "auto",
                    maxHeight: "85dvh",
                    maxWidth: "full",
                    // 画面端に接する下側は角を落とさず、上側だけ白いパネル面の役割の角丸(panel)で丸める
                    borderTopRadius: "panel",
                    // iPhone のホームインジケーターなどに中身が重ならないよう、セーフエリア分の余白を足す
                    pb: "env(safe-area-inset-bottom, 0px)",
                    ...slideAnimation("drawerSlideInFromBottom", "drawerSlideOutToBottom"),
                },
            },
            top: {
                positioner: { flexDirection: "column", justifyContent: "flex-start" },
                content: {
                    height: "auto",
                    maxHeight: "85dvh",
                    maxWidth: "full",
                    // bottom の反転。画面上端に接する上側は角を落とさず、下側だけ丸める
                    borderBottomRadius: "panel",
                    // ノッチやステータスバーに中身が重ならないよう、セーフエリア分の余白を足す
                    pt: "env(safe-area-inset-top, 0px)",
                    ...slideAnimation("drawerSlideInFromTop", "drawerSlideOutToTop"),
                },
            },
        },
    },
    defaultVariants: {
        placement: "end",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
