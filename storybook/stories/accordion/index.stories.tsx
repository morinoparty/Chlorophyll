import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "../../../packages/react/src/components/accordion";

const meta: Meta<typeof Accordion> = {
    title: "COMPONENTS/Accordion",
    component: Accordion,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// Accordion は width:full で親が幅を決める設計
const PANEL_WIDTH = 400;

const items = [
    { value: "send", title: "誰かに送る", body: "送りたい相手を選んで、ずんだもちを送れるのだ。" },
    { value: "record", title: "口座の記録", body: "これまでの入出金の履歴をまとめて確認できるのだ。" },
    { value: "save", title: "貯める", body: "毎月こつこつ貯金して、目標額を目指せるのだ。" },
];

export const Default: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Accordion.Root defaultValue={["send"]} collapsible>
                {items.map((item) => (
                    <Accordion.Item key={item.value} value={item.value}>
                        <Accordion.ItemTrigger>{item.title}</Accordion.ItemTrigger>
                        <Accordion.ItemContent>{item.body}</Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </div>
    ),
};

// 複数の項目を同時に開ける
export const Multiple: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Accordion.Root multiple defaultValue={["send", "save"]}>
                {items.map((item) => (
                    <Accordion.Item key={item.value} value={item.value}>
                        <Accordion.ItemTrigger>{item.title}</Accordion.ItemTrigger>
                        <Accordion.ItemContent>{item.body}</Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </div>
    ),
};

// disabled な項目を含む
export const WithDisabled: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Accordion.Root collapsible>
                {items.map((item, index) => (
                    <Accordion.Item key={item.value} value={item.value} disabled={index === 1}>
                        <Accordion.ItemTrigger>{item.title}</Accordion.ItemTrigger>
                        <Accordion.ItemContent>{item.body}</Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </div>
    ),
};
