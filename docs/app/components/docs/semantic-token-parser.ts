import { getTokens } from "./design-system";

// Semantic token data structure from design-system.json
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
export type SemanticTokenType =
    | "colors"
    | "sizes"
    | "spacing"
    | "radii"
    | "borders"
    | "borderWidths"
    | "shadows"
    | "durations"
    | "easings";

// Parse semantic tokens by type and optional filter prefix
export function parseSemanticTokensByType(type: SemanticTokenType, filterPrefix?: string): SemanticToken[] {
    return getTokens(type, "semantic")
        .filter((token) => !filterPrefix || token.name.startsWith(filterPrefix))
        .map((token) => ({ name: token.name, reference: token.originalValue, cssVar: token.cssVar }));
}

// Parse shadow tokens with their resolved value
export function parseShadowTokens(): SemanticTokenWithConditions[] {
    return getTokens("shadows", "semantic").map((token) => ({
        name: token.name,
        value: token.originalValue,
        cssVar: token.cssVar,
    }));
}

// Get unique prefixes from semantic tokens (e.g., "component.padding", "component.gap", "layout")
export function getSemanticTokenPrefixes(type: SemanticTokenType): string[] {
    const prefixes = new Set<string>();
    for (const token of getTokens(type, "semantic")) {
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
