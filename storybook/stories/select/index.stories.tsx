import type { Meta, StoryObj } from "@storybook/react";
import { type ReactNode, type Ref, useRef, useState } from "react";
import { css } from "styled-system/css";
import { Portal } from "../../../packages/react/src/components/portal";
import { createListCollection, Select } from "../../../packages/react/src/components/select";

const meta: Meta<typeof Select> = {
    title: "FORM/Select",
    component: Select,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

// layout: centered は flex コンテナで Root が縮んでしまうため、
// フォーム欄らしい横幅を story 側で確保する(375px でも収まる幅)
const fieldStyle = css({
    width: "72",
});

// 見本を名前付きの <form>(form ランドマーク)で包む。
// HiddenSelect が name/value を載せる送信先になるのと、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たすため
const Field = ({ children, ref }: { children: ReactNode; ref?: Ref<HTMLFormElement> }) => (
    <form ref={ref} className={fieldStyle} aria-label="路線の設定">
        {children}
    </form>
);

// Controlled で選択値を表示する行
const valueStyle = css({
    mt: "3",
    fontSize: "sm",
    color: "fg.muted",
});

// 路線の運営グループ。value は API 側の ID、label が表示名
const groups = createListCollection({
    items: [
        { label: "森の鉄道株式会社", value: "mori-railway" },
        { label: "うみのみち交通", value: "umi-transit" },
        { label: "北部開拓鉄道", value: "north-pioneer" },
        { label: "ずんだ急行", value: "zunda-express" },
        { label: "山手トンネル連絡線", value: "yamate-tunnel", disabled: true },
    ],
});

// 地域ごとにまとめた運営グループ。ItemGroup / ItemGroupLabel で見出しを付ける
const regionalGroups = createListCollection({
    items: [
        { label: "森の鉄道株式会社", value: "mori-railway", region: "本島" },
        { label: "ずんだ急行", value: "zunda-express", region: "本島" },
        { label: "うみのみち交通", value: "umi-transit", region: "離島" },
        { label: "北部開拓鉄道", value: "north-pioneer", region: "新大陸" },
        { label: "山手トンネル連絡線", value: "yamate-tunnel", region: "新大陸" },
    ],
    groupBy: (item) => item.region,
});

export const Default: Story = {
    render: () => (
        <Field>
            <Select.Root collection={groups} name="group">
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="選択してください" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
        </Field>
    ),
};

// テーブルのセルなど狭い場所向けの sm サイズ
export const Small: Story = {
    render: () => (
        <Field>
            <Select.Root collection={groups} size="sm" defaultValue={["umi-transit"]}>
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="選択してください" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
        </Field>
    ),
};

// 地域ごとに ItemGroup で区切った例。collection の groupBy でグループを取り出す
export const WithGroups: Story = {
    render: () => (
        <Field>
            <Select.Root collection={regionalGroups}>
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="地域から選ぶのだ" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {regionalGroups.group().map(([region, items]) => (
                                <Select.ItemGroup key={region}>
                                    <Select.ItemGroupLabel>{region}</Select.ItemGroupLabel>
                                    {items.map((item) => (
                                        <Select.Item key={item.value} item={item}>
                                            <Select.ItemText>{item.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.ItemGroup>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
        </Field>
    ),
};

// 編集権限が無いときなど、操作できない状態
export const Disabled: Story = {
    render: () => (
        <Field>
            <Select.Root collection={groups} defaultValue={["mori-railway"]} disabled>
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="選択してください" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
        </Field>
    ),
};

// バリデーションに失敗した状態。invalid で枠線がエラー色になる
export const Invalid: Story = {
    render: () => (
        <Field>
            <Select.Root collection={groups} invalid required>
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="選択してください" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
        </Field>
    ),
};

// useState で値を制御する例。ClearTrigger で未選択に戻せる
const ControlledExample = () => {
    const [value, setValue] = useState<string[]>(["zunda-express"]);
    const selected = groups.items.find((item) => item.value === value[0]);

    return (
        <Field>
            <Select.Root collection={groups} value={value} onValueChange={(details) => setValue(details.value)}>
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="選択してください" />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.ClearTrigger />
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
            <p className={valueStyle}>選択中: {selected ? `${selected.label} (${selected.value})` : "なし"}</p>
        </Field>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};

// multiple で複数選択にした例。zag が multiple のときだけ closeOnSelect を false にするので、
// 項目を選んでも一覧は開いたままになり、続けて選び足せる。
// ValueText は選択中のラベルをカンマでつないで表示し、あふれた分は省略記号で切る
const MultipleExample = () => {
    const [value, setValue] = useState<string[]>(["mori-railway", "umi-transit"]);
    const selected = groups.items.filter((item) => value.includes(item.value));

    return (
        <Field>
            <Select.Root
                collection={groups}
                multiple
                name="groups"
                value={value}
                onValueChange={(details) => setValue(details.value)}
            >
                <Select.Label>運営グループ(複数選択)</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="1 つ以上選んでください" />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.ClearTrigger />
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
            <p className={valueStyle}>
                選択中: {selected.length > 0 ? selected.map((item) => item.label).join("、") : "なし"}
            </p>
        </Field>
    );
};

export const Multiple: Story = {
    render: () => <MultipleExample />,
};

// 一覧を開いた状態。VRT で Content の見た目を固定するために defaultOpen にしている。
// Portal は既定で document.body 直下に描画するため、開きっぱなしの Content が form ランドマークの
// 外に出てしまい axe の region ルールに引っかかる。container で描画先を form の中に変えている
const OpenExample = () => {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Field ref={formRef}>
            <Select.Root collection={groups} defaultValue={["north-pioneer"]} defaultOpen>
                <Select.Label>運営グループ</Select.Label>
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="選択してください" />
                        <Select.Indicator />
                    </Select.Trigger>
                </Select.Control>
                <Portal container={formRef}>
                    <Select.Positioner>
                        <Select.Content>
                            {groups.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
                <Select.HiddenSelect />
            </Select.Root>
        </Field>
    );
};

export const Open: Story = {
    render: () => <OpenExample />,
};
