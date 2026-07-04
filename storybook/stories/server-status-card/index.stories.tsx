import type { Meta, StoryObj } from "@storybook/react";
import { ServerStatusCard } from "../../../packages/react";

const meta: Meta<typeof ServerStatusCard> = {
    title: "MINECRAFT/ServerStatusCard",
    component: ServerStatusCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        version: { control: "text" },
        address: { control: "text" },
        onlineCount: { control: "number" },
        registeredCount: { control: "number" },
    },
    args: {
        version: "1.21.11",
        address: "visit.morino.party",
        onlineCount: 12,
        registeredCount: 348,
    },
};

export default meta;
type Story = StoryObj<typeof ServerStatusCard>;

export const Default: Story = {};

export const Empty: Story = {
    args: { onlineCount: 0 },
};
