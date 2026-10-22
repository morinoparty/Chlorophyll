import type { Meta, StoryObj } from "@storybook/react";
import { UserIcon } from "lucide-react";
import { css } from "styled-system/css";
import { Avatar } from "../../../packages/react";

const meta: Meta<typeof Avatar> = {
    title: "DATA DISPLAY/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        shape: {
            control: "select",
            options: ["circle", "rounded"],
        },
    },
    args: {
        size: "md",
        shape: "circle",
    },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// VRT のスクリーンショットを外部サービスに依存させないため、アバター画像はネットワークを使わない
// data URI の SVG で作る。色だけ変えた「人物のシルエット」で、人ごとに見分けられるようにする
const portrait = (bg: string, fg: string) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><circle cx="32" cy="25" r="12" fill="${fg}"/><path d="M10 64c0-13 10-22 22-22s22 9 22 22z" fill="${fg}"/></svg>`,
    )}`;

const PEOPLE = [
    { name: "Ada Lovelace", src: portrait("#2f7d5b", "#d8f0e4") },
    { name: "Grace Hopper", src: portrait("#2b5f9e", "#dbe8f7") },
    { name: "Chocolatt", src: portrait("#9a5b2e", "#f5e3d3") },
    { name: "Nikomaru", src: portrait("#6b4fa0", "#e8e0f5") },
];

// サーバーやチームを表す正方形のアイコン。端まで塗った正方形なので、circle / rounded のどちらで
// 切り抜いても図柄が欠けない(透過の横長ロゴを cover で切り抜くと左右が削れてしまう)
const TEAM_SRC = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2f7d5b"/><path d="M32 12c-11 8-16 18-16 27a16 16 0 0 0 32 0c0-9-5-19-16-27z" fill="#d8f0e4"/><path d="M32 26v28" stroke="#2f7d5b" stroke-width="3" stroke-linecap="round"/></svg>`,
)}`;

// 確実に読み込みに失敗する画像。壊れた base64 なのでネットワークに出ず、毎回同じタイミングで error になる
const BROKEN_SRC = "data:image/png;base64,AAAA";

// ストーリー内のレイアウト用スタイル
const styles = {
    // アバターを横に並べる行
    row: css({ display: "flex", alignItems: "center", gap: "3", flexWrap: "wrap" }),
    // 大きさ・形の一覧で、各アバターの下に variant 名を添える
    cell: css({ display: "flex", flexDirection: "column", alignItems: "center", gap: "2" }),
    caption: css({ fontSize: "xs", color: "fg.muted" }),
    // 重ねて並べるグループ。後ろのアバターを左に寄せて重ね、白い縁取りで境目を見せる
    stack: css({
        display: "flex",
        alignItems: "center",
        "& > *:not(:first-child)": { marginInlineStart: "-2" },
        "& > *": { boxShadow: "0 0 0 2px {colors.bg.panel}" },
    }),
};

// 画像を読み込めた状態。alt に人物名を渡し、画像として名前が読み上げられる
export const Default: Story = {
    render: (args) => (
        <Avatar.Root {...args}>
            <Avatar.Fallback name={PEOPLE[0].name} />
            <Avatar.Image src={PEOPLE[0].src} alt={PEOPLE[0].name} />
        </Avatar.Root>
    ),
};

// 画像が無い・読み込めないときのフォールバック。
// name を渡すと頭文字を表示し、支援技術には頭文字ではなく名前そのものを読ませる。
// children を渡せば頭文字の代わりにアイコンなど任意の中身を表示できる
export const Fallback: Story = {
    render: (args) => (
        <div className={styles.row}>
            {/* 画像なし: 2 語の名前は最初と最後の語の頭文字 */}
            <Avatar.Root {...args}>
                <Avatar.Fallback name="Grace Hopper" />
            </Avatar.Root>
            {/* 画像なし: 1 語の名前は先頭 2 文字 */}
            <Avatar.Root {...args}>
                <Avatar.Fallback name="Chocolatt" />
            </Avatar.Root>
            {/* 画像の読み込みに失敗: Image は隠れ、Fallback が表示される */}
            <Avatar.Root {...args}>
                <Avatar.Fallback name="Nikomaru" />
                <Avatar.Image src={BROKEN_SRC} alt="Nikomaru" />
            </Avatar.Root>
            {/* 名前の分からない人: アイコンを表示し、aria-label で「ゲスト」と伝える */}
            <Avatar.Root {...args}>
                <Avatar.Fallback role="img" aria-label="ゲスト">
                    <UserIcon size="50%" aria-hidden="true" />
                </Avatar.Fallback>
            </Avatar.Root>
        </div>
    ),
};

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

// sizes.avatar の 5 段階(24 / 32 / 40 / 48 / 64px)。画像とフォールバックを上下に並べて比べる
export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: (args) => (
        <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
            <div className={styles.row}>
                {SIZES.map((size) => (
                    <div key={size} className={styles.cell}>
                        <Avatar.Root {...args} size={size}>
                            <Avatar.Fallback name={PEOPLE[1].name} />
                            <Avatar.Image src={PEOPLE[1].src} alt={PEOPLE[1].name} />
                        </Avatar.Root>
                        <span className={styles.caption}>{size}</span>
                    </div>
                ))}
            </div>
            <div className={styles.row}>
                {SIZES.map((size) => (
                    <div key={size} className={styles.cell}>
                        <Avatar.Root {...args} size={size}>
                            <Avatar.Fallback name={PEOPLE[1].name} />
                        </Avatar.Root>
                        <span className={styles.caption}>{size}</span>
                    </div>
                ))}
            </div>
        </div>
    ),
};

// circle は人物、rounded はサーバーやチームなど人以外を表すときに使う。
// rounded の角丸は大きさに応じて item / control / panel の役割トークンから選ばれる
export const Shapes: Story = {
    parameters: { layout: "padded" },
    render: (args) => (
        <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
            {(["circle", "rounded"] as const).map((shape) => (
                <div key={shape} className={styles.row}>
                    {SIZES.map((size) => (
                        <div key={size} className={styles.cell}>
                            <Avatar.Root {...args} size={size} shape={shape}>
                                <Avatar.Fallback name="Chlorophyll" />
                                <Avatar.Image src={TEAM_SRC} alt="Chlorophyll" />
                            </Avatar.Root>
                            <span className={styles.caption}>
                                {shape} / {size}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ),
};

// 複数人を重ねて並べるグループ表示の例。入りきらない人数は「+N」のフォールバックで示す
export const Group: Story = {
    render: (args) => (
        <div className={styles.stack}>
            {PEOPLE.map((person) => (
                <Avatar.Root key={person.name} {...args}>
                    <Avatar.Fallback name={person.name} />
                    <Avatar.Image src={person.src} alt={person.name} />
                </Avatar.Root>
            ))}
            <Avatar.Root {...args}>
                <Avatar.Fallback role="img" aria-label="ほか 3 人">
                    <span aria-hidden="true">+3</span>
                </Avatar.Fallback>
            </Avatar.Root>
        </div>
    ),
};
