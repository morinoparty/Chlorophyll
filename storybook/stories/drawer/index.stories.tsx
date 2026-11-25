import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { css } from "styled-system/css";
import { Drawer } from "../../../packages/react/src/components/drawer";
import { PlayerPhraseCard } from "../../../packages/react/src/components/player-phrase-card";
import { Portal } from "../../../packages/react/src/components/portal";
import { Button } from "../../../packages/react/src/components/styled/button";

// フレーズ生成を決定的にするための固定時刻(VRT がバケット跨ぎで揺れないように)
const FIXED_TIME = Date.UTC(2024, 0, 1, 0, 0, 0);

// ボトムシートのサンプルに並べる、オンライン中の Morino Party のプレイヤー
const onlinePlayers = [
    { id: "f8b761ec-4a54-48eb-a040-c5604042bcc9", name: "_NIKOMARU" },
    { id: "389b1a68-f647-4dd0-a421-61b6c22fdebe", name: "Chocolatt" },
    { id: "e31f4f1a-9c82-4f8b-b2af-8e1152719f73", name: "kina1120" },
    { id: "610fa9d7-4607-4d47-83fd-360f76192723", name: "tututututu201" },
    { id: "0ebbb0bf-f0d1-41a6-ac80-ca9b2f6df883", name: "hikighaL" },
];

// シートの本文。Title の左右余白(component.padding.2xl)に揃え、カードは余白で区切る
const sheetBodyStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "3",
    px: "component.padding.2xl",
    pt: "component.padding.lg",
    pb: "component.padding.2xl",
});

const meta: Meta<typeof Drawer> = {
    title: "OVERLAY/Drawer",
    component: Drawer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// 既定(end): 画面右からスライドインする
export const Default: Story = {
    render: () => (
        <Drawer.Root>
            <Drawer.Trigger>メニューを開く</Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Title>メニュー</Drawer.Title>
                        <div style={{ padding: "0 24px 24px" }}>
                            <p>森の街のなかを歩き回れるのだ。</p>
                        </div>
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    ),
};

// start: 画面左からスライドインする(モバイルのサイドバーなどで使う想定)
export const Start: Story = {
    render: () => (
        <Drawer.Root placement="start">
            <Drawer.Trigger>サイドバーを開く</Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Title>サイドバー</Drawer.Title>
                        <div style={{ padding: "0 24px 24px" }}>
                            <p>左から滑り込んでくるのだ。</p>
                        </div>
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    ),
};

// CloseTrigger の children を差し替えたカスタムボタンの例
export const CustomCloseButton: Story = {
    render: () => (
        <Drawer.Root>
            <Drawer.Trigger>メニューを開く</Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Title>メニュー</Drawer.Title>
                        <div style={{ padding: "0 24px 24px" }}>
                            <p>閉じるボタンの中身を差し替えられるのだ。</p>
                        </div>
                        <Drawer.CloseTrigger>とじる</Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    ),
};

// bottom: 画面下からせり上がるボトムシート。上端に Handle を置き、長いリストは 85dvh で止めて中でスクロールする
export const Bottom: Story = {
    render: () => (
        <Drawer.Root placement="bottom">
            <Drawer.Trigger>オンラインのプレイヤー</Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Handle />
                        <Drawer.Title>いまオンライン</Drawer.Title>
                        <div className={sheetBodyStyle}>
                            {onlinePlayers.map((player) => (
                                <PlayerPhraseCard
                                    key={player.id}
                                    playerId={player.id}
                                    playerName={player.name}
                                    referenceTime={FIXED_TIME}
                                >
                                    <PlayerPhraseCard.Avatar />
                                    <PlayerPhraseCard.Body>
                                        <PlayerPhraseCard.Phrase />
                                        <PlayerPhraseCard.Name />
                                    </PlayerPhraseCard.Body>
                                </PlayerPhraseCard>
                            ))}
                        </div>
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    ),
};

// top: 画面上から降りてくるシート。bottom を上下反転した形で、下側の角だけ丸まる
export const Top: Story = {
    render: () => (
        <Drawer.Root placement="top">
            <Drawer.Trigger>お知らせを開く</Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Title>お知らせ</Drawer.Title>
                        <div className={sheetBodyStyle}>
                            <p>今夜はワールドボーダーが広がるのだ。</p>
                        </div>
                        <Drawer.Handle />
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    ),
};

// 閉じるときの動き: 開閉を外から制御し、lazyMount + unmountOnExit で閉じたら DOM から外す。
// Ark の Presence が退場アニメーション(スライドアウト + 暗幕のフェードアウト)の終了を待ってから外すため、
// 中のボタンで閉じても、背景クリックや Esc で閉じても、パネルは画面端へ滑り出てから消える。
// OS の「視差効果を減らす」(prefers-reduced-motion: reduce)が有効なら、スライドせずフェードだけで開閉する
export const Closing: Story = {
    render: function ClosingStory() {
        const [open, setOpen] = useState(false);
        return (
            <Drawer.Root
                placement="bottom"
                open={open}
                onOpenChange={(details) => setOpen(details.open)}
                lazyMount
                unmountOnExit
            >
                <Drawer.Trigger>シートを開く</Drawer.Trigger>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Handle />
                            <Drawer.Title>テレポートする</Drawer.Title>
                            <div className={sheetBodyStyle}>
                                <p>スポーンへ戻るのだ。</p>
                                <Button intent="primary" onClick={() => setOpen(false)}>
                                    戻る
                                </Button>
                            </div>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        );
    },
};
