import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";
import { Field, Input } from "../../../packages/react/src/components/field";
import { Portal } from "../../../packages/react/src/components/portal";
import { createListCollection, Select } from "../../../packages/react/src/components/select";

const meta: Meta<typeof Field> = {
    title: "FORM/Field",
    component: Field,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Field>;

// 見本を名前付きの <form>(form ランドマーク)で包む。
// axe の region ルール(すべてのコンテンツがランドマークの中にあること)を満たすためと、
// layout: centered の flex コンテナで Root が縮まないようフォーム欄らしい横幅を確保するため
const formStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    width: "80",
});

const Form = ({ children, label = "駅の設定" }: { children: ReactNode; label?: string }) => (
    <form className={formStyle} aria-label={label} onSubmit={(event) => event.preventDefault()}>
        {children}
    </form>
);

/**
 * 基本形。ラベル + 入力欄 + 補足テキスト。
 * Label は Ark が htmlFor で Input と関連付け、HelperText は aria-describedby に入る
 */
export const Default: Story = {
    render: () => (
        <Form>
            <Field.Root>
                <Field.Label>駅名</Field.Label>
                <Field.Input name="station" placeholder="北森野駅" />
                <Field.HelperText>路線図と案内板に表示される名前なのだ</Field.HelperText>
            </Field.Root>
        </Form>
    ),
};

// sm / md を並べる。Select / Button と同じ高さのスケール
export const Sizes: Story = {
    render: () => (
        <Form>
            <Field.Root size="sm">
                <Field.Label>駅名(sm)</Field.Label>
                <Field.Input defaultValue="北森野駅" />
                <Field.HelperText>表のセルなど狭い場所向けなのだ</Field.HelperText>
            </Field.Root>
            <Field.Root size="md">
                <Field.Label>駅名(md)</Field.Label>
                <Field.Input defaultValue="北森野駅" />
                <Field.HelperText>単独で置くときの標準サイズなのだ</Field.HelperText>
            </Field.Root>
        </Form>
    ),
};

// 必須項目。RequiredIndicator は Root が required のときだけ「*」を表示する
export const Required: Story = {
    render: () => (
        <Form>
            <Field.Root required>
                <Field.Label>
                    駅名
                    <Field.RequiredIndicator />
                </Field.Label>
                <Field.Input name="station" placeholder="北森野駅" />
                <Field.HelperText>必須の項目なのだ</Field.HelperText>
            </Field.Root>
        </Form>
    ),
};

// バリデーションに失敗した状態。枠線がエラー色になり、ErrorText が表示される
export const Invalid: Story = {
    render: () => (
        <Form>
            <Field.Root invalid required>
                <Field.Label>
                    駅名
                    <Field.RequiredIndicator />
                </Field.Label>
                <Field.Input name="station" defaultValue="北森野駅!!" />
                <Field.ErrorText>駅名に記号は使えないのだ</Field.ErrorText>
            </Field.Root>
            <Field.Root invalid size="sm">
                <Field.Label>駅番号(sm)</Field.Label>
                <Field.Input name="code" placeholder="M-01" />
                <Field.ErrorText>駅番号を入力してほしいのだ</Field.ErrorText>
            </Field.Root>
        </Form>
    ),
};

// 無効: 保存中や権限が無いときなど、操作できない状態
export const Disabled: Story = {
    render: () => (
        <Form>
            <Field.Root disabled>
                <Field.Label>駅名</Field.Label>
                <Field.Input defaultValue="北森野駅" />
                <Field.HelperText>管理者だけが変更できるのだ</Field.HelperText>
            </Field.Root>
            <Field.Root disabled>
                <Field.Label>駅番号</Field.Label>
                <Field.Input placeholder="M-01" />
            </Field.Root>
        </Form>
    ),
};

// 読み取り専用: 値はコピーできるが書き換えられない
export const ReadOnly: Story = {
    render: () => (
        <Form>
            <Field.Root readOnly>
                <Field.Label>駅 ID</Field.Label>
                <Field.Input defaultValue="kita-morino-station" />
                <Field.HelperText>ID は作成後に変更できないのだ</Field.HelperText>
            </Field.Root>
        </Form>
    ),
};

// 複数行の入力。Textarea も Input と同じ見た目・状態を持つ
export const Textarea: Story = {
    render: () => (
        <Form>
            <Field.Root>
                <Field.Label>駅の説明</Field.Label>
                <Field.Textarea placeholder="森の入り口にある小さな駅なのだ" />
                <Field.HelperText>200 文字まで入力できるのだ</Field.HelperText>
            </Field.Root>
            <Field.Root invalid>
                <Field.Label>駅の説明</Field.Label>
                <Field.Textarea defaultValue="ずんだ" />
                <Field.ErrorText>10 文字以上で書いてほしいのだ</Field.ErrorText>
            </Field.Root>
        </Form>
    ),
};

// ラベルの要らない場所では Input を単体で使う。size / invalid は Input 自身に渡す。
// ラベルが無いぶん aria-label で何の入力欄かを伝える
export const Standalone: Story = {
    render: () => (
        <Form label="駅の検索">
            <Input aria-label="駅を検索" placeholder="駅名で検索" />
            <Input aria-label="駅番号" size="sm" placeholder="M-01" />
            <Input aria-label="駅番号(エラー)" size="sm" invalid defaultValue="M-XX" />
        </Form>
    ),
};

// 検索欄のようにアイコンを添える例。アイコンの置き方は利用側に任せ、Input には余白だけ足す
const searchStyle = css({
    position: "relative",
    "& > svg": {
        position: "absolute",
        insetStart: "3.5",
        top: "50%",
        transform: "translateY(-50%)",
        width: "icon.sm",
        height: "icon.sm",
        color: "colorPalette.fg.muted",
        pointerEvents: "none",
    },
});

export const WithIcon: Story = {
    render: () => (
        <Form label="駅の検索">
            <div className={searchStyle}>
                <SearchIcon aria-hidden />
                <Input aria-label="駅を検索" placeholder="駅名で検索" className={css({ ps: "10" })} />
            </div>
        </Form>
    ),
};

// Select と横に並べたときに、高さ・枠線・角丸が揃うことを確認する見本
const rowStyle = css({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4",
    alignItems: "start",
    width: "full",
});

const lines = createListCollection({
    items: [
        { label: "森野環状線", value: "morino-loop" },
        { label: "うみのみち線", value: "umi-line" },
    ],
});

export const WithSelect: Story = {
    render: () => (
        <form className={css({ width: "xl" })} aria-label="駅の設定">
            {(["md", "sm"] as const).map((size) => (
                <div key={size} className={css({ mb: "6" })}>
                    <div className={rowStyle}>
                        <Field.Root size={size}>
                            <Field.Label>駅名({size})</Field.Label>
                            <Field.Input defaultValue="北森野駅" />
                        </Field.Root>
                        <Select.Root collection={lines} size={size} defaultValue={["morino-loop"]}>
                            <Select.Label>路線({size})</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="選択してください" />
                                    <Select.Indicator />
                                </Select.Trigger>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {lines.items.map((item) => (
                                            <Select.Item key={item.value} item={item}>
                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </div>
                </div>
            ))}
        </form>
    ),
};

// useState で値を制御し、入力内容からその場でエラーを出し分ける例
const ControlledExample = () => {
    const [value, setValue] = useState("北森野駅");
    // 空欄はエラーにする
    const invalid = value.trim() === "";

    return (
        <Form>
            <Field.Root invalid={invalid} required>
                <Field.Label>
                    駅名
                    <Field.RequiredIndicator />
                </Field.Label>
                <Field.Input value={value} onChange={(event) => setValue(event.target.value)} />
                <Field.HelperText>空にするとエラーになるのだ</Field.HelperText>
                <Field.ErrorText>駅名を入力してほしいのだ</Field.ErrorText>
            </Field.Root>
        </Form>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};
