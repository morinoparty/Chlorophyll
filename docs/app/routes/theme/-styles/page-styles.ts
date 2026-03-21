import { sva } from "styled-system/css";

// Common page layout styles shared across theme documentation pages
export const basePageStyles = sva({
    slots: ["root", "pageTitle", "description", "section", "sectionTitle"],
    base: {
        root: { display: "flex", flexDirection: "column", gap: "8" },
        pageTitle: { fontSize: "2xl", fontWeight: "bold", color: "colorPalette.fg" },
        description: { fontSize: "md", color: "colorPalette.fg.muted" },
        section: { display: "flex", flexDirection: "column", gap: "6" },
        sectionTitle: { fontSize: "xl", fontWeight: "semibold", color: "colorPalette.fg" },
    },
});

// Table styles for token documentation pages
export const tableStyles = sva({
    slots: ["tableWrapper", "table", "th", "td"],
    base: {
        tableWrapper: {
            width: "full",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
        },
        table: { width: "full", minWidth: "[500px]", borderCollapse: "collapse" },
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
    },
});

// Grid styles for card-based token displays
export const gridStyles = sva({
    slots: ["grid", "card", "cardPreview", "cardInfo", "cardName", "cardValue"],
    base: {
        grid: {
            display: "grid",
            gap: "6",
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            alignItems: "center",
        },
        cardPreview: {
            width: "20",
            height: "20",
            backgroundColor: "colorPalette.solid",
            border: "sm",
            borderColor: "border",
        },
        cardInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "center",
        },
        cardName: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
        },
        cardValue: {
            fontSize: "xs",
            color: "colorPalette.fg.muted",
            fontFamily: "mono",
        },
    },
});
