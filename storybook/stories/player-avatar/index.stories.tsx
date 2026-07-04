import type { Meta, StoryObj } from "@storybook/react";
import { PlayerAvatar } from "../../../packages/react";

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
