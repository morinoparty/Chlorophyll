import { SegmentGroup } from "@morinoparty/chlorophyll-react";
import { css, cx, sva } from "styled-system/css";

export type PaletteName = "mori" | "umi" | "gray" | "red" | "yellow" | "blue";
export type RadiusName = "none" | "sm" | "md" | "lg";

// Panda は静的解析でクラスを生成するため、パレットごとのクラスを列挙しておく
export const paletteClass: Record<PaletteName, string> = {
    mori: css({ colorPalette: "mori" }),
    umi: css({ colorPalette: "umi" }),
    gray: css({ colorPalette: "gray" }),
    red: css({ colorPalette: "red" }),
    yellow: css({ colorPalette: "yellow" }),
    blue: css({ colorPalette: "blue" }),
};

// 角丸は semantic token(radii.l1〜l3)の CSS 変数を上書きして切り替える。
// md は docs の preset(radius: "xl")と同じ段にしている
const radiusScale: Record<RadiusName, [string, string, string]> = {
    none: ["0", "0", "0"],
    sm: ["var(--mpc-radii-xs)", "var(--mpc-radii-sm)", "var(--mpc-radii-md)"],
    md: ["var(--mpc-radii-lg)", "var(--mpc-radii-xl)", "var(--mpc-radii-2xl)"],
    lg: ["var(--mpc-radii-2xl)", "var(--mpc-radii-3xl)", "var(--mpc-radii-4xl)"],
};

export function radiusStyle(radius: RadiusName) {
    const [l1, l2, l3] = radiusScale[radius];
    return { "--mpc-radii-l1": l1, "--mpc-radii-l2": l2, "--mpc-radii-l3": l3 } as React.CSSProperties;
}

const PALETTES: { value: PaletteName; label: string }[] = [
    { value: "mori", label: "もり" },
    { value: "umi", label: "うみ" },
    { value: "gray", label: "グレー" },
    { value: "red", label: "レッド" },
    { value: "yellow", label: "イエロー" },
    { value: "blue", label: "ブルー" },
];

const RADII: { value: RadiusName; label: string }[] = [
    { value: "none", label: "なし" },
    { value: "sm", label: "小" },
    { value: "md", label: "中" },
    { value: "lg", label: "大" },
];

const pickerStyles = sva({
    slots: ["root", "row", "label", "swatches", "swatch", "dot"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            padding: "4",
            borderRadius: "l3",
            bg: "bg.panel",
            borderWidth: "1",
            borderColor: "border",
        },
        row: {
            display: "flex",
            alignItems: "center",
            gap: "4",
        },
        label: {
            width: "14",
            flexShrink: "0",
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
        },
        swatches: {
            display: "flex",
            gap: "2.5",
        },
        // 選択中のスウォッチだけ外側にリングを出す
        swatch: {
            display: "grid",
            placeItems: "center",
            width: "8",
            height: "8",
            borderRadius: "full",
            borderWidth: "2",
            borderColor: "transparent",
            cursor: "pointer",
            _pressed: { borderColor: "colorPalette.solid" },
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "focus.ring",
                outlineColor: "colorPalette.focus.ring",
                outlineOffset: "0.5",
            },
        },
        dot: {
            width: "6",
            height: "6",
            borderRadius: "full",
            bg: "colorPalette.solid",
        },
    },
});

interface ThemePickerProps {
    palette: PaletteName;
    radius: RadiusName;
    onPaletteChange: (palette: PaletteName) => void;
    onRadiusChange: (radius: RadiusName) => void;
}

export function ThemePicker({ palette, radius, onPaletteChange, onRadiusChange }: ThemePickerProps) {
    const styles = pickerStyles();

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <span className={styles.label} id="theme-picker-palette">
                    カラー
                </span>
                <div className={styles.swatches} role="group" aria-labelledby="theme-picker-palette">
                    {PALETTES.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            aria-label={item.label}
                            aria-pressed={palette === item.value}
                            className={cx(paletteClass[item.value], styles.swatch)}
                            onClick={() => onPaletteChange(item.value)}
                        >
                            <span className={styles.dot} />
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>角丸</span>
                <SegmentGroup.Root
                    size="sm"
                    value={radius}
                    onValueChange={(details) => onRadiusChange(details.value as RadiusName)}
                    aria-label="角丸"
                >
                    <SegmentGroup.Control>
                        <SegmentGroup.Indicator />
                        {RADII.map((item) => (
                            <SegmentGroup.Item key={item.value} value={item.value}>
                                <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
                                <SegmentGroup.ItemControl />
                                <SegmentGroup.ItemHiddenInput />
                            </SegmentGroup.Item>
                        ))}
                    </SegmentGroup.Control>
                </SegmentGroup.Root>
            </div>
        </div>
    );
}
