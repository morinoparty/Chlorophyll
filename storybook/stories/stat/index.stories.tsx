import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Card } from "../../../packages/react/src/components/card";
import { PlayerAvatar } from "../../../packages/react/src/components/player-avatar";
import { Stat } from "../../../packages/react/src/components/stat";

// 数値は桁区切り済みの固定文字列で渡し、toLocaleString() やランダム生成は使わない(VRT を決定的にする)
const meta: Meta<typeof Stat> = {
    title: "DATA DISPLAY/Stat",
    component: Stat,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    // 見本を名前付きの <section>(region ランドマーク)で包み、axe の region ルール
    // (すべてのコンテンツがランドマークの中にあること)を満たす
    decorators: [
        (Story) => (
            <section aria-label="Stat の見本">
                <Story />
            </section>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Stat>;

// Group の帯はスマホ幅のパネルに合わせて表示する
const PANEL_WIDTH = 358;

// プレイヤープロフィールに並べる統計値。unit が無いものは数値だけを表示する
interface PlayerStat {
    label: string;
    value: string;
    unit?: string;
    helpText?: string;
}

const PLAYER_STATS: PlayerStat[] = [
    { label: "どんぐり", value: "12,480", helpText: "先週より +1,320" },
    { label: "保護ブロック", value: "1,240", helpText: "残り 760 ブロック" },
    { label: "プレイ", value: "512", unit: "時間", helpText: "今月 38 時間" },
    { label: "連続投票", value: "7", unit: "日", helpText: "自己ベスト 14 日" },
];

// 1 つ分の Stat を描画する。helpText を出すかどうかを切り替えられるようにする
const renderStat = (item: PlayerStat, withHelpText = false) => (
    <Stat.Root key={item.label}>
        <Stat.Label>{item.label}</Stat.Label>
        <Stat.Value>
            {item.value}
            {item.unit && <Stat.Unit>{item.unit}</Stat.Unit>}
        </Stat.Value>
        {withHelpText && item.helpText && <Stat.HelpText>{item.helpText}</Stat.HelpText>}
    </Stat.Root>
);

// 基本形: ラベルと数値だけ
export const Default: Story = {
    args: { size: "md", align: "start" },
    argTypes: {
        size: { control: "select", options: ["sm", "md", "lg"] },
        align: { control: "select", options: ["start", "center"] },
    },
    render: (args) => (
        <Stat.Root {...args}>
            <Stat.Label>どんぐり</Stat.Label>
            <Stat.Value>12,480</Stat.Value>
        </Stat.Root>
    ),
};

// 数値の横に単位を小さく添える例(プレイ時間 / 連続投票日数)
export const WithUnit: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 48 }}>
            {renderStat(PLAYER_STATS[2])}
            {renderStat(PLAYER_STATS[3])}
        </div>
    ),
};

// 数値の下に前回比などの補足を出す例
export const WithHelpText: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 48 }}>
            {renderStat(PLAYER_STATS[0], true)}
            {renderStat(PLAYER_STATS[3], true)}
        </div>
    ),
};

// 比較用の各パネルに付ける「size / align」の見出し
const panelCaption = css({
    textStyle: "xs",
    color: "colorPalette.fg.muted",
    mb: "component.gap.sm",
});

// sm / md / lg の大きさを並べて比較する
export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
            {(["sm", "md", "lg"] as const).map((size) => (
                // どのパネルがどの大きさかを見出しで示す(VRT の差分確認でも見分けられるように)
                <figure key={size} style={{ margin: 0 }}>
                    <figcaption className={panelCaption}>{size}</figcaption>
                    <Stat.Root size={size}>
                        <Stat.Label>プレイ</Stat.Label>
                        <Stat.Value>
                            512
                            <Stat.Unit>時間</Stat.Unit>
                        </Stat.Value>
                        <Stat.HelpText>今月 38 時間</Stat.HelpText>
                    </Stat.Root>
                </figure>
            ))}
        </div>
    ),
};

// start / center の揃え方を比較する。center は Value の中の数値と単位もまとめて中央に寄る
export const Align: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
            {(["start", "center"] as const).map((align) => (
                <figure key={align} style={{ margin: 0, width: 160 }}>
                    <figcaption className={panelCaption}>{align}</figcaption>
                    <Stat.Root align={align}>
                        <Stat.Label>連続投票</Stat.Label>
                        <Stat.Value>
                            7<Stat.Unit>日</Stat.Unit>
                        </Stat.Value>
                        <Stat.HelpText>自己ベスト 14 日</Stat.HelpText>
                    </Stat.Root>
                </figure>
            ))}
        </div>
    ),
};

// プロフィールの統計の帯: Group で横一列に並べ、間に縦の区切り線を引く。
// size / align は Group に 1 回だけ渡し、子の Stat.Root に引き継がせる
export const Group: Story = {
    args: { size: "sm", align: "center" },
    argTypes: {
        size: { control: "select", options: ["sm", "md", "lg"] },
        align: { control: "select", options: ["start", "center"] },
    },
    render: (args) => (
        <div style={{ width: PANEL_WIDTH }}>
            <Stat.Group size={args.size} align={args.align}>
                {PLAYER_STATS.map((item) => renderStat(item))}
            </Stat.Group>
        </div>
    ),
};

// Group を start 揃え・md で、補足付きの 3 項目を並べる例(ダッシュボードの概要など)
export const GroupWithHelpText: Story = {
    render: () => (
        <div style={{ width: 560 }}>
            <Stat.Group>{PLAYER_STATS.slice(0, 3).map((item) => renderStat(item, true))}</Stat.Group>
        </div>
    ),
};

// プロフィールのアバターと名前の下に置く使い方
const profileHeader = css({
    display: "flex",
    alignItems: "center",
    gap: "component.gap.md",
});

const profileName = css({
    textStyle: "lg",
    fontWeight: "bold",
    color: "colorPalette.fg",
});

export const InProfileCard: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Card.Root>
                <Card.Body className={css({ display: "flex", flexDirection: "column", gap: "component.gap.lg" })}>
                    <div className={profileHeader}>
                        {/* プレイヤー名は隣に文字で出しているので、アバターは装飾として扱う */}
                        <PlayerAvatar
                            playerId="f8b761ec-4a54-48eb-a040-c5604042bcc9"
                            playerName="_NIKOMARU"
                            size="md"
                            decorative
                        />
                        <p className={profileName}>_NIKOMARU</p>
                    </div>
                    <Stat.Group size="sm" align="center">
                        {PLAYER_STATS.map((item) => renderStat(item))}
                    </Stat.Group>
                </Card.Body>
            </Card.Root>
        </div>
    ),
};

// colorPalette を umi に切り替えると、文字色がパレットに追従する
export const UmiPalette: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }} className={css({ colorPalette: "umi" })}>
            <Stat.Group size="sm" align="center">
                {PLAYER_STATS.map((item) => renderStat(item))}
            </Stat.Group>
        </div>
    ),
};
