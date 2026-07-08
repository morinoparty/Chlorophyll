import type { Meta, StoryObj } from "@storybook/react";
import { MinecraftProvider, PlayerAvatar } from "../../../packages/react";

const meta: Meta<typeof PlayerAvatar> = {
    title: "MINECRAFT/PlayerAvatar",
    component: PlayerAvatar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        playerId: { control: "text" },
        playerName: { control: "text" },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
    args: {
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        playerName: "Chocolatt",
        size: "md",
    },
};

export default meta;
type Story = StoryObj<typeof PlayerAvatar>;

export const Default: Story = {};

export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: (args) => (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <PlayerAvatar {...args} size="sm" />
            <PlayerAvatar {...args} size="md" />
            <PlayerAvatar {...args} size="lg" />
        </div>
    ),
};

// MinecraftProvider の config.avatarUrl で画像の取得先を差し替えた例。
// `avatarUrl: (uuid, size) => ...` の形で任意の画像サービスや自前 API を使える
export const WithCustomAvatarUrl: Story = {
    render: (args) => (
        <MinecraftProvider
            config={{
                // mc-heads.net の代わりに minotar.net から取得する(ハイフン無し UUID 形式)
                avatarUrl: (playerId, pixelSize) =>
                    `https://minotar.net/avatar/${playerId.replaceAll("-", "")}/${pixelSize}`,
            }}
        >
            <PlayerAvatar {...args} />
        </MinecraftProvider>
    ),
};
