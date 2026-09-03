import { defineSemanticTokens } from "@pandacss/dev";
import { blue } from "./blue";
import { gray } from "./gray";
import { mori } from "./mori";
import { red } from "./red";
import { umi } from "./umi";
import { yellow } from "./yellow";

/**
 * Base color tokens
 * 色スケール(1〜12、a1〜a12)と色固有の semantic token を含む。
 * 各パレットは create-palette.ts の createPalette で同じ形に生成される
 */
export const base = defineSemanticTokens.colors({
    ...gray,
    ...mori,
    ...umi,
    ...red,
    ...yellow,
    ...blue,
});
