import { IconButton } from "@morinoparty/chlorophyll-react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { sva } from "styled-system/css";

const INSTALL_COMMAND = "pnpm add @morinoparty/chlorophyll-react";

const installStyles = sva({
    slots: ["root", "prompt", "command"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            gap: "3",
            paddingLeft: "4",
            paddingRight: "1.5",
            paddingY: "1.5",
            borderRadius: "l2",
            bg: "colorPalette.surface.subtle",
            borderWidth: "1",
            borderColor: "border",
            fontFamily: "mono",
            fontSize: "sm",
        },
        prompt: {
            color: "colorPalette.fg.muted",
            userSelect: "none",
        },
        command: {
            flex: "1",
            minWidth: "0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "mono",
            color: "colorPalette.fg",
        },
    },
});

export function InstallCommand() {
    const styles = installStyles();
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(INSTALL_COMMAND);
        setCopied(true);
        // 一定時間でアイコンをコピー前に戻す
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className={styles.root}>
            <span className={styles.prompt}>$</span>
            <code className={styles.command}>{INSTALL_COMMAND}</code>
            <IconButton
                variant="ghost"
                size="sm"
                aria-label={copied ? "コピーしました" : "コマンドをコピー"}
                onClick={copy}
            >
                {copied ? <Check /> : <Copy />}
            </IconButton>
        </div>
    );
}
