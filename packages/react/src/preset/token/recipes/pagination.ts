import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

// item / prevTrigger / nextTrigger は同じ「押せる四角いボタン」の見た目を共有する。
// asChild で <a> を差し込む使い方が前提なので、リンクの下線と文字色も打ち消しておく
const control = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    // 40px の正方形を基準に、3 桁のページ番号でも潰れないよう min で確保する
    minWidth: "10",
    height: "10",
    px: "component.padding.sm",
    borderRadius: "control",
    // button 要素・a 要素どちらで描画されても同じ見た目になるようリセットする
    bg: "transparent",
    border: "none",
    color: "colorPalette.fg.muted",
    fontSize: "sm",
    fontWeight: "medium",
    textDecoration: "none",
    userSelect: "none",
    cursor: "pointer",
    transitionDuration: "normal",
    transitionProperty: "background, color",
    transitionTimingFunction: "easeInOut",
    // 20px = sizes.5。prev/next に差し込むアイコン用
    "& :where(svg)": {
        width: "5",
        height: "5",
    },
    // 現在ページ(data-selected)と無効状態には hover を効かせない。
    // _selected と :hover は詳細度が同じため、hover 側を明示的に除外しないと現在ページが塗り替わる
    "&:not([data-selected]):not(:disabled):not([data-disabled]):hover": {
        bg: "colorPalette.surface",
        color: "colorPalette.fg",
    },
    // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
    // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
    _focusVisible: focusRing,
    // 現在ページ。zag が data-selected と aria-current="page" を付ける
    _selected: {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast",
    },
    // type="link" のとき zag は disabled 属性ではなく data-disabled だけを付ける。
    // _disabled は :disabled / [data-disabled] の双方に当たる
    _disabled: {
        cursor: "not-allowed",
        color: "fg.disabled",
        pointerEvents: "none",
    },
};

export const pagination = defineSlotRecipe({
    className: "pagination",
    jsx: ["Pagination"],
    description: "The pagination component",
    // zag/Ark の anatomy に合わせたスロット名
    slots: ["root", "item", "prevTrigger", "nextTrigger", "ellipsis"],
    base: {
        root: {
            // ページ送りを横一列に並べる。幅が足りなければ折り返して中央に寄せる
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "component.gap.xs",
        },
        item: control,
        prevTrigger: control,
        nextTrigger: control,
        ellipsis: {
            // 省略記号。押せないので cursor もフォーカスも持たせない
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            minWidth: "10",
            height: "10",
            color: "colorPalette.fg.muted",
            fontSize: "sm",
            userSelect: "none",
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
