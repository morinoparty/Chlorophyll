import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { MinecraftItem, MinecraftProvider } from "../../../packages/react";

const meta: Meta<typeof MinecraftItem> = {
    title: "MINECRAFT/Items",
    component: MinecraftItem,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        id: { control: "text" },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
    args: {
        size: "md",
    },
    // 全ストーリーを MinecraftProvider でラップし、assets のローカルパス(.storybook/main.ts の
    // staticDirs で minecraft-assets として公開している)から resolveModel/resolveTexture を
    // 自動的に解決させる。個々の MinecraftItem に resolveModel/resolveTexture を渡す必要はない。
    // Storybook は docs Worker の /storybook/ 配下で配信するため、iframe.html からの相対パスで渡す
    decorators: [
        (Story) => (
            <MinecraftProvider assets="./minecraft-assets">
                <Story />
            </MinecraftProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MinecraftItem>;

// --- 平面アイテム ---

export const DiamondSword: Story = {
    args: { id: "diamond_sword" },
};

export const Apple: Story = {
    args: { id: "apple" },
};

export const EnderPearl: Story = {
    args: { id: "ender_pearl" },
};

export const Stick: Story = {
    args: { id: "stick" },
};

// --- ブロックアイテム(3 面等角図) ---

export const Stone: Story = {
    args: { id: "stone" },
};

export const OakLog: Story = {
    args: { id: "oak_log" },
};

export const CraftingTable: Story = {
    args: { id: "crafting_table" },
};

// 単一の立方体ではなく、支柱+横棒からなる複数の直方体で構成される形状の例
export const OakFence: Story = {
    args: { id: "oak_fence" },
};

// 一覧表示用レイアウト
const showcaseStyles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
};

// 平面アイテム 4 種・ブロックアイテム 3 種を sm/md/lg で並べたショーケース
export const Showcase: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={showcaseStyles.grid}>
            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Flat items</span>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="diamond_sword" size="sm" />
                    <MinecraftItem id="apple" size="sm" />
                    <MinecraftItem id="ender_pearl" size="sm" />
                    <MinecraftItem id="stick" size="sm" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="diamond_sword" size="md" />
                    <MinecraftItem id="apple" size="md" />
                    <MinecraftItem id="ender_pearl" size="md" />
                    <MinecraftItem id="stick" size="md" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="diamond_sword" size="lg" />
                    <MinecraftItem id="apple" size="lg" />
                    <MinecraftItem id="ender_pearl" size="lg" />
                    <MinecraftItem id="stick" size="lg" />
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Block items</span>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" size="sm" />
                    <MinecraftItem id="oak_log" size="sm" />
                    <MinecraftItem id="crafting_table" size="sm" />
                    <MinecraftItem id="oak_fence" size="sm" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" size="md" />
                    <MinecraftItem id="oak_log" size="md" />
                    <MinecraftItem id="crafting_table" size="md" />
                    <MinecraftItem id="oak_fence" size="md" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" size="lg" />
                    <MinecraftItem id="oak_log" size="lg" />
                    <MinecraftItem id="crafting_table" size="lg" />
                    <MinecraftItem id="oak_fence" size="lg" />
                </div>
            </div>
        </div>
    ),
};

// 色付け(tint)と透過の確認用。背景に模様を敷き、透ける部分が背景を見せることを確認する
const tintStyles = {
    row: css({
        display: "flex",
        gap: "4",
        padding: "4",
        borderRadius: "l3",
        // 透過したピクセルの向こうが見えるよう、市松模様の背景に置く
        backgroundImage:
            "repeating-conic-gradient(var(--mpc-colors-bg-subtle) 0% 25%, var(--mpc-colors-bg-panel) 0% 50%)",
        backgroundSize: "16px 16px",
    }),
    item: css({ display: "flex", flexDirection: "column", alignItems: "center", gap: "2" }),
    label: css({ fontSize: "xs", color: "colorPalette.fg.muted" }),
};

const TINT_SAMPLES = [
    // 色付けしないブロック(テクスチャの色そのまま)
    { id: "stone", note: "no tint" },
    // 透明なピクセルを持つブロック。色付けせず、透けた部分から背景が見える
    { id: "glass", note: "cutout" },
    { id: "light_blue_stained_glass", note: "translucent" },
    // items/<id>.json の tints で色を付けるブロック
    { id: "grass_block", note: "tint: grass" },
    { id: "oak_leaves", note: "tint: constant" },
] as const;

// tint を定義していないブロックはテクスチャのまま、定義しているブロックはインベントリと同じ既定色で描く
export const TintAndTransparency: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={tintStyles.row}>
            {TINT_SAMPLES.map(({ id, note }) => (
                <div key={id} className={tintStyles.item}>
                    <MinecraftItem id={id} size="lg" />
                    <span className={tintStyles.label}>
                        {id} ({note})
                    </span>
                </div>
            ))}
        </div>
    ),
};
