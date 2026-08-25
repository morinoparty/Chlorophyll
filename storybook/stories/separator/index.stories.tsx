import type { Meta, StoryObj } from "@storybook/react";
import { PanelLeftIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Button, Separator } from "../../../packages/react";

const meta: Meta<typeof Separator> = {
    title: "LAYOUT/Separator",
    component: Separator,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        orientation: {
            control: "select",
            options: ["horizontal", "vertical"],
        },
        semantic: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof Separator>;

// 横線は親の幅いっぱいに広がるため、パネル幅を固定して見せる
const PANEL_WIDTH = 320;

// ストーリー内のレイアウト用スタイル
const styles = {
    // 段落を縦に並べたパネル。段落と区切り線の間に余白を取る
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "component.gap.md",
        padding: "component.padding.md",
        bg: "bg.panel",
        borderRadius: "xl",
    }),
    paragraph: css({ fontSize: "sm", color: "fg", lineHeight: "relaxed", margin: 0 }),
    // ツールバー: 項目を横に並べる。縦線は alignSelf: stretch でこの行の高さいっぱいに伸びる
    toolbar: css({
        display: "flex",
        alignItems: "center",
        gap: "component.gap.sm",
        padding: "component.padding.sm",
        bg: "bg.panel",
        borderRadius: "xl",
    }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "fg.muted", whiteSpace: "nowrap" }),
    // 横線・縦線の例を縦に並べる
    stack: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    caption: css({ fontSize: "xs", color: "fg.subtle" }),
};

// 段落同士を横線で区切る、最も基本的な使い方
export const Default: Story = {
    render: (args) => (
        <div className={styles.panel} style={{ width: PANEL_WIDTH }}>
            <p className={styles.paragraph}>
                もりのパーティーは、みんなで街づくりや鉄道の敷設を楽しむ Minecraft サーバーなのだ。
            </p>
            <Separator {...args} />
            <p className={styles.paragraph}>森林鉄道の新しい駅が開業したので、ぜひ遊びに来てほしいのだ。</p>
        </div>
    ),
};

// アプリのヘッダーのように、ボタンとラベルを縦線で区切るツールバー
export const Vertical: Story = {
    args: {
        orientation: "vertical",
    },
    render: (args) => (
        <div className={styles.toolbar}>
            <Button intent="plain" size="sm">
                <PanelLeftIcon />
                サイドバー
            </Button>
            <Separator {...args} />
            <span className={styles.label}>森林鉄道 / 駅一覧 / もりの中央駅</span>
        </div>
    ),
};

// 支援技術にも区切りとして伝えたい場合は semantic を有効にする。
// role="separator" と aria-orientation が付与される
export const Semantic: Story = {
    args: {
        semantic: true,
    },
    render: (args) => (
        <div className={styles.stack}>
            <div className={styles.panel} style={{ width: PANEL_WIDTH }}>
                <span className={styles.caption}>横線 (role="separator")</span>
                <p className={styles.paragraph}>森林鉄道の路線図なのだ。</p>
                <Separator {...args} orientation="horizontal" />
                <p className={styles.paragraph}>海岸線の路線図なのだ。</p>
            </div>
            <div className={styles.toolbar}>
                <span className={styles.caption}>縦線 (aria-orientation="vertical")</span>
                <Separator {...args} orientation="vertical" />
                <span className={styles.label}>もりの中央駅</span>
                <Separator {...args} orientation="vertical" />
                <span className={styles.label}>うみの港駅</span>
            </div>
        </div>
    ),
};
