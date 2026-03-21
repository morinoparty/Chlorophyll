import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ColorPaletteSpec, SemanticTokensSpec, SpecData, TokensSpec } from "../types/index.js";

/**
 * Load spec files from @chlorophyll/react styled-system/specs
 */
export async function loadSpecs(): Promise<SpecData> {
    const specsDir = await resolveSpecsPath();

    const [tokens, semanticTokens, colorPalette] = await Promise.all([
        loadJsonFile<TokensSpec>(join(specsDir, "tokens.json")),
        loadJsonFile<SemanticTokensSpec>(join(specsDir, "semantic-tokens.json")),
        loadJsonFile<ColorPaletteSpec>(join(specsDir, "color-palette.json")),
    ]);

    return { tokens, semanticTokens, colorPalette };
}

/**
 * Load and parse a JSON file
 */
async function loadJsonFile<T>(filePath: string): Promise<T> {
    try {
        const content = await readFile(filePath, "utf-8");
        return JSON.parse(content) as T;
    } catch (error) {
        throw new Error(`Failed to load ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Resolve the path to specs directory
 */
async function resolveSpecsPath(): Promise<string> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Navigate from packages/cli/dist to packages/react/styled-system/specs
    const cliRoot = resolve(__dirname, "..");
    const packagesDir = dirname(cliRoot);
    const specsPath = join(packagesDir, "react", "styled-system", "specs");

    return specsPath;
}

/**
 * Filter token categories by type (e.g., "colors", "spacing")
 */
export function filterTokensByType(tokens: TokensSpec, type: string): TokensSpec {
    return {
        type: "tokens",
        data: tokens.data.filter((category) => category.type === type),
    };
}

/**
 * Filter semantic tokens by palette name (e.g., "mori", "umi")
 */
export function filterSemanticTokensByPalette(semanticTokens: SemanticTokensSpec, palette: string): SemanticTokensSpec {
    return {
        type: "semantic-tokens",
        data: semanticTokens.data.map((category) => ({
            ...category,
            values: category.values.filter((token) => token.name.startsWith(`${palette}.`) || token.name === palette),
        })),
    };
}
