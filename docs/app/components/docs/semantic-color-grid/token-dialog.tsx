import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { X } from "lucide-react";
import { cx } from "styled-system/css";
import { CopyableCode } from "../copyable-code";
import { checkerboard } from "../shared-styles";
import { apcaLevel, CONTRAST_TONE_CLASS, contrastLevel, type TokenMetrics } from "./contrast";
import { type DisplayToken, type ThemeName, TOKEN_DESCRIPTIONS } from "./data";
import { semanticColorDialogRecipe } from "./recipes";

interface SemanticColorDialogProps {
    /** 表示対象のトークン。null のときダイアログは閉じる */
    selected: DisplayToken | null;
    theme: ThemeName;
    /** 表示対象トークンの計測値（未計測なら undefined） */
    metric?: TokenMetrics;
    onClose: () => void;
}

// スウォッチクリックで開く詳細ダイアログ。CSS 変数や解決値はここからコピーする
export function SemanticColorDialog({ selected, theme, metric, onClose }: SemanticColorDialogProps) {
    const styles = semanticColorDialogRecipe();

    const level = metric?.ratio !== undefined ? contrastLevel(metric.ratio) : undefined;
    const apca = metric?.lc !== undefined ? apcaLevel(metric.lc) : undefined;
    // パレット相対トークンはサイドバーのテーマトグルに追従した参照先だけを見せる
    const reference = selected
        ? selected.referenceByTheme
            ? selected.referenceByTheme[theme]
            : selected.reference
        : undefined;

    return (
        <Dialog.Root
            open={selected !== null}
            onOpenChange={(e) => {
                if (!e.open) onClose();
            }}
        >
            <Portal>
                <Dialog.Backdrop className={styles.backdrop} />
                <Dialog.Positioner className={styles.positioner}>
                    <Dialog.Content className={styles.content}>
                        {selected && (
                            <>
                                <Dialog.CloseTrigger className={styles.close} aria-label="閉じる">
                                    <X size={18} />
                                </Dialog.CloseTrigger>
                                <Dialog.Title className={styles.title}>{selected.name}</Dialog.Title>
                                {selected.pairedBg ? (
                                    <div
                                        className={styles.preview}
                                        style={{ backgroundColor: selected.pairedBg, color: selected.cssVar }}
                                    >
                                        <span className={styles.previewText}>Aa</span>
                                    </div>
                                ) : (
                                    <div className={cx(styles.preview, checkerboard)}>
                                        <div
                                            className={styles.previewFill}
                                            style={{ backgroundColor: selected.cssVar }}
                                        />
                                    </div>
                                )}
                                <div className={styles.rows}>
                                    <div className={styles.row}>
                                        <span className={styles.rowLabel}>Token</span>
                                        <span className={styles.rowValue}>
                                            <CopyableCode text={selected.name} />
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <span className={styles.rowLabel}>CSS Variable</span>
                                        <span className={styles.rowValue}>
                                            <CopyableCode text={selected.cssVar} />
                                        </span>
                                    </div>
                                    {reference && (
                                        <div className={styles.row}>
                                            <span className={styles.rowLabel}>
                                                Reference{selected.referenceByTheme ? ` (${theme})` : ""}
                                            </span>
                                            <span className={styles.rowValue}>{reference}</span>
                                        </div>
                                    )}
                                    <div className={styles.row}>
                                        <span className={styles.rowLabel}>Resolved value ({theme})</span>
                                        <span className={styles.rowValue}>
                                            {metric?.hex ? <CopyableCode text={metric.hex} /> : "—"}
                                        </span>
                                    </div>
                                    {metric?.ratio !== undefined && level && (
                                        <div className={styles.row}>
                                            <span className={styles.rowLabel}>Contrast</span>
                                            <span className={styles.rowValue}>
                                                <span
                                                    className={cx(
                                                        styles.contrastBadge,
                                                        CONTRAST_TONE_CLASS[level.tone],
                                                    )}
                                                    title="ペアの背景に対する WCAG 2.1 コントラスト比"
                                                >
                                                    WCAG {metric.ratio.toFixed(2)} : 1 · {level.label}
                                                </span>
                                                {metric.lc !== undefined && apca && (
                                                    <span
                                                        className={cx(
                                                            styles.contrastBadge,
                                                            CONTRAST_TONE_CLASS[apca.tone],
                                                        )}
                                                        title="ペアの背景に対する APCA コントラスト値（|Lc| 75 以上が本文の目安）"
                                                    >
                                                        APCA Lc {metric.lc.toFixed(1)} · {apca.label}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {TOKEN_DESCRIPTIONS[selected.name] && (
                                        <Dialog.Description className={styles.description}>
                                            {TOKEN_DESCRIPTIONS[selected.name]}
                                        </Dialog.Description>
                                    )}
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
