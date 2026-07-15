import Color from "colorjs.io";
import { useEffect, useRef, useState } from "react";
import { css, cx, sva } from "styled-system/css";
import { CopyableCode } from "./copyable-code";
import { parseSemanticTokensByType } from "./semantic-token-parser";
import { checkerboard } from "./shared-styles";

// パレット切り替えの対象。panda は css() 内のリテラルを静的解析して CSS を生成するため、
// colorPalette に変数を渡さずここで個別に事前生成する（badge と同じパターン）
const PALETTES = ["mori", "umi", "gray", "red", "yellow", "blue"] as const;
type PaletteName = (typeof PALETTES)[number];

const PALETTE_CLASS: Record<PaletteName, string> = {
    mori: css({ colorPalette: "mori" }),
    umi: css({ colorPalette: "umi" }),
    gray: css({ colorPalette: "gray" }),
    red: css({ colorPalette: "red" }),
    yellow: css({ colorPalette: "yellow" }),
    blue: css({ colorPalette: "blue" }),
};

// トークン名の接尾辞（最初のセグメント）から役割グループへのマッピング
const ROLE_ORDER = [
    "Background",
    "Surface",
    "Solid",
    "Foreground",
    "Contrast",
    "Border",
    "Focus",
    "Overlay",
    "Other",
] as const;
type Role = (typeof ROLE_ORDER)[number];

const ROLE_BY_PREFIX: Record<string, Role> = {
    bg: "Background",
    surface: "Surface",
    solid: "Solid",
    fg: "Foreground",
    contrast: "Contrast",
    border: "Border",
    focus: "Focus",
    overlay: "Overlay",
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
    Background: "ページやセクション、セカンダリ面の背景に使うトークン",
    Surface: "カードやリストなどコンポーネントの面に使うトークン",
    Solid: "ボタンなどの塗りつぶしに使う高彩度トークン",
    Foreground: "テキストやアイコンに使う前景色トークン",
    Contrast: "solid 塗りつぶしの上に載せる文字色トークン",
    Border: "枠線や区切り線に使うトークン",
    Focus: "フォーカスリングに使うトークン",
    Overlay: "モーダルなどの背面を覆うオーバーレイ用トークン",
    Other: "その他のセマンティックカラートークン",
};

// 各役割グループの使い方のルール（コントラクト）。見出し直下に表示する
const ROLE_RULES: Partial<Record<Role, string[]>> = {
    Background: ["ページ全体には bg.subtle、セクションの面には bg を使う"],
    Surface: ["hover → active の順で一段ずつ濃くする。段階を飛ばさない"],
    Solid: ["solid の上のテキストには必ず contrast を使う", "hover 時は solid.emphasized に切り替える"],
    Foreground: ["fg 系は bg / surface 系の上でのみ使う。solid の上には contrast を使う"],
    Contrast: ["contrast は solid / solid.emphasized の上専用。淡い背景の上では使わない"],
    Border: ["通常の区切りには border、入力欄など操作対象には border.interactive を使う"],
    Focus: ["フォーカスリングは focus.ring を outline か box-shadow で描画する"],
    Overlay: ["モーダルの背面には overlay を重ね、コンテンツ自体を暗くしない"],
};

// 人間向けの補足説明。未知のトークンは説明なしでも解決値つきで表示される
const TOKEN_DESCRIPTIONS: Record<string, string> = {
    "colorPalette.bg": "Default background",
    "colorPalette.bg.subtle": "Subtle background",
    "colorPalette.bg.secondary": "Secondary surface (solid fill)",
    "colorPalette.surface": "Component background (normal)",
    "colorPalette.surface.hover": "Component background (hover)",
    "colorPalette.surface.active": "Component background (active)",
    "colorPalette.solid": "Solid background for buttons",
    "colorPalette.solid.emphasized": "Solid background (hover)",
    "colorPalette.contrast": "Text on solid background",
    "colorPalette.fg": "Default text",
    "colorPalette.fg.subtle": "Subtle text",
    "colorPalette.fg.muted": "Muted text",
    "colorPalette.fg.secondary": "Text on bg.secondary",
    "colorPalette.border": "Palette-tinted border",
    border: "Default border",
    "border.muted": "Muted border",
    "border.subtle": "Subtle border",
    "border.interactive": "Interactive element border",
    "border.emphasized": "Emphasized border",
    "border.error": "Error state border",
    "border.warning": "Warning state border",
    "border.success": "Success state border",
    "border.info": "Info state border",
    bg: "App background",
    "bg.subtle": "Subtle app background",
    "bg.muted": "Muted background",
    "bg.emphasized": "Emphasized background",
    "bg.inverted": "Inverted background",
    "bg.panel": "Panel background",
    overlay: "Modal overlay",
    "overlay.subtle": "Subtle overlay",
    "focus.ring": "Focus ring",
    "focus.ring.error": "Focus ring (error)",
};

// fg 系トークンのプレビューとコントラスト計測に使う、ペアとなる背景の CSS 変数
const FG_PAIRED_BG: Record<string, string> = {
    "colorPalette.fg": "var(--mpc-colors-color-palette-bg)",
    "colorPalette.fg.subtle": "var(--mpc-colors-color-palette-bg)",
    "colorPalette.fg.muted": "var(--mpc-colors-color-palette-bg)",
    "colorPalette.fg.secondary": "var(--mpc-colors-color-palette-bg-secondary)",
    "colorPalette.contrast": "var(--mpc-colors-color-palette-solid)",
};

interface DisplayToken {
    /** 表示名。パレット相対なら colorPalette.*、グローバルならそのままの名前 */
    name: string;
    cssVar: string;
    role: Role;
    /** パレット相対トークンのみ: 各パレットでの参照先 */
    referenceByPalette?: Partial<Record<PaletteName, string>>;
    /** グローバルトークンのみ: 参照先 */
    reference?: string;
    /** fg 系トークンのプレビュー背景に使う CSS 変数 */
    pairedBg?: string;
}

// spec の参照値 "{colors.mori.2}" を "mori.2" のような読みやすい形にする
const cleanReference = (reference: string): string => reference.replace(/\{colors\.([^}]+)\}/g, "$1");

// mori.1 / mori.a12 のような 12 段階スケール名（リファレンストークン側）を除外する
const SCALE_NAME_RE = /^a?\d+$/;

// spec からセマンティックカラートークンを読み込み、役割ごとにグループ化する。
// パレット相対トークン（mori.bg など）は colorPalette.* 1 件に集約する
function buildRoleGroups(): Map<Role, DisplayToken[]> {
    const groups = new Map<Role, DisplayToken[]>();
    const paletteTokens = new Map<string, DisplayToken>();

    const push = (token: DisplayToken) => {
        const list = groups.get(token.role) ?? [];
        list.push(token);
        groups.set(token.role, list);
    };

    for (const token of parseSemanticTokensByType("colors")) {
        const [head, ...rest] = token.name.split(".");
        const suffix = rest.join(".");

        if ((PALETTES as readonly string[]).includes(head)) {
            // 12 段階スケール（mori.1 等）はリファレンストークンのページで扱う
            if (!suffix || SCALE_NAME_RE.test(suffix)) continue;

            const existing = paletteTokens.get(suffix);
            if (existing?.referenceByPalette) {
                // 2 つ目以降のパレットは参照先だけを追記する
                existing.referenceByPalette[head as PaletteName] = cleanReference(token.reference);
                continue;
            }

            const name = `colorPalette.${suffix}`;
            const displayToken: DisplayToken = {
                name,
                cssVar: `var(--mpc-colors-color-palette-${rest.join("-")})`,
                role: ROLE_BY_PREFIX[rest[0]] ?? "Other",
                referenceByPalette: { [head as PaletteName]: cleanReference(token.reference) },
                pairedBg: FG_PAIRED_BG[name],
            };
            paletteTokens.set(suffix, displayToken);
            push(displayToken);
        } else {
            // border / bg / overlay / focus などのグローバルトークン
            push({
                name: token.name,
                cssVar: token.cssVar,
                role: ROLE_BY_PREFIX[head] ?? "Other",
                reference: cleanReference(token.reference),
            });
        }
    }

    // 各グループ内はパレット相対 → グローバルの順に、名前順で並べる
    for (const list of groups.values()) {
        list.sort((a, b) => {
            if (!!a.referenceByPalette !== !!b.referenceByPalette) return a.referenceByPalette ? -1 : 1;
            return a.name.localeCompare(b.name, "en", { numeric: true });
        });
    }
    return groups;
}

// モジュール読み込み時に一度だけ spec を解析する
const roleGroups = buildRoleGroups();

// 計測済みの解決値。hex は実際に描画された色、ratio は fg / bg の WCAG コントラスト比
interface TokenMetrics {
    hex: string;
    ratio?: number;
}

const toHex = (colorValue: string): string => {
    try {
        return new Color(colorValue).to("srgb").toString({ format: "hex" });
    } catch {
        return colorValue;
    }
};

// WCAG 2.1 の達成基準ラベル。通常テキスト AA = 4.5、AAA = 7、大きな文字 AA = 3
const contrastLevel = (ratio: number): { label: string; tone: "pass" | "warn" | "fail" } => {
    if (ratio >= 7) return { label: "AAA", tone: "pass" };
    if (ratio >= 4.5) return { label: "AA", tone: "pass" };
    if (ratio >= 3) return { label: "AA Large", tone: "warn" };
    return { label: "Fail", tone: "fail" };
};

// コントラストバッジの色はパレット切り替えの影響を受けないよう固定パレットで指定する
const CONTRAST_TONE_CLASS: Record<"pass" | "warn" | "fail", string> = {
    pass: css({ backgroundColor: "mori.3", color: "mori.11" }),
    warn: css({ backgroundColor: "yellow.3", color: "yellow.11" }),
    fail: css({ backgroundColor: "red.3", color: "red.11" }),
};

const gridStyles = sva({
    slots: [
        "root",
        "switcher",
        "switchButton",
        "switchDot",
        "group",
        "groupHeader",
        "groupTitle",
        "groupDescription",
        "ruleList",
        "ruleItem",
        "grid",
        "card",
        "cardPreview",
        "cardPreviewFill",
        "cardPreviewText",
        "cardInfo",
        "cardName",
        "cardVar",
        "cardReference",
        "cardValue",
        "cardDescription",
        "contrastBadge",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
        },
        switcher: {
            display: "flex",
            flexWrap: "wrap",
            gap: "2",
        },
        switchButton: {
            display: "inline-flex",
            alignItems: "center",
            gap: "1.5",
            paddingX: "3",
            paddingY: "1",
            borderRadius: "full",
            border: "sm",
            borderColor: "border.subtle",
            backgroundColor: "[transparent]",
            fontSize: "sm",
            color: "gray.fg",
            cursor: "pointer",
            transition: "[background-color 0.15s ease, border-color 0.15s ease]",
            _hover: { backgroundColor: "gray.a3" },
            "&[data-active]": {
                borderColor: "border.emphasized",
                backgroundColor: "gray.a4",
                fontWeight: "semibold",
            },
        },
        switchDot: {
            width: "3",
            height: "3",
            borderRadius: "full",
            flexShrink: 0,
        },
        group: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
        },
        groupHeader: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            // グループの区切りを線で明示し、ただの羅列に見えないようにする
            borderBottom: "sm",
            borderColor: "border.subtle",
            paddingBottom: "2",
        },
        groupTitle: {
            fontSize: "lg",
            fontWeight: "semibold",
            color: "gray.fg",
        },
        groupDescription: {
            fontSize: "sm",
            color: "gray.fg.muted",
        },
        ruleList: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            marginTop: "1",
        },
        ruleItem: {
            fontSize: "sm",
            color: "gray.fg.muted",
            // ルールであることが一目でわかるようにマーカーを付ける
            _before: { content: "'※ '", color: "gray.fg.subtle" },
        },
        grid: {
            display: "grid",
            gridTemplateColumns: { base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: "6",
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            minWidth: "0",
        },
        cardPreview: {
            width: "full",
            height: "20",
            borderRadius: "md",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // 明るい色でもチップの輪郭が分かるよう内側に薄い線を引く
            boxShadow: "[inset 0 0 0 1px rgba(0,0,0,0.1)]",
        },
        cardPreviewFill: {
            width: "full",
            height: "full",
        },
        cardPreviewText: {
            fontSize: "2xl",
            fontWeight: "semibold",
        },
        cardInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5",
            alignItems: "flex-start",
            minWidth: "0",
        },
        cardName: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "gray.fg",
            maxWidth: "full",
        },
        cardVar: {
            fontSize: "xs",
            color: "gray.fg.subtle",
            maxWidth: "full",
        },
        cardReference: {
            fontSize: "xs",
            fontFamily: "mono",
            color: "gray.fg.subtle",
            overflowWrap: "anywhere",
        },
        cardValue: {
            display: "inline-flex",
            alignItems: "center",
            gap: "2",
            fontSize: "xs",
            fontFamily: "mono",
            fontVariantNumeric: "tabular-nums",
            color: "gray.fg.muted",
        },
        cardDescription: {
            fontSize: "xs",
            color: "gray.fg.muted",
            textWrap: "balance",
        },
        contrastBadge: {
            display: "inline-flex",
            alignItems: "center",
            paddingX: "2",
            paddingY: "0.5",
            borderRadius: "full",
            fontSize: "xs",
            fontVariantNumeric: "tabular-nums",
        },
    },
});

export function SemanticColorGrid() {
    const styles = gridStyles();
    const rootRef = useRef<HTMLDivElement>(null);
    const [palette, setPalette] = useState<PaletteName>("mori");
    const [metrics, setMetrics] = useState<Record<string, TokenMetrics>>({});

    // 描画後に CSS 変数の解決値を計測する。color-mix などもブラウザが解決した色で取得できる。
    // パレット切り替え時はクラス適用後のフレームで再計測される
    // biome-ignore lint/correctness/useExhaustiveDependencies: palette 変更で再計測するための依存
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const next: Record<string, TokenMetrics> = {};
        for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-token-id]"))) {
            const id = el.dataset.tokenId;
            if (!id) continue;
            const style = window.getComputedStyle(el);
            if (el.dataset.measure === "fg") {
                const entry: TokenMetrics = { hex: toHex(style.color) };
                try {
                    // 前景色とペアの背景色から WCAG 2.1 のコントラスト比を計算する
                    entry.ratio = new Color(style.color).contrast(new Color(style.backgroundColor), "WCAG21");
                } catch {
                    // 解析できない色はコントラスト表示を省略する
                }
                next[id] = entry;
            } else {
                next[id] = { hex: toHex(style.backgroundColor) };
            }
        }
        setMetrics(next);
    }, [palette]);

    return (
        <div ref={rootRef} className={styles.root}>
            {/* パレット切り替え。colorPalette.* トークンがどう変化するかを確認できる */}
            <div className={styles.switcher}>
                {PALETTES.map((name) => (
                    <button
                        key={name}
                        type="button"
                        className={styles.switchButton}
                        data-active={palette === name ? "" : undefined}
                        aria-pressed={palette === name}
                        onClick={() => setPalette(name)}
                    >
                        <span
                            className={styles.switchDot}
                            style={{ backgroundColor: `var(--mpc-colors-${name}-solid)` }}
                            aria-hidden="true"
                        />
                        {name}
                    </button>
                ))}
            </div>

            {ROLE_ORDER.map((role) => {
                const tokens = roleGroups.get(role);
                if (!tokens || tokens.length === 0) return null;
                return (
                    <section key={role} className={styles.group}>
                        <div className={styles.groupHeader}>
                            <span className={styles.groupTitle}>{role}</span>
                            <span className={styles.groupDescription}>{ROLE_DESCRIPTIONS[role]}</span>
                            {ROLE_RULES[role] && (
                                <ul className={styles.ruleList}>
                                    {ROLE_RULES[role]?.map((rule) => (
                                        <li key={rule} className={styles.ruleItem}>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* カード領域だけに選択中のパレットを適用する */}
                        <div className={cx(styles.grid, PALETTE_CLASS[palette])}>
                            {tokens.map((token) => {
                                const reference = token.referenceByPalette
                                    ? token.referenceByPalette[palette]
                                    : token.reference;
                                const metric = metrics[token.name];
                                const level = metric?.ratio !== undefined ? contrastLevel(metric.ratio) : undefined;
                                // 選択中のパレットに定義がないトークン（gray の bg.secondary など）
                                const isMissing = !!token.referenceByPalette && !reference;

                                return (
                                    <div key={token.name} className={styles.card}>
                                        {token.pairedBg ? (
                                            // 前景色トークン: ペアの背景の上に文字を載せてプレビューする
                                            <div
                                                className={styles.cardPreview}
                                                data-token-id={isMissing ? undefined : token.name}
                                                data-measure="fg"
                                                style={{ backgroundColor: token.pairedBg }}
                                            >
                                                <span
                                                    className={styles.cardPreviewText}
                                                    style={{ color: token.cssVar }}
                                                >
                                                    Aa
                                                </span>
                                            </div>
                                        ) : (
                                            // 背景系トークン: 市松模様の上の色チップとして見せる（透過色対応）
                                            <div className={cx(styles.cardPreview, checkerboard)}>
                                                <div
                                                    className={styles.cardPreviewFill}
                                                    data-token-id={isMissing ? undefined : token.name}
                                                    style={{ backgroundColor: token.cssVar }}
                                                />
                                            </div>
                                        )}
                                        <div className={styles.cardInfo}>
                                            <span className={styles.cardName}>
                                                <CopyableCode text={token.name} />
                                            </span>
                                            <span className={styles.cardVar}>
                                                <CopyableCode text={token.cssVar} />
                                            </span>
                                            <span className={styles.cardReference}>
                                                → {isMissing ? "このパレットには未定義" : reference}
                                            </span>
                                            {!isMissing && (
                                                <span className={styles.cardValue}>
                                                    {metric?.hex ?? "—"}
                                                    {metric?.ratio !== undefined && level && (
                                                        <span
                                                            className={cx(
                                                                styles.contrastBadge,
                                                                CONTRAST_TONE_CLASS[level.tone],
                                                            )}
                                                            title="ペアの背景に対する WCAG 2.1 コントラスト比"
                                                        >
                                                            {metric.ratio.toFixed(2)} : 1 · {level.label}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {TOKEN_DESCRIPTIONS[token.name] && (
                                                <span className={styles.cardDescription}>
                                                    {TOKEN_DESCRIPTIONS[token.name]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
