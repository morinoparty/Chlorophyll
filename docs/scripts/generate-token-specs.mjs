// Panda v2 の `panda codegen --spec` は styled-system/specs/design-system.json の 1 ファイルだけを出力し、
// v1 の tokens.json / semantic-tokens.json / text-styles.json は無くなった。
// さらに design-system.json の `semantic` フラグは参照値だけのトークンにしか付かず、
// 生値で定義したセマンティックトークン（durations.transition.* など）とリファレンストークンを区別できない。
// そこで解決済みの panda config（theme.tokens / theme.semanticTokens / theme.textStyles）から
// トークンの分類と定義値を取り、design-system.json から CSS 変数名と解決済みの値を引いて、
// docs のコンポーネントと generate-llms-tokens.mjs が読む v1 互換の JSON を書き出す。
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "@pandacss/dev/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SPECS_DIR = join(ROOT, "styled-system/specs");
const DESIGN_SYSTEM_PATH = join(SPECS_DIR, "design-system.json");

/**
 * `{ value }` を葉に持つトークン定義の木を、定義順のまま [名前, 定義] の配列に平坦化する。
 * DEFAULT は親の名前として扱う（例: colors.bg.DEFAULT -> "bg"）。
 */
function flattenTokens(tree, prefix = []) {
    const entries = [];
    for (const [key, node] of Object.entries(tree ?? {})) {
        if (node === null || typeof node !== "object") continue;
        const path = key === "DEFAULT" ? prefix : [...prefix, key];
        if ("value" in node) entries.push([path.join("."), node]);
        const children = Object.fromEntries(Object.entries(node).filter(([k]) => k !== "value" && k !== "description"));
        entries.push(...flattenTokens(children, path));
    }
    return entries;
}

/** 条件付きの値（{ base, _dark }）を v1 と同じ [{ condition, value }] の形にする。 */
function toConditionValues(value) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        return Object.entries(value).map(([condition, v]) => ({ condition, value: String(v) }));
    }
    return [{ condition: "base", value: String(value) }];
}

function writeJson(fileName, json) {
    writeFileSync(join(SPECS_DIR, fileName), `${JSON.stringify(json, null, 2)}\n`, "utf-8");
}

async function main() {
    const { config } = await loadConfig({ cwd: ROOT });
    const theme = config.theme ?? {};
    const designSystem = JSON.parse(readFileSync(DESIGN_SYSTEM_PATH, "utf-8"));
    const baseValues = new Map(
        designSystem.values.filter((entry) => !entry.condition && !entry.theme).map((e) => [e.token, e.value]),
    );
    const cssVarOf = (category, name) => {
        const cssVar = designSystem.tokens[`${category}.${name}`]?.cssVar;
        return cssVar ? `var(${cssVar})` : "";
    };

    const tokens = Object.entries(theme.tokens ?? {}).map(([category, tree]) => ({
        type: category,
        values: flattenTokens(tree).map(([name, token]) => ({
            name,
            value: baseValues.get(`${category}.${name}`) ?? String(token.value),
            cssVar: cssVarOf(category, name),
        })),
    }));

    const semanticTokens = Object.entries(theme.semanticTokens ?? {}).map(([category, tree]) => ({
        type: category,
        values: flattenTokens(tree).map(([name, token]) => ({
            name,
            cssVar: cssVarOf(category, name),
            values: toConditionValues(token.value),
        })),
    }));

    const textStyles = flattenTokens(theme.textStyles).map(([name, style]) => ({
        name,
        description: style.description ?? "",
    }));

    writeJson("tokens.json", { type: "tokens", data: tokens });
    writeJson("semantic-tokens.json", { type: "semantic-tokens", data: semanticTokens });
    writeJson("text-styles.json", { type: "text-styles", data: textStyles });
    console.log(`🐼 info [token-specs] Generated tokens.json / semantic-tokens.json / text-styles.json → ${SPECS_DIR}`);
}

await main();
