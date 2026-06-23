import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Button } from "../../../packages/react";

const meta: Meta<typeof Button> = {
    title: "COMPONENTS/Button",
    component: Button,
    parameters: {
        layout: "centered",
        design: {
            type: "figma",
            url: "https://www.figma.com/design/QkBegnGghvCy2WYD1Mz8NP/Design-System?node-id=14-45&m=dev",
        },
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text" },
        intent: {
            control: "select",
            options: ["primary", "secondary"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
    },
    args: {
        children: "Button",
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        intent: "primary",
        size: "lg",
        children: "ここを押して、ログイン",
    },
};

export const Secondary: Story = {
    args: {
        intent: "secondary",
        children: "ボタンだよー",
    },
};

export const WithIcon: Story = {
    args: {
        intent: "secondary",
        size: "sm",
    },

    render: (args) => (
        <Button {...args}>
            {args.children}
            <ArrowRightIcon />
        </Button>
    ),
};

// スタイルの一覧表示用レイアウト
const showcaseStyles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
};

// intent × size × state を一覧で並べたショーケース
export const Showcase: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={showcaseStyles.grid}>
            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Primary</span>
                <div className={showcaseStyles.row}>
                    <Button intent="primary" size="sm">
                        Small
                    </Button>
                    <Button intent="primary" size="md">
                        Medium
                    </Button>
                    <Button intent="primary" size="lg">
                        Large
                    </Button>
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Secondary</span>
                <div className={showcaseStyles.row}>
                    <Button intent="secondary" size="sm">
                        Small
                    </Button>
                    <Button intent="secondary" size="md">
                        Medium
                    </Button>
                    <Button intent="secondary" size="lg">
                        Large
                    </Button>
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>With icon</span>
                <div className={showcaseStyles.row}>
                    <Button intent="primary">
                        次へ
                        <ArrowRightIcon />
                    </Button>
                    <Button intent="secondary">
                        次へ
                        <ArrowRightIcon />
                    </Button>
                </div>
            </div>

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>Disabled</span>
                <div className={showcaseStyles.row}>
                    <Button intent="primary" disabled>
                        Primary
                    </Button>
                    <Button intent="secondary" disabled>
                        Secondary
                    </Button>
                </div>
            </div>
        </div>
    ),
};
