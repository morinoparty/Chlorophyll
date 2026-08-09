import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../../packages/react/src/components/button";
import { createToaster, Toaster } from "../../../packages/react/src/components/toast";

const meta: Meta<typeof Toaster> = {
    title: "FEEDBACK/Toast",
    component: Toaster,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

// 実アプリでは createToaster はモジュールスコープで 1 回だけ呼び、
// アプリ全体で同じ store を使い回す。
// ここでは autodocs で全ストーリーが同時にマウントされても
// 同じ toast が重複して描かれないよう、ストーリーごとに store を分けている
const toaster = createToaster();
const closableToaster = createToaster();
const actionToaster = createToaster();
const promiseToaster = createToaster();

// 画面上部に出したい場合の例。placement は createToaster に渡して切り替える
const topToaster = createToaster({ placement: "top" });

const row = { display: "flex", gap: 8, flexWrap: "wrap" as const };

// 種別ごとの見た目。data-type に応じて colorPalette が切り替わる
export const Default: Story = {
    render: () => (
        <>
            <div style={row}>
                <Button
                    size="sm"
                    onClick={() => toaster.success({ title: "保存したのだ", description: "変更を反映したのだ。" })}
                >
                    success
                </Button>
                <Button
                    size="sm"
                    onClick={() =>
                        toaster.error({ title: "保存に失敗したのだ", description: "時間を置いて試すのだ。" })
                    }
                >
                    error
                </Button>
                <Button size="sm" onClick={() => toaster.info({ title: "新しいお知らせがあるのだ" })}>
                    info
                </Button>
                <Button size="sm" onClick={() => toaster.warning({ title: "残りの枠が少ないのだ" })}>
                    warning
                </Button>
                <Button
                    size="sm"
                    onClick={() => toaster.loading({ title: "送信しているのだ", description: "少し待つのだ。" })}
                >
                    loading
                </Button>
            </div>
            <Toaster toaster={toaster} />
        </>
    ),
};

// closable: true を渡した toast だけ × ボタンが出る
export const Closable: Story = {
    render: () => (
        <>
            <div style={row}>
                <Button
                    size="sm"
                    onClick={() =>
                        closableToaster.success({
                            title: "ずんだもちを送ったのだ",
                            description: "相手の口座に届くまで少しかかるのだ。",
                            closable: true,
                        })
                    }
                >
                    閉じられる toast
                </Button>
            </div>
            <Toaster toaster={closableToaster} />
        </>
    ),
};

// action を渡すと本文の右にテキストボタンが出る。押すと onClick 実行後に閉じる
export const WithAction: Story = {
    render: () => (
        <>
            <div style={row}>
                <Button
                    size="sm"
                    onClick={() =>
                        actionToaster.create({
                            title: "1 件削除したのだ",
                            action: {
                                label: "元に戻す",
                                onClick: () => actionToaster.success({ title: "元に戻したのだ" }),
                            },
                        })
                    }
                >
                    action 付き toast
                </Button>
            </div>
            <Toaster toaster={actionToaster} />
        </>
    ),
};

// promise の解決/失敗に合わせて loading → success/error と中身が差し替わる
export const PromiseToast: Story = {
    name: "Promise",
    render: () => (
        <>
            <div style={row}>
                <Button
                    size="sm"
                    onClick={() =>
                        promiseToaster.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                            loading: { title: "送信中なのだ" },
                            success: { title: "送信できたのだ" },
                            error: { title: "送信に失敗したのだ" },
                        })
                    }
                >
                    promise toast
                </Button>
            </div>
            <Toaster toaster={promiseToaster} />
        </>
    ),
};

// placement を top にした toaster の例
export const TopPlacement: Story = {
    render: () => (
        <>
            <div style={row}>
                <Button size="sm" onClick={() => topToaster.info({ title: "画面上部に出るのだ" })}>
                    上に出す
                </Button>
            </div>
            <Toaster toaster={topToaster} />
        </>
    ),
};
