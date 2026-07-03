import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon, StarIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Badge } from "../../../packages/react";

const meta: Meta<typeof Badge> = {
    title: "COMPONENTS/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text" },
        variant: {
            control: "select",
            options: ["solid", "subtle", "outline"],
        },
        size: {
            control: "select",
            options: ["sm", "md"],
        },
    },
    args: {
        children: "Badge",
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Solid: Story = {
    args: {
        variant: "solid",
        children: "新着",
    },
};

export const Subtle: Story = {
    args: {
        variant: "subtle",
        children: "下書き",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
        children: "保留中",
    },
};

export const WithIcon: Story = {
    args: {
        variant: "solid",
    },
    render: (args) => (
        <div className={showcaseStyles.row}>
            <Badge {...args}>
                <CheckIcon />
                完了
            </Badge>
            <Badge {...args}>
                <StarIcon />
                おすすめ
            </Badge>
        </div>
    ),
};

// スタイルの一覧表示用レイアウト
const showcaseStyles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
};

// variant × size を一覧で並べたショーケース
export const Showcase: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={showcaseStyles.grid}>
            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Solid</span>
                <div className={showcaseStyles.row}>
                    <Badge variant="solid" size="sm">
                        Small
                    </Badge>
                    <Badge variant="solid" size="md">
                        Medium
                    </Badge>
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Subtle</span>
                <div className={showcaseStyles.row}>
                    <Badge variant="subtle" size="sm">
                        Small
                    </Badge>
                    <Badge variant="subtle" size="md">
                        Medium
                    </Badge>
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Outline</span>
                <div className={showcaseStyles.row}>
                    <Badge variant="outline" size="sm">
                        Small
                    </Badge>
                    <Badge variant="outline" size="md">
                        Medium
                    </Badge>
                </div>
            </div>
        </div>
    ),
};
