import { sva } from "styled-system/css";
import { CopyableCode } from "./copyable-code";
import { parseShadowTokens } from "./semantic-token-parser";

const gridStyles = sva({
    slots: ["grid", "card", "cardPreview", "cardInfo", "cardName", "cardDescription"],
    base: {
        grid: {
            display: "grid",
            // inset.raised.subtle.hover のような長いトークン名でもコピーチップが
            // 途中で折り返さない幅を確保する。影のプレビューも広いほうが見分けやすい
            gridTemplateColumns: "[repeat(auto-fill, minmax(240px, 1fr))]",
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
        cardDescription: {
            fontSize: "xs",
            color: "colorPalette.fg.muted",
            textWrap: "balance",
        },
    },
});

// 影の使いどころ。生の box-shadow 値より「どの場面で使うか」のほうが選ぶ助けになるため、
// 値の代わりにこの説明を見せる。内容は preset/token/semantic-token/shadow.ts の定義意図に対応する
const SHADOW_DESCRIPTIONS: Record<string, string> = {
    xs: "境界を軽く示す程度の最も控えめな影",
    sm: "小さく浮いた面の影。セカンダリボタンの通常時",
    md: "カードなど中程度に浮いた面の影",
    lg: "しっかり浮き上がる柔らかい影。濃い solid 面では小さい影が沈むため primary ボタンに使う",
    xl: "大きく持ち上がった影。primary ボタンのホバー時",
    "2xl": "最も高く浮かせる影",
    inner: "面をへこませる内側の影",
    // elevation ベースの別名（Atlassian 式）。値はスケールのいずれかと同じで、用途で選べるようにしたもの
    raised: "重なりの別名: 一段浮いた面（sm と同じ値）",
    overlay: "重なりの別名: ドロップダウンなど重ねる面（lg と同じ値）",
    floating: "重なりの別名: モーダルなど最前面に浮かせる面（xl と同じ値）",
    "inset.raised": "濃い solid 面のベベル。上辺のハイライトと下辺の影で隆起して見せる",
    "inset.raised.hover": "同上のホバー時。隆起感を少し強める",
    "inset.raised.subtle": "白い面用の控えめなベベル。濃い影だと汚れて見えるため薄くする",
    "inset.raised.subtle.hover": "同上のホバー時。下辺の影を少し深める",
};

export function ShadowTokenGrid() {
    const styles = gridStyles();
    const tokens = parseShadowTokens();

    return (
        <div className={styles.grid}>
            {tokens.map((token) => (
                <div key={token.name} className={styles.card}>
                    <div className={styles.cardPreview} style={{ boxShadow: token.cssVar }} />
                    <div className={styles.cardInfo}>
                        {/* クリックでトークン名をコピーできる */}
                        <CopyableCode text={`shadows.${token.name}`} className={styles.cardName} />
                        {SHADOW_DESCRIPTIONS[token.name] && (
                            <span className={styles.cardDescription}>{SHADOW_DESCRIPTIONS[token.name]}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
