import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon } from "lucide-react";
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
