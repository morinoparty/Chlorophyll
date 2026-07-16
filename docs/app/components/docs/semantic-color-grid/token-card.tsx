import { cx } from "styled-system/css";
import { CopyableCode } from "../copyable-code";
import { checkerboard } from "../shared-styles";
import { type DisplayToken, TOKEN_DESCRIPTIONS } from "./data";
import { semanticColorCardRecipe } from "./recipes";

interface SemanticColorCardProps {
    token: DisplayToken;
    /** スウォッチクリックで詳細ダイアログを開く */
    onSelect: (token: DisplayToken) => void;
}

export function SemanticColorCard({ token, onSelect }: SemanticColorCardProps) {
    const styles = semanticColorCardRecipe();

    return (
        <div className={styles.card}>
            {token.pairedBg ? (
                // 前景色トークン: ペアの背景の上に文字を載せてプレビューする
                <button
                    type="button"
                    className={styles.preview}
                    onClick={() => onSelect(token)}
                    aria-label={`${token.name} の詳細を表示`}
                    data-token-id={token.name}
                    data-measure="fg"
                    // color も計測要素自身に載せ、継承色を計測しないようにする
                    style={{ backgroundColor: token.pairedBg, color: token.cssVar }}
                >
                    <span className={styles.previewText}>Aa</span>
                </button>
            ) : (
                // 背景系トークン: 市松模様の上の色チップとして見せる（透過色対応）
                <button
                    type="button"
                    className={cx(styles.preview, checkerboard)}
                    onClick={() => onSelect(token)}
                    aria-label={`${token.name} の詳細を表示`}
                >
                    <div
                        className={styles.previewFill}
                        data-token-id={token.name}
                        style={{ backgroundColor: token.cssVar }}
                    />
                </button>
            )}
            <div className={styles.info}>
                {/* トークン名はページ上で直接コピーできる。解決値（hex）は詳細ダイアログで見せる */}
                <CopyableCode text={token.name} className={styles.name} />
                {TOKEN_DESCRIPTIONS[token.name] && (
                    <span className={styles.description}>{TOKEN_DESCRIPTIONS[token.name]}</span>
                )}
            </div>
        </div>
    );
}
