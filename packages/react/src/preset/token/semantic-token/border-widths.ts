import { defineSemanticTokens } from "@pandacss/dev";

export const borderWidths = defineSemanticTokens.borderWidths({
    focus: {
        // フォーカスリングの太さ。recipes/shared/focus-ring.ts から outlineWidth として参照する
        ring: { value: "{borderWidths.2}" },
    },
});
