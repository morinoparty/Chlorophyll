// LLM/エージェント向けに、セマンティックトークン一覧を短いMarkdown契約書として出力するスクリプト。
// `panda spec` が生成する styled-system/specs/semantic-tokens.json を読み、
// 生値の色コードを発明させないための「常にトークンを選ばせる」ドキュメントを public/ 配下に書き出す。
// 依存ライブラリは使わず、Node.js の fs のみで完結させる。
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPEC_PATH = join(__dirname, "../styled-system/specs/semantic-tokens.json");
const OUTPUT_PATH = join(__dirname, "../public/design-tokens.md");

// カラーパレット系のロール（gray/mori/umi/red/yellow/blue 共通）に対する一行ルール。
// キーは brand プレフィックスを除いたトークン名（例: "mori.bg.subtle" -> "bg.subtle"）。
const ROLE_RULES = {
    bg: "面の背景色",
    "bg.subtle": "控えめな背景色",
    "bg.secondary": "セカンダリ強調背景（button.secondary 等）",
    surface: "カード等の表面色",
    "surface.hover": "surface のホバー色",
    "surface.active": "surface のアクティブ色",
    border: "brand 用ボーダー色",
    fg: "標準テキスト色",
    "fg.muted": "控えめなテキスト色",
    "fg.subtle": "さらに控えめなテキスト色",
    "fg.secondary": "bg.secondary 上の前景色（白抜き）",
    solid: "アクセントの塗り色（ボタン等）",
    "solid.emphasized": "solid の強調色（hover 等）",
    contrast: "solid 上のコントラスト色",
};

// グローバルトークン（brand に依存しない）の一行ルール。
const GLOBAL_RULES = {
    bg: "標準の背景色",
    "bg.subtle": "控えめな背景色",
    "bg.muted": "より沈んだ背景色",
    "bg.emphasized": "強調背景色",
    "bg.inverted": "反転面（ダーク）の背景色",
    "bg.panel": "白背景が必要なパネル面",
    "bg.disabled": "disabled コントロールの背景色",
    fg: "標準テキスト色",
    "fg.muted": "控えめなテキスト色",
    "fg.subtle": "さらに控えめなテキスト色",
    "fg.disabled": "disabled コントロールの文字色",
    border: "非インタラクティブ要素（カード等）のボーダー",
    "border.muted": "より控えめなボーダー",
    "border.subtle": "最も控えめなボーダー",
    "border.interactive": "インタラクティブ要素のボーダー",
    "border.emphasized": "フォーカスリング/強調ボーダー",
    "border.error": "エラー状態のボーダー",
    "border.warning": "警告状態のボーダー",
    "border.success": "成功状態のボーダー",
    "border.info": "情報状態のボーダー",
    overlay: "モーダル等の背景オーバーレイ",
    "overlay.subtle": "軽い背景暗転",
    "focus.ring": "フォーカスリング",
    "focus.ring.error": "エラー時のフォーカスリング",
};

// ブランド（color-palette）として展開されるロールベースの名前一覧。
const BRAND_NAMES = ["gray", "mori", "umi", "red", "yellow", "blue"];

/**
 * セマンティックトークン仕様(JSON)を読み込む。
 * `pnpm panda spec` が未実行の場合はエラーで気付けるようにする。
 */
function loadSemanticTokens() {
    const raw = readFileSync(SPEC_PATH, "utf-8");
    const json = JSON.parse(raw);
    const colorsEntry = json.data.find((entry) => entry.type === "colors");
    if (!colorsEntry) {
        throw new Error("semantic-tokens.json に colors のエントリが見つからないのだ");
    }
    return colorsEntry.values;
}

/**
 * 数値スケール(1-12, a1-a12)のトークンかどうかを判定する。
 * これらは直接使わず、bg/fg/solid などのロールトークンを使ってほしいので契約書からは除外する。
 */
function isScaleToken(name) {
    const lastSegment = name.split(".").pop();
    return /^a?\d+$/.test(lastSegment);
}

/**
 * トークンの参照値（reference token）を短く表示する。
 * 例: "{colors.mori.9}" -> "mori.9"
 * color-mix() は長くなりすぎるため "参照A × 参照B N%" のように圧縮する。
 */
function formatReference(values) {
    const base = values.find((v) => v.condition === "base") ?? values[0];
    const value = base.value;
    const simpleMatch = /^\{colors\.(.+)\}$/.exec(value);
    if (simpleMatch) return simpleMatch[1];

    if (value.startsWith("color-mix")) {
        const refs = [...value.matchAll(/\{colors\.([^}]+)\}/g)].map((m) => m[1]);
        const percentMatch = /}\s*(\d+%)/.exec(value);
        if (refs.length === 2 && percentMatch) return `${refs[0]} × ${refs[1]} ${percentMatch[1]}`;
        if (refs.length === 1 && percentMatch) return `${refs[0]}, transparent ${percentMatch[1]}`;
        return refs.join(" / ");
    }
    return value;
}

/** name/cssVar に含まれる brand プレフィックスを "{brand}" プレースホルダーに置き換える。 */
function toPattern(text, brand) {
    return text.replaceAll(brand, "{brand}");
}

/** 1行のMarkdownテーブル行を組み立てる。 */
function formatRow(name, cssVar, reference, rule) {
    return `| \`${name}\` | \`${cssVar}\` | \`${reference}\` | ${rule} |`;
}

/** テーブルの見出し行。 */
const TABLE_HEADER = "| token | css var | reference | rule |\n| --- | --- | --- | --- |";

function buildMarkdown(tokens) {
    const globalTokens = tokens.filter(
        (t) => !BRAND_NAMES.some((brand) => t.name === brand || t.name.startsWith(`${brand}.`)),
    );
    // "mori" を代表ブランドとして使い、全ブランド共通のロールパターン（bg/surface/fg/solid/contrast）を作る。
    // mori/umi にしか無い secondary 系は別テーブルで明示する。
    const representativeBrand = "mori";
    const representativeTokens = tokens.filter(
        (t) =>
            (t.name === representativeBrand || t.name.startsWith(`${representativeBrand}.`)) &&
            !isScaleToken(t.name) &&
            !t.name.includes("secondary"),
    );
    // secondary 系は mori/umi にのみ存在するため個別に集める
    const secondaryTokens = tokens.filter((t) => t.name.includes("secondary"));

    const lines = [];
    lines.push("# Chlorophyll Design Tokens");
    lines.push("");
    lines.push("常に既存のセマンティックトークンを選ぶこと。色の生値を発明しないこと。");
    lines.push("");
    lines.push(
        "数値スケール（`gray.9` 等）は直接使わず、必ず `bg`/`fg`/`surface`/`solid`/`contrast` 等のロールトークンを使うこと。",
    );
    lines.push("");

    // グローバルトークン（bg/fg/border/overlay/focus.ring）
    lines.push("## Global");
    lines.push("");
    lines.push(TABLE_HEADER);
    for (const token of globalTokens) {
        const rule = GLOBAL_RULES[token.name] ?? "";
        lines.push(formatRow(token.name, token.cssVar, formatReference(token.values), rule));
    }
    lines.push("");

    // カラーパレット共通ロール（brand ごとに同じ形で存在するため、パターンとしてまとめる）
    lines.push("## Color palette roles");
    lines.push("");
    lines.push(`利用可能な brand: ${BRAND_NAMES.join(" / ")}（\`{brand}\` を置き換えて使うこと）`);
    lines.push("");
    lines.push(TABLE_HEADER);
    for (const token of representativeTokens) {
        const roleKey = token.name === representativeBrand ? "" : token.name.slice(representativeBrand.length + 1);
        const rule = ROLE_RULES[roleKey] ?? "";
        lines.push(
            formatRow(
                toPattern(token.name, representativeBrand),
                toPattern(token.cssVar, representativeBrand),
                toPattern(formatReference(token.values), representativeBrand),
                rule,
            ),
        );
    }
    lines.push("");
    lines.push(
        "補足: `contrast` は brand ごとに参照が異なる場合がある（実装値は styled-system の生成結果を確認すること）。",
    );
    lines.push("");

    // secondary トークン（mori / umi のみ、button.secondary などが使う）
    lines.push("## Secondary tokens (mori / umi only)");
    lines.push("");
    lines.push(TABLE_HEADER);
    for (const token of secondaryTokens) {
        const brand = token.name.split(".")[0];
        const roleKey = token.name.slice(brand.length + 1);
        const rule = ROLE_RULES[roleKey] ?? "";
        lines.push(formatRow(token.name, token.cssVar, formatReference(token.values), rule));
    }
    lines.push("");

    return lines.join("\n");
}

function main() {
    const tokens = loadSemanticTokens();
    const markdown = buildMarkdown(tokens);
    writeFileSync(OUTPUT_PATH, markdown, "utf-8");
    const sizeKb = (Buffer.byteLength(markdown, "utf-8") / 1024).toFixed(2);
    console.log(`🐼 info [llms-tokens] Generated design-tokens.md (${sizeKb} KB) → ${OUTPUT_PATH}`);
}

main();
