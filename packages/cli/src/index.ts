import { defineCommand, runMain } from "citty";
import { exportCommand } from "./commands/export.js";

const main = defineCommand({
    meta: {
        name: "chlorophyll",
        version: "0.0.1",
        description: "Chlorophyll Design System CLI - Export design tokens to various formats",
    },
    subCommands: {
        export: exportCommand,
    },
});

runMain(main);
