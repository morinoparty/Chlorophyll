import designSystem from "styled-system/specs/design-system.json";
import config from "../../../panda.config";

// `panda codegen --spec` が出力する design-system.json からトークンを引くためのヘルパー。
// design-system.json の `semantic` フラグは参照値だけのトークンにしか付かず、
// 生値で定義したセマンティックトークン（shadows.md / durations.transition.* など）を区別できない。
// そのため、どのトークンがセマンティックかは panda.config のプリセット定義から判定する。

export type TokenKind = "reference" | "semantic";

export interface DesignToken {
    /** カテゴリを除いたトークン名（例: "mori.bg.subtle"） */
    name: string;
    /** `var(--mpc-...)` 形式の CSS 変数参照 */
    cssVar: string;
    /** 解決済みの値 */
    value: string;
    /** 定義時の値。参照（{colors.gray.12}）や color-mix() をそのまま残したもの */
    originalValue: string;
}

interface DesignSystemToken {
    category: string;
    /** 自動生成される負の spacing（spacing.-1 など）には付かない */
    cssVar?: string;
    originalValue?: string;
}

const tokens: Record<string, DesignSystemToken> = designSystem.tokens;

// 条件やテーマに依存しない base の値だけを使う
const baseValues = new Map(
    designSystem.values
        .filter((entry) => !("condition" in entry) && !("theme" in entry))
        .map((e) => [e.token, e.value]),
);

/** `{ value }` を葉に持つトークン定義の木からパスを集める。DEFAULT は親の名前として扱う。 */
function collectTokenPaths(tree: object, prefix: string[]): string[] {
    const paths: string[] = [];
    for (const [key, node] of Object.entries(tree)) {
        if (node === null || typeof node !== "object") continue;
        const path = key === "DEFAULT" ? prefix : [...prefix, key];
        if ("value" in node) paths.push(path.join("."));
        paths.push(...collectTokenPaths(node, path));
    }
    return paths;
}

const semanticPaths = new Set(
    config.presets.flatMap((preset) =>
        typeof preset === "object"
            ? Object.entries(preset.theme.extend.semanticTokens).flatMap(([category, tree]) =>
                  collectTokenPaths(tree ?? {}, [category]),
              )
            : [],
    ),
);

/** カテゴリ内のトークンを定義順で返す。 */
export function getTokens(category: string, kind: TokenKind): DesignToken[] {
    const prefix = `${category}.`;
    return Object.entries(tokens)
        .filter(
            (entry): entry is [string, Required<Pick<DesignSystemToken, "cssVar">> & DesignSystemToken] =>
                entry[1].category === category &&
                entry[1].cssVar !== undefined &&
                semanticPaths.has(entry[0]) === (kind === "semantic"),
        )
        .map(([path, token]) => {
            const value = baseValues.get(path) ?? "";
            return {
                name: path.slice(prefix.length),
                cssVar: `var(${token.cssVar})`,
                value,
                originalValue: token.originalValue ?? value,
            };
        });
}

/** textStyles の名前を返す（design-system.json では名前順に並んでいる）。 */
export function getTextStyleNames(): string[] {
    return Object.keys(designSystem.textStyles);
}
