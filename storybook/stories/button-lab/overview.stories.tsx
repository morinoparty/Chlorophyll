import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon } from "lucide-react";
import type { ComponentProps, ComponentType } from "react";
import { css, cx } from "styled-system/css";
import { Button } from "../../../packages/react";
import { BrutalButton } from "./brutal.stories";
import { GlassButton } from "./glass.stories";
import { LeafButton } from "./leaf.stories";
import { PillGlossButton } from "./pill-gloss.stories";
import { PixelButton } from "./pixel.stories";
import { PressableButton } from "./pressable.stories";
import { TonalButton } from "./tonal.stories";

// 各デザイン案のボタンが共通で受け取る props。既存 Button と同じ intent / size の形に揃えている
type DesignButtonProps = ComponentProps<"button"> & {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
};

// 1 行 = 1 つのデザイン案
interface Design {
    name: string;
    // 一言で伝えるコンセプト
    pitch: string;
    Component: ComponentType<DesignButtonProps>;
    // ガラスのように、背後に色や模様がないと評価できない案のためのセル背景
    cellClassName?: string;
}

const styles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "2", w: "full" }),
    // ラベル列 + 比較列。PC の横幅を使って 1 行に全バリエーションを並べる
    compareGrid: css({
        display: "grid",
        gridTemplateColumns: "minmax(220px, 280px) repeat(5, minmax(0, 1fr))",
        columnGap: "4",
        rowGap: "2",
        alignItems: "center",
        w: "full",
    }),
    paletteGrid: css({
        display: "grid",
        gridTemplateColumns: "minmax(220px, 280px) repeat(3, minmax(0, 1fr))",
        columnGap: "4",
        rowGap: "2",
        alignItems: "center",
        w: "full",
    }),
    // 列見出しは本文より一段引いて読ませる
    columnHeading: css({
        fontSize: "xs",
        fontWeight: "medium",
        color: "colorPalette.fg.subtle",
        textTransform: "uppercase",
        letterSpacing: "wider",
        pb: "1",
    }),
    labelCell: css({ display: "flex", flexDirection: "column", gap: "1", py: "4" }),
    name: css({ fontSize: "md", fontWeight: "bold", color: "colorPalette.fg" }),
    pitch: css({ fontSize: "sm", color: "colorPalette.fg.muted", lineHeight: "relaxed" }),
    cell: css({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "3",
        flexWrap: "wrap",
        minH: "24",
        px: "4",
        py: "4",
        borderRadius: "panel",
    }),
    // 行の区切りは枠線ではなく、セル間の余白とうっすらした面で見せる
    currentCell: css({ bg: "bg.panel" }),
    // ガラス案は色付きの模様の上でないと透け感が見えないため、セルの背後に縞とグラデーションを敷く
    glassCell: css({
        backgroundImage:
            "repeating-linear-gradient(135deg, {colors.colorPalette.6} 0 10px, transparent 10px 28px), linear-gradient(120deg, {colors.colorPalette.8}, {colors.colorPalette.surface.hover})",
    }),
    mori: css({ colorPalette: "mori" }),
    umi: css({ colorPalette: "umi" }),
    red: css({ colorPalette: "red" }),
};

const designs: Design[] = [
    {
        name: "Current",
        pitch: "現在の本番 Button。比較の基準として並べている。",
        Component: Button as ComponentType<DesignButtonProps>,
        cellClassName: styles.currentCell,
    },
    {
        name: "Tonal",
        pitch: "影も枠線も使わず、森の色の濃さ一段ずつだけで語る、静かで上品なフラットボタン。",
        Component: TonalButton,
    },
    {
        name: "Pressable",
        pitch: "枠線のかわりに側面と柔らかい影で厚みを出し、押すとカチッと沈むキーボードのような立体ボタン。",
        Component: PressableButton,
    },
    {
        name: "Pixel",
        pitch: "もりのパーティらしい「押せるブロック」。ドットの段差で押した手応えまでピクセルで出す。",
        Component: PixelButton,
    },
    {
        name: "Pill Gloss",
        pitch: "パレット色に染まるグローとほのかなツヤで、押したくなる手触りを出した上質でやさしい pill ボタン。",
        Component: PillGlossButton,
    },
    {
        name: "Glass",
        pitch: "写真やブランド色の面にそっと溶け込む、光をまとったすりガラスのボタン。",
        Component: GlassButton,
        cellClassName: styles.glassCell,
    },
    {
        name: "Neo Brutal",
        pitch: "太いインクの縁取りと固い影で、押すと影に沈み込む、いちばん主張が強く遊び心のあるボタン。",
        Component: BrutalButton,
    },
    {
        name: "Leaf",
        pitch: "左上から光を受ける葉っぱの形で、Chlorophyll らしさが一目で伝わる、穏やかで有機的なボタン。",
        Component: LeafButton,
    },
];

// デザイン名と一言紹介を表示するラベル列
const DesignLabel = ({ design }: { design: Design }) => (
    <div className={styles.labelCell}>
        <span className={styles.name}>{design.name}</span>
        <span className={styles.pitch}>{design.pitch}</span>
    </div>
);

const compareColumns = ["Primary", "Secondary", "Plain", "With icon", "Disabled"] as const;

// 1 つのデザイン案を、intent / アイコン付き / 無効状態の 5 セルに並べる
const CompareRow = ({ design }: { design: Design }) => {
    const { Component, cellClassName } = design;
    const cell = cx(styles.cell, cellClassName);
    return (
        <>
            <DesignLabel design={design} />
            <div className={cell}>
                <Component intent="primary" size="lg">
                    ログイン
                </Component>
            </div>
            <div className={cell}>
                <Component intent="secondary" size="lg">
                    キャンセル
                </Component>
            </div>
            <div className={cell}>
                <Component intent="plain" size="lg">
                    詳細を見る
                </Component>
            </div>
            <div className={cell}>
                <Component intent="primary" size="lg">
                    次へ
                    <ArrowRightIcon />
                </Component>
            </div>
            <div className={cell}>
                <Component intent="primary" size="lg" disabled>
                    送信できません
                </Component>
            </div>
        </>
    );
};

// パレット比較の列。クラス名は Panda の静的抽出のため styles 側でリテラルに定義したものを使う
const paletteColumns = [
    { name: "mori", className: styles.mori },
    { name: "umi", className: styles.umi },
    { name: "red", className: styles.red },
] as const;

// 1 つのデザイン案を、mori / umi / red の 3 パレットで primary + secondary だけ並べる
const PaletteRow = ({ design }: { design: Design }) => {
    const { Component, cellClassName } = design;
    return (
        <>
            <DesignLabel design={design} />
            {paletteColumns.map((palette) => (
                // ラッパーごと colorPalette を切り替え、セル背景もそのパレットに追従させる
                <div key={palette.name} className={cx(palette.className, styles.cell, cellClassName)}>
                    <Component intent="primary" size="lg">
                        保存する
                    </Component>
                    <Component intent="secondary" size="lg">
                        戻る
                    </Component>
                </div>
            ))}
        </>
    );
};

const meta: Meta = {
    title: "LAB/Button Designs/Overview",
    parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

// 全デザイン案を同じ条件で横並びにして見比べる
export const Compare: Story = {
    render: () => (
        <div className={styles.stack}>
            <div className={styles.compareGrid}>
                <span className={styles.columnHeading}>Design</span>
                {compareColumns.map((column) => (
                    <span key={column} className={styles.columnHeading}>
                        {column}
                    </span>
                ))}
                {designs.map((design) => (
                    <CompareRow key={design.name} design={design} />
                ))}
            </div>
        </div>
    ),
};

// 各デザイン案がパレット(mori / umi / red)に追従するかを見比べる
export const Palettes: Story = {
    render: () => (
        <div className={styles.stack}>
            <div className={styles.paletteGrid}>
                <span className={styles.columnHeading}>Design</span>
                {paletteColumns.map((palette) => (
                    <span key={palette.name} className={styles.columnHeading}>
                        {palette.name}
                    </span>
                ))}
                {designs.map((design) => (
                    <PaletteRow key={design.name} design={design} />
                ))}
            </div>
        </div>
    ),
};
