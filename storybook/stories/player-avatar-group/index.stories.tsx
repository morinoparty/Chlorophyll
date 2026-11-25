import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Card } from "../../../packages/react/src/components/card";
import {
    PlayerAvatarGroup,
    type PlayerAvatarGroupPlayer,
} from "../../../packages/react/src/components/player-avatar-group";

const meta: Meta<typeof PlayerAvatarGroup> = {
    title: "MINECRAFT/PlayerAvatarGroup",
    component: PlayerAvatarGroup,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    // 見本を名前付きの <section>(region ランドマーク)で包み、axe の region ルール
    // (すべてのコンテンツがランドマークの中にあること)を満たす
    decorators: [
        (Story) => (
            <section aria-label="PlayerAvatarGroup の見本">
                <Story />
            </section>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof PlayerAvatarGroup>;

// 日記やオンライン一覧に並ぶプレイヤー。先頭の 3 人は他のストーリーと同じ実在の UUID で、
// max を 3 にしたストーリーでは「+N」に入る 4 人目以降の画像は取得されない
const PLAYERS: PlayerAvatarGroupPlayer[] = [
    { id: "389b1a68-f647-4dd0-a421-61b6c22fdebe", name: "Chocolatt" },
    { id: "75ba1a8c-4e02-4b4b-abe3-92ef4af6147c", name: "Yahirrro" },
    { id: "f8b761ec-4a54-48eb-a040-c5604042bcc9", name: "_NIKOMARU" },
    { id: "0b6c7e2a-3f41-4c8e-9d2a-5e7f1a4b6c80", name: "momiji_leaf" },
    { id: "1c7d8f3b-4a52-4d9f-8e3b-6f8a2b5c7d91", name: "Kinoko_Taro" },
    { id: "2d8e9a4c-5b63-4ea0-9f4c-7a9b3c6d8ea2", name: "sakura_yuki" },
    { id: "3e9fab5d-6c74-4fb1-a05d-8bac4d7e9fb3", name: "tanuki0221" },
];

// 基本形: 7 人のうち 3 人をアバターで並べ、残りを「+4」にまとめる
export const Default: Story = {
    args: {
        players: PLAYERS,
        max: 3,
        size: "md",
        spacing: "normal",
        "aria-label": "この日記にいた人",
    },
    argTypes: {
        max: { control: { type: "number", min: 0 } },
        size: { control: "select", options: ["sm", "md", "lg"] },
        spacing: { control: "select", options: ["normal", "tight"] },
    },
};

const column = css({ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "component.gap.lg" });

// 大きさ: PlayerAvatar と同じ sm 32px / md 48px / lg 64px。重なり幅も大きさに比例する
export const Sizes: Story = {
    render: () => (
        <div className={column}>
            <PlayerAvatarGroup players={PLAYERS} max={3} size="sm" aria-label="参加者(sm)" />
            <PlayerAvatarGroup players={PLAYERS} max={3} size="md" aria-label="参加者(md)" />
            <PlayerAvatarGroup players={PLAYERS} max={3} size="lg" aria-label="参加者(lg)" />
        </div>
    ),
};

// 重なり幅: normal は頭の 1/4、tight は 3/8 を重ねる。狭い場所では tight で詰める
export const Spacing: Story = {
    render: () => (
        <div className={column}>
            <PlayerAvatarGroup players={PLAYERS} max={3} spacing="normal" aria-label="参加者(normal)" />
            <PlayerAvatarGroup players={PLAYERS} max={3} spacing="tight" aria-label="参加者(tight)" />
        </div>
    ),
};

// 人数が max 以下のときは「+N」を出さず全員を並べる
export const WithoutOverflow: Story = {
    args: {
        players: PLAYERS.slice(0, 3),
        max: 5,
        "aria-label": "オンラインのプレイヤー",
    },
};

// 「+N」の読み上げを差し替える例。隠れたプレイヤーの名前まで読ませたいときに使う
export const CustomOverflowLabel: Story = {
    args: {
        players: PLAYERS,
        max: 3,
        size: "sm",
        "aria-label": "メッセージの宛先",
        overflowLabel: (hiddenCount, hiddenPlayers) =>
            `ほか ${hiddenCount} 人: ${hiddenPlayers.map((player) => player.name).join("、")}`,
    },
};

// Compound 版: Root / Item / Overflow を組み合わせ、並べ方を自分で決める例。
// 総数だけが API から分かり、全員分のプレイヤー情報は持っていない場合などに使う
export const Compound: Story = {
    render: () => (
        <PlayerAvatarGroup.Root size="sm" spacing="tight" aria-label="オンラインのプレイヤー">
            {PLAYERS.slice(0, 3).map((player) => (
                <PlayerAvatarGroup.Item key={player.id} playerId={player.id} playerName={player.name} />
            ))}
            <PlayerAvatarGroup.Overflow count={24} aria-label="ほか 24 人がオンライン" />
        </PlayerAvatarGroup.Root>
    ),
};

// 隠れた人数が多い場合: 「+N」のチップは四角に収まらない桁数になると横に伸びる
export const LargeOverflowCount: Story = {
    render: () => (
        <div className={column}>
            <PlayerAvatarGroup.Root size="sm" aria-label="オンラインのプレイヤー(sm)">
                {PLAYERS.slice(0, 3).map((player) => (
                    <PlayerAvatarGroup.Item key={player.id} playerId={player.id} playerName={player.name} />
                ))}
                <PlayerAvatarGroup.Overflow count={1024} aria-label="ほか 1024 人がオンライン" />
            </PlayerAvatarGroup.Root>
            <PlayerAvatarGroup.Root size="md" aria-label="オンラインのプレイヤー(md)">
                {PLAYERS.slice(0, 3).map((player) => (
                    <PlayerAvatarGroup.Item key={player.id} playerId={player.id} playerName={player.name} />
                ))}
                <PlayerAvatarGroup.Overflow count={1024} aria-label="ほか 1024 人がオンライン" />
            </PlayerAvatarGroup.Root>
        </div>
    ),
};

// ページの地色(colorPalette.bg)の上に置く場合: リングの色を CSS 変数で地色に合わせる。
// 値は生成される変数名ではなくトークン参照で書き、prefix や命名規則に依存しないようにする
export const OnPageBackground: Story = {
    render: () => (
        <div className={css({ bg: "colorPalette.bg", padding: "component.padding.lg", borderRadius: "panel" })}>
            <PlayerAvatarGroup
                players={PLAYERS}
                max={3}
                aria-label="この日記にいた人"
                className={css({ "--player-avatar-group-ring-color": "{colors.colorPalette.bg}" })}
            />
        </div>
    ),
};

const diaryMeta = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "component.gap.md",
});

const diaryMetaLabel = css({
    textStyle: "sm",
    color: "colorPalette.fg.muted",
});

// 日記のカードに「この日いた人」を添える例。スマホ幅のパネルに合わせる
export const InDiaryCard: Story = {
    render: () => (
        <div style={{ width: 358 }}>
            <Card.Root>
                <Card.Header>
                    <Card.Title>森の拠点で花火大会</Card.Title>
                    <Card.Description>2026年8月15日</Card.Description>
                </Card.Header>
                <Card.Body>
                    <div className={diaryMeta}>
                        <span className={diaryMetaLabel}>この日いた人</span>
                        <PlayerAvatarGroup players={PLAYERS} max={3} size="sm" aria-label="この日いた人" />
                    </div>
                </Card.Body>
            </Card.Root>
        </div>
    ),
};
