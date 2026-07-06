import type { Meta, StoryObj } from "@storybook/react";
import { PlayerMap } from "../../../packages/react";

const meta: Meta<typeof PlayerMap> = {
    title: "MINECRAFT/PlayerMap",
    component: PlayerMap,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        playerId: { control: "text" },
        playerName: { control: "text" },
        size: {
            control: "select",
            options: ["md", "lg", "xl"],
        },
    },
    args: {
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        playerName: "Chocolatt",
        size: "md",
    },
};

export default meta;
type Story = StoryObj<typeof PlayerMap>;

export const Default: Story = {};

export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: (args) => (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <PlayerMap {...args} size="md" />
            <PlayerMap {...args} size="lg" />
            <PlayerMap {...args} size="xl" />
        </div>
    ),
};
