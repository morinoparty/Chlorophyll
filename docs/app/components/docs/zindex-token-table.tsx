import { css, sva } from "styled-system/css";
import { parseTokensByType } from "./token-parser";

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

const previewContainerStyle = css({
    position: "relative",
    width: "full",
    height: "48",
    backgroundColor: "colorPalette.bg.subtle",
    borderRadius: "md",
    overflow: "hidden",
});

const previewLayerStyle = css({
    position: "absolute",
    width: "24",
    height: "16",
    borderRadius: "sm",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "xs",
    fontWeight: "medium",
    color: "white",
});

// Description mappings for z-index tokens
const zIndexDescriptions: Record<string, string> = {
    hide: "非表示要素",
    base: "基本レイヤー",
    docked: "ドッキング要素",
    dropdown: "ドロップダウン",
    sticky: "スティッキー要素",
    banner: "バナー",
    overlay: "オーバーレイ",
    modal: "モーダル",
    popover: "ポップオーバー",
    skipNav: "スキップナビゲーション",
    toast: "トースト",
    tooltip: "ツールチップ",
    max: "最大値",
};

// Preview layer colors and positions
const previewLayers = [
    { name: "dropdown", color: "var(--mpc-colors-blue-9)", top: "8px", left: "8px" },
    { name: "modal", color: "var(--mpc-colors-mori-9)", top: "32px", left: "48px" },
    { name: "popover", color: "var(--mpc-colors-yellow-9)", top: "56px", left: "88px" },
    { name: "tooltip", color: "var(--mpc-colors-red-9)", top: "80px", left: "128px" },
];

export function ZIndexTokenTable() {
    const styles = tableStyles();
    const tokens = parseTokensByType("zIndex");

    return (
        <>
            <section className={css({ marginBottom: "8" })}>
                <h3
                    className={css({
                        fontSize: "lg",
                        fontWeight: "semibold",
                        marginBottom: "4",
                        color: "colorPalette.fg.muted",
                    })}
                >
                    Layer Hierarchy
                </h3>
                <div className={previewContainerStyle}>
                    {previewLayers.map((layer) => (
                        <div
                            key={layer.name}
                            className={previewLayerStyle}
                            style={{
                                backgroundColor: layer.color,
                                top: layer.top,
                                left: layer.left,
                                zIndex: tokens.find((t) => t.name === layer.name)?.value as number,
                            }}
                        >
                            {layer.name}
                        </div>
                    ))}
                </div>
            </section>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Token</th>
                            <th className={styles.th}>Value</th>
                            <th className={styles.th}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token) => (
                            <tr key={token.name}>
                                <td className={styles.td}>
                                    <code>zIndex.{token.name}</code>
                                </td>
                                <td className={styles.tdMuted}>
                                    <code>{String(token.value)}</code>
                                </td>
                                <td className={styles.tdMuted}>{zIndexDescriptions[token.name] || ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
