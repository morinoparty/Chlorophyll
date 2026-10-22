import type { Meta, StoryObj } from "@storybook/react";
import { BellIcon, EyeOffIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { css } from "styled-system/css";
import { Switch } from "../../../packages/react/src/components/switch";

const meta: Meta<typeof Switch> = {
    title: "FORM/Switch",
    component: Switch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

// 見本を名前付きの <form>(form ランドマーク)で包む。
// HiddenInput が name/value を載せる送信先になるのと、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たすため
const formStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4",
});

const Form = ({ children, label = "記事の設定" }: { children: ReactNode; label?: string }) => (
    <form className={formStyle} aria-label={label} onSubmit={(event) => event.preventDefault()}>
        {children}
    </form>
);

// Controlled で現在の値を表示する行
const valueStyle = css({
    fontSize: "sm",
    color: "fg.muted",
});

/**
 * 基本形。トラック(Control)+ つまみ(Thumb)+ ラベル + HiddenInput。
 * Root が <label> なので、ラベルの文字をクリックしても切り替わる
 */
export const Default: Story = {
    render: () => (
        <Form>
            <Switch.Root name="notify">
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>更新を通知する</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
        </Form>
    ),
};

// 初期状態をオンにする(非制御)
export const Checked: Story = {
    render: () => (
        <Form>
            <Switch.Root name="notify" defaultChecked>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>更新を通知する</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
        </Form>
    ),
};

// sm / md をオフ・オンで並べる。md は 36x20 / つまみ 16、sm は 28x16 / つまみ 12
export const Sizes: Story = {
    render: () => (
        <Form>
            {(["sm", "md"] as const).map((size) =>
                [false, true].map((checked) => (
                    <Switch.Root key={`${size}-${checked}`} size={size} defaultChecked={checked}>
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                        <Switch.Label>
                            {size}({checked ? "オン" : "オフ"})
                        </Switch.Label>
                        <Switch.HiddenInput />
                    </Switch.Root>
                )),
            )}
        </Form>
    ),
};

// 無効。オン / オフはつまみの位置で読ませる
export const Disabled: Story = {
    render: () => (
        <Form>
            <Switch.Root disabled>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>更新を通知する(オフ)</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
            <Switch.Root disabled defaultChecked>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>更新を通知する(オン)</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
        </Form>
    ),
};

// 読み取り専用。値は見せるが切り替えられない。hover の色替えをせず、カーソルも通常の矢印にする
export const ReadOnly: Story = {
    render: () => (
        <Form>
            <Switch.Root readOnly>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>更新を通知する(オフ)</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
            <Switch.Root readOnly defaultChecked>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>更新を通知する(オン)</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
        </Form>
    ),
};

// エラー状態。トラックを赤にし、オン / オフはつまみの位置で読ませる
export const Invalid: Story = {
    render: () => (
        <Form>
            <Switch.Root invalid>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>利用規約に同意する(オフ)</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
            <Switch.Root invalid defaultChecked>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>利用規約に同意する(オン)</Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
        </Form>
    ),
};

// ラベルの前にアイコンを置く。svg は Label のスタイルで文字サイズ(1em)に揃う。
// 意味はラベルの文字で伝わるため、アイコンは aria-hidden にする
export const WithIcon: Story = {
    render: () => (
        <Form>
            <Switch.Root name="draft" defaultChecked>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>
                    <EyeOffIcon aria-hidden />
                    下書き(非公開)
                </Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
            <Switch.Root name="notify" size="sm">
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>
                    <BellIcon aria-hidden />
                    更新を通知する
                </Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
        </Form>
    ),
};

// checked / onCheckedChange で値を外から持つ例。
// wiki-frontend の記事編集ヘッダーにある「下書き(非公開)」トグルと同じ使い方
const ControlledExample = () => {
    const [draft, setDraft] = useState(true);

    return (
        <Form>
            <Switch.Root checked={draft} onCheckedChange={(details) => setDraft(details.checked)}>
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>
                    <EyeOffIcon aria-hidden />
                    下書き(非公開)
                </Switch.Label>
                <Switch.HiddenInput />
            </Switch.Root>
            <p className={valueStyle}>状態: {draft ? "下書き" : "公開"}</p>
        </Form>
    );
};

export const Controlled: Story = {
    render: () => <ControlledExample />,
};
