import type { Meta, StoryObj } from "@storybook/react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";
import { Tabs } from "../../../packages/react/src/components/tabs";

const meta: Meta<typeof Tabs> = {
    title: "DISCLOSURE/Tabs",
    component: Tabs,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// layout: centered は flex コンテナで Root が縮んでしまうため、見本の横幅を story 側で確保する(375px でも収まる幅)
const panelStyle = css({
    width: "80",
});

// 見本を名前付きの <section>(region ランドマーク)で包む。
// タブはフォーム部品ではないので <form> ではなく section を使い、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たす
const Section = ({ label, children }: { label: string; children: ReactNode }) => (
    <section className={panelStyle} aria-label={label}>
        {children}
    </section>
);

// 見本を縦に並べる
const stackStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "8",
});

// variant / size の見出し
const captionStyle = css({
    mb: "2",
    fontSize: "xs",
    color: "fg.muted",
});

// Controlled で選択値を表示する行
const valueStyle = css({
    mt: "3",
    fontSize: "sm",
    color: "fg.muted",
});

// 口座画面のタブ。value は URL のクエリなどに載せる ID、label が表示名
const items = [
    { value: "send", label: "送る", body: "送りたい相手を選んで、ずんだもちを送れるのだ。" },
    { value: "record", label: "記録", body: "これまでの入出金の履歴をまとめて確認できるのだ。" },
    { value: "save", label: "貯める", body: "毎月こつこつ貯金して、目標額を目指せるのだ。" },
];

// タブ列とパネルをまとめて描く。各 story で同じ中身を使い回す
const TabsBody = ({ disabledValue }: { disabledValue?: string }) => (
    <>
        <Tabs.List>
            {items.map((item) => (
                <Tabs.Trigger key={item.value} value={item.value} disabled={item.value === disabledValue}>
                    {item.label}
                </Tabs.Trigger>
            ))}
            <Tabs.Indicator />
        </Tabs.List>
        {items.map((item) => (
            <Tabs.Content key={item.value} value={item.value}>
                {item.body}
            </Tabs.Content>
        ))}
    </>
);

export const Default: Story = {
    render: () => (
        <Section label="口座のメニュー">
            <Tabs.Root defaultValue="send">
                <TabsBody />
            </Tabs.Root>
        </Section>
    ),
};

// line(下線)と enclosed(白い枠の中で選択中を塗る)の比較
export const Variants: Story = {
    render: () => (
        <Section label="タブの見せ方">
            <div className={stackStyle}>
                {(["line", "enclosed"] as const).map((variant) => (
                    <div key={variant}>
                        <p className={captionStyle}>{variant}</p>
                        <Tabs.Root variant={variant} defaultValue="send">
                            <TabsBody />
                        </Tabs.Root>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

// sm / md の比較。高さは Button / Select の control.sm / control.md に揃う
export const Sizes: Story = {
    render: () => (
        <Section label="タブの大きさ">
            <div className={stackStyle}>
                {(["line", "enclosed"] as const).flatMap((variant) =>
                    (["sm", "md"] as const).map((size) => (
                        <div key={`${variant}-${size}`}>
                            <p className={captionStyle}>
                                {variant} / {size}
                            </p>
                            <Tabs.Root variant={variant} size={size} defaultValue="send">
                                <TabsBody />
                            </Tabs.Root>
                        </div>
                    )),
                )}
            </div>
        </Section>
    ),
};

// 縦並び。タブ列が左に縦に並び、パネルはその右に置かれる。矢印キーは上下で移動する
export const Vertical: Story = {
    render: () => (
        <Section label="縦並びのタブ">
            <div className={stackStyle}>
                {(["line", "enclosed"] as const).map((variant) => (
                    <div key={variant}>
                        <p className={captionStyle}>{variant}</p>
                        <Tabs.Root variant={variant} orientation="vertical" defaultValue="send">
                            <TabsBody />
                        </Tabs.Root>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

// 一部のタブを無効にする。矢印キーでの移動でも飛ばされる
export const Disabled: Story = {
    render: () => (
        <Section label="無効なタブを含むメニュー">
            <div className={stackStyle}>
                {(["line", "enclosed"] as const).map((variant) => (
                    <div key={variant}>
                        <p className={captionStyle}>{variant}</p>
                        <Tabs.Root variant={variant} defaultValue="send">
                            <TabsBody disabledValue="save" />
                        </Tabs.Root>
                    </div>
                ))}
            </div>
        </Section>
    ),
};

// 選択中の value を外側の state で持つ。Ark v5 の onValueChange は details オブジェクトを渡す
const ControlledExample = () => {
    const [value, setValue] = useState("record");
    return (
        <Section label="選択中のタブを外から管理するメニュー">
            <Tabs.Root value={value} onValueChange={(details) => setValue(details.value)}>
                <TabsBody />
            </Tabs.Root>
            <p className={valueStyle}>選択中: {value}</p>
        </Section>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};
