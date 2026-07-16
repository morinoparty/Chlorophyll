import Color from "colorjs.io";
import { type RefObject, useEffect, useState } from "react";
import { type TokenMetrics, toHex } from "./contrast";
import type { ThemeName } from "./data";

// documentElement の data-color-palette から現在のテーマを読む（SSR では mori）
function readTheme(): ThemeName {
    if (typeof document === "undefined") return "mori";
    const value = document.documentElement.getAttribute("data-color-palette");
    return value === "umi" ? "umi" : "mori";
}

// ヘッダーのテーマトグルによる data-color-palette の変更に追従する
export function useThemeName(): ThemeName {
    const [theme, setTheme] = useState<ThemeName>("mori");

    useEffect(() => {
        setTheme(readTheme());
        const observer = new MutationObserver(() => setTheme(readTheme()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-palette"] });
        return () => observer.disconnect();
    }, []);

    return theme;
}

// 描画後に CSS 変数の解決値を計測する。color-mix などもブラウザが解決した色で取得できる。
// テーマ切り替え時は属性適用後のフレームで再計測される
export function useTokenMetrics(
    rootRef: RefObject<HTMLElement | null>,
    theme: ThemeName,
): Record<string, TokenMetrics> {
    const [metrics, setMetrics] = useState<Record<string, TokenMetrics>>({});

    // biome-ignore lint/correctness/useExhaustiveDependencies: theme 変更で再計測するための依存
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const next: Record<string, TokenMetrics> = {};
        for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-token-id]"))) {
            const id = el.dataset.tokenId;
            if (!id) continue;
            const style = window.getComputedStyle(el);
            if (el.dataset.measure === "fg") {
                const entry: TokenMetrics = { hex: toHex(style.color) };
                try {
                    // 半透明の前景色は背景と合成してから WCAG 2.1 のコントラスト比を計算する
                    const bg = new Color(style.backgroundColor);
                    const fg = new Color(style.color);
                    const alpha = fg.alpha ?? 1;
                    const composited = alpha < 1 ? Color.mix(bg, fg, alpha, { space: "srgb" }) : fg;
                    composited.alpha = 1;
                    entry.ratio = composited.contrast(bg, "WCAG21");
                    // APCA は非対称なアルゴリズムなので、背景 → 文字色の順で渡す
                    entry.lc = bg.contrast(composited, "APCA");
                } catch {
                    // 解析できない色はコントラスト表示を省略する
                }
                next[id] = entry;
            } else {
                next[id] = { hex: toHex(style.backgroundColor) };
            }
        }
        setMetrics(next);
    }, [rootRef, theme]);

    return metrics;
}
