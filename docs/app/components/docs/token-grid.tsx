import type React from "react";
import { css, sva } from "styled-system/css";
import { parseTokensByType, type Token, type TokenType } from "./token-parser";

const gridStyles = sva({
    slots: ["grid", "card", "cardPreview", "cardInfo", "cardName", "cardValue"],
    base: {
        grid: {
            display: "grid",
            gridTemplateColumns: { base: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" },
            gap: "6",
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            alignItems: "center",
        },
        cardPreview: {
            width: "20",
            height: "20",
            backgroundColor: "colorPalette.solid",
            border: "sm",
            borderColor: "border",
        },
        cardInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "center",
        },
        cardName: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
        },
        cardValue: {
            fontSize: "xs",
            color: "colorPalette.fg.muted",
            fontFamily: "mono",
        },
    },
});

type PreviewStyle = "radii" | "opacity" | "aspectRatio" | "borderWidth" | "default";

interface TokenGridProps {
    type: TokenType;
    previewStyle?: PreviewStyle;
}

export function TokenGrid({ type, previewStyle = "default" }: TokenGridProps) {
    const styles = gridStyles();
    const tokens = parseTokensByType(type);

    const getPreviewStyle = (token: Token): React.CSSProperties => {
        switch (previewStyle) {
            case "radii":
                return { borderRadius: token.cssVar };
            case "opacity":
                return { opacity: String(token.value) };
            case "aspectRatio":
                return {
                    aspectRatio: String(token.value),
                    height: "auto",
                    width: "100%",
                    maxWidth: "160px",
                };
            case "borderWidth":
                return {
                    border: `${token.cssVar} solid var(--mpc-colors-border)`,
                };
            default:
                return {};
        }
    };

    return (
        <div className={styles.grid}>
            {tokens.map((token) => (
                <div key={token.name} className={styles.card}>
                    <div className={css(gridStyles.raw().cardPreview)} style={getPreviewStyle(token)} />
                    <div className={styles.cardInfo}>
                        <span className={styles.cardName}>{token.name}</span>
                        <span className={styles.cardValue}>{String(token.value)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
