import { defineTokens } from "@pandacss/dev";
import { aspectRatios } from "./aspect-ratios";
import { borderWidths } from "./border-widths";
import { colors } from "./color";
import { durations } from "./durations";
import { easings } from "./easings";
import { fontSizes } from "./font-size";
import { fontWeights } from "./font-weight";
import { fonts } from "./fonts";
import { letterSpacings } from "./letter-spacing";
import { lineHeights } from "./line-height";
import { opacity } from "./opacity";
import { radii } from "./radii";
import { sizes } from "./sizes";
import { spacing } from "./spacing";
import { zIndex } from "./z-index";

export { globalFontFace } from "./font-face";
export { textStyles } from "./typography";

export const tokens = defineTokens({
    aspectRatios,
    borderWidths,
    colors,
    durations,
    easings,
    fonts,
    fontSizes,
    fontWeights,
    letterSpacings,
    lineHeights,
    opacity,
    radii,
    sizes,
    spacing,
    zIndex,
});
