import type { ReactNode } from "react";
import { css, sva } from "styled-system/css";
import { parseSemanticTokensByType, type SemanticTokenType } from "./semantic-token-parser";

const tableStyles = sva({
    slots: ["tableWrapper", "table", "th", "td", "tdMuted"],
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
        tdMuted: {
            padding: "3",
            fontSize: { base: "xs", md: "sm" },
            color: "colorPalette.fg.muted",
            borderBottom: "[1px solid]",
            borderColor: "border.subtle",
            verticalAlign: "middle",
            whiteSpace: "normal",
        },
    },
});

// Preview bar style for spacing demonstrations
const previewBarStyle = css({
    height: "4",
    backgroundColor: "colorPalette.8",
    borderRadius: "sm",
});

type PreviewType = "spacing" | "radii" | "shadow" | "none";

interface SemanticTokenTableProps {
    type: SemanticTokenType;
    filterPrefix?: string;
    previewType?: PreviewType;
    showDescription?: boolean;
    descriptions?: Record<string, string>;
}

export function SemanticTokenTable({
    type,
    filterPrefix,
    previewType = "none",
    showDescription = false,
    descriptions = {},
}: SemanticTokenTableProps) {
    const styles = tableStyles();
    const tokens = parseSemanticTokensByType(type, filterPrefix);

    const renderPreview = (cssVar: string): ReactNode => {
        switch (previewType) {
            case "spacing":
                return (
                    <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
                        <div className={previewBarStyle} style={{ width: cssVar }} />
                    </div>
                );
            case "radii":
                return (
                    <div
                        style={{
                            width: "3rem",
                            height: "3rem",
                            backgroundColor: "var(--mpc-colors-color-palette-solid)",
                            borderRadius: cssVar,
                        }}
                    />
                );
            case "shadow":
                return (
                    <div
                        style={{
                            width: "3rem",
                            height: "3rem",
                            backgroundColor: "var(--mpc-colors-color-palette-bg)",
                            boxShadow: cssVar,
                            borderRadius: "0.25rem",
                        }}
                    />
                );
            default:
                return null;
        }
    };

    const hasPreview = previewType !== "none";

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Token</th>
                        <th className={styles.th}>Reference</th>
                        {hasPreview && <th className={styles.th}>Preview</th>}
                        {showDescription && <th className={styles.th}>Description</th>}
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <tr key={token.name}>
                            <td className={styles.td}>
                                <code>
                                    {type}.{token.name}
                                </code>
                            </td>
                            <td className={styles.tdMuted}>
                                <code>{token.reference}</code>
                            </td>
                            {hasPreview && <td className={styles.td}>{renderPreview(token.cssVar)}</td>}
                            {showDescription && <td className={styles.tdMuted}>{descriptions[token.name] || ""}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
