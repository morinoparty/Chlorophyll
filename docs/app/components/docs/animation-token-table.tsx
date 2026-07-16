"use client";

import { CopyableCode } from "./copyable-code";
import { MotionBall, parseDurationSeconds, parseEaseValue } from "./motion-preview";
import { parseSemanticTokensByType, type SemanticTokenType } from "./semantic-token-parser";
import { tokenTableStyles } from "./shared-styles";

// セマンティックトークン名（transition.fast など）に対する説明
const durationDescriptions: Record<string, string> = {
    "transition.fast": "ホバーやフォーカスなどのマイクロインタラクション",
    "transition.normal": "標準的なトランジション",
    "transition.slow": "強調したいアニメーション",
};

const easingDescriptions: Record<string, string> = {
    transition: "ほとんどのトランジションに使う標準イージング",
    "transition.enter": "要素が現れるときの減速カーブ",
    "transition.exit": "要素が消えるときの加速カーブ",
    "transition.emphasized": "重要なアクションに使う強調カーブ",
};

type AnimationType = "durations" | "easings";

interface AnimationTokenTableProps {
    type: AnimationType;
}

export function AnimationTokenTable({ type }: AnimationTokenTableProps) {
    const styles = tokenTableStyles();
    const tokens = parseSemanticTokensByType(type as SemanticTokenType);
    const descriptions = type === "durations" ? durationDescriptions : easingDescriptions;

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
                                <CopyableCode text={`${type}.${token.name}`} />
                            </td>
                            {/* 値は折り返さず 1 行で見せる（横スクロールはラッパーが受ける） */}
                            <td className={styles.tdMuted} style={{ whiteSpace: "nowrap" }}>
                                <code>{token.reference}</code>
                            </td>
                            <td className={styles.td} style={{ minWidth: "180px" }}>
                                {type === "durations" ? (
                                    // duration トークン: 実際の長さで移動させ、標準イージングで揃える
                                    <MotionBall
                                        duration={parseDurationSeconds(token.reference)}
                                        ease={[0.4, 0, 0.2, 1]}
                                    />
                                ) : (
                                    // easing トークン: カーブの違いがわかるよう長さを 1.5 秒に揃える
                                    <MotionBall duration={1.5} ease={parseEaseValue(token.reference)} />
                                )}
                            </td>
                            <td className={styles.tdMuted}>{descriptions[token.name] || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
