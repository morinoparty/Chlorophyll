import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const toast = defineSlotRecipe({
    className: "toast",
    jsx: ["Toaster", "Toast"],
    description: "The toast component",
    // zag/Ark の anatomy(root/title/description/actionTrigger/closeTrigger)に、
    // 種別アイコンの indicator と本文をまとめる content を足したスロット構成
    slots: ["root", "indicator", "content", "title", "description", "actionTrigger", "closeTrigger"],
    base: {
        root: {
            // 位置(position/absolute, top/bottom)と CSS 変数は zag が inline style で配るため、
            // ここでは見た目とモーションだけを定義する
            display: "flex",
            alignItems: "start",
            gap: "component.gap.md",
            // 通知として読みやすい固定幅。狭い画面では viewport からはみ出さないよう縮める
            width: "sm",
            maxWidth: "[calc(100vw - 2rem)]",
            p: "component.padding.lg",
            borderRadius: "panel",
            borderWidth: "1px",
            borderColor: "border.subtle",
            bg: "bg.panel",
            color: "fg",
            // ページ内容の上に浮かせるため、overlay 相当の影を落とす
            boxShadow: "overlay",
            // 種別ごとの色は data-type で colorPalette を差し替え、
            // CSS 変数の継承で indicator / title など子スロットへ伝える
            colorPalette: "gray",
            '&[data-type="success"]': { colorPalette: "mori" },
            '&[data-type="error"]': { colorPalette: "red" },
            '&[data-type="warning"]': { colorPalette: "yellow" },
            '&[data-type="info"]': { colorPalette: "blue" },
            '&[data-type="loading"]': { colorPalette: "gray" },
            // ↓ zag が inline style で供給する CSS 変数を消費して、出入り/積み上げのモーションを作る
            // --x/--y: 表示位置のオフセット、--scale: 背面に重なった toast の縮小率
            translate: "[var(--x) var(--y)]",
            scale: "[var(--scale, 1)]",
            opacity: "[var(--opacity)]",
            zIndex: "[var(--z-index)]",
            // stacked/overlap のときだけ供給される。未設定なら height:auto に落ちる
            height: "[var(--height)]",
            willChange: "[translate, opacity, scale, height]",
            transitionProperty: "[translate, scale, opacity, height]",
            transitionDuration: "slower",
            transitionTimingFunction: "emphasizedDecelerate",
            // 消えるときは素早く引く
            _closed: {
                transitionDuration: "normal",
                transitionTimingFunction: "emphasizedAccelerate",
            },
            // root は tabIndex=0 でフォーカスできる(hotkey で移動してくる)
            // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
            // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
            _focusVisible: focusRing,
        },
        indicator: {
            // 種別を表すアイコン。1 行目の文字と目線が揃うよう少しだけ下げる
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            marginTop: "0.5",
            color: "colorPalette.solid",
            // 20px = sizes.5
            "& :where(svg)": {
                width: "5",
                height: "5",
            },
            // loading のときだけアイコンをスピナーとして回す。
            // spin keyframes は create-preset.ts の theme.extend.keyframes に定義してある
            '&[data-type="loading"]': {
                animationName: "spin",
                animationDuration: "1s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
            },
        },
        content: {
            // タイトルと説明文を縦に積む領域。余白を全部もらって伸びる
            display: "flex",
            flexDirection: "column",
            gap: "component.gap.xs",
            flex: "1",
            // 長い文字列が縮まずに root を押し広げるのを防ぐ
            minWidth: "0",
        },
        title: {
            color: "colorPalette.fg",
            fontSize: "sm",
            fontWeight: "semibold",
            lineHeight: "snug",
        },
        description: {
            color: "fg.muted",
            fontSize: "sm",
            lineHeight: "relaxed",
            // URL のような区切りのない文字列でも折り返す
            overflowWrap: "anywhere",
        },
        actionTrigger: {
            // 「元に戻す」などの任意アクション。テキストボタンとして控えめに置く
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            alignSelf: "center",
            px: "component.padding.md",
            py: "component.padding.xs",
            borderRadius: "item",
            bg: "transparent",
            border: "none",
            color: "colorPalette.fg",
            fontSize: "sm",
            fontWeight: "semibold",
            whiteSpace: "nowrap",
            cursor: "pointer",
            transitionProperty: "[background-color, color]",
            transitionDuration: "fast",
            transitionTimingFunction: "easeInOut",
            _hover: {
                bg: "colorPalette.surface",
            },
            _focusVisible: focusRing,
        },
        closeTrigger: {
            // 右上の × ボタン。本文より一段控えめな色にして視線を奪わない
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            marginTop: "0.5",
            // 24px = sizes.6
            width: "6",
            height: "6",
            p: "0",
            borderRadius: "full",
            bg: "transparent",
            border: "none",
            color: "fg.muted",
            cursor: "pointer",
            transitionProperty: "[background-color, color]",
            transitionDuration: "fast",
            transitionTimingFunction: "easeInOut",
            // 16px = sizes.4
            "& :where(svg)": {
                width: "4",
                height: "4",
            },
            _hover: {
                bg: "bg.muted",
                color: "fg",
            },
            _focusVisible: focusRing,
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
