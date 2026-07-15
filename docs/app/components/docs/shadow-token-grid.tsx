import { sva } from "styled-system/css";
import { parseShadowTokens } from "./semantic-token-parser";

const gridStyles = sva({
    slots: ["grid", "card", "cardPreview", "cardInfo", "cardName", "cardValue"],
    base: {
        grid: {
            display: "grid",
            gridTemplateColumns: { base: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "6",
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
        },
        cardPreview: {
            width: "full",
            height: "32",
            backgroundColor: "colorPalette.bg",
            borderRadius: "lg",
        },
        cardInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
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
            wordBreak: "break-all",
        },
    },
});

export function ShadowTokenGrid() {
    const styles = gridStyles();
    const tokens = parseShadowTokens();

    return (
        <div className={styles.grid}>
            {tokens.map((token) => (
                <div key={token.name} className={styles.card}>
                    <div className={styles.cardPreview} style={{ boxShadow: token.cssVar }} />
                    <div className={styles.cardInfo}>
                        <span className={styles.cardName}>shadows.{token.name}</span>
                        <span className={styles.cardValue}>{token.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
