import { sva } from "styled-system/css";
import textStylesSpec from "styled-system/specs/text-styles.json";
import tokensSpec from "styled-system/specs/tokens.json";

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
            whiteSpace: "nowrap",
        },
    },
});

interface FontSizeToken {
    name: string;
    value: string;
    cssVar: string;
}

const lineHeightMap: Record<string, string> = {
    "2xs": "0.75rem",
    xs: "1rem",
    sm: "1.25rem",
    md: "1.5rem",
    lg: "1.75rem",
    xl: "1.875rem",
    "2xl": "2rem",
    "3xl": "2.375rem",
    "4xl": "2.75rem",
    "5xl": "3.75rem",
};

function parseFontSizeTokens(): FontSizeToken[] {
    const fontSizesData = tokensSpec.data.find((d) => d.type === "fontSizes");
    if (!fontSizesData) return [];
    return fontSizesData.values.map((token) => ({
        name: token.name,
        value: String(token.value),
        cssVar: token.cssVar,
    }));
}

export function TextStylesTable() {
    const styles = tableStyles();
    const fontSizeTokens = parseFontSizeTokens();
    const fontSizeMap = new Map(fontSizeTokens.map((t) => [t.name, t.value]));

    const textStyleTokens = textStylesSpec.data
        .filter((token) => token.name !== "none" && token.name !== "body" && token.name !== "label")
        .map((token) => ({
            name: token.name,
            description: token.description,
            fontSize: fontSizeMap.get(token.name),
            lineHeight: lineHeightMap[token.name],
        }));

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Name</th>
                        <th className={styles.th}>Font Size</th>
                        <th className={styles.th}>Line Height</th>
                        <th className={styles.th}>Sample</th>
                    </tr>
                </thead>
                <tbody>
                    {textStyleTokens.map((token) => (
                        <tr key={token.name}>
                            <td className={styles.td}>
                                <code>{token.name}</code>
                            </td>
                            <td className={styles.tdMuted}>{token.fontSize}</td>
                            <td className={styles.tdMuted}>{token.lineHeight}</td>
                            <td className={styles.td}>
                                <span
                                    style={{
                                        fontSize: `var(--mpc-font-sizes-${token.name})`,
                                        lineHeight: token.lineHeight,
                                        color: "var(--mpc-colors-color-palette-fg)",
                                    }}
                                >
                                    Aa
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function FontSizesTable() {
    const styles = tableStyles();
    const fontSizeTokens = parseFontSizeTokens();

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Token</th>
                        <th className={styles.th}>Value</th>
                        <th className={styles.th}>Sample</th>
                    </tr>
                </thead>
                <tbody>
                    {fontSizeTokens.map((token) => (
                        <tr key={token.name}>
                            <td className={styles.td}>
                                <code>fontSizes.{token.name}</code>
                            </td>
                            <td className={styles.tdMuted}>{token.value}</td>
                            <td className={styles.td}>
                                <span
                                    style={{
                                        fontSize: token.cssVar,
                                        color: "var(--mpc-colors-color-palette-fg)",
                                    }}
                                >
                                    Third Place
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
