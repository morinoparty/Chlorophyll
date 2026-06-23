import type { Meta, StoryObj } from "@storybook/react";
import { PlayerPhraseCard } from "../../../packages/react/src/components/player-phrase-card";

// フレーズ生成を決定的にするための固定時刻(VRT がバケット跨ぎで揺れないように)
const FIXED_TIME = Date.UTC(2024, 0, 1, 0, 0, 0);

// VRT を外部サービス(mc-heads.net)に依存させないためのローカルアバター。
// seed から決定的に色を決めて、プレイヤーごとに見分けがつくようにする。
const avatarFor = (seed: string): string => {
    let hue = 0;
    for (const ch of seed) hue = (hue * 31 + ch.charCodeAt(0)) % 360;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="hsl(${hue} 45% 55%)"/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

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
        avatarSrc: avatarFor("Chocolatt"),
    },
};

export const MultiplePlayers: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <PlayerPhraseCard
                playerId="389b1a68-f647-4dd0-a421-61b6c22fdebe"
                playerName="Chocolatt"
                avatarSrc={avatarFor("Chocolatt")}
                referenceTime={FIXED_TIME}
            />
            <PlayerPhraseCard
                playerId="75ba1a8c-4e02-4b4b-abe3-92ef4af6147c"
                playerName="Yahirrro"
                avatarSrc={avatarFor("Yahirrro")}
                referenceTime={FIXED_TIME}
            />
            <PlayerPhraseCard
                playerId="f8b761ec-4a54-48eb-a040-c5604042bcc9"
                playerName="_NIKOMARU"
                avatarSrc={avatarFor("_NIKOMARU")}
                referenceTime={FIXED_TIME}
            />
        </div>
    ),
};
