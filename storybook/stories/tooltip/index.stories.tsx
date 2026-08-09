import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Portal } from "../../../packages/react/src/components/portal";
import { Tooltip } from "../../../packages/react/src/components/tooltip";

const meta: Meta<typeof Tooltip> = {
    title: "OVERLAY/Tooltip",
    component: Tooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const triggerStyle = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "10",
    px: "4",
    borderRadius: "lg",
    border: "none",
    bg: "colorPalette.solid",
    color: "colorPalette.contrast",
    fontSize: "sm",
    fontWeight: "medium",
    cursor: "pointer",
});

export const Default: Story = {
    render: () => (
        <Tooltip.Root>
            <Tooltip.Trigger className={triggerStyle}>ホバーしてね</Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content>合言葉を送るのだ</Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    ),
};

// 吹き出しの先端に三角形を付けたバージョン
export const WithArrow: Story = {
    render: () => (
        <Tooltip.Root>
            <Tooltip.Trigger className={triggerStyle}>ホバーしてね</Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content>
                        <Tooltip.Arrow />
                        合言葉を送るのだ
                    </Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    ),
};

// placement を変えて表示位置を切り替える
export const Placements: Story = {
    render: () => (
        <div className={css({ display: "flex", gap: "8" })}>
            {(["top", "right", "bottom", "left"] as const).map((placement) => (
                <Tooltip.Root key={placement} positioning={{ placement }}>
                    <Tooltip.Trigger className={triggerStyle}>{placement}</Tooltip.Trigger>
                    <Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Content>
                                <Tooltip.Arrow />
                                {placement} に表示するのだ
                            </Tooltip.Content>
                        </Tooltip.Positioner>
                    </Portal>
                </Tooltip.Root>
            ))}
        </div>
    ),
};

// openDelay/closeDelay は ArkTooltip.Root の props としてそのまま渡せる
export const CustomDelay: Story = {
    render: () => (
        <Tooltip.Root openDelay={0} closeDelay={500}>
            <Tooltip.Trigger className={triggerStyle}>すぐ出て、ゆっくり消える</Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content>
                        <Tooltip.Arrow />
                        openDelay=0 / closeDelay=500
                    </Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    ),
};

// disabled にすると常に表示されない
export const Disabled: Story = {
    render: () => (
        <Tooltip.Root disabled>
            <Tooltip.Trigger className={triggerStyle}>disabled なのだ</Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content>
                        <Tooltip.Arrow />
                        表示されないはずなのだ
                    </Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    ),
};
