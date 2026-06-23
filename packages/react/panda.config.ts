import { defineConfig } from "@pandacss/dev";
import { createPreset } from "./src/preset";
import stone from "./src/preset/colors/gray/stone";

export default defineConfig({
    preflight: true,
    prefix: "mpc",
    presets: ["@pandacss/preset-base", createPreset({ brandColor: "mori", grayColor: stone, radius: "md" })],
    include: ["./src/**/*.{ts,tsx}"],
    exclude: [],
    jsxFramework: "react",
    outdir: "styled-system",
});
