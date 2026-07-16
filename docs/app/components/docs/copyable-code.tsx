import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx, sva } from "styled-system/css";

// トークン名や var(--mpc-...) をクリックでコピーできるインラインコード。
// 通常は素のコード表示に徹し、ホバー / フォーカス時だけコピーアイコンを見せる
const copyableCodeStyles = sva({
    slots: ["root", "code", "iconStack", "icon", "iconDone"],
    base: {
        root: {
            display: "inline-flex",
            alignItems: "center",
            gap: "1.5",
            maxWidth: "full",
            padding: "0",
            border: "[none]",
            backgroundColor: "[transparent]",
            textAlign: "left",
            // cursor: copy はドラッグ&ドロップの複製を示すカーソルで誤解を招くため、通常のクリック可能表示にする
            cursor: "pointer",
            // アイコン列ぶんの幅は常に確保し、表示切替でレイアウトが動かないようにする
            "&:hover [data-copy-icon], &:focus-visible [data-copy-icon]": {
                opacity: "[1]",
            },
            // ホバー時はチップの背景を一段濃くしてコピー対象であることを示す
            "&:hover code": {
                backgroundColor: "gray.a4",
            },
            _focusVisible: {
                outline: "[none]",
                borderRadius: "sm",
                boxShadow: "[0 0 0 2px var(--mpc-colors-color-palette-focus-ring)]",
            },
        },
        code: {
            fontFamily: "mono",
            // 長い CSS 変数名でもレイアウトを壊さず折り返す
            overflowWrap: "anywhere",
            // fumadocs の prose スタイルに依存せず、チップの見た目を自前で持つ
            backgroundColor: "gray.a3",
            border: "[none]",
            borderRadius: "sm",
            paddingX: "1.5",
            paddingY: "0.5",
            transition: "[background-color 0.15s ease]",
        },
        iconStack: {
            position: "relative",
            width: "3",
            height: "3",
            flexShrink: 0,
            color: "gray.fg.subtle",
            // 通常時はアイコンを消してコードだけを見せる
            opacity: "[0]",
            transition: "[opacity 0.15s ease]",
        },
        icon: {
            position: "absolute",
            inset: "0",
            width: "full",
            height: "full",
            transition: "[opacity 0.15s ease, transform 0.15s ease]",
            // keyframes を使わず、opacity + scale の遷移だけでクロスフェードする
            "&[data-hidden]": {
                opacity: "[0]",
                transform: "[scale(0.4)]",
            },
        },
        iconDone: {
            // コピー完了はブランドカラーのチェックで示す
            color: "mori.11",
        },
    },
});

interface CopyableCodeProps {
    /** クリック時にクリップボードへコピーされる文字列 */
    text: string;
    /** 表示用ラベル。省略時は text をそのまま表示する */
    display?: string;
    className?: string;
}

export function CopyableCode({ text, display, className }: CopyableCodeProps) {
    const styles = copyableCodeStyles();
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // アンマウント時にコピー表示リセット用のタイマーを破棄する
    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCopy = () => {
        navigator.clipboard?.writeText(text).catch(() => {
            // クリップボードが使えない環境では何もしない
        });
        setCopied(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            type="button"
            className={cx(styles.root, className)}
            onClick={handleCopy}
            title={`Copy: ${text}`}
            aria-label={`Copy ${text}`}
        >
            <code className={styles.code}>{display ?? text}</code>
            <span
                className={styles.iconStack}
                data-copy-icon
                // コピー直後はホバーが外れてもチェックを見せ続ける
                style={copied ? { opacity: 1 } : undefined}
                aria-hidden="true"
            >
                <Copy className={styles.icon} data-hidden={copied ? "" : undefined} />
                <Check className={cx(styles.icon, styles.iconDone)} data-hidden={copied ? undefined : ""} />
            </span>
        </button>
    );
}
