import type { Meta, StoryObj } from "@storybook/react";
import { MinecraftProvider, SkinViewer } from "../../../packages/react";

const meta: Meta<typeof SkinViewer> = {
    title: "MINECRAFT/SkinViewer",
    component: SkinViewer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        playerId: { control: "text" },
        skinUrl: { control: "text" },
        width: { control: "number" },
        height: { control: "number" },
        autoRotate: { control: "boolean" },
        animation: {
            control: "select",
            options: ["idle", "walking", "running", "wave", "none"],
        },
        interactive: { control: "boolean" },
    },
    args: {
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        width: 300,
        height: 400,
        autoRotate: true,
        animation: "idle",
        interactive: true,
    },
};

export default meta;
type Story = StoryObj<typeof SkinViewer>;

export const Default: Story = {};

export const Walking: Story = {
    args: { animation: "walking" },
};

export const Static: Story = {
    args: { autoRotate: false, animation: "none" },
};

export const CustomSkinUrl: Story = {
    args: {
        playerId: undefined,
        skinUrl: "https://mc-heads.net/skin/f8b761ec-4a54-48eb-a040-c5604042bcc9",
    },
};

// マウス操作(回転・ズーム・パン)を全てロックした表示専用モード。
// autoRotate による自動回転は操作ロックとは独立して機能する
export const NonInteractive: Story = {
    args: {
        interactive: false,
        autoRotate: false,
        animation: "none",
    },
};

// MinecraftProvider の config.skinUrl でスキンテクスチャの取得先を差し替えた例。
// `skinUrl: (uuid) => ...` の形で任意の画像サービスや自前 API を使える
export const WithCustomSkinUrl: Story = {
    render: (args) => (
        <MinecraftProvider
            config={{
                // mc-heads.net の代わりに minotar.net から取得する(ハイフン無し UUID 形式)
                skinUrl: (playerId) => `https://minotar.net/skin/${playerId.replaceAll("-", "")}`,
            }}
        >
            <SkinViewer {...args} />
        </MinecraftProvider>
    ),
};
