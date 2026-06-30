import type { Meta, StoryObj } from "@storybook/react";
import { List } from "../../../packages/react/src/components/list";

const meta: Meta<typeof List> = {
    title: "COMPONENTS/List",
    component: List,
    parameters: {
        layout: "centered",
        design: {
            type: "figma",
            url: "https://www.figma.com/design/bLFItyZuAZLUHnceC1EBJI/app.morino.party?node-id=197-1926&m=dev",
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof List>;

// List は width:full で親が幅を決める設計。Figma の 358px に合わせて表示する
const PANEL_WIDTH = 358;

export const Default: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <List.Root>
                <List.Item>誰かに送る</List.Item>
                <List.Item>口座の記録</List.Item>
                <List.Item>貯める</List.Item>
            </List.Root>
        </div>
    ),
};

// 一回り小さい sm サイズ
export const Small: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <List.Root size="sm">
                <List.Item>誰かに送る</List.Item>
                <List.Item>口座の記録</List.Item>
                <List.Item>貯める</List.Item>
            </List.Root>
        </div>
    ),
};

// md と sm を並べて大きさを比較する
export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ width: PANEL_WIDTH }}>
                <List.Root size="md">
                    <List.Item>誰かに送る</List.Item>
                    <List.Item>口座の記録</List.Item>
                    <List.Item>貯める</List.Item>
                </List.Root>
            </div>
            <div style={{ width: PANEL_WIDTH }}>
                <List.Root size="sm">
                    <List.Item>誰かに送る</List.Item>
                    <List.Item>口座の記録</List.Item>
                    <List.Item>貯める</List.Item>
                </List.Root>
            </div>
        </div>
    ),
};

// 行をクリックできることを示すサンプル
export const Clickable: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <List.Root>
                <List.Item onClick={() => alert("誰かに送る")}>誰かに送る</List.Item>
                <List.Item onClick={() => alert("口座の記録")}>口座の記録</List.Item>
                <List.Item onClick={() => alert("貯める")}>貯める</List.Item>
            </List.Root>
        </div>
    ),
};

// disabled な行を含むサンプル
export const WithDisabled: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <List.Root>
                <List.Item>誰かに送る</List.Item>
                <List.Item disabled>口座の記録</List.Item>
                <List.Item>貯める</List.Item>
            </List.Root>
        </div>
    ),
};
