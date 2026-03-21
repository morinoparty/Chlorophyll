import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { defineCommand } from "citty";
import { consola } from "consola";
import { formatCSS } from "../formatters/css.js";
import { formatFumaDocs } from "../formatters/fuma-docs.js";
import { formatW3C } from "../formatters/w3c.js";
import { loadSpecs } from "../loaders/token-loader.js";
import type { ExportFormat } from "../types/index.js";

// Default output file names for each format
const DEFAULT_OUTPUT_FILES: Record<ExportFormat, string> = {
    "fuma-docs": "fumadocs-theme.css",
    w3c: "tokens.json",
    css: "tokens.css",
};

export const exportCommand = defineCommand({
    meta: {
        name: "export",
        description: "Export design tokens to various formats (fuma-docs, w3c, css)",
    },
    args: {
        format: {
            type: "string",
            description: "Output format: fuma-docs | w3c | css",
            required: true,
            alias: "f",
        },
        output: {
            type: "string",
            description: "Output file path (defaults to ./dist/<format-specific-file>)",
            alias: "o",
        },
        palette: {
            type: "string",
            description: "Color palette to export (mori, umi, etc.)",
            alias: "p",
        },
    },
    async run({ args }) {
        const format = args.format as ExportFormat;
        const palette = args.palette as string | undefined;

        // Validate format
        const validFormats: ExportFormat[] = ["fuma-docs", "w3c", "css"];
        if (!validFormats.includes(format)) {
            consola.error(`Unknown format: ${format}`);
            consola.info("Available formats: fuma-docs, w3c, css");
            process.exit(1);
        }

        // Determine output path (default to ./dist/<filename>)
        const output = (args.output as string | undefined) || join("./dist", DEFAULT_OUTPUT_FILES[format]);

        try {
            consola.start("Loading spec files...");
            const specs = await loadSpecs();

            const tokenCount = specs.tokens.data.reduce((sum, cat) => sum + cat.values.length, 0);
            const semanticCount = specs.semanticTokens.data.reduce((sum, cat) => sum + cat.values.length, 0);
            consola.success(`Loaded ${tokenCount} tokens and ${semanticCount} semantic tokens`);

            // Format based on the specified format
            consola.start(`Formatting as ${format}...`);
            let result: string;

            switch (format) {
                case "fuma-docs":
                    result = formatFumaDocs(specs, { palette });
                    break;
                case "w3c":
                    result = formatW3C(specs, { palette });
                    break;
                case "css":
                    result = formatCSS(specs, { palette });
                    break;
                default:
                    throw new Error(`Unknown format: ${format}`);
            }

            // Output the result
            await mkdir(dirname(output), { recursive: true });
            await writeFile(output, result, "utf-8");
            consola.success(`Exported to ${output}`);
        } catch (error) {
            consola.error(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
            process.exit(1);
        }
    },
});
