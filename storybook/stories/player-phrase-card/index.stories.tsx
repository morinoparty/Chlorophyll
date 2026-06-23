import type { Meta, StoryObj } from "@storybook/react";
import { PlayerPhraseCard } from "../../../packages/react/src/components/player-phrase-card";

const meta: Meta<typeof PlayerPhraseCard> = {
    title: "COMPONENTS/PlayerPhraseCard",
    component: PlayerPhraseCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        playerId: { control: "text" },
        playerName: { control: "text" },
    },
};

export default meta;
type Story = StoryObj<typeof PlayerPhraseCard>;

export const Default: Story = {
    args: {
        playerId: "069a79f4-44e9-4726-a5be-fca90e38aaf6",
        playerName: "Notch",
    },
};

export const MultiplePlayers: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <PlayerPhraseCard playerId="069a79f4-44e9-4726-a5be-fca90e38aaf6" playerName="Notch" />
            <PlayerPhraseCard playerId="853c80ef-3c37-49fd-aa49-938b674adae6" playerName="jeb_" />
            <PlayerPhraseCard playerId="61699b2e-d327-4a01-9f1e-0ea8c3f06bc6" playerName="Dinnerbone" />
        </div>
    ),
};
