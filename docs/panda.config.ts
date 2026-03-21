import { createPreset, stone } from "@chlorophyll/react/preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    preflight: true,
    strictTokens: true,
    prefix: "mpc",
    globalCss: {
        // デフォルト + moriテーマ
        ":root, [data-color-palette='mori']": {
            colorPalette: "mori",
        },
        // umiテーマ
        "[data-color-palette='umi']": {
            colorPalette: "umi",
        },
    },
    presets: ["@pandacss/preset-base", createPreset({ brandColor: "mori", grayColor: stone, radius: "xl" })],
    include: ["./app/**/*.{ts,tsx,js,jsx}"],
    exclude: [],
    jsxFramework: "react",
    outdir: "styled-system",
});
