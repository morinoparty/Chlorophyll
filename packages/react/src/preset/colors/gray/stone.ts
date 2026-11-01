import type { SemanticTokens } from "@pandacss/types";
import type { ColorPalette } from "../../create-preset";

// baseカラー（主にstone）のセマンティックトークンを定義
const semanticTokens: SemanticTokens["colors"] = {
    bg: {
        canvas: { value: "{colors.white}" },
        default: { value: "{colors.white}" },
        subtle: { value: "{colors.gray.2}" },
        muted: { value: "{colors.gray.3}" },
        emphasized: { value: "{colors.gray.4}" },
        disabled: { value: "{colors.gray.6}" },
    },
    border: {
        default: { value: "{colors.gray.6}" },
        muted: { value: "{colors.gray.4}" },
        subtle: { value: "{colors.gray.3}" },
        disabled: { value: "{colors.gray.7}" },
        outline: { value: "{colors.gray.9}" },
        error: { value: "{colors.red.9}" },
    },
};

// stoneカラーパレットをエクスポート
const stone: ColorPalette = {
    name: "stone",
    semanticTokens,
};

export default stone;
