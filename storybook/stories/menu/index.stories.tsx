import type { Meta, StoryObj } from "@storybook/react";
import { Ellipsis, LogOut, Settings, User } from "lucide-react";
import { Menu } from "../../../packages/react/src/components/menu";
import { Portal } from "../../../packages/react/src/components/portal";

const meta: Meta<typeof Menu> = {
    title: "OVERLAY/Menu",
    component: Menu,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Menu>;

// トリガーは asChild で任意の要素に差し替えられる。ここでは丸いアイコンボタンにする
const TriggerButton = () => (
    <button
        type="button"
        style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
        }}
    >
        <Ellipsis />
    </button>
);

export const Default: Story = {
    render: () => (
        <Menu.Root>
            <Menu.Trigger asChild>
                <TriggerButton />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="profile">プロフィール</Menu.Item>
                        <Menu.Item value="settings">設定</Menu.Item>
                        <Menu.Item value="logout">ログアウト</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    ),
};

// アイコン付きの項目
export const WithIcons: Story = {
    render: () => (
        <Menu.Root>
            <Menu.Trigger asChild>
                <TriggerButton />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="profile">
                            <User />
                            プロフィール
                        </Menu.Item>
                        <Menu.Item value="settings">
                            <Settings />
                            設定
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    ),
};

// ItemGroup / ItemGroupLabel / Separator で項目をカテゴリ分けした例。
// ログアウトは danger variant で危険な操作であることを示す
export const WithGroups: Story = {
    render: () => (
        <Menu.Root>
            <Menu.Trigger asChild>
                <TriggerButton />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup id="account">
                            <Menu.ItemGroupLabel>アカウント</Menu.ItemGroupLabel>
                            <Menu.Item value="profile">
                                <User />
                                プロフィール
                            </Menu.Item>
                            <Menu.Item value="settings">
                                <Settings />
                                設定
                            </Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.Separator />
                        <Menu.Item value="logout" variant="danger">
                            <LogOut />
                            ログアウト
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    ),
};

// disabled な項目を含む
export const WithDisabled: Story = {
    render: () => (
        <Menu.Root>
            <Menu.Trigger asChild>
                <TriggerButton />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="profile">プロフィール</Menu.Item>
                        <Menu.Item value="settings" disabled>
                            設定(準備中)
                        </Menu.Item>
                        <Menu.Item value="logout" variant="danger">
                            ログアウト
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    ),
};
