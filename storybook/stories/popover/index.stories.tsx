import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { PlayerAvatar } from "../../../packages/react/src/components/player-avatar";
import { Popover } from "../../../packages/react/src/components/popover";
import { Portal } from "../../../packages/react/src/components/portal";
import { Button } from "../../../packages/react/src/components/styled/button";

const meta: Meta<typeof Popover> = {
    title: "OVERLAY/Popover",
    component: Popover,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

// 開いた Popover が Storybook のキャンバスに収まるよう、上下に余白を取る
const stageStyle = css({ display: "grid", placeItems: "center", minHeight: "80" });

// 位置の比較用に、トリガーを横一列に並べる
const rowStyle = css({ display: "flex", flexWrap: "wrap", gap: "component.gap.lg", justifyContent: "center" });

// プレイヤーの Popover の見出し行。アバターと名前を横並びにする
const playerHeaderStyle = css({ display: "flex", alignItems: "center", gap: "component.gap.md" });

// 既定: トリガーの下に白いパネルが浮かぶ。Arrow / Title / Description / CloseTrigger を一通り置いた形
export const Default: Story = {
    render: () => (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button intent="secondary">保護ブロックとは</Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Title>保護ブロック</Popover.Title>
                        <Popover.Description>1 ブロックで 1 マス分の土地を守れるのだ。</Popover.Description>
                        <Popover.CloseTrigger />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    ),
};

// 最初から開いた状態。中身の見た目と a11y(Title による名前付け)を確認する
export const Open: Story = {
    render: () => (
        <div className={stageStyle}>
            <Popover.Root defaultOpen positioning={{ placement: "bottom" }}>
                <Popover.Trigger asChild>
                    <Button intent="secondary">_NIKOMARU</Button>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content>
                            <Popover.Arrow />
                            <div className={playerHeaderStyle}>
                                <PlayerAvatar playerId="f8b761ec-4a54-48eb-a040-c5604042bcc9" playerName="_NIKOMARU" />
                                <Popover.Title>_NIKOMARU</Popover.Title>
                            </div>
                            <Popover.Description>いまは森の街にいるのだ。</Popover.Description>
                            <Popover.CloseTrigger />
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </div>
    ),
};

// positioning.placement で出る向きを変えられる。画面端では floating-ui が自動で反転する
export const Placement: Story = {
    render: () => (
        <div className={rowStyle}>
            {(["top", "right", "bottom", "left"] as const).map((placement) => (
                <Popover.Root key={placement} positioning={{ placement }}>
                    <Popover.Trigger asChild>
                        <Button intent="secondary">{placement}</Button>
                    </Popover.Trigger>
                    <Portal>
                        <Popover.Positioner>
                            <Popover.Content>
                                <Popover.Arrow />
                                <Popover.Title>{placement}</Popover.Title>
                                <Popover.Description>この向きに開くのだ。</Popover.Description>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
            ))}
        </div>
    ),
};
