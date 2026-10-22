import type { Meta, StoryObj } from "@storybook/react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";
import { RadioGroup, type RadioGroupSize } from "../../../packages/react/src/components/radio-group";

const meta: Meta<typeof RadioGroup> = {
    title: "FORM/RadioGroup",
    component: RadioGroup,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// 見本を名前付きの <form>(form ランドマーク)で包む。
// ItemHiddenInput が name/value を載せる送信先になるのと、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たすため
const formStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    width: "80",
});

const Form = ({ children, label = "列車の設定" }: { children: ReactNode; label?: string }) => (
    <form className={formStyle} aria-label={label} onSubmit={(event) => event.preventDefault()}>
        {children}
    </form>
);

// 列車の種別。value は API 側の ID、label が表示名
const trainTypes = [
    { label: "各駅停車", value: "local" },
    { label: "快速", value: "rapid" },
    { label: "急行", value: "express" },
    { label: "特急", value: "limited-express" },
];

// 選択肢を並べる。各 Item に丸・文字・送信用の input を置く
const Items = ({ disabledValue }: { disabledValue?: string }) =>
    trainTypes.map((item) => (
        <RadioGroup.Item key={item.value} value={item.value} disabled={item.value === disabledValue}>
            <RadioGroup.ItemControl />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
            <RadioGroup.ItemHiddenInput />
        </RadioGroup.Item>
    ));

// 基本形。縦に並べ、最初の項目を選んでおく
export const Default: Story = {
    render: () => (
        <Form>
            <RadioGroup.Root name="train-type" defaultValue="local">
                <RadioGroup.Label>列車の種別</RadioGroup.Label>
                <Items />
            </RadioGroup.Root>
        </Form>
    ),
};

// 項目を横に並べる。入りきらない分は折り返す
export const Horizontal: Story = {
    render: () => (
        <Form>
            <RadioGroup.Root name="train-type" orientation="horizontal" defaultValue="rapid">
                <RadioGroup.Label>列車の種別</RadioGroup.Label>
                <Items />
            </RadioGroup.Root>
        </Form>
    ),
};

// sm / md を並べる。Select / Field と同じ文字サイズのスケール
export const Sizes: Story = {
    render: () => (
        <Form>
            {(["sm", "md"] as RadioGroupSize[]).map((size) => (
                <RadioGroup.Root key={size} name={`train-type-${size}`} size={size} defaultValue="express">
                    <RadioGroup.Label>列車の種別({size})</RadioGroup.Label>
                    <Items />
                </RadioGroup.Root>
            ))}
        </Form>
    ),
};

// 一部の項目だけ無効にする例と、グループ全体を無効にする例
export const Disabled: Story = {
    render: () => (
        <Form>
            <RadioGroup.Root name="train-type-item" defaultValue="local">
                <RadioGroup.Label>列車の種別(特急は運休中)</RadioGroup.Label>
                <Items disabledValue="limited-express" />
            </RadioGroup.Root>
            <RadioGroup.Root name="train-type-group" defaultValue="rapid" disabled>
                <RadioGroup.Label>列車の種別(変更できない)</RadioGroup.Label>
                <Items />
            </RadioGroup.Root>
        </Form>
    ),
};

// エラーメッセージ。ラジオボタンの丸の赤い枠線と合わせてエラーを伝える
const errorStyle = css({
    mt: "1.5",
    fontSize: "sm",
    color: "fg.error",
});

// 未選択のまま送信しようとしたときなど、エラー状態の見た目
export const Invalid: Story = {
    render: () => (
        <Form>
            <div>
                <RadioGroup.Root name="train-type" invalid aria-describedby="train-type-error">
                    <RadioGroup.Label>列車の種別</RadioGroup.Label>
                    <Items />
                </RadioGroup.Root>
                <p id="train-type-error" className={errorStyle}>
                    種別を選ぶのだ
                </p>
            </div>
        </Form>
    ),
};

// 選択中の値を表示する行
const valueStyle = css({
    fontSize: "sm",
    color: "fg.muted",
});

// 選択値を外側の state で持つ例
const ControlledExample = () => {
    const [value, setValue] = useState<string | null>("express");
    return (
        <Form>
            <RadioGroup.Root name="train-type" value={value} onValueChange={(details) => setValue(details.value)}>
                <RadioGroup.Label>列車の種別</RadioGroup.Label>
                <Items />
            </RadioGroup.Root>
            <p className={valueStyle}>選択中: {value ?? "なし"}</p>
        </Form>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};
