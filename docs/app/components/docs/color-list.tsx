import Color from "colorjs.io";
import { cx, sva } from "styled-system/css";
import tokensSpec from "styled-system/specs/tokens.json";
import { CopyableCode } from "./copyable-code";
import { checkerboard } from "./shared-styles";

const colorListStyles = sva({
    slots: ["root", "section", "title", "scaleLabel", "grid", "card", "swatch", "swatchFill", "info", "step", "value"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
            width: "full",
        },
        section: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            width: "full",
        },
        title: {
            fontSize: "lg",
            fontWeight: "semibold",
            color: "gray.fg",
            // パレット名は小文字のトークン名をそのまま見出しにする
            fontFamily: "mono",
        },
        scaleLabel: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "gray.fg.muted",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
            gap: "3",
            width: "full",
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "1.5",
            minWidth: "0",
        },
        swatch: {
            height: "16",
            width: "full",
            borderRadius: "md",
            overflow: "hidden",
            // 明るい色でもチップの輪郭が分かるよう内側に薄い線を引く
            boxShadow: "[inset 0 0 0 1px rgba(0,0,0,0.1)]",
        },
        swatchFill: {
            width: "full",
            height: "full",
        },
        info: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            minWidth: "0",
        },
        step: {
            fontSize: "xs",
            color: "gray.fg",
            maxWidth: "full",
        },
        value: {
            fontSize: "xs",
            fontFamily: "mono",
            fontVariantNumeric: "tabular-nums",
            color: "gray.fg.muted",
            overflowWrap: "anywhere",
        },
    },
});

interface ReferenceColorToken {
    name: string;
    value: string;
    cssVar: string;
}

interface PaletteScales {
    palette: string;
    /** 12 段階のソリッドスケール (1-12) */
    scale: ReferenceColorToken[];
    /** 12 段階のアルファスケール (a1-a12) */
    alpha: ReferenceColorToken[];
}

// spec の tokens.json からすべてのカラーパレットを最初のパスセグメントでグループ化する。
// このプロジェクトはライトモード専用のため、light スケールのみを表示対象にする
function parseReferenceColorPalettes(): { palettes: PaletteScales[]; singles: ReferenceColorToken[] } {
    const data = tokensSpec.data.find((d) => d.type === "colors");
    if (!data) return { palettes: [], singles: [] };

    const paletteMap = new Map<string, PaletteScales>();
    const singles: ReferenceColorToken[] = [];

    for (const token of data.values) {
        const parts = token.name.split(".");
        const entry: ReferenceColorToken = {
            name: token.name,
            value: String(token.value),
            cssVar: token.cssVar,
        };

        // white / black などセグメントが 1 つだけの単色トークン
        if (parts.length === 1) {
            singles.push(entry);
            continue;
        }
        // ライトモード専用プロジェクトのため dark スケールは表示しない
        if (parts[1] !== "light") continue;

        const scales = paletteMap.get(parts[0]) ?? { palette: parts[0], scale: [], alpha: [] };
        // a1-a12 はアルファスケール、それ以外はソリッドスケール
        (parts[2].startsWith("a") ? scales.alpha : scales.scale).push(entry);
        paletteMap.set(parts[0], scales);
    }

    return { palettes: Array.from(paletteMap.values()), singles };
}

// モジュール読み込み時に一度だけ spec を解析する
const { palettes: allPalettes, singles: singleTokens } = parseReferenceColorPalettes();

const toHex = (colorValue: string): string => {
    try {
        return new Color(colorValue).to("srgb").toString({ format: "hex" });
    } catch {
        return colorValue;
    }
};

interface SwatchCardProps {
    token: ReferenceColorToken;
    styles: ReturnType<typeof colorListStyles>;
    /** 透過色を市松模様の上に描画するか */
    isAlpha?: boolean;
}

function SwatchCard({ token, styles, isAlpha }: SwatchCardProps) {
    // 表示は末尾のステップ名 (1 / a12 など) に短縮し、コピーはフルのトークン名にする
    const step = token.name.split(".").at(-1) ?? token.name;
    return (
        <div className={styles.card}>
            <div className={cx(styles.swatch, isAlpha && checkerboard)}>
                <div className={styles.swatchFill} style={{ backgroundColor: token.cssVar }} />
            </div>
            <div className={styles.info}>
                <span className={styles.step}>
                    <CopyableCode text={token.name} display={step} />
                </span>
                <span className={styles.value}>{toHex(token.value)}</span>
            </div>
        </div>
    );
}

interface ColorListProps {
    /** 指定した場合はそのパレットのみ表示する。省略時は全パレットを表示する */
    palette?: string;
}

export function ColorList({ palette }: ColorListProps) {
    const styles = colorListStyles();
    const palettes = palette ? allPalettes.filter((p) => p.palette === palette) : allPalettes;

    return (
        <div className={styles.root}>
            {palettes.map((scales) => (
                <section key={scales.palette} className={styles.section}>
                    <h3 className={styles.title}>{scales.palette}</h3>
                    <span className={styles.scaleLabel}>Scale (1-12)</span>
                    <div className={styles.grid}>
                        {scales.scale.map((token) => (
                            <SwatchCard key={token.name} token={token} styles={styles} />
                        ))}
                    </div>
                    <span className={styles.scaleLabel}>Alpha (a1-a12)</span>
                    <div className={styles.grid}>
                        {scales.alpha.map((token) => (
                            <SwatchCard key={token.name} token={token} styles={styles} isAlpha />
                        ))}
                    </div>
                </section>
            ))}
            {/* white / black などパレットに属さない単色トークン */}
            {!palette && singleTokens.length > 0 && (
                <section className={styles.section}>
                    <h3 className={styles.title}>base</h3>
                    <div className={styles.grid}>
                        {singleTokens.map((token) => (
                            <SwatchCard key={token.name} token={token} styles={styles} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
