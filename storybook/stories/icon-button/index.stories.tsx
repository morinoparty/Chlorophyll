import type { Meta, StoryObj } from "@storybook/react";
import { HeartIcon, MenuIcon, PencilIcon, SearchIcon, SettingsIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { css } from "styled-system/css";
import { IconButton } from "../../../packages/react";

const meta: Meta<typeof IconButton> = {
    title: "FORM/IconButton",
    component: IconButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["ghost", "outline", "solid"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        shape: {
            control: "select",
            options: ["square", "circle"],
        },
        disabled: { control: "boolean" },
    },
    // 見た目に文字が無いため、操作内容は aria-label で必ず伝える
    args: {
        "aria-label": "検索",
        children: <SearchIcon />,
    },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

const styles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "6", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "2" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "3", alignItems: "center", flexWrap: "wrap" }),
};

// 見本を名前付きの <form>(form ランドマーク)で包み、axe の region ルール
// (すべてのコンテンツがランドマークの中にあること)を満たす
const Showcase = ({ label, children }: { label: string; children: ReactNode }) => (
    <form aria-label={label} className={styles.grid}>
        {children}
    </form>
);

const Section = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className={styles.section}>
        <span className={styles.label}>{label}</span>
        <div className={styles.row}>{children}</div>
    </div>
);

export const Default: Story = {
    render: (args) => (
        <Showcase label="アイコンボタン">
            <IconButton {...args} />
        </Showcase>
    ),
};

export const Variants: Story = {
    render: () => (
        <Showcase label="アイコンボタンの見た目">
            <Section label="Ghost">
                <IconButton variant="ghost" aria-label="メニューを開く">
                    <MenuIcon />
                </IconButton>
            </Section>
            <Section label="Outline">
                <IconButton variant="outline" aria-label="編集">
                    <PencilIcon />
                </IconButton>
            </Section>
            <Section label="Solid">
                <IconButton variant="solid" aria-label="お気に入りに追加">
                    <HeartIcon />
                </IconButton>
            </Section>
        </Showcase>
    ),
};

export const Sizes: Story = {
    render: () => (
        <Showcase label="アイコンボタンの大きさ">
            {(["ghost", "outline", "solid"] as const).map((variant) => (
                <Section key={variant} label={variant}>
                    <IconButton variant={variant} size="sm" aria-label="設定(小)">
                        <SettingsIcon />
                    </IconButton>
                    <IconButton variant={variant} size="md" aria-label="設定(中)">
                        <SettingsIcon />
                    </IconButton>
                    <IconButton variant={variant} size="lg" aria-label="設定(大)">
                        <SettingsIcon />
                    </IconButton>
                </Section>
            ))}
        </Showcase>
    ),
};

export const Shapes: Story = {
    render: () => (
        <Showcase label="アイコンボタンの形">
            {(["square", "circle"] as const).map((shape) => (
                <Section key={shape} label={shape}>
                    <IconButton shape={shape} variant="ghost" aria-label="閉じる">
                        <XIcon />
                    </IconButton>
                    <IconButton shape={shape} variant="outline" aria-label="閉じる">
                        <XIcon />
                    </IconButton>
                    <IconButton shape={shape} variant="solid" aria-label="閉じる">
                        <XIcon />
                    </IconButton>
                </Section>
            ))}
        </Showcase>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Showcase label="無効なアイコンボタン">
            <Section label="Disabled">
                <IconButton variant="ghost" disabled aria-label="検索">
                    <SearchIcon />
                </IconButton>
                <IconButton variant="outline" disabled aria-label="編集">
                    <PencilIcon />
                </IconButton>
                <IconButton variant="solid" disabled aria-label="お気に入りに追加">
                    <HeartIcon />
                </IconButton>
            </Section>
        </Showcase>
    ),
};
