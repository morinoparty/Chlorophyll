import type { Meta, StoryObj } from "@storybook/react";
import { PlayerPhraseCard } from "../../../packages/react/src/components/player-phrase-card";

// フレーズ生成を決定的にするための固定時刻(VRT がバケット跨ぎで揺れないように)。
// アバター画像は実物(mc-heads.net)を表示し、VRT 時のみ capture 側で差し替える。
const FIXED_TIME = Date.UTC(2024, 0, 1, 0, 0, 0);

const meta: Meta<typeof PlayerPhraseCard> = {
    title: "BRAND/PlayerPhraseCard",
    component: PlayerPhraseCard,
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
        // 既定で決定的に描画する
        referenceTime: FIXED_TIME,
    },
};

export default meta;
type Story = StoryObj<typeof PlayerPhraseCard>;

// Compound Component パターンのため、Root は Avatar/Body/Phrase/Name を子として組み立てる
const renderCard = (playerId: string, playerName: string) => (
    <PlayerPhraseCard playerId={playerId} playerName={playerName} referenceTime={FIXED_TIME}>
        <PlayerPhraseCard.Avatar />
        <PlayerPhraseCard.Body>
            <PlayerPhraseCard.Phrase />
            <PlayerPhraseCard.Name />
        </PlayerPhraseCard.Body>
    </PlayerPhraseCard>
);

// Controls パネルで playerId/playerName を編集できるよう、args をそのまま Root に渡す
export const Default: Story = {
    args: {
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        playerName: "Chocolatt",
    },
    render: (args) => (
        <PlayerPhraseCard {...args}>
            <PlayerPhraseCard.Avatar />
            <PlayerPhraseCard.Body>
                <PlayerPhraseCard.Phrase />
                <PlayerPhraseCard.Name />
            </PlayerPhraseCard.Body>
        </PlayerPhraseCard>
    ),
};

export const MultiplePlayers: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {renderCard("389b1a68-f647-4dd0-a421-61b6c22fdebe", "Chocolatt")}
            {renderCard("75ba1a8c-4e02-4b4b-abe3-92ef4af6147c", "Yahirrro")}
            {renderCard("f8b761ec-4a54-48eb-a040-c5604042bcc9", "_NIKOMARU")}
        </div>
    ),
};

export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <PlayerPhraseCard
                    key={size}
                    playerId="389b1a68-f647-4dd0-a421-61b6c22fdebe"
                    playerName="Chocolatt"
                    referenceTime={FIXED_TIME}
                    size={size}
                >
                    <PlayerPhraseCard.Avatar />
                    <PlayerPhraseCard.Body>
                        <PlayerPhraseCard.Phrase />
                        <PlayerPhraseCard.Name />
                    </PlayerPhraseCard.Body>
                </PlayerPhraseCard>
            ))}
        </div>
    ),
};
