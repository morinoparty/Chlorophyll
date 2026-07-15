import type { ReactNode } from "react";
import { CopyableCode } from "./copyable-code";
import { MotionBall, parseDurationSeconds, parseEaseValue } from "./motion-preview";
import { tokenTableStyles } from "./shared-styles";
import { parseTokensByType, type TokenType } from "./token-parser";

type PreviewType = "fontWeight" | "duration" | "easing" | "letterSpacing" | "lineHeight" | "opacity" | "borderWidth";

interface TokenTableProps {
    type: TokenType;
    previewType?: PreviewType;
    showDescription?: boolean;
    descriptions?: Record<string, string>;
}

export function TokenTable({ type, previewType, showDescription = false, descriptions = {} }: TokenTableProps) {
    const styles = tokenTableStyles();
    const tokens = parseTokensByType(type);

    const renderPreview = (value: string | number): ReactNode => {
        const stringValue = String(value);
        switch (previewType) {
            case "fontWeight":
                return <span style={{ fontWeight: stringValue }}>The quick brown fox</span>;
            case "duration":
                // トークンの持続時間そのままでボールを動かし、速さの違いを見せる
                return <MotionBall duration={parseDurationSeconds(stringValue)} ease={[0.4, 0, 0.2, 1]} />;
            case "easing":
                // カーブの違いに集中できるよう長さは 1.5 秒に揃える
                return <MotionBall duration={1.5} ease={parseEaseValue(stringValue)} />;
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
                                {/* クリックでトークン名をコピーできる */}
                                <CopyableCode text={`${type}.${token.name}`} />
                            </td>
                            {/* 値は折り返さず 1 行で見せる（横スクロールはラッパーが受ける） */}
                            <td className={styles.tdMuted} style={{ whiteSpace: "nowrap" }}>
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
