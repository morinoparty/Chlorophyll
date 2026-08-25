import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { css } from "styled-system/css";
import { Editable } from "../../../packages/react/src/components/editable";
import { Spinner } from "../../../packages/react/src/components/spinner";

const meta: Meta<typeof Editable> = {
    title: "FORM/Editable",
    component: Editable,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md"],
        },
        mono: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Editable>;

// 確定した値はコンソールに流す。実際のアプリではここで API を叩く
const logCommit = (details: { value: string }) => console.log("commit:", details.value);

/**
 * 基本形。ラベル + 表示/入力の切り替え。
 * preview をクリックすると入力に変わり、Enter で確定・Esc で取り消す。
 * Label は zag が htmlFor で input と関連付けてくれる
 */
export const Default: Story = {
    render: () => (
        <Editable.Root defaultValue="北森野駅" activationMode="click" onValueCommit={logCommit}>
            <Editable.Label>駅名</Editable.Label>
            <Editable.Area>
                <Editable.Input />
                <Editable.Preview />
            </Editable.Area>
        </Editable.Root>
    ),
};

// slug や ID のような識別子は等幅フォントで読ませる。preview / input の両方に効く
export const Mono: Story = {
    render: () => (
        <Editable.Root mono defaultValue="kita-morino-station" activationMode="click" onValueCommit={logCommit}>
            <Editable.Label>slug</Editable.Label>
            <Editable.Area>
                <Editable.Input />
                <Editable.Preview />
            </Editable.Area>
        </Editable.Root>
    ),
};

// 明示的なボタンで操作する例。
// Context の render prop から editing を受け取り、表示中は Edit・編集中は Submit / Cancel を出す
export const WithControls: Story = {
    render: () => (
        <Editable.Root defaultValue="森野環状線" activationMode="click" onValueCommit={logCommit}>
            <Editable.Label>路線名</Editable.Label>
            <Editable.Area>
                <Editable.Input />
                <Editable.Preview />
            </Editable.Area>
            <Editable.Context>
                {(api) => (
                    <Editable.Control>
                        {api.editing ? (
                            <>
                                <Editable.SubmitTrigger aria-label="確定">
                                    <CheckIcon />
                                </Editable.SubmitTrigger>
                                <Editable.CancelTrigger aria-label="取り消し">
                                    <XIcon />
                                </Editable.CancelTrigger>
                            </>
                        ) : (
                            <Editable.EditTrigger aria-label="編集">
                                <PencilIcon />
                            </Editable.EditTrigger>
                        )}
                    </Editable.Control>
                )}
            </Editable.Context>
        </Editable.Root>
    ),
};

// 保存が終わるまでの疑似的な待ち時間
const FAKE_SAVE_MS = 1500;

/**
 * 非同期保存のデモ。確定すると 1.5 秒間「保存中」になり、その間は disabled にして
 * 編集に入れなくする(二重送信を防ぐ)。実際のアプリでは await fetch() の前後で saving を切り替える
 */
const SavingEditable = () => {
    const [saving, setSaving] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    // アンマウント時にタイマーを片付ける
    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCommit = (details: { value: string }) => {
        console.log("saving:", details.value);
        setSaving(true);
        timerRef.current = setTimeout(() => setSaving(false), FAKE_SAVE_MS);
    };

    return (
        <Editable.Root
            defaultValue="南森野駅"
            activationMode="click"
            // 保存リクエスト中は編集に入れなくする。これが二重送信のガードになる
            disabled={saving}
            onValueCommit={handleCommit}
        >
            <Editable.Label>駅名</Editable.Label>
            <Editable.Area>
                <Editable.Input />
                <Editable.Preview />
            </Editable.Area>
            {saving && <Spinner size="sm" aria-label="保存中" />}
        </Editable.Root>
    );
};

export const Saving: Story = {
    render: () => <SavingEditable />,
};

const columnStyle = css({ display: "flex", flexDirection: "column", gap: "4", alignItems: "flex-start" });

// sm / md を縦に並べて大きさを比較する
export const Sizes: Story = {
    render: () => (
        <div className={columnStyle}>
            <Editable.Root size="sm" defaultValue="東森野駅" activationMode="click" onValueCommit={logCommit}>
                <Editable.Label>sm</Editable.Label>
                <Editable.Area>
                    <Editable.Input />
                    <Editable.Preview />
                </Editable.Area>
            </Editable.Root>
            <Editable.Root size="md" defaultValue="東森野駅" activationMode="click" onValueCommit={logCommit}>
                <Editable.Label>md</Editable.Label>
                <Editable.Area>
                    <Editable.Input />
                    <Editable.Preview />
                </Editable.Area>
            </Editable.Root>
        </div>
    ),
};

// 最初から編集モードで開いた状態。VRT で input の見た目を固定して確認するための story。
// preview と input は同じ寸法を共有しているので、Default と行の高さが一致する
export const Editing: Story = {
    render: () => (
        <Editable.Root defaultValue="北森野駅" defaultEdit activationMode="click" onValueCommit={logCommit}>
            <Editable.Label>駅名</Editable.Label>
            <Editable.Area>
                <Editable.Input />
                <Editable.Preview />
            </Editable.Area>
        </Editable.Root>
    ),
};

// 値が空のときは placeholder が薄い色で表示される
export const Placeholder: Story = {
    render: () => (
        <Editable.Root defaultValue="" placeholder="駅名を入力" activationMode="click" onValueCommit={logCommit}>
            <Editable.Label>駅名</Editable.Label>
            <Editable.Area>
                <Editable.Input />
                <Editable.Preview />
            </Editable.Area>
        </Editable.Root>
    ),
};

// disabled(保存中など) と readOnly(権限がない場合など)の見た目
export const DisabledAndReadOnly: Story = {
    render: () => (
        <div className={columnStyle}>
            <Editable.Root defaultValue="西森野駅" disabled activationMode="click">
                <Editable.Label>disabled</Editable.Label>
                <Editable.Area>
                    <Editable.Input />
                    <Editable.Preview />
                </Editable.Area>
            </Editable.Root>
            <Editable.Root defaultValue="西森野駅" readOnly activationMode="click">
                <Editable.Label>readOnly</Editable.Label>
                <Editable.Area>
                    <Editable.Input />
                    <Editable.Preview />
                </Editable.Area>
            </Editable.Root>
        </div>
    ),
};
