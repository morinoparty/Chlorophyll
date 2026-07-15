"use client";

import { sva } from "styled-system/css";
import { CopyableCode } from "./copyable-code";
import { MotionBall, parseEaseValue } from "./motion-preview";
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

const descriptions: Record<string, string> = {
    linear: "一定速度のアニメーション",
    easeIn: "加速するアニメーション",
    easeOut: "減速するアニメーション",
    easeInOut: "加速して減速するアニメーション",
    emphasizedDecelerate: "強調された減速",
    emphasizedAccelerate: "強調された加速",
};

export function EasingTokenTable() {
    const styles = tableStyles();
    const tokens = parseTokensByType("easings");

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Token</th>
                        <th className={styles.th}>Value</th>
                        <th className={styles.th}>Preview</th>
                        <th className={styles.th}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <tr key={token.name}>
                            <td className={styles.td}>
                                <CopyableCode text={`easings.${token.name}`} />
                            </td>
                            {/* 値は折り返さず 1 行で見せる（横スクロールはラッパーが受ける） */}
                            <td className={styles.tdMuted} style={{ whiteSpace: "nowrap" }}>
                                <code>{String(token.value)}</code>
                            </td>
                            <td className={styles.td} style={{ minWidth: "160px" }}>
                                {/* カーブの違いに集中できるよう長さは 1.5 秒に揃える */}
                                <MotionBall duration={1.5} ease={parseEaseValue(String(token.value))} />
                            </td>
                            <td className={styles.tdMuted}>{descriptions[token.name] || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
