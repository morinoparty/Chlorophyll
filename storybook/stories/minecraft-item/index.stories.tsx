import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { MinecraftItem } from "../../../packages/react";
import apple from "./assets/apple.png";
import craftingTableFront from "./assets/crafting_table_front.png";
import craftingTableSide from "./assets/crafting_table_side.png";
import craftingTableTop from "./assets/crafting_table_top.png";
import diamondSword from "./assets/diamond_sword.png";
import enderPearl from "./assets/ender_pearl.png";
import blockBlockModel from "./assets/models/block/block.json?url";
import craftingTableBlockModel from "./assets/models/block/crafting_table.json?url";
import oakLogBlockModel from "./assets/models/block/oak_log.json?url";
import stoneBlockModel from "./assets/models/block/stone.json?url";
import appleItemModel from "./assets/models/item/apple.json?url";
import craftingTableItemModel from "./assets/models/item/crafting_table.json?url";
import diamondSwordItemModel from "./assets/models/item/diamond_sword.json?url";
import enderPearlItemModel from "./assets/models/item/ender_pearl.json?url";
import oakLogItemModel from "./assets/models/item/oak_log.json?url";
import stickItemModel from "./assets/models/item/stick.json?url";
import stoneItemModel from "./assets/models/item/stone.json?url";
import oakLog from "./assets/oak_log.png";
import oakLogTop from "./assets/oak_log_top.png";
import oakPlanks from "./assets/oak_planks.png";
import stick from "./assets/stick.png";
import stone from "./assets/stone.png";

// テクスチャファイル名 -> Storybook にバンドルされたサンプル画像 URL の対応表。
// ライブラリ本体はテクスチャを同梱しないため、利用側がこの resolveTexture を用意する。
// 3D 立方体は 6 面すべてにテクスチャが要る(下面など画面には映らない面も含む)ため、
// oak_planks.png (crafting_table の底面)のような非表示面のテクスチャも同梱している
const TEXTURE_MAP: Record<string, string> = {
    "apple.png": apple,
    "crafting_table_front.png": craftingTableFront,
    "crafting_table_side.png": craftingTableSide,
    "crafting_table_top.png": craftingTableTop,
    "diamond_sword.png": diamondSword,
    "ender_pearl.png": enderPearl,
    "oak_log.png": oakLog,
    "oak_log_top.png": oakLogTop,
    "oak_planks.png": oakPlanks,
    "stick.png": stick,
    "stone.png": stone,
};

const resolveTexture = (fileName: string) => TEXTURE_MAP[fileName] ?? "";

// モデル JSON のパス("item/stone.json" 等) -> バンドルされたサンプル JSON URL の対応表。
// MinecraftItem はこの JSON を実際に読んで平面/ブロックの種別と面テクスチャを判定する
const MODEL_MAP: Record<string, string> = {
    "item/diamond_sword.json": diamondSwordItemModel,
    "item/apple.json": appleItemModel,
    "item/ender_pearl.json": enderPearlItemModel,
    "item/stick.json": stickItemModel,
    "item/stone.json": stoneItemModel,
    "item/oak_log.json": oakLogItemModel,
    "item/crafting_table.json": craftingTableItemModel,
    "block/stone.json": stoneBlockModel,
    "block/oak_log.json": oakLogBlockModel,
    "block/crafting_table.json": craftingTableBlockModel,
    "block/block.json": blockBlockModel,
};

const resolveModel = (path: string) => MODEL_MAP[path] ?? "";

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
        resolveModel: { control: false },
        resolveTexture: { control: false },
    },
    args: {
        resolveModel,
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
                    <MinecraftItem
                        id="diamond_sword"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="sm"
                    />
                    <MinecraftItem id="apple" resolveModel={resolveModel} resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem
                        id="ender_pearl"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="sm"
                    />
                    <MinecraftItem id="stick" resolveModel={resolveModel} resolveTexture={resolveTexture} size="sm" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem
                        id="diamond_sword"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="md"
                    />
                    <MinecraftItem id="apple" resolveModel={resolveModel} resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem
                        id="ender_pearl"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="md"
                    />
                    <MinecraftItem id="stick" resolveModel={resolveModel} resolveTexture={resolveTexture} size="md" />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem
                        id="diamond_sword"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="lg"
                    />
                    <MinecraftItem id="apple" resolveModel={resolveModel} resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem
                        id="ender_pearl"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="lg"
                    />
                    <MinecraftItem id="stick" resolveModel={resolveModel} resolveTexture={resolveTexture} size="lg" />
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Block items</span>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" resolveModel={resolveModel} resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem id="oak_log" resolveModel={resolveModel} resolveTexture={resolveTexture} size="sm" />
                    <MinecraftItem
                        id="crafting_table"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="sm"
                    />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" resolveModel={resolveModel} resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem id="oak_log" resolveModel={resolveModel} resolveTexture={resolveTexture} size="md" />
                    <MinecraftItem
                        id="crafting_table"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="md"
                    />
                </div>
                <div className={showcaseStyles.row}>
                    <MinecraftItem id="stone" resolveModel={resolveModel} resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem id="oak_log" resolveModel={resolveModel} resolveTexture={resolveTexture} size="lg" />
                    <MinecraftItem
                        id="crafting_table"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    ),
};
