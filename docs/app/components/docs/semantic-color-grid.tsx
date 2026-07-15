import Color from "colorjs.io";
import { useEffect, useRef, useState } from "react";
import { css, cx, sva } from "styled-system/css";
import { CopyableCode } from "./copyable-code";
import { parseSemanticTokensByType } from "./semantic-token-parser";
import { checkerboard } from "./shared-styles";

// spec に含まれるパレット接頭辞。パレット相対トークンを colorPalette.* に集約するための判定に使う
const PALETTE_PREFIXES = ["mori", "umi", "gray", "red", "yellow", "blue"] as const;

// 実際にテーマとして使うのは mori / umi のみ。
// 表示はヘッダーのテーマトグル（data-color-palette）に追従する
const THEMES = ["mori", "umi"] as const;
type ThemeName = (typeof THEMES)[number];

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
    "colorPalette.bg": "セクションの面に使う標準の背景色",
    "colorPalette.bg.subtle": "ページ全体に使う最も淡い背景色",
    "colorPalette.bg.secondary": "セカンダリ面の塗りに使う濃い背景色",
    "colorPalette.surface": "コンポーネントの面（通常時）",
    "colorPalette.surface.hover": "コンポーネントの面（ホバー時）",
    "colorPalette.surface.active": "コンポーネントの面（押下時）",
    "colorPalette.solid": "ボタンなどの塗りつぶし",
    "colorPalette.solid.emphasized": "塗りつぶし（ホバー時）",
    "colorPalette.contrast": "solid の上に載せる文字色",
    "colorPalette.fg": "標準の文字色",
    "colorPalette.fg.subtle": "控えめな文字色",
    "colorPalette.fg.muted": "補足テキスト用の文字色",
    "colorPalette.fg.secondary": "bg.secondary の上に載せる文字色（白抜き）",
    "colorPalette.border": "パレットの色味を帯びた枠線",
    "colorPalette.focus.ring": "パレットに追従するフォーカスリング",
    border: "標準の枠線",
    "border.muted": "控えめな枠線",
    "border.subtle": "最も淡い枠線",
    "border.interactive": "入力欄など操作対象の枠線",
    "border.emphasized": "強調された枠線",
    "border.error": "エラー状態の枠線",
    "border.warning": "警告状態の枠線",
    "border.success": "成功状態の枠線",
    "border.info": "情報表示の枠線",
    bg: "アプリ全体の背景",
    "bg.subtle": "淡いアプリ背景",
    "bg.muted": "沈んだ背景",
    "bg.emphasized": "強調された背景",
    "bg.inverted": "反転背景",
    "bg.panel": "パネルやカードの背景",
    "bg.disabled": "無効状態のコントロールの背景",
    "fg.disabled": "無効状態のコントロールの文字色",
    overlay: "モーダルのオーバーレイ",
    "overlay.subtle": "軽い暗転用のオーバーレイ",
    "focus.ring.error": "エラー時のフォーカスリング",
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
    /** パレット相対トークンのみ: mori / umi それぞれでの参照先 */
    referenceByTheme?: Partial<Record<ThemeName, string>>;
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

        if ((PALETTE_PREFIXES as readonly string[]).includes(head)) {
            // 12 段階スケール（mori.1 等）はリファレンストークンのページで扱う
            if (!suffix || SCALE_NAME_RE.test(suffix)) continue;

            const existing = paletteTokens.get(suffix);
            if (existing) {
                // 参照先の表示はテーマとして使う mori / umi のみ持つ
                if (existing.referenceByTheme && (THEMES as readonly string[]).includes(head)) {
                    existing.referenceByTheme[head as ThemeName] = cleanReference(token.reference);
                }
                continue;
            }

            const name = `colorPalette.${suffix}`;
            const displayToken: DisplayToken = {
                name,
                cssVar: `var(--mpc-colors-color-palette-${rest.join("-")})`,
                role: ROLE_BY_PREFIX[rest[0]] ?? "Other",
                referenceByTheme: (THEMES as readonly string[]).includes(head)
                    ? { [head as ThemeName]: cleanReference(token.reference) }
                    : {},
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
            if (!!a.referenceByTheme !== !!b.referenceByTheme) return a.referenceByTheme ? -1 : 1;
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

// コントラストバッジの色はテーマ切り替えの影響を受けないよう固定パレットで指定する
const CONTRAST_TONE_CLASS: Record<"pass" | "warn" | "fail", string> = {
    pass: css({ backgroundColor: "mori.3", color: "mori.11" }),
    warn: css({ backgroundColor: "yellow.3", color: "yellow.11" }),
    fail: css({ backgroundColor: "red.3", color: "red.11" }),
};

const gridStyles = sva({
    slots: [
        "root",
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

// documentElement の data-color-palette から現在のテーマを読む（SSR では mori）
function readTheme(): ThemeName {
    if (typeof document === "undefined") return "mori";
    const value = document.documentElement.getAttribute("data-color-palette");
    return value === "umi" ? "umi" : "mori";
}

export function SemanticColorGrid() {
    const styles = gridStyles();
    const rootRef = useRef<HTMLDivElement>(null);
    const [theme, setTheme] = useState<ThemeName>("mori");
    const [metrics, setMetrics] = useState<Record<string, TokenMetrics>>({});

    // ヘッダーのテーマトグルによる data-color-palette の変更に追従する
    useEffect(() => {
        setTheme(readTheme());
        const observer = new MutationObserver(() => setTheme(readTheme()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-palette"] });
        return () => observer.disconnect();
    }, []);

    // 描画後に CSS 変数の解決値を計測する。color-mix などもブラウザが解決した色で取得できる。
    // テーマ切り替え時は属性適用後のフレームで再計測される
    // biome-ignore lint/correctness/useExhaustiveDependencies: theme 変更で再計測するための依存
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
                    // 半透明の前景色は背景と合成してから WCAG 2.1 のコントラスト比を計算する
                    const bg = new Color(style.backgroundColor);
                    const fg = new Color(style.color);
                    const alpha = fg.alpha ?? 1;
                    const composited = alpha < 1 ? Color.mix(bg, fg, alpha, { space: "srgb" }) : fg;
                    composited.alpha = 1;
                    entry.ratio = composited.contrast(bg, "WCAG21");
                } catch {
                    // 解析できない色はコントラスト表示を省略する
                }
                next[id] = entry;
            } else {
                next[id] = { hex: toHex(style.backgroundColor) };
            }
        }
        setMetrics(next);
    }, [theme]);

    return (
        <div ref={rootRef} className={styles.root}>
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
                        <div className={styles.grid}>
                            {tokens.map((token) => {
                                const reference = token.referenceByTheme
                                    ? token.referenceByTheme[theme]
                                    : token.reference;
                                const metric = metrics[token.name];
                                const level = metric?.ratio !== undefined ? contrastLevel(metric.ratio) : undefined;

                                return (
                                    <div key={token.name} className={styles.card}>
                                        {token.pairedBg ? (
                                            // 前景色トークン: ペアの背景の上に文字を載せてプレビューする
                                            <div
                                                className={styles.cardPreview}
                                                data-token-id={token.name}
                                                data-measure="fg"
                                                // color も計測要素自身に載せ、継承色を計測しないようにする
                                                style={{ backgroundColor: token.pairedBg, color: token.cssVar }}
                                            >
                                                <span className={styles.cardPreviewText}>Aa</span>
                                            </div>
                                        ) : (
                                            // 背景系トークン: 市松模様の上の色チップとして見せる（透過色対応）
                                            <div className={cx(styles.cardPreview, checkerboard)}>
                                                <div
                                                    className={styles.cardPreviewFill}
                                                    data-token-id={token.name}
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
                                            {reference && <span className={styles.cardReference}>→ {reference}</span>}
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
