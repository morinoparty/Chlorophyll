import { defineSemanticTokens } from "@pandacss/dev";
import { durations, easings } from "./animations";
import { borders } from "./borders";
import { colors } from "./colors";
import { shadows } from "./shadow";
import { spacing } from "./spacing";
import { fontSizes, fontWeights, letterSpacings, lineHeights } from "./typography";

// radii is a factory function handled in create-preset.ts
export const semanticTokens = defineSemanticTokens({
    colors,
    fontSizes,
    fontWeights,
    letterSpacings,
    lineHeights,
    shadows,
    spacing,
    borders,
    durations,
    easings,
});
