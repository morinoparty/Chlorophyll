import { sva } from "styled-system/css";
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

// Description mappings for duration tokens
const durationDescriptions: Record<string, string> = {
    fastest: "最速のアニメーション（ホバー、フォーカス）",
    faster: "高速なアニメーション",
    fast: "やや速いアニメーション",
    normal: "標準的なアニメーション",
    slow: "やや遅いアニメーション",
    slower: "遅いアニメーション",
    slowest: "最も遅いアニメーション",
};

// Description mappings for easing tokens
const easingDescriptions: Record<string, string> = {
    linear: "一定速度のアニメーション",
    default: "標準的なイージング",
    in: "加速するアニメーション",
    out: "減速するアニメーション",
    "in-out": "加速して減速するアニメーション",
    "emphasized-in": "強調された加速",
    "emphasized-out": "強調された減速",
};

type AnimationType = "durations" | "easings";

interface AnimationTokenTableProps {
    type: AnimationType;
}

export function AnimationTokenTable({ type }: AnimationTokenTableProps) {
    const styles = tableStyles();
    const tokens = parseSemanticTokensByType(type as SemanticTokenType);
    const descriptions = type === "durations" ? durationDescriptions : easingDescriptions;

    return (
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
                                <code>
                                    {type}.{token.name}
                                </code>
                            </td>
                            <td className={styles.tdMuted}>
                                <code>{token.reference}</code>
                            </td>
                            <td className={styles.tdMuted}>{descriptions[token.name] || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
