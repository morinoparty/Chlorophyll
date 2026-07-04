import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { MinecraftItem, MinecraftProvider } from "../../../packages/react";
import blockBlockModel from "./assets/models/block/block.json?url";
import craftingTableBlockModel from "./assets/models/block/crafting_table.json?url";
import cubeBlockModel from "./assets/models/block/cube.json?url";
import cubeAllBlockModel from "./assets/models/block/cube_all.json?url";
import cubeBottomTopBlockModel from "./assets/models/block/cube_bottom_top.json?url";
import cubeColumnBlockModel from "./assets/models/block/cube_column.json?url";
import cubeTopBlockModel from "./assets/models/block/cube_top.json?url";
import fenceInventoryBlockModel from "./assets/models/block/fence_inventory.json?url";
import oakFenceInventoryBlockModel from "./assets/models/block/oak_fence_inventory.json?url";
import oakLogBlockModel from "./assets/models/block/oak_log.json?url";
import stoneBlockModel from "./assets/models/block/stone.json?url";
import appleItemModel from "./assets/models/item/apple.json?url";
import craftingTableItemModel from "./assets/models/item/crafting_table.json?url";
import diamondSwordItemModel from "./assets/models/item/diamond_sword.json?url";
import enderPearlItemModel from "./assets/models/item/ender_pearl.json?url";
import oakFenceItemModel from "./assets/models/item/oak_fence.json?url";
import oakLogItemModel from "./assets/models/item/oak_log.json?url";
import stickItemModel from "./assets/models/item/stick.json?url";
import stoneItemModel from "./assets/models/item/stone.json?url";
import apple from "./assets/textures/apple.png";
import craftingTableFront from "./assets/textures/crafting_table_front.png";
import craftingTableSide from "./assets/textures/crafting_table_side.png";
import craftingTableTop from "./assets/textures/crafting_table_top.png";
import diamondSword from "./assets/textures/diamond_sword.png";
import enderPearl from "./assets/textures/ender_pearl.png";
import oakLog from "./assets/textures/oak_log.png";
import oakLogTop from "./assets/textures/oak_log_top.png";
import oakPlanks from "./assets/textures/oak_planks.png";
import stick from "./assets/textures/stick.png";
import stone from "./assets/textures/stone.png";

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
    "item/oak_fence.json": oakFenceItemModel,
    "block/stone.json": stoneBlockModel,
    "block/oak_log.json": oakLogBlockModel,
    "block/crafting_table.json": craftingTableBlockModel,
    "block/block.json": blockBlockModel,
    "block/oak_fence_inventory.json": oakFenceInventoryBlockModel,
    "block/fence_inventory.json": fenceInventoryBlockModel,
    // 単一立方体の実体(elements)を持つ共通テンプレート群。cube_all/cube_column 等は
    // テクスチャ変数を付け替えるだけで、実体は block/cube.json が持っている
    "block/cube.json": cubeBlockModel,
    "block/cube_all.json": cubeAllBlockModel,
    "block/cube_column.json": cubeColumnBlockModel,
    "block/cube_bottom_top.json": cubeBottomTopBlockModel,
    "block/cube_top.json": cubeTopBlockModel,
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

// 単一の立方体ではなく、支柱+横棒からなる複数の直方体で構成される形状の例
export const OakFence: Story = {
    args: { id: "oak_fence" },
};

// --- MinecraftProvider ---

const providerStyles = {
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
};

// resolveModel/resolveTexture を各 MinecraftItem に個別に渡す代わりに、MinecraftProvider を
// 一箇所でラップするだけで済むことを示す。assets には .storybook/main.ts の staticDirs で
// 公開しているローカルパス(/minecraft-assets/models, /minecraft-assets/textures)を渡している
export const WithProvider: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <MinecraftProvider assets="/minecraft-assets">
            <div className={providerStyles.row}>
                <MinecraftItem id="diamond_sword" size="md" />
                <MinecraftItem id="stone" size="md" />
                <MinecraftItem id="oak_log" size="md" />
                <MinecraftItem id="oak_fence" size="md" />
            </div>
        </MinecraftProvider>
    ),
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
                    <MinecraftItem
                        id="oak_fence"
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
                    <MinecraftItem
                        id="oak_fence"
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
                    <MinecraftItem
                        id="oak_fence"
                        resolveModel={resolveModel}
                        resolveTexture={resolveTexture}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    ),
};
