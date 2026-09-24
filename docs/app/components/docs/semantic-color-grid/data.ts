import { parseSemanticTokensByType } from "../semantic-token-parser";

// spec に含まれるパレット接頭辞。パレット相対トークンを colorPalette.* に集約するための判定に使う
const PALETTE_PREFIXES = ["mori", "umi", "gray", "red", "yellow", "blue"] as const;

// 実際にテーマとして使うのは mori / umi のみ。
// 表示はヘッダーのテーマトグル（data-color-palette）に追従する
export const THEMES = ["mori", "umi"] as const;
export type ThemeName = (typeof THEMES)[number];

// 役割グループ名。見出しや説明は MDX 側（colors.mdx）に記述する
export type SemanticColorRole =
    | "Background"
    | "Surface"
    | "Solid"
    | "Foreground"
    | "Contrast"
    | "Border"
    | "Focus"
    | "Overlay"
    | "Other";

const ROLE_BY_PREFIX: Record<string, SemanticColorRole> = {
    bg: "Background",
    surface: "Surface",
    solid: "Solid",
    fg: "Foreground",
    contrast: "Contrast",
    border: "Border",
    focus: "Focus",
    overlay: "Overlay",
};

// 人間向けの補足説明。未知のトークンは説明なしでも解決値つきで表示される
export const TOKEN_DESCRIPTIONS: Record<string, string> = {
    "colorPalette.bg": "ページの地色。白いパネル（bg.panel）を浮かせる沈んだ背景色",
    "colorPalette.bg.subtle": "bg より淡い背景色（step1）",
    "colorPalette.surface.subtle": "白いパネルの上にごく薄く色を差す面（表の見出し行・縞・カードの hover）",
    "colorPalette.surface": "コンポーネントの面（通常時）",
    "colorPalette.surface.hover": "コンポーネントの面（ホバー時）",
    "colorPalette.surface.active": "コンポーネントの面（押下時）",
    "colorPalette.solid": "ボタンなどの塗りつぶし",
    "colorPalette.solid.emphasized": "塗りつぶし（ホバー時）",
    "colorPalette.solid.active": "塗りつぶし（押下時）。solid.emphasized をさらに一段沈めた色",
    "colorPalette.contrast": "solid の上に載せる文字色",
    "colorPalette.fg": "標準の文字色",
    "colorPalette.fg.subtle": "控えめな文字色",
    "colorPalette.fg.muted": "補足テキスト用の文字色",
    "colorPalette.border": "パレットの色味を帯びた標準の枠線",
    "colorPalette.border.subtle": "パレットの色味を帯びた最も淡い枠線",
    "colorPalette.border.muted": "パレットの色味を帯びた控えめな枠線",
    "colorPalette.border.interactive": "パレットの色味を帯びた操作対象の枠線",
    "colorPalette.border.emphasized": "パレットの色味を帯びた強調枠線",
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
    "bg.panel.hover": "白いパネル状のコントロールのホバー背景",
    "bg.disabled": "無効状態のコントロールの背景",
    "bg.error": "エラー状態のアラートやバナーの地色",
    "bg.warning": "警告状態のアラートやバナーの地色",
    "bg.success": "成功状態のアラートやバナーの地色",
    "bg.info": "情報表示のアラートやバナーの地色",
    fg: "標準の文字色",
    "fg.muted": "補足テキスト用の文字色",
    "fg.subtle": "控えめな文字色",
    "fg.inverted": "bg.inverted の上に載せる文字色",
    "fg.placeholder": "入力欄や Select の未入力時に表示するプレースホルダーの文字色",
    "fg.disabled": "無効状態のコントロールの文字色",
    "fg.error": "エラーメッセージの文字色",
    "fg.warning": "警告メッセージの文字色",
    "fg.success": "成功メッセージの文字色",
    "fg.info": "情報メッセージの文字色",
    overlay: "モーダルのオーバーレイ",
    "overlay.subtle": "軽い暗転用のオーバーレイ",
    "focus.ring.error": "エラー時のフォーカスリング",
};

// fg 系トークンのプレビューとコントラスト計測に使う、ペアとなる背景の CSS 変数
const FG_PAIRED_BG: Record<string, string> = {
    "colorPalette.fg": "var(--mpc-colors-color-palette-bg)",
    "colorPalette.fg.subtle": "var(--mpc-colors-color-palette-bg)",
    "colorPalette.fg.muted": "var(--mpc-colors-color-palette-bg)",
    "colorPalette.contrast": "var(--mpc-colors-color-palette-solid)",
    fg: "var(--mpc-colors-bg-panel)",
    "fg.muted": "var(--mpc-colors-bg-panel)",
    "fg.subtle": "var(--mpc-colors-bg-panel)",
    "fg.inverted": "var(--mpc-colors-bg-inverted)",
    "fg.placeholder": "var(--mpc-colors-bg-panel)",
    "fg.disabled": "var(--mpc-colors-bg-disabled)",
    "fg.error": "var(--mpc-colors-bg-error)",
    "fg.warning": "var(--mpc-colors-bg-warning)",
    "fg.success": "var(--mpc-colors-bg-success)",
    "fg.info": "var(--mpc-colors-bg-info)",
};

export interface DisplayToken {
    /** 表示名。パレット相対なら colorPalette.*、グローバルならそのままの名前 */
    name: string;
    cssVar: string;
    role: SemanticColorRole;
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
function buildRoleGroups(): Map<SemanticColorRole, DisplayToken[]> {
    const groups = new Map<SemanticColorRole, DisplayToken[]>();
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
                // fg.inverted / fg.error などは対応する背景の上でプレビューする
                pairedBg: FG_PAIRED_BG[token.name],
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
export const roleGroups = buildRoleGroups();
