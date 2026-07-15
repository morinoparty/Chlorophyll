import { css, sva } from "styled-system/css";

// token-table / semantic-token-table で共通のテーブルスタイル。
// テーブル自体を横スクロール可能なラッパーで包み、minWidth の強制はしない
export const tokenTableStyles = sva({
    slots: ["tableWrapper", "table", "th", "td", "tdMuted"],
    base: {
        tableWrapper: {
            width: "full",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
        },
        table: {
            width: "full",
            borderCollapse: "collapse",
            // 数値の桁を揃えて縦に読みやすくする
            fontVariantNumeric: "tabular-nums",
        },
        th: {
            textAlign: "left",
            padding: "3",
            fontSize: { base: "xs", md: "sm" },
            fontWeight: "semibold",
            color: "colorPalette.fg.muted",
            borderBottom: "[1px solid]",
            borderColor: "border.muted",
            whiteSpace: "nowrap",
        },
        td: {
            padding: "3",
            fontSize: { base: "xs", md: "sm" },
            color: "colorPalette.fg",
            borderBottom: "[1px solid]",
            borderColor: "border.subtle",
            verticalAlign: "middle",
            whiteSpace: "nowrap",
        },
        tdMuted: {
            padding: "3",
            fontSize: { base: "xs", md: "sm" },
            color: "colorPalette.fg.muted",
            borderBottom: "[1px solid]",
            borderColor: "border.subtle",
            verticalAlign: "middle",
            whiteSpace: "normal",
            // 長い参照値は折り返して横スクロールを最小限にする
            overflowWrap: "anywhere",
        },
    },
});

// 透過色（アルファスケールやオーバーレイ）を視認できるようにする市松模様の背景
export const checkerboard = css({
    backgroundImage: "[repeating-conic-gradient(rgba(0,0,0,0.08) 0% 25%, transparent 0% 50%)]",
    backgroundSize: "[14px 14px]",
});
