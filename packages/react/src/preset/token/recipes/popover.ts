import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const popover = defineSlotRecipe({
    className: "popover",
    jsx: ["Popover"],
    description: "The popover component. A floating panel anchored to its trigger.",
    // Ark UI Popover の anatomy に合わせたスロット名(Root はDOMを持たないため含めない)
    slots: ["trigger", "positioner", "content", "arrow", "title", "description", "closeTrigger"],
    base: {
        trigger: {
            // 素の見た目は最低限のリセットのみ。asChild で Button などに差し替えて使うのが基本
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "component.gap.xs",
            bg: "transparent",
            border: "none",
            borderRadius: "control",
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
        positioner: {
            // 実際の位置決めは zag のインラインスタイルが担う。重なり順だけここで持つ。
            // zag は positioner に `--z-index: auto; z-index: var(--z-index)` を
            // **インラインで** 当てるため、Menu / Select と同じく !important で popover の段に載せる
            zIndex: "popover!",
        },
        content: {
            // 白い浮遊パネル。枠線は引かず、floating の影だけでページから浮かせる
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "component.gap.xs",
            minWidth: "48",
            maxWidth: "xs",
            bg: "bg.panel",
            borderRadius: "popover",
            boxShadow: "floating",
            p: "component.padding.lg",
            color: "colorPalette.fg",
            fontSize: "sm",
            outline: "none",
            // Ark が付与する data-state=open で開くアニメーションを再生する(Menu / Tooltip と同じ)
            _open: {
                animationName: "slideDownIn",
                animationDuration: "fast",
                animationTimingFunction: "easeOut",
            },
        },
        arrow: {
            // 三角形の描画自体は zag のインラインスタイルが担う。大きさと色を CSS 変数で渡すだけでよい。
            // 色は Content と同じ白にして、吹き出しと先端をひと続きの面に見せる
            "--arrow-size": "token(sizes.3)",
            "--arrow-background": "token(colors.bg.panel)",
        },
        title: {
            // 見出し。白(bg.panel)の上の colorPalette.fg は Lc 80 以上(mori: Lc 82.1)で本文の目安 Lc 75 を満たす
            color: "colorPalette.fg",
            fontSize: "md",
            fontWeight: "semibold",
            lineHeight: "normal",
            // 右上の CloseTrigger と文字が重ならないよう、右側にボタン分の余白を空ける
            pe: "8",
        },
        description: {
            // 補足テキスト。colorPalette.fg.muted(gray.11)は白の上で Lc 79.8 で、補助テキストの目安 Lc 60 を満たす
            color: "colorPalette.fg.muted",
            fontSize: "sm",
            lineHeight: "relaxed",
        },
        closeTrigger: {
            position: "absolute",
            insetBlockStart: "2",
            insetInlineEnd: "2",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "8",
            height: "8",
            bg: "transparent",
            border: "none",
            borderRadius: "full",
            // アイコンは意味のある非テキスト要素。colorPalette.fg.muted は白の上で Lc 79.8(目安 Lc 45 以上)
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            transitionProperty: "background",
            transitionDuration: "fast",
            _hover: {
                bg: "bg.muted",
            },
            _focusVisible: focusRing,
            "& svg": {
                width: "4",
                height: "4",
            },
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
