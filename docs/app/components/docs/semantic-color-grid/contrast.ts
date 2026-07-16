import Color from "colorjs.io";
import { css } from "styled-system/css";

// 計測済みの解決値。hex は実際に描画された色、
// ratio は fg / bg の WCAG 2.1 コントラスト比、lc は APCA のコントラスト値
export interface TokenMetrics {
    hex: string;
    ratio?: number;
    lc?: number;
}

export const toHex = (colorValue: string): string => {
    try {
        return new Color(colorValue).to("srgb").toString({ format: "hex" });
    } catch {
        return colorValue;
    }
};

interface ContrastResult {
    label: string;
    tone: "pass" | "warn" | "fail";
}

// WCAG 2.1 の達成基準ラベル。通常テキスト AA = 4.5、AAA = 7、大きな文字 AA = 3
export const contrastLevel = (ratio: number): ContrastResult => {
    if (ratio >= 7) return { label: "AAA", tone: "pass" };
    if (ratio >= 4.5) return { label: "AA", tone: "pass" };
    if (ratio >= 3) return { label: "AA Large", tone: "warn" };
    return { label: "Fail", tone: "fail" };
};

// APCA の目安ラベル。|Lc| 75 以上で本文、60 以上で大きな文字、45 以上で太字の大きな文字
export const apcaLevel = (lc: number): ContrastResult => {
    const abs = Math.abs(lc);
    if (abs >= 75) return { label: "Body", tone: "pass" };
    if (abs >= 60) return { label: "Large", tone: "warn" };
    if (abs >= 45) return { label: "Large Bold", tone: "warn" };
    return { label: "Fail", tone: "fail" };
};

// コントラストバッジの色はテーマ切り替えの影響を受けないよう固定パレットで指定する
export const CONTRAST_TONE_CLASS: Record<"pass" | "warn" | "fail", string> = {
    pass: css({ backgroundColor: "mori.3", color: "mori.11" }),
    warn: css({ backgroundColor: "yellow.3", color: "yellow.11" }),
    fail: css({ backgroundColor: "red.3", color: "red.11" }),
};
