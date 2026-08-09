import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { css } from "styled-system/css";
import { ModalDialog } from "../../../packages/react/src/components/modal-dialog";
import { Button } from "../../../packages/react/src/components/styled/button";

const meta: Meta<typeof ModalDialog> = {
    title: "OVERLAY/ModalDialog",
    component: ModalDialog,
    parameters: {
        // overlay は position:fixed で画面全体を覆うため、余白のない全画面で見せる
        layout: "fullscreen",
        // autodocs は既定でストーリーをインライン描画するため、position:fixed の overlay と
        // body のスクロールロックがドキュメントページ自体を覆ってしまう。iframe に閉じ込める
        docs: { story: { inline: false, iframeHeight: 640 } },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ModalDialog>;

const subtitleStyle = css({ textStyle: "sm", fontWeight: "bold", color: "colorPalette.fg.muted" });
const listStyle = css({ display: "flex", flexDirection: "column", gap: "4" });
// main が左右いっぱいに広がる既定レイアウト用。自前で 38px の余白と区切り線を持たせる
const bleedListStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    maxHeight: "320px",
    overflowY: "auto",
    py: "8",
    px: "[38px]",
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
    borderColor: "border.subtle",
});
const stageStyle = css({ display: "grid", placeItems: "center", height: "100vh", bg: "colorPalette.bg" });

const categories = [
    { title: "お知らせ", description: "サーバーの最新情報を届ける記事なのだ。" },
    { title: "ガイド", description: "はじめての人向けの遊びかたをまとめるのだ。" },
    { title: "イベント", description: "開催中のイベントの詳細を書くのだ。" },
];

// 背景クリックで閉じたあとに開き直せるデモ。
// onClose を渡さないと既定の window.history.back() が走り、Storybook の iframe ごと
// 前のページへ戻ってしまうため、ストーリーでは必ず onClose を指定する
const ModalDialogDemo = ({ hasMainPadding = false }: { hasMainPadding?: boolean }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={stageStyle}>
            <Button intent="primary" size="lg" onClick={() => setIsOpen(true)}>
                モーダルを開く
            </Button>
            {isOpen && (
                <ModalDialog.Root onClose={() => setIsOpen(false)}>
                    <ModalDialog.Container hasMainPadding={hasMainPadding}>
                        <ModalDialog.Title>
                            <span className={subtitleStyle}>新しい記事</span>
                            記事の種類を選ぶ
                        </ModalDialog.Title>
                        <ModalDialog.Content>
                            <div className={hasMainPadding ? listStyle : bleedListStyle}>
                                {categories.map((category) => (
                                    <div key={category.title}>
                                        <div className={css({ fontWeight: "bold" })}>{category.title}</div>
                                        <div className={css({ textStyle: "sm" })}>{category.description}</div>
                                    </div>
                                ))}
                            </div>
                        </ModalDialog.Content>
                        <ModalDialog.Footer>
                            <Button intent="plain" onClick={() => setIsOpen(false)}>
                                やめる
                            </Button>
                            <Button intent="primary" onClick={() => setIsOpen(false)}>
                                次へ進む
                            </Button>
                        </ModalDialog.Footer>
                    </ModalDialog.Container>
                </ModalDialog.Root>
            )}
        </div>
    );
};

// 既定。main は左右いっぱいに広がるので、区切り線付きのスクロール領域を置ける
export const Default: Story = {
    render: () => <ModalDialogDemo />,
};

// main も title/footer と同じ左右 38px の余白に揃える
export const WithMainPadding: Story = {
    render: () => <ModalDialogDemo hasMainPadding />,
};

// isPage: 暗幕もアニメーションも使わず、ページそのものとして見せる。
// 背景クリックでは閉じない
export const Page: Story = {
    render: () => (
        <ModalDialog.Root isPage>
            <ModalDialog.Container hasMainPadding>
                <ModalDialog.Title>
                    <span className={subtitleStyle}>フルページ表示</span>
                    記事を書く
                </ModalDialog.Title>
                <ModalDialog.Content>
                    モーダルではなく1枚のページとして開くときの見た目なのだ。暗幕もアニメーションも無効になるのだ。
                </ModalDialog.Content>
                <ModalDialog.Footer>
                    <Button intent="plain">やめる</Button>
                    <Button intent="primary">保存する</Button>
                </ModalDialog.Footer>
            </ModalDialog.Container>
        </ModalDialog.Root>
    ),
};
