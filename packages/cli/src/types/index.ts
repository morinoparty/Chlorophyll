/**
 * Panda CSS spec file structures
 */

// tokens.json structure
export interface TokenValue {
    name: string;
    value: string | number;
    cssVar: string;
}

export interface TokenCategory {
    type: string;
    values: TokenValue[];
    tokenFunctionExamples?: string[];
    functionExamples?: string[];
    jsxExamples?: string[];
}

export interface TokensSpec {
    type: "tokens";
    data: TokenCategory[];
}

// semantic-tokens.json structure
export interface SemanticTokenCondition {
    value: string;
    condition: string;
}

export interface SemanticTokenValue {
    name: string;
    values: SemanticTokenCondition[];
    cssVar: string;
}

export interface SemanticTokenCategory {
    type: string;
    values: SemanticTokenValue[];
    tokenFunctionExamples?: string[];
    functionExamples?: string[];
    jsxExamples?: string[];
}

export interface SemanticTokensSpec {
    type: "semantic-tokens";
    data: SemanticTokenCategory[];
}

// color-palette.json structure
export interface ColorPaletteSpec {
    type: "color-palette";
    data: {
        values: string[];
        functionExamples?: string[];
        jsxExamples?: string[];
    };
}

/**
 * Combined spec data for CLI usage
 */
export interface SpecData {
    tokens: TokensSpec;
    semanticTokens: SemanticTokensSpec;
    colorPalette: ColorPaletteSpec;
}

/**
 * Export format options
 */
export type ExportFormat = "fuma-docs" | "w3c" | "css";

/**
 * Export command options
 */
export interface ExportOptions {
    format: ExportFormat;
    output?: string;
    palette?: string;
}

/**
 * W3C Design Token value types
 * W3C Design Tokens 2025.10 uses string values for colors
 */
export interface W3CDimensionValue {
    value: number;
    unit: string;
}

export interface W3CToken {
    $value: string | number | W3CDimensionValue | unknown;
    $type?: string;
    $description?: string;
    $extensions?: Record<string, unknown>;
}

export interface W3CTokenGroup {
    $type?: string;
    $description?: string;
    [key: string]: W3CToken | W3CTokenGroup | string | undefined;
}
