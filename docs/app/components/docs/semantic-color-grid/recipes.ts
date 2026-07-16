import { sva } from "styled-system/css";

// 役割グループ 1 つぶんのカード一覧のレイアウト
export const semanticColorGridRecipe = sva({
    slots: ["grid"],
    base: {
        grid: {
            display: "grid",
            gridTemplateColumns: { base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "6",
        },
    },
});

// トークン 1 件ぶんのカード（スウォッチ + トークン名 + 補足説明）
export const semanticColorCardRecipe = sva({
    slots: ["card", "preview", "previewFill", "previewText", "info", "name", "description"],
    base: {
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            minWidth: "0",
        },
        // クリックで詳細ダイアログを開くスウォッチ（button 要素）
        preview: {
            width: "full",
            height: "20",
            borderRadius: "md",
            border: "sm",
            borderColor: "border",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            cursor: "pointer",
            transition: "[border-color 0.15s ease-out, box-shadow 0.15s ease-out]",
            _hover: {
                borderColor: "border.emphasized",
            },
            _focusVisible: {
                outline: "[none]",
                boxShadow: "[0 0 0 2px var(--mpc-colors-color-palette-focus-ring)]",
            },
        },
        previewFill: {
            width: "full",
            height: "full",
        },
        previewText: {
            fontSize: "2xl",
            fontWeight: "semibold",
        },
        info: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5",
            alignItems: "flex-start",
            minWidth: "0",
        },
        name: {
            fontSize: "sm",
            maxWidth: "full",
        },
        description: {
            fontSize: "xs",
            color: "gray.fg.muted",
            textWrap: "balance",
        },
    },
});

// スウォッチクリックで開く詳細ダイアログ
export const semanticColorDialogRecipe = sva({
    slots: [
        "backdrop",
        "positioner",
        "content",
        "close",
        "preview",
        "previewFill",
        "previewText",
        "title",
        "rows",
        "row",
        "rowLabel",
        "rowValue",
        "description",
        "contrastBadge",
    ],
    base: {
        backdrop: {
            position: "fixed",
            inset: "0",
            zIndex: "overlay",
            backgroundColor: "overlay",
            opacity: "0",
            transition: "[opacity 0.2s ease-out]",
            _open: { opacity: "[1]" },
            _closed: { opacity: "0" },
        },
        positioner: {
            position: "fixed",
            inset: "0",
            zIndex: "overlay",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4",
        },
        content: {
            position: "relative",
            width: "full",
            maxWidth: "[26rem]",
            display: "flex",
            flexDirection: "column",
            gap: "4",
            backgroundColor: "bg.panel",
            border: "sm",
            borderColor: "border",
            borderRadius: "lg",
            boxShadow: "[0 16px 48px rgba(0, 0, 0, 0.24)]",
            padding: "5",
            opacity: "0",
            transform: "[translateY(8px)]",
            transition: "[opacity 0.2s ease-out, transform 0.2s ease-out]",
            _open: { opacity: "[1]", transform: "[translateY(0)]" },
            _closed: { opacity: "0", transform: "[translateY(8px)]" },
        },
        close: {
            position: "absolute",
            top: "3",
            right: "3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "8",
            height: "8",
            borderRadius: "md",
            color: "gray.fg.muted",
            backgroundColor: "[transparent]",
            border: "[none]",
            cursor: "pointer",
            transition: "colors",
            _hover: { backgroundColor: "gray.a3", color: "gray.fg" },
        },
        preview: {
            width: "full",
            height: "28",
            borderRadius: "md",
            border: "sm",
            borderColor: "border",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        previewFill: {
            width: "full",
            height: "full",
        },
        previewText: {
            fontSize: "3xl",
            fontWeight: "semibold",
        },
        title: {
            fontSize: "lg",
            fontFamily: "mono",
            fontWeight: "semibold",
            color: "gray.fg",
            overflowWrap: "anywhere",
        },
        rows: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
        },
        row: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "flex-start",
        },
        rowLabel: {
            fontSize: "xs",
            color: "gray.fg.subtle",
            textTransform: "uppercase",
            letterSpacing: "[0.05em]",
        },
        rowValue: {
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2",
            fontSize: "sm",
            fontFamily: "mono",
            fontVariantNumeric: "tabular-nums",
            color: "gray.fg",
            overflowWrap: "anywhere",
        },
        description: {
            fontSize: "sm",
            color: "gray.fg.muted",
        },
        contrastBadge: {
            display: "inline-flex",
            alignItems: "center",
            paddingX: "2",
            paddingY: "0.5",
            borderRadius: "full",
            fontSize: "xs",
            fontVariantNumeric: "tabular-nums",
            // 比率とラベルを 1 行に保ち、バッジが縦に潰れないようにする
            whiteSpace: "nowrap",
        },
    },
});
