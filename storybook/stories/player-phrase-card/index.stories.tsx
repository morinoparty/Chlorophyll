import type { Meta, StoryObj } from "@storybook/react";
import { PlayerPhraseCard } from "../../../packages/react/src/components/player-phrase-card";

// フレーズ生成を決定的にするための固定時刻(VRT がバケット跨ぎで揺れないように)。
// アバター画像は実物(mc-heads.net)を表示し、VRT 時のみ capture 側で差し替える。
const FIXED_TIME = Date.UTC(2024, 0, 1, 0, 0, 0);

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
    args: {
        // 既定で決定的に描画する
        referenceTime: FIXED_TIME,
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
            <PlayerPhraseCard
                playerId="389b1a68-f647-4dd0-a421-61b6c22fdebe"
                playerName="Chocolatt"
                referenceTime={FIXED_TIME}
            />
            <PlayerPhraseCard
                playerId="75ba1a8c-4e02-4b4b-abe3-92ef4af6147c"
                playerName="Yahirrro"
                referenceTime={FIXED_TIME}
            />
            <PlayerPhraseCard
                playerId="f8b761ec-4a54-48eb-a040-c5604042bcc9"
                playerName="_NIKOMARU"
                referenceTime={FIXED_TIME}
            />
        </div>
    ),
};
