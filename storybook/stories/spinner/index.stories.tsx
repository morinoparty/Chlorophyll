import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Spinner } from "../../../packages/react/src/components/spinner";

const meta: Meta<typeof Spinner> = {
    title: "FEEDBACK/Spinner",
    component: Spinner,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    args: {
        size: "md",
    },
};

const rowStyle = css({ display: "flex", gap: "4", alignItems: "center" });

// sm/md/lg を並べたサイズ一覧
export const Sizes: Story = {
    render: () => (
        <div className={rowStyle}>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
        </div>
    ),
};

// 弧の色は colorPalette トークンに追従する。
// colorPalette は JSX の prop ではなく css() で生成したクラスとして渡す
export const ColorPalette: Story = {
    render: () => (
        <div className={rowStyle}>
            <Spinner className={css({ colorPalette: "mori" })} />
            <Spinner className={css({ colorPalette: "umi" })} />
            <Spinner className={css({ colorPalette: "red" })} />
        </div>
    ),
};
