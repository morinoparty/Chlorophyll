import type { ReactNode } from "react";
import { sva } from "styled-system/css";
import { parseTokensByType, type TokenType } from "./token-parser";

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

type PreviewType = "fontWeight" | "duration" | "easing" | "letterSpacing" | "lineHeight" | "opacity" | "borderWidth";

interface TokenTableProps {
    type: TokenType;
    previewType?: PreviewType;
    showDescription?: boolean;
    descriptions?: Record<string, string>;
}

export function TokenTable({ type, previewType, showDescription = false, descriptions = {} }: TokenTableProps) {
    const styles = tableStyles();
    const tokens = parseTokensByType(type);

    const renderPreview = (value: string | number): ReactNode => {
        const stringValue = String(value);
        switch (previewType) {
            case "fontWeight":
                return <span style={{ fontWeight: stringValue }}>The quick brown fox</span>;
            case "duration":
                return <span>{stringValue}</span>;
            case "easing":
                return <span>{stringValue}</span>;
            case "letterSpacing":
                return <span style={{ letterSpacing: stringValue }}>The quick brown fox</span>;
            case "lineHeight":
                return (
                    <span style={{ lineHeight: stringValue, display: "block" }}>
                        Line 1<br />
                        Line 2
                    </span>
                );
            case "opacity":
                return (
                    <div
                        style={{
                            width: "2rem",
                            height: "2rem",
                            backgroundColor: "var(--mpc-colors-color-palette-solid)",
                            opacity: stringValue,
                            borderRadius: "0.25rem",
                        }}
                    />
                );
            case "borderWidth":
                return (
                    <div
                        style={{
                            width: "3rem",
                            height: "1.5rem",
                            border: `${stringValue} solid var(--mpc-colors-border)`,
                            borderRadius: "0.25rem",
                        }}
                    />
                );
            default:
                return <span>{stringValue}</span>;
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Token</th>
                        <th className={styles.th}>Value</th>
                        {previewType && <th className={styles.th}>Preview</th>}
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
                                <code>{String(token.value)}</code>
                            </td>
                            {previewType && <td className={styles.td}>{renderPreview(token.value)}</td>}
                            {showDescription && <td className={styles.tdMuted}>{descriptions[token.name] || ""}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
