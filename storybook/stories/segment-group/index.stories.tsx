import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGridIcon, ListIcon, MapIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";
import { SegmentGroup, type SegmentGroupSize } from "../../../packages/react/src/components/segment-group";

const meta: Meta<typeof SegmentGroup> = {
    title: "FORM/SegmentGroup",
    component: SegmentGroup,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SegmentGroup>;

// 見本を名前付きの <form>(form ランドマーク)で包む。
// ItemHiddenInput が name/value を載せる送信先になるのと、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たすため
const formStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "6",
});

const Form = ({ children, label = "表示の設定" }: { children: ReactNode; label?: string }) => (
    <form className={formStyle} aria-label={label} onSubmit={(event) => event.preventDefault()}>
        {children}
    </form>
);

// 地図の表示期間。value は API 側の ID、label が表示名
const periods = [
    { label: "今日", value: "day" },
    { label: "今週", value: "week" },
    { label: "今月", value: "month" },
    { label: "全期間", value: "all" },
];

// 選択肢を並べる共通部分。disabledValues に入れた項目だけ選べなくする
const PeriodItems = ({ disabledValues = [] }: { disabledValues?: string[] }) => (
    <SegmentGroup.Control>
        <SegmentGroup.Indicator />
        {periods.map((period) => (
            <SegmentGroup.Item key={period.value} value={period.value} disabled={disabledValues.includes(period.value)}>
                <SegmentGroup.ItemText>{period.label}</SegmentGroup.ItemText>
                <SegmentGroup.ItemControl />
                <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
        ))}
    </SegmentGroup.Control>
);

/**
 * 基本形。Label が Root(role="radiogroup")の名前になる。
 * 矢印キーで選択肢を移動でき、選択中の項目の下を Indicator が滑る
 */
export const Default: Story = {
    render: () => (
        <Form>
            <SegmentGroup.Root name="period" defaultValue="week">
                <SegmentGroup.Label>集計期間</SegmentGroup.Label>
                <PeriodItems />
            </SegmentGroup.Root>
        </Form>
    ),
};

// sm / md を並べる。Select / Field / Button と同じ高さのスケール
export const Sizes: Story = {
    render: () => (
        <Form>
            {(["sm", "md"] satisfies SegmentGroupSize[]).map((size) => (
                <SegmentGroup.Root key={size} size={size} name={`period-${size}`} defaultValue="week">
                    <SegmentGroup.Label>集計期間({size})</SegmentGroup.Label>
                    <PeriodItems />
                </SegmentGroup.Root>
            ))}
        </Form>
    ),
};

// 一部の項目だけ無効にする場合と、グループ全体を無効にする場合
export const Disabled: Story = {
    render: () => (
        <Form>
            <SegmentGroup.Root name="period-item-disabled" defaultValue="week">
                <SegmentGroup.Label>集計期間(全期間は準備中)</SegmentGroup.Label>
                <PeriodItems disabledValues={["all"]} />
            </SegmentGroup.Root>
            <SegmentGroup.Root name="period-disabled" defaultValue="week" disabled>
                <SegmentGroup.Label>集計期間(すべて無効)</SegmentGroup.Label>
                <PeriodItems />
            </SegmentGroup.Root>
        </Form>
    ),
};

// エラー状態。Root の invalid でトラックの枠線が赤くなる。理由は近くの文章で伝える
export const Invalid: Story = {
    render: () => (
        <Form>
            <SegmentGroup.Root name="period-invalid" invalid>
                <SegmentGroup.Label>集計期間(未選択)</SegmentGroup.Label>
                <PeriodItems />
            </SegmentGroup.Root>
        </Form>
    ),
};

// 表示の切り替え。アイコンは ItemText と並べて Item の直下に置く(svg は 1em に揃う)
const views = [
    { label: "一覧", value: "list", icon: <ListIcon aria-hidden /> },
    { label: "グリッド", value: "grid", icon: <LayoutGridIcon aria-hidden /> },
    { label: "地図", value: "map", icon: <MapIcon aria-hidden /> },
];

export const WithIcons: Story = {
    render: () => (
        <Form>
            <SegmentGroup.Root name="view" defaultValue="grid">
                <SegmentGroup.Label>表示形式</SegmentGroup.Label>
                <SegmentGroup.Control>
                    <SegmentGroup.Indicator />
                    {views.map((view) => (
                        <SegmentGroup.Item key={view.value} value={view.value}>
                            {view.icon}
                            <SegmentGroup.ItemText>{view.label}</SegmentGroup.ItemText>
                            <SegmentGroup.ItemControl />
                            <SegmentGroup.ItemHiddenInput />
                        </SegmentGroup.Item>
                    ))}
                </SegmentGroup.Control>
            </SegmentGroup.Root>
        </Form>
    ),
};

// Controlled で選択値を表示する行
const valueStyle = css({
    fontSize: "sm",
    color: "fg.muted",
});

// 選択値を親の state で持つ例。onValueChange の details.value は未選択のとき null になる
const ControlledExample = () => {
    const [value, setValue] = useState<string | null>("month");
    return (
        <Form>
            <SegmentGroup.Root
                name="period-controlled"
                value={value}
                onValueChange={(details) => setValue(details.value)}
            >
                <SegmentGroup.Label>集計期間</SegmentGroup.Label>
                <PeriodItems />
            </SegmentGroup.Root>
            <p className={valueStyle}>選択中: {value ?? "なし"}</p>
        </Form>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};
