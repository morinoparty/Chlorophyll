import { sva } from "styled-system/css";
import { parseSemanticTokensByType } from "./semantic-token-parser";

const tableStyles = sva({
    slots: ["tableWrapper", "table", "th", "td", "tdMuted", "previewBox"],
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
            whiteSpace: "nowrap",
        },
        previewBox: {
            width: "16",
            height: "10",
            backgroundColor: "colorPalette.bg.subtle",
            borderRadius: "sm",
        },
    },
});

export function BorderTokenTable() {
    const styles = tableStyles();
    const tokens = parseSemanticTokensByType("borders");

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Token</th>
                        <th className={styles.th}>Value</th>
                        <th className={styles.th}>Preview</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <tr key={token.name}>
                            <td className={styles.td}>
                                <code>borders.{token.name}</code>
                            </td>
                            <td className={styles.tdMuted}>
                                <code>{token.reference}</code>
                            </td>
                            <td className={styles.td}>
                                <div className={styles.previewBox} style={{ border: token.cssVar }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
