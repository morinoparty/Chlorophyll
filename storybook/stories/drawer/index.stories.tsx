import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "../../../packages/react/src/components/drawer";
import { Portal } from "../../../packages/react/src/components/portal";

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
