import { defineSemanticTokens } from "@pandacss/dev";

/**
 * Overlay セマンティックトークン
 * Modal backdrop用の半透明オーバーレイ
 */
export const overlay = defineSemanticTokens.colors({
    overlay: {
        // 標準オーバーレイ（モーダル背景など）
        DEFAULT: {
            value: "rgba(0, 0, 0, 0.4)",
        },
        // 微妙なオーバーレイ（軽い背景暗転）
        subtle: {
            value: "rgba(0, 0, 0, 0.2)",
        },
    },
});
