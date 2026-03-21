import { css, sva } from "styled-system/css";

const gridStyles = sva({
    slots: ["grid", "card", "cardPreview", "cardInfo", "cardName", "cardValue"],
    base: {
        grid: {
            display: "grid",
            gridTemplateColumns: { base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
            gap: "6",
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            alignItems: "center",
        },
        cardPreview: {
            width: "full",
            height: "24",
            borderRadius: "md",
            border: "sm",
            borderColor: "border",
        },
        cardInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "center",
        },
        cardName: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
        },
        cardValue: {
            fontSize: "xs",
            color: "colorPalette.fg.muted",
        },
    },
});

interface SemanticColorToken {
    name: string;
    cssVar: string;
    reference: string;
    description: string;
}

const colorPaletteTokens: SemanticColorToken[] = [
    {
        name: "colorPalette.bg",
        cssVar: "--mpc-colors-color-palette-bg",
        reference: "colorPalette.2",
        description: "Default background",
    },
    {
        name: "colorPalette.bg.subtle",
        cssVar: "--mpc-colors-color-palette-bg-subtle",
        reference: "colorPalette.1",
        description: "Subtle background",
    },
    {
        name: "colorPalette.surface",
        cssVar: "--mpc-colors-color-palette-surface",
        reference: "colorPalette.3",
        description: "Component background (normal)",
    },
    {
        name: "colorPalette.surface.hover",
        cssVar: "--mpc-colors-color-palette-surface-hover",
        reference: "colorPalette.4",
        description: "Component background (hover)",
    },
    {
        name: "colorPalette.surface.active",
        cssVar: "--mpc-colors-color-palette-surface-active",
        reference: "colorPalette.5",
        description: "Component background (active)",
    },
    {
        name: "colorPalette.solid",
        cssVar: "--mpc-colors-color-palette-solid",
        reference: "colorPalette.9",
        description: "Solid background for buttons",
    },
    {
        name: "colorPalette.solid.emphasized",
        cssVar: "--mpc-colors-color-palette-solid-emphasized",
        reference: "colorPalette.10",
        description: "Solid background (hover)",
    },
    {
        name: "colorPalette.fg",
        cssVar: "--mpc-colors-color-palette-fg",
        reference: "colorPalette.12",
        description: "Default text",
    },
    {
        name: "colorPalette.fg.muted",
        cssVar: "--mpc-colors-color-palette-fg-muted",
        reference: "gray.11",
        description: "Muted text",
    },
    {
        name: "colorPalette.fg.subtle",
        cssVar: "--mpc-colors-color-palette-fg-subtle",
        reference: "colorPalette.11",
        description: "Subtle text",
    },
    {
        name: "colorPalette.contrast",
        cssVar: "--mpc-colors-color-palette-contrast",
        reference: "white",
        description: "Text on solid background",
    },
];

export function SemanticColorGrid() {
    const styles = gridStyles();

    return (
        <div className={styles.grid}>
            {colorPaletteTokens.map((token) => (
                <div key={token.name} className={styles.card}>
                    <div
                        className={css(gridStyles.raw().cardPreview)}
                        style={{ backgroundColor: `var(${token.cssVar})` }}
                    />
                    <div className={styles.cardInfo}>
                        <span className={styles.cardName}>{token.name}</span>
                        <span className={styles.cardValue}>{token.description}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
