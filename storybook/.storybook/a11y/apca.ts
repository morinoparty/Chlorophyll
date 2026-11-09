import { calcAPCA } from "apca-w3";
import axe, { type Check, type Rule } from "axe-core";

type ConformanceLevel = "custom" | "bronze" | "silver";

type ConformanceThresholdFn = (fontSize: string, fontWeight: string) => number | null;

// Augment Axe types to include the color utilities we use in this file
// https://github.com/dequelabs/axe-core/blob/develop/lib/commons/color/color.js
type Color = {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    toHexString: () => string;
};
declare module "axe-core" {
    interface Commons {
        color: {
            getForegroundColor: (node: HTMLElement, _: unknown, bgColor: Color | null) => Color | null;
            getBackgroundColor: (node: HTMLElement) => Color | null;
        };
    }
}

const generateColorContrastAPCAConformanceCheck = (
    conformanceLevel: string,
    conformanceThresholdFn: ConformanceThresholdFn,
): Check => ({
    id: `color-contrast-apca-${conformanceLevel}-conformance`,
    metadata: {
        impact: "serious",
        messages: {
            pass:
                "要素は十分なAPCA " +
                conformanceLevel +
                // oxlint-disable-next-line no-template-curly-in-string -- for axe-core
                " レベルのLcを持っています ${data.apcaContrast}Lc（前景色: ${data.fgColor}, 背景色: ${data.bgColor}, フォントサイズ: ${data.fontSize}, フォントウェイト: ${data.fontWeight}）。必要な最小APCAコントラストは${data.apcaThreshold}です。",
            fail: {
                default:
                    "要素のAPCA " +
                    conformanceLevel +
                    // oxlint-disable-next-line no-template-curly-in-string -- for axe-core
                    " レベルのコントラストが不十分です: ${data.apcaContrast}Lc（前景色: ${data.fgColor}, 背景色: ${data.bgColor}, フォントサイズ: ${data.fontSize}, フォントウェイト: ${data.fontWeight}）。必要な最小APCA明度コントラストは${data.apcaThreshold}Lcです。",
                increaseFont:
                    "要素のAPCA " +
                    conformanceLevel +
                    // oxlint-disable-next-line no-template-curly-in-string -- for axe-core
                    " レベルのコントラストが不十分です: ${data.apcaContrast}Lc（前景色: ${data.fgColor}, 背景色: ${data.bgColor}, フォントサイズ: ${data.fontSize}, フォントウェイト: ${data.fontWeight}）。APCAの基準を満たすためにフォントサイズやフォントウェイトを上げてください。",
                placeholder:
                    "要素のAPCA " +
                    conformanceLevel +
                    // oxlint-disable-next-line no-template-curly-in-string -- for axe-core
                    " レベルのコントラストが不十分です: ${data.apcaContrast}Lc（前景色: ${data.fgColor}, 背景色: ${data.bgColor}, フォントサイズ: ${data.fontSize}, フォントウェイト: ${data.fontWeight}）。プレースホルダーのため閾値を30Lcに緩和しています。",
            },
            incomplete: "APCA明度コントラスト (Lc) を判定できませんでした。",
        },
    },
    evaluate(n) {
        const node = n as HTMLElement;
        const nodeStyle = window.getComputedStyle(node);
        const fontSize = nodeStyle.getPropertyValue("font-size");
        const fontWeight = nodeStyle.getPropertyValue("font-weight");

        const bgColor: Color | null = axe.commons.color.getBackgroundColor(node);
        const fgColor: Color | null = axe.commons.color.getForegroundColor(node, false, bgColor);

        // missing data to determine APCA contrast for this node
        if (!bgColor || !fgColor || !fontSize || !fontWeight) {
            return undefined;
        }

        const toRGBA = (color: Color) => {
            return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
        };

        const apcaContrast = Math.abs(calcAPCA(toRGBA(fgColor), toRGBA(bgColor)) as number);

        // Check if element has data-placeholder attribute
        const hasPlaceholderAttr = node.hasAttribute("data-placeholder");
        const originalThreshold = conformanceThresholdFn(fontSize, fontWeight);

        // Use reduced threshold of 30 for placeholders, otherwise use original threshold
        const apcaThreshold = hasPlaceholderAttr ? 30 : originalThreshold;

        this.data({
            fgColor: fgColor.toHexString(),
            bgColor: bgColor.toHexString(),
            fontSize: `${((Number.parseFloat(fontSize) * 72) / 96).toFixed(1)}pt (${Number.parseFloat(fontSize)}px)`,
            fontWeight: fontWeight,
            apcaContrast: Math.round(apcaContrast * 100) / 100,
            apcaThreshold: apcaThreshold,
            messageKey: apcaThreshold === null ? "increaseFont" : hasPlaceholderAttr ? "placeholder" : "default",
        });

        return apcaThreshold ? apcaContrast >= apcaThreshold : false;
    },
});

const generateColorContrastAPCARule = (conformanceLevel: string): Rule => ({
    id: `color-contrast-apca-${conformanceLevel}`,
    impact: "serious",
    matches: "color-contrast-matches",
    metadata: {
        description: `Ensures the contrast between foreground and background colors meets APCA ${conformanceLevel} level conformance minimums thresholds`,
        help: "Elements must meet APCA conformance minimums thresholds",
        helpUrl: "https://apcacontrast.com/",
    },
    all: [`color-contrast-apca-${conformanceLevel}-conformance`],
    tags: ["apca", "wcag3", `apca-${conformanceLevel}`],
});

const registerAPCACheck = (conformanceLevel: ConformanceLevel, conformanceThresholdFn: ConformanceThresholdFn) => {
    if (typeof conformanceThresholdFn !== "function") {
        throw new Error("Conformance threshold function is required");
    }

    return {
        rules: [generateColorContrastAPCARule(conformanceLevel)],
        checks: [generateColorContrastAPCAConformanceCheck(conformanceLevel, conformanceThresholdFn)],
    };
};

export type { ConformanceLevel, ConformanceThresholdFn };
export default registerAPCACheck;
