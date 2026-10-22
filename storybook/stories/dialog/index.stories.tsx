import type { Meta, StoryObj } from "@storybook/react";
import { type FormEvent, useId, useState } from "react";
import { css } from "styled-system/css";
import { Button } from "../../../packages/react/src/components/button";
import { Dialog, type DialogSize } from "../../../packages/react/src/components/dialog";
import { Field } from "../../../packages/react/src/components/field";
import { Portal } from "../../../packages/react/src/components/portal";

const meta: Meta<typeof Dialog> = {
    title: "OVERLAY/Dialog",
    component: Dialog,
    parameters: {
        layout: "centered",
        // autodocs は既定でストーリーをインライン描画するため、defaultOpen のストーリーで
        // position:fixed の Backdrop とスクロールロックがドキュメントページ自体を覆ってしまう。iframe に閉じ込める
        docs: { story: { inline: false, iframeHeight: 560 } },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// フォーム項目を縦に並べる。Dialog.Body の中で Field 同士の間隔を取る
const formStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "5",
});

const sizesStyle = css({ display: "flex", gap: "3" });

/**
 * 基本形。Trigger で開き、右上の ×・Esc・背景クリックで閉じる。
 * Content は Portal で body 直下に描画する(親の overflow や重なり順の影響を受けないため)
 */
export const Default: Story = {
    render: () => (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button intent="primary" size="md">
                    ダイアログを開く
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>お知らせ</Dialog.Title>
                            <Dialog.Description>サーバーからの最新情報なのだ。</Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>今週末は森の街でお祭りがあるのだ。屋台を出したい人は役場で申し込むのだ。</p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            {/* CloseTrigger は × の 1 つだけにして id の重複を避け、Footer からは Context で閉じる */}
                            <Dialog.Context>
                                {(dialog) => (
                                    <Button intent="primary" size="md" onClick={() => dialog.setOpen(false)}>
                                        わかったのだ
                                    </Button>
                                )}
                            </Dialog.Context>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    ),
};

/**
 * 最初から開いた状態。VRT で開いた見た目をスクリーンショットするためのストーリー。
 * position:fixed で画面全体を覆うため fullscreen で見せる
 */
export const Open: Story = {
    parameters: {
        layout: "fullscreen",
    },
    render: () => (
        <Dialog.Root defaultOpen>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>お知らせ</Dialog.Title>
                            <Dialog.Description>サーバーからの最新情報なのだ。</Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>今週末は森の街でお祭りがあるのだ。屋台を出したい人は役場で申し込むのだ。</p>
                        </Dialog.Body>
                        <Dialog.Context>
                            {(dialog) => (
                                <Dialog.Footer>
                                    <Button intent="secondary" size="md" onClick={() => dialog.setOpen(false)}>
                                        あとで読む
                                    </Button>
                                    <Button intent="primary" size="md" onClick={() => dialog.setOpen(false)}>
                                        わかったのだ
                                    </Button>
                                </Dialog.Footer>
                            )}
                        </Dialog.Context>
                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    ),
};

const sizeLabels: Record<DialogSize, string> = {
    sm: "確認など短い内容向けの幅なのだ。",
    md: "標準の幅なのだ。",
    lg: "フォームや長い文章向けの幅なのだ。",
};

// sm / md / lg の最大幅を見比べる。それぞれのボタンで開く
export const Sizes: Story = {
    render: () => (
        <div className={sizesStyle}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Dialog.Root key={size} size={size}>
                    <Dialog.Trigger asChild>
                        <Button intent="secondary" size="md">
                            {size}
                        </Button>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>サイズ {size}</Dialog.Title>
                                    <Dialog.Description>{sizeLabels[size]}</Dialog.Description>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <p>ずんだもちは枝豆をすりつぶして作るのだ。甘さは控えめが好みなのだ。</p>
                                </Dialog.Body>
                                <Dialog.CloseTrigger />
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            ))}
        </div>
    ),
};

/**
 * Field を並べたフォームの例。open を外から制御し、送信したら閉じる。
 * <form> に名前を付けて form ランドマークにし、送信ボタンは form 属性で Footer から紐づける
 */
export const WithForm: Story = {
    render: function WithFormStory() {
        const [isOpen, setIsOpen] = useState(false);
        const [stationName, setStationName] = useState("北森野駅");

        const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setIsOpen(false);
        };

        return (
            <Dialog.Root size="lg" open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
                <Dialog.Trigger asChild>
                    <Button intent="primary" size="md">
                        駅を編集する
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>駅の設定</Dialog.Title>
                                <Dialog.Description>路線図と案内板に反映されるのだ。</Dialog.Description>
                            </Dialog.Header>
                            <Dialog.Body>
                                <form
                                    id="station-form"
                                    aria-label="駅の設定"
                                    className={formStyle}
                                    onSubmit={handleSubmit}
                                >
                                    <Field.Root required>
                                        <Field.Label>駅名</Field.Label>
                                        <Field.Input
                                            name="station"
                                            value={stationName}
                                            onChange={(event) => setStationName(event.target.value)}
                                        />
                                        <Field.HelperText>案内板に表示される名前なのだ</Field.HelperText>
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>メモ</Field.Label>
                                        <Field.Textarea name="memo" rows={3} placeholder="乗り換えの案内など" />
                                    </Field.Root>
                                </form>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button intent="secondary" size="md" onClick={() => setIsOpen(false)}>
                                    キャンセル
                                </Button>
                                <Button type="submit" form="station-form" intent="primary" size="md">
                                    保存する
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger />
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        );
    },
};

/**
 * 取り消せない操作の確認。role="alertdialog" にすると支援技術が応答必須のダイアログとして読み上げる。
 * 背景クリックでうっかり閉じないよう closeOnInteractOutside を切る。
 * zag の既定では初期フォーカス先を CloseTrigger の id で探すため、ボタンの並び順に頼らず
 * initialFocusEl で安全側の「キャンセル」を明示する
 */
export const Alert: Story = {
    render: function AlertStory() {
        // Button は ref を受け取らないため、id で要素を引いて初期フォーカス先に渡す
        const cancelId = useId();
        return (
            <Dialog.Root
                role="alertdialog"
                size="sm"
                closeOnInteractOutside={false}
                initialFocusEl={() => document.getElementById(cancelId)}
            >
                <Dialog.Trigger asChild>
                    <Button intent="secondary" size="md">
                        記事を削除する
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>記事を削除するのだ?</Dialog.Title>
                                <Dialog.Description>削除した記事は元に戻せないのだ。</Dialog.Description>
                            </Dialog.Header>
                            <Dialog.Context>
                                {(dialog) => (
                                    <Dialog.Footer>
                                        <Button
                                            id={cancelId}
                                            intent="secondary"
                                            size="md"
                                            onClick={() => dialog.setOpen(false)}
                                        >
                                            キャンセル
                                        </Button>
                                        <Button intent="primary" size="md" onClick={() => dialog.setOpen(false)}>
                                            削除する
                                        </Button>
                                    </Dialog.Footer>
                                )}
                            </Dialog.Context>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        );
    },
};
