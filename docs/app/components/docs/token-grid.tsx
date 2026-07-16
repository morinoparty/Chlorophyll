import type React from "react";
import { css, sva } from "styled-system/css";
import { CopyableCode } from "./copyable-code";
import { parseTokensByType, type Token, type TokenType } from "./token-parser";

const gridStyles = sva({
    slots: ["grid", "card", "cardPreviewArea", "cardPreview", "cardInfo", "cardName", "cardValue"],
    base: {
        grid: {
            display: "grid",
            // トークン名のコピーチップはアイコン列ぶんの幅を要するため、
            // カラム数を固定せず最低幅を保証して名前が途中で折り返さないようにする
            gridTemplateColumns: "[repeat(auto-fill, minmax(120px, 1fr))]",
            gap: "6",
        },
        // プレビュー・トークン名・値をカード左端で揃える。
        // 中央揃えだと幅の異なるコピーチップがカードごとにずれて落ち着かないため
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            alignItems: "flex-start",
            minWidth: "0",
        },
        // プレビューの高さを固定し、比率で高さが変わる aspectRatio でも
        // トークン名の開始位置が行内で揃うようにする
        cardPreviewArea: {
            display: "flex",
            alignItems: "center",
            width: "full",
            height: "20",
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
            alignItems: "flex-start",
            minWidth: "0",
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
                // 高さを領域いっぱいに固定し、幅は比率に従わせる。
                // 横長すぎてカード幅を超えるものは maxWidth で頭打ちにする
                return {
                    aspectRatio: String(token.value),
                    height: "100%",
                    width: "auto",
                    maxWidth: "100%",
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
                    <div className={styles.cardPreviewArea}>
                        <div className={css(gridStyles.raw().cardPreview)} style={getPreviewStyle(token)} />
                    </div>
                    <div className={styles.cardInfo}>
                        {/* カードは短い名前で見せ、コピーは実際に指定できるトークンパスにする */}
                        <CopyableCode text={`${type}.${token.name}`} display={token.name} className={styles.cardName} />
                        <span className={styles.cardValue}>{String(token.value)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
