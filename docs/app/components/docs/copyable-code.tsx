import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cx, sva } from "styled-system/css";

// トークン名や var(--mpc-...) をクリックでコピーできるインラインコード。
// コピー完了時はアイコンを opacity + scale のクロスフェードで切り替える
const copyableCodeStyles = sva({
    slots: ["root", "code", "iconStack", "icon", "iconDone"],
    base: {
        root: {
            display: "inline-flex",
            alignItems: "center",
            gap: "1",
            maxWidth: "full",
            paddingX: "1",
            paddingY: "0.5",
            borderRadius: "sm",
            border: "[none]",
            backgroundColor: "[transparent]",
            textAlign: "left",
            cursor: "pointer",
            transition: "[background-color 0.15s ease]",
            _hover: { backgroundColor: "gray.a3" },
        },
        code: {
            fontFamily: "mono",
            // 長い CSS 変数名でもレイアウトを壊さず折り返す
            overflowWrap: "anywhere",
        },
        iconStack: {
            position: "relative",
            width: "3",
            height: "3",
            flexShrink: 0,
            color: "colorPalette.fg.muted",
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
            <span className={styles.iconStack} aria-hidden="true">
                <Copy className={styles.icon} data-hidden={copied ? "" : undefined} />
                <Check className={cx(styles.icon, styles.iconDone)} data-hidden={copied ? undefined : ""} />
            </span>
        </button>
    );
}
