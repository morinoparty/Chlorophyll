import type { Meta, StoryObj } from "@storybook/react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";
import { Checkbox, type CheckboxCheckedState } from "../../../packages/react/src/components/checkbox";

const meta: Meta<typeof Checkbox> = {
    title: "FORM/Checkbox",
    component: Checkbox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// 見本を名前付きの <form>(form ランドマーク)で包む。
// HiddenInput が name/value を載せる送信先になるのと、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たすため
const formStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4",
});

const Form = ({ children, label = "通知の設定" }: { children: ReactNode; label?: string }) => (
    <form className={formStyle} aria-label={label} onSubmit={(event) => event.preventDefault()}>
        {children}
    </form>
);

// グループの見出し。Checkbox.Group の aria-labelledby から参照する
const groupLabelStyle = css({
    fontSize: "sm",
    fontWeight: "medium",
    color: "colorPalette.fg",
});

// 「すべて選択」の下に子のグループを字下げして親子関係を見せる(四角 20px + 間隔 8px ぶん)
const childGroupStyle = css({
    ps: "7",
});

// Controlled で現在の値を表示する行
const valueStyle = css({
    fontSize: "sm",
    color: "fg.muted",
});

// 基本形。Root(<label>)の中に Control / Label / HiddenInput を置く
export const Default: Story = {
    render: () => (
        <Form>
            <Checkbox.Root name="notify" value="on">
                <Checkbox.Control />
                <Checkbox.Label>新着記事をメールで受け取る</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
            <Checkbox.Root name="weekly" value="on" defaultChecked>
                <Checkbox.Control />
                <Checkbox.Label>週刊ダイジェストを受け取る</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
        </Form>
    ),
};

/**
 * 未確定(indeterminate)。一部だけ選ばれている「すべて選択」などで使う。
 * checked / defaultChecked に "indeterminate" を渡すとマイナスのアイコンになる
 */
export const Indeterminate: Story = {
    render: () => (
        <Form>
            <Checkbox.Root defaultChecked="indeterminate">
                <Checkbox.Control />
                <Checkbox.Label>すべての路線</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
        </Form>
    ),
};

// sm / md を並べる。ラベルの文字サイズは同じ size の Input と揃う
export const Sizes: Story = {
    render: () => (
        <Form>
            <Checkbox.Root size="sm" defaultChecked>
                <Checkbox.Control />
                <Checkbox.Label>sm: 表のセルなど狭い場所向け</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
            <Checkbox.Root size="md" defaultChecked>
                <Checkbox.Control />
                <Checkbox.Label>md: 既定の大きさ</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
        </Form>
    ),
};

// 無効。未チェック / チェック済み / 未確定のすべてで塗りを外して沈める
export const Disabled: Story = {
    render: () => (
        <Form>
            <Checkbox.Root disabled>
                <Checkbox.Control />
                <Checkbox.Label>未チェック</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
            <Checkbox.Root disabled defaultChecked>
                <Checkbox.Control />
                <Checkbox.Label>チェック済み</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
            <Checkbox.Root disabled defaultChecked="indeterminate">
                <Checkbox.Control />
                <Checkbox.Label>未確定</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
        </Form>
    ),
};

// エラー状態。枠線が赤になり、HiddenInput に aria-invalid が付く
export const Invalid: Story = {
    render: () => (
        <Form label="利用規約">
            <Checkbox.Root invalid required name="terms" value="agreed">
                <Checkbox.Control />
                <Checkbox.Label>利用規約に同意する</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
            <Checkbox.Root invalid defaultChecked>
                <Checkbox.Control />
                <Checkbox.Label>チェック済みでもエラーの枠線を出す</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
        </Form>
    ),
};

// 路線の一覧。Group の value にはチェック済みの Root の value が配列で入る
const lines = [
    { label: "森の本線", value: "mori-main" },
    { label: "うみのみち線", value: "umi-line" },
    { label: "北部開拓線", value: "north-pioneer" },
    { label: "山手トンネル連絡線(工事中)", value: "yamate-tunnel", disabled: true },
];

/**
 * 複数のチェックボックスをまとめる。name / size / disabled / invalid は Group から中の Root に配られる。
 * 見出しは aria-labelledby で Group に結び付ける
 */
export const Group: Story = {
    render: () => (
        <Form label="路線の設定">
            <span id="checkbox-group-lines" className={groupLabelStyle}>
                表示する路線
            </span>
            <Checkbox.Group aria-labelledby="checkbox-group-lines" name="lines" defaultValue={["mori-main"]}>
                {lines.map((line) => (
                    <Checkbox.Root key={line.value} value={line.value} disabled={line.disabled}>
                        <Checkbox.Control />
                        <Checkbox.Label>{line.label}</Checkbox.Label>
                        <Checkbox.HiddenInput />
                    </Checkbox.Root>
                ))}
            </Checkbox.Group>
        </Form>
    ),
};

// 「すべて選択」を親に持つ制御された例。子の選び具合から親の checked(true / false / "indeterminate")を導く
const ControlledExample = () => {
    const [selected, setSelected] = useState<string[]>(["mori-main"]);
    const enabledValues = lines.filter((line) => !line.disabled).map((line) => line.value);

    // 全部選ばれていれば true、一部なら "indeterminate"、何も無ければ false
    const allState: CheckboxCheckedState =
        selected.length === enabledValues.length ? true : selected.length > 0 ? "indeterminate" : false;

    return (
        <Form label="路線の設定">
            <Checkbox.Root
                checked={allState}
                // 親を押したら、全部選ばれているとき以外はすべて選ぶ
                onCheckedChange={() => setSelected(allState === true ? [] : enabledValues)}
            >
                <Checkbox.Control />
                <Checkbox.Label>すべての路線</Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox.Root>
            <Checkbox.Group
                aria-label="表示する路線"
                name="lines"
                value={selected}
                onValueChange={setSelected}
                className={childGroupStyle}
            >
                {lines
                    .filter((line) => !line.disabled)
                    .map((line) => (
                        <Checkbox.Root key={line.value} value={line.value}>
                            <Checkbox.Control />
                            <Checkbox.Label>{line.label}</Checkbox.Label>
                            <Checkbox.HiddenInput />
                        </Checkbox.Root>
                    ))}
            </Checkbox.Group>
            <p className={valueStyle}>選択中: {selected.length > 0 ? selected.join(", ") : "なし"}</p>
        </Form>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};
