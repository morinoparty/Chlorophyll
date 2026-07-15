import semanticTokensSpec from "styled-system/specs/semantic-tokens.json";

// Semantic token data structure from spec JSON
export interface SemanticToken {
    name: string;
    reference: string;
    cssVar: string;
}

// Extended semantic token with a resolved value for shadows
export interface SemanticTokenWithConditions {
    name: string;
    value: string;
    cssVar: string;
}

// Available semantic token types
export type SemanticTokenType = "colors" | "spacing" | "radii" | "borders" | "shadows" | "durations" | "easings";

// Parse semantic tokens by type and optional filter prefix
export function parseSemanticTokensByType(type: SemanticTokenType, filterPrefix?: string): SemanticToken[] {
    const data = semanticTokensSpec.data.find((d) => d.type === type);
    if (!data) return [];

    return data.values
        .filter((token) => !filterPrefix || token.name.startsWith(filterPrefix))
        .map((token) => ({
            name: token.name,
            reference: token.values.find((v) => v.condition === "base")?.value || "",
            cssVar: token.cssVar,
        }));
}

// Parse shadow tokens with their resolved value
export function parseShadowTokens(): SemanticTokenWithConditions[] {
    const data = semanticTokensSpec.data.find((d) => d.type === "shadows");
    if (!data) return [];

    return data.values.map((token) => ({
        name: token.name,
        value: token.values.find((v) => v.condition === "base")?.value || "",
        cssVar: token.cssVar,
    }));
}

// Get unique prefixes from semantic tokens (e.g., "component.padding", "component.gap", "layout")
export function getSemanticTokenPrefixes(type: SemanticTokenType): string[] {
    const data = semanticTokensSpec.data.find((d) => d.type === type);
    if (!data) return [];

    const prefixes = new Set<string>();
    for (const token of data.values) {
        // Extract first two parts of the token name as prefix
        const parts = token.name.split(".");
        if (parts.length >= 2) {
            prefixes.add(`${parts[0]}.${parts[1]}`);
        } else {
            prefixes.add(parts[0]);
        }
    }
    return Array.from(prefixes);
}
