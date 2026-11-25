import type { Meta, StoryObj } from "@storybook/react";
import { CloudIcon, MoonIcon, PickaxeIcon, SunIcon, UserPlusIcon } from "lucide-react";
import { css } from "styled-system/css";
import { PlayerAvatar } from "../../../packages/react/src/components/player-avatar";
import { Timeline } from "../../../packages/react/src/components/timeline";

// 時刻やプレイヤーは固定値を渡し、new Date() やランダム生成は使わない(VRT を決定的にする)
const meta: Meta<typeof Timeline> = {
    title: "DATA DISPLAY/Timeline",
    component: Timeline,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    // 見本を名前付きの <section>(region ランドマーク)で包み、axe の region ルール
    // (すべてのコンテンツがランドマークの中にあること)を満たす
    decorators: [
        (Story) => (
            <section aria-label="Timeline の見本">
                <Story />
            </section>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

// Timeline は width:full で親が幅を決める設計。スマホ幅のパネルに合わせて表示する
const PANEL_WIDTH = 358;

// もりぱダイアリーの 1 日分。時間帯(朝 / 昼 / 夜)ごとにまとめて表示する
interface DiaryEntry {
    time: string;
    dateTime: string;
    title: string;
    description?: string;
}

const DIARY: { label: string; entries: DiaryEntry[] }[] = [
    {
        label: "朝",
        entries: [
            { time: "05:00", dateTime: "2026-11-25T05:00", title: "穏やかな時間が流れていました ☁️" },
            {
                time: "07:30",
                dateTime: "2026-11-25T07:30",
                title: "朝市がにぎわっていました 🥕",
                description: "中央広場で 12 人がお買い物をしていたみたい。",
            },
        ],
    },
    {
        label: "昼",
        entries: [
            {
                time: "12:10",
                dateTime: "2026-11-25T12:10",
                title: "新しい仲間がやってきました 🎉",
                description: "はじめてのログインをみんなで歓迎しました。",
            },
            { time: "15:45", dateTime: "2026-11-25T15:45", title: "資源ワールドでダイヤが見つかりました 💎" },
        ],
    },
    {
        label: "夜",
        entries: [
            {
                time: "21:00",
                dateTime: "2026-11-25T21:00",
                title: "花火大会が開かれました 🎆",
                description: "海辺の街に 24 人が集まりました。",
            },
            { time: "23:30", dateTime: "2026-11-25T23:30", title: "静かな夜になりました 🌙" },
        ],
    },
];

// 1 件分の項目を描画する。点だけの Indicator と、文字の組み合わせの基本形
const renderEntry = (entry: DiaryEntry) => (
    <Timeline.Item key={entry.dateTime}>
        <Timeline.Indicator />
        <Timeline.Connector />
        <Timeline.Content>
            <Timeline.Time dateTime={entry.dateTime}>{entry.time}</Timeline.Time>
            <Timeline.Title>{entry.title}</Timeline.Title>
            {entry.description && <Timeline.Description>{entry.description}</Timeline.Description>}
        </Timeline.Content>
    </Timeline.Item>
);

// 時間帯の見出し。Timeline の外側に置き、時間帯ごとに Timeline.Root を分ける
const groupLabel = css({
    textStyle: "sm",
    fontWeight: "bold",
    color: "colorPalette.fg.muted",
    mb: "component.gap.sm",
});

export const Default: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Timeline.Root>{DIARY[0].entries.concat(DIARY[1].entries).map(renderEntry)}</Timeline.Root>
        </div>
    ),
};

// もりぱダイアリー: 朝 / 昼 / 夜の時間帯ごとに見出しを付けて並べる
export const Diary: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH, display: "flex", flexDirection: "column", gap: 24 }}>
            {DIARY.map((group) => (
                <section key={group.label}>
                    <h3 className={groupLabel}>{group.label}</h3>
                    <Timeline.Root>{group.entries.map(renderEntry)}</Timeline.Root>
                </section>
            ))}
        </div>
    ),
};

// 本文を枠付きのカードにする outline variant
export const Outline: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Timeline.Root variant="outline">
                {DIARY[2].entries.concat(DIARY[0].entries).map(renderEntry)}
            </Timeline.Root>
        </div>
    ),
};

// md と sm を、subtle / outline それぞれで並べて大きさを比較する
export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(2, ${PANEL_WIDTH}px)`, gap: 32 }}>
            {(["subtle", "outline"] as const).map((variant) =>
                (["md", "sm"] as const).map((size) => (
                    <Timeline.Root key={`${variant}-${size}`} variant={variant} size={size}>
                        {DIARY[1].entries.map(renderEntry)}
                    </Timeline.Root>
                )),
            )}
        </div>
    ),
};

// Indicator にアイコンを入れた例。点だけの項目と混ぜても縦線の位置は揃う
export const WithIcons: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Timeline.Root>
                <Timeline.Item>
                    <Timeline.Indicator>
                        <SunIcon />
                    </Timeline.Indicator>
                    <Timeline.Connector />
                    <Timeline.Content>
                        <Timeline.Time dateTime="2026-11-25T06:00">06:00</Timeline.Time>
                        <Timeline.Title>日が昇りました</Timeline.Title>
                    </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                    <Timeline.Indicator>
                        <PickaxeIcon />
                    </Timeline.Indicator>
                    <Timeline.Connector />
                    <Timeline.Content>
                        <Timeline.Time dateTime="2026-11-25T10:20">10:20</Timeline.Time>
                        <Timeline.Title>資源ワールドがリセットされました</Timeline.Title>
                        <Timeline.Description>次回のリセットは 12 月 25 日の予定です。</Timeline.Description>
                    </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                    <Timeline.Indicator />
                    <Timeline.Connector />
                    <Timeline.Content>
                        <Timeline.Time dateTime="2026-11-25T14:00">14:00</Timeline.Time>
                        <Timeline.Title>小雨が降りはじめました</Timeline.Title>
                    </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                    <Timeline.Indicator>
                        <CloudIcon />
                    </Timeline.Indicator>
                    <Timeline.Connector />
                    <Timeline.Content>
                        <Timeline.Time dateTime="2026-11-25T17:30">17:30</Timeline.Time>
                        <Timeline.Title>雲が晴れて夕焼けが見えました</Timeline.Title>
                    </Timeline.Content>
                </Timeline.Item>
                <Timeline.Item>
                    <Timeline.Indicator>
                        <MoonIcon />
                    </Timeline.Indicator>
                    <Timeline.Connector />
                    <Timeline.Content>
                        <Timeline.Time dateTime="2026-11-25T22:00">22:00</Timeline.Time>
                        <Timeline.Title>月がきれいな夜でした</Timeline.Title>
                    </Timeline.Content>
                </Timeline.Item>
            </Timeline.Root>
        </div>
    ),
};

// 参加したプレイヤーなどを Meta で本文の右端に表示する例
const ACTIVITIES = [
    {
        dateTime: "2026-11-25T09:00",
        time: "09:00",
        title: "_NIKOMARU さんがログインしました",
        description: "今日も森の手入れから始めるみたい。",
        player: { playerId: "f8b761ec-4a54-48eb-a040-c5604042bcc9", playerName: "_NIKOMARU" },
    },
    {
        dateTime: "2026-11-25T13:15",
        time: "13:15",
        title: "Yahirrro さんが土地を保護しました",
        description: "海辺に 32 × 32 ブロックの土地を確保しました。",
        player: { playerId: "75ba1a8c-4e02-4b4b-abe3-92ef4af6147c", playerName: "Yahirrro" },
    },
    {
        dateTime: "2026-11-25T19:40",
        time: "19:40",
        title: "Chocolatt さんがはじめて参加しました",
        player: { playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe", playerName: "Chocolatt" },
    },
];

export const WithMeta: Story = {
    args: { variant: "outline" },
    argTypes: {
        variant: { control: "select", options: ["subtle", "outline"] },
        size: { control: "select", options: ["sm", "md"] },
    },
    render: (args) => (
        <div style={{ width: PANEL_WIDTH }}>
            <Timeline.Root {...args}>
                {ACTIVITIES.map((activity, index) => (
                    <Timeline.Item key={activity.dateTime}>
                        <Timeline.Indicator>{index === ACTIVITIES.length - 1 && <UserPlusIcon />}</Timeline.Indicator>
                        <Timeline.Connector />
                        <Timeline.Content>
                            <Timeline.Time dateTime={activity.dateTime}>{activity.time}</Timeline.Time>
                            <Timeline.Title>{activity.title}</Timeline.Title>
                            {activity.description && (
                                <Timeline.Description>{activity.description}</Timeline.Description>
                            )}
                            <Timeline.Meta>
                                {/* プレイヤー名は Title に文字で出しているので、アバターは装飾として扱う */}
                                <PlayerAvatar {...activity.player} size="sm" decorative />
                            </Timeline.Meta>
                        </Timeline.Content>
                    </Timeline.Item>
                ))}
            </Timeline.Root>
        </div>
    ),
};

// colorPalette を umi に切り替えると、点・線・文字色がパレットに追従する
export const UmiPalette: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }} className={css({ colorPalette: "umi" })}>
            <Timeline.Root>{DIARY[2].entries.map(renderEntry)}</Timeline.Root>
        </div>
    ),
};
