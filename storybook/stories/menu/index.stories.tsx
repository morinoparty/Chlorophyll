import type { Meta, StoryObj } from "@storybook/react";
import { Ellipsis, Layers, LogOut, Settings, User } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Menu } from "../../../packages/react/src/components/menu";
import { Portal } from "../../../packages/react/src/components/portal";
import { Button } from "../../../packages/react/src/components/styled/button";

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

// トリガーは asChild で任意の要素に差し替えられる。ここでは丸いアイコンボタンにする。
// asChild は cloneElement で props(onClick / aria-* / ref / className)を子へ渡すため、
// 差し替え先のコンポーネントは受け取った props を必ず DOM 要素へ透過させる必要がある。
// 透過し忘れるとクリックハンドラが届かず、メニューが開かなくなる
// アイコンだけのボタンなので、読み上げ用の名前を aria-label で与える
const TriggerButton = (props: ComponentProps<"button">) => (
    <button
        type="button"
        aria-label="メニューを開く"
        {...props}
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

// 地図に重ねるマーカーの種類。CheckboxItem で 1 つずつオン/オフする
const markerLayers = [
    { value: "railway", label: "鉄道" },
    { value: "claim", label: "エリア保護" },
    { value: "spawn", label: "スポーン" },
    { value: "world-border", label: "ワールドボーダー" },
    { value: "banner", label: "バナー(町の名前)" },
    { value: "player", label: "プレイヤー" },
];

// CheckboxItem: 地図のマーカー表示を切り替える。項目を押してもメニューが閉じないよう closeOnSelect={false} にする。
// ItemIndicator は未選択でも幅を保つため、オン/オフでラベルの位置がずれない
export const CheckboxItems: Story = {
    render: function CheckboxItemsStory() {
        const [visibleLayers, setVisibleLayers] = useState(["railway", "claim", "player"]);

        // 1 つのレイヤーの表示/非表示を切り替える
        const toggleLayer = (value: string, checked: boolean) => {
            setVisibleLayers((current) => (checked ? [...current, value] : current.filter((layer) => layer !== value)));
        };

        return (
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button intent="secondary">
                        <Layers />
                        マーカー表示
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            {markerLayers.map((layer) => (
                                <Menu.CheckboxItem
                                    key={layer.value}
                                    value={layer.value}
                                    checked={visibleLayers.includes(layer.value)}
                                    onCheckedChange={(checked) => toggleLayer(layer.value, checked)}
                                    closeOnSelect={false}
                                >
                                    <Menu.ItemIndicator />
                                    {layer.label}
                                </Menu.CheckboxItem>
                            ))}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    },
};

// RadioItemGroup / RadioItem: 1 つだけを選ぶ。ItemGroupLabel で見出しを付けられる
export const RadioItems: Story = {
    render: function RadioItemsStory() {
        const [mapType, setMapType] = useState("surface");

        return (
            <Menu.Root>
                <Menu.Trigger asChild>
                    <TriggerButton />
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.RadioItemGroup value={mapType} onValueChange={(details) => setMapType(details.value)}>
                                <Menu.ItemGroupLabel>地図の種類</Menu.ItemGroupLabel>
                                <Menu.RadioItem value="surface">
                                    <Menu.ItemIndicator />
                                    地上
                                </Menu.RadioItem>
                                <Menu.RadioItem value="cave">
                                    <Menu.ItemIndicator />
                                    洞窟
                                </Menu.RadioItem>
                                <Menu.RadioItem value="flat">
                                    <Menu.ItemIndicator />
                                    平面
                                </Menu.RadioItem>
                            </Menu.RadioItemGroup>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    },
};
