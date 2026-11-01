import { getTokens } from "./design-system";

export interface Token {
    name: string;
    value: string | number;
    cssVar: string;
}

export type TokenType =
    | "aspectRatios"
    | "borderWidths"
    | "durations"
    | "easings"
    | "fontWeights"
    | "letterSpacings"
    | "lineHeights"
    | "opacity"
    | "radii"
    | "zIndex";

export function parseTokensByType(type: TokenType): Token[] {
    return getTokens(type, "reference").map((t) => ({ name: t.name, value: t.value, cssVar: t.cssVar }));
}
