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
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        playerName: "Chocolatt",
    },
};

export const MultiplePlayers: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <PlayerPhraseCard playerId="389b1a68-f647-4dd0-a421-61b6c22fdebe" playerName="Chocolatt" />
            <PlayerPhraseCard playerId="75ba1a8c-4e02-4b4b-abe3-92ef4af6147c" playerName="Yahirrro" />
            <PlayerPhraseCard playerId="f8b761ec-4a54-48eb-a040-c5604042bcc9" playerName="_NIKOMARU" />
        </div>
    ),
};
