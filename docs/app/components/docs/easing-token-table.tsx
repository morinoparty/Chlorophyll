"use client";

import { motion } from "motion/react";
import { sva } from "styled-system/css";
import { parseTokensByType, type Token } from "./token-parser";

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

const previewStyles = sva({
    slots: ["track", "ball"],
    base: {
        track: {
            position: "relative",
            width: "full",
            height: "6",
            borderRadius: "full",
            backgroundColor: "colorPalette.bg.subtle",
            overflow: "hidden",
        },
        ball: {
            position: "absolute",
            top: "1",
            left: "0",
            width: "4",
            height: "4",
            borderRadius: "full",
            backgroundColor: "colorPalette.solid",
        },
    },
});

/**
 * Parse cubic-bezier CSS value into [x1, y1, x2, y2] for motion's ease prop.
 */
function parseEaseValue(value: string): [number, number, number, number] | "linear" {
    if (value === "linear") return "linear";
    const match = value.match(/cubic-bezier\(([^)]+)\)/);
    if (!match) return "linear";
    const parts = match[1].split(",").map((s) => Number.parseFloat(s.trim()));
    if (parts.length !== 4 || parts.some(Number.isNaN)) return "linear";
    return parts as [number, number, number, number];
}

const descriptions: Record<string, string> = {
    linear: "一定速度のアニメーション",
    easeIn: "加速するアニメーション",
    easeOut: "減速するアニメーション",
    easeInOut: "加速して減速するアニメーション",
    emphasizedDecelerate: "強調された減速",
    emphasizedAccelerate: "強調された加速",
};

function EasingBall({ token }: { token: Token }) {
    const ease = parseEaseValue(String(token.value));
    const preview = previewStyles();

    return (
        <div className={preview.track}>
            <motion.div
                className={preview.ball}
                initial={{ left: "0px" }}
                animate={{ left: "calc(100% - 1rem)" }}
                transition={{
                    duration: 1.5,
                    ease,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    repeatDelay: 0.8,
                }}
            />
        </div>
    );
}

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
                                <code>easings.{token.name}</code>
                            </td>
                            <td className={styles.tdMuted}>
                                <code>{String(token.value)}</code>
                            </td>
                            <td className={styles.td} style={{ minWidth: "160px" }}>
                                <EasingBall token={token} />
                            </td>
                            <td className={styles.tdMuted}>{descriptions[token.name] || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
