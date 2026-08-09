import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Skeleton } from "../../../packages/react/src/components/skeleton";

const meta: Meta<typeof Skeleton> = {
    title: "FEEDBACK/Skeleton",
    component: Skeleton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["text", "rect", "circle"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        variant: "text",
    },
    render: (args) => <Skeleton {...args} className={css({ width: "64" })} />,
};

// text/rect/circle を並べた一覧
export const Variants: Story = {
    render: () => (
        <div className={css({ display: "flex", flexDirection: "column", gap: "4", width: "64" })}>
            <Skeleton variant="text" />
            <Skeleton variant="rect" className={css({ height: "32" })} />
            <Skeleton variant="circle" />
        </div>
    ),
};

// text を複数並べて段落の読み込み中を表現する
export const TextLines: Story = {
    render: () => (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2", width: "64" })}>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" className={css({ width: "3/4" })} />
        </div>
    ),
};

// GuideCard/NewsCard のようなカードの読み込み中を想定した組み合わせ例
export const CardPlaceholder: Story = {
    render: () => (
        <div
            className={css({
                display: "flex",
                gap: "4",
                p: "4",
                width: "80",
                bg: "bg.panel",
                borderRadius: "2xl",
                boxShadow: "sm",
            })}
        >
            <Skeleton variant="rect" className={css({ width: "16", height: "16", flexShrink: "0" })} />
            <div className={css({ display: "flex", flexDirection: "column", gap: "2", flex: "1" })}>
                <Skeleton variant="text" className={css({ width: "3/4", height: "5" })} />
                <Skeleton variant="text" />
                <Skeleton variant="text" className={css({ width: "1/2" })} />
            </div>
        </div>
    ),
};
