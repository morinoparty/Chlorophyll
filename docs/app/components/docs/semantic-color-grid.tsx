import { css, sva } from "styled-system/css";

const gridStyles = sva({
    slots: [
        "root",
        "group",
        "groupHeader",
        "groupTitle",
        "groupDescription",
        "grid",
        "card",
        "cardPreview",
        "cardPreviewText",
        "cardInfo",
        "cardName",
        "cardReference",
        "cardValue",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "10",
        },
        group: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
        },
        groupHeader: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            // グループの区切りを線で明示し、ただの羅列に見えないようにする
            borderBottom: "sm",
            borderColor: "border.subtle",
            paddingBottom: "2",
        },
        groupTitle: {
            fontSize: "lg",
            fontWeight: "semibold",
            color: "colorPalette.fg",
        },
        groupDescription: {
            fontSize: "sm",
            color: "colorPalette.fg.muted",
        },
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        cardPreviewText: {
            fontSize: "2xl",
            fontWeight: "semibold",
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
        cardReference: {
            fontSize: "xs",
            fontFamily: "mono",
            color: "colorPalette.fg.subtle",
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
    // 前景色トークンは色チップだけでは用途が伝わらないため、
    // 実際の背景の上に文字を載せたプレビューで表示する
    previewTextOn?: string;
}

interface SemanticColorGroup {
    title: string;
    description: string;
    tokens: SemanticColorToken[];
}

const colorPaletteGroups: SemanticColorGroup[] = [
    {
        title: "Background",
        description: "ページやセクション全体の背景に使う、最も薄い階調のトークン",
        tokens: [
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
                name: "colorPalette.bg.secondary",
                cssVar: "--mpc-colors-color-palette-bg-secondary",
                reference: "white",
                description: "Secondary surface (white fill)",
            },
        ],
    },
    {
        title: "Surface",
        description: "カードやリストなどコンポーネントの面。hover → active の順に一段ずつ濃くなる",
        tokens: [
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
        ],
    },
    {
        title: "Solid",
        description: "ボタンなどの塗りつぶしに使う高彩度トークンと、その上に載せる文字色",
        tokens: [
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
                name: "colorPalette.contrast",
                cssVar: "--mpc-colors-color-palette-contrast",
                reference: "white",
                description: "Text on solid background",
                previewTextOn: "--mpc-colors-color-palette-solid",
            },
        ],
    },
    {
        title: "Foreground",
        description: "テキストやアイコンに使う前景色。背景に対する強調度で使い分ける",
        tokens: [
            {
                name: "colorPalette.fg",
                cssVar: "--mpc-colors-color-palette-fg",
                reference: "colorPalette.12",
                description: "Default text",
                previewTextOn: "--mpc-colors-color-palette-bg",
            },
            {
                name: "colorPalette.fg.subtle",
                cssVar: "--mpc-colors-color-palette-fg-subtle",
                reference: "colorPalette.11",
                description: "Subtle text",
                previewTextOn: "--mpc-colors-color-palette-bg",
            },
            {
                name: "colorPalette.fg.muted",
                cssVar: "--mpc-colors-color-palette-fg-muted",
                reference: "gray.11",
                description: "Muted text",
                previewTextOn: "--mpc-colors-color-palette-bg",
            },
            {
                name: "colorPalette.fg.secondary",
                cssVar: "--mpc-colors-color-palette-fg-secondary",
                reference: "colorPalette.10",
                description: "Text on bg.secondary (white)",
                previewTextOn: "--mpc-colors-color-palette-bg-secondary",
            },
        ],
    },
];

export function SemanticColorGrid() {
    const styles = gridStyles();

    return (
        <div className={styles.root}>
            {colorPaletteGroups.map((group) => (
                <section key={group.title} className={styles.group}>
                    <div className={styles.groupHeader}>
                        <span className={styles.groupTitle}>{group.title}</span>
                        <span className={styles.groupDescription}>{group.description}</span>
                    </div>
                    <div className={styles.grid}>
                        {group.tokens.map((token) => (
                            <div key={token.name} className={styles.card}>
                                {token.previewTextOn ? (
                                    // 前景色トークン: 想定される背景の上に文字色を載せて見せる
                                    <div
                                        className={css(gridStyles.raw().cardPreview)}
                                        style={{ backgroundColor: `var(${token.previewTextOn})` }}
                                    >
                                        <span
                                            className={css(gridStyles.raw().cardPreviewText)}
                                            style={{ color: `var(${token.cssVar})` }}
                                        >
                                            Aa
                                        </span>
                                    </div>
                                ) : (
                                    // 背景色トークン: 色チップとして見せる
                                    <div
                                        className={css(gridStyles.raw().cardPreview)}
                                        style={{ backgroundColor: `var(${token.cssVar})` }}
                                    />
                                )}
                                <div className={styles.cardInfo}>
                                    <span className={styles.cardName}>{token.name}</span>
                                    <span className={styles.cardReference}>{token.reference}</span>
                                    <span className={styles.cardValue}>{token.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
