import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { PlayerCard } from "../../../packages/react/src/components/player-card";

// アバター画像は実物(mc-heads.net)を表示し、VRT 時のみ capture 側で差し替える。
// 一言は固定の文字列を渡し、PlayerPhraseCard のようなランダム生成はしない(VRT を決定的にする)
const meta: Meta<typeof PlayerCard> = {
    title: "MINECRAFT/PlayerCard",
    component: PlayerCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        playerId: { control: "text" },
        playerName: { control: "text" },
        description: { control: "text" },
        variant: {
            control: "select",
            options: ["elevated", "outline", "subtle"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
    args: {
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        playerName: "Chocolatt",
        description: "あの多趣味なタイプ",
        variant: "elevated",
        size: "md",
    },
};

export default meta;
type Story = StoryObj<typeof PlayerCard>;

// カードは親の幅に従う設計。狭い画面ではページがはみ出さないよう画面幅(余白ぶんを引く)に抑える
const cardWidth = css({ width: "min(320px, calc(100vw - 2rem))" });

// 複数のカードを並べる行
const stack = css({ display: "flex", flexDirection: "column", gap: "3" });

// children を省略すると既定のレイアウト(左にアバター、右に名前と一言)で描画する
export const Default: Story = {
    render: (args) => <PlayerCard {...args} className={cardWidth} />,
};

// 一言が無いときは名前だけを表示する
export const WithoutDescription: Story = {
    args: { description: undefined },
    render: (args) => <PlayerCard {...args} className={cardWidth} />,
};

// Card の variant をそのまま使える
export const Variants: Story = {
    render: (args) => (
        <div className={stack}>
            {(["elevated", "outline", "subtle"] as const).map((variant) => (
                <PlayerCard key={variant} {...args} variant={variant} className={cardWidth} />
            ))}
        </div>
    ),
};

// プレイヤー一覧のように縦に並べた例
export const MultiplePlayers: Story = {
    render: () => (
        <div className={stack}>
            <PlayerCard
                playerId="389b1a68-f647-4dd0-a421-61b6c22fdebe"
                playerName="Chocolatt"
                description="あの多趣味なタイプ"
                className={cardWidth}
            />
            <PlayerCard
                playerId="75ba1a8c-4e02-4b4b-abe3-92ef4af6147c"
                playerName="Yahirrro"
                description="あの建築好きなタイプ"
                className={cardWidth}
            />
            <PlayerCard
                playerId="f8b761ec-4a54-48eb-a040-c5604042bcc9"
                playerName="_NIKOMARU"
                description="あの夜更かしなタイプ"
                className={cardWidth}
            />
        </div>
    ),
};

// 各パーツを子として組み立てて、アバターの大きさを変えた例
export const Composed: Story = {
    render: (args) => (
        <PlayerCard {...args} size="lg" className={cardWidth}>
            <PlayerCard.Avatar size="lg" />
            <PlayerCard.Body>
                <PlayerCard.Name />
                <PlayerCard.Description />
            </PlayerCard.Body>
        </PlayerCard>
    ),
};
