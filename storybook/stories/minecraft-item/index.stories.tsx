import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { MinecraftItem } from "../../../packages/react";
import apple from "./assets/apple.png";
import craftingTableFront from "./assets/crafting_table_front.png";
import craftingTableSide from "./assets/crafting_table_side.png";
import craftingTableTop from "./assets/crafting_table_top.png";
import diamondSword from "./assets/diamond_sword.png";
import enderPearl from "./assets/ender_pearl.png";
import oakLog from "./assets/oak_log.png";
import oakLogTop from "./assets/oak_log_top.png";
import stick from "./assets/stick.png";
import stone from "./assets/stone.png";

// テクスチャファイル名 -> Storybook にバンドルされたサンプル画像 URL の対応表。
// ライブラリ本体はテクスチャを同梱しないため、利用側がこの resolveTexture を用意する
const TEXTURE_MAP: Record<string, string> = {
    "apple.png": apple,
    "crafting_table_front.png": craftingTableFront,
    "crafting_table_side.png": craftingTableSide,
    "crafting_table_top.png": craftingTableTop,
    "diamond_sword.png": diamondSword,
    "ender_pearl.png": enderPearl,
    "oak_log.png": oakLog,
    "oak_log_top.png": oakLogTop,
    "stick.png": stick,
    "stone.png": stone,
};

const resolveTexture = (fileName: string) => TEXTURE_MAP[fileName] ?? "";

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
        resolveTexture: { control: false },
    },
    args: {
        resolveTexture,
        size: "md",
    },
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
                    <MinecraftItem id="diamond_sword" resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem id="apple" resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem id="ender_pearl" resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem id="stick" resolveTexture={resolveTexture} size="sm" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="diamond_sword" resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem id="apple" resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem id="ender_pearl" resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem id="stick" resolveTexture={resolveTexture} size="md" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="diamond_sword" resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem id="apple" resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem id="ender_pearl" resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem id="stick" resolveTexture={resolveTexture} size="lg" />
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Block items</span>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem id="oak_log" resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem id="crafting_table" resolveTexture={resolveTexture} size="sm" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem id="oak_log" resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem id="crafting_table" resolveTexture={resolveTexture} size="md" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem id="oak_log" resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem id="crafting_table" resolveTexture={resolveTexture} size="lg" />
                </div>
            </div>
        </div>
    ),
};
