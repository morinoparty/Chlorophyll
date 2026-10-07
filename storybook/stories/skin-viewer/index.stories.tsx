import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { MinecraftProvider, SkinViewer } from "../../../packages/react";

const meta: Meta<typeof SkinViewer> = {
    title: "MINECRAFT/SkinViewer",
    component: SkinViewer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        playerId: { control: "text" },
        skinUrl: { control: "text" },
        width: { control: "number" },
        height: { control: "number" },
        autoRotate: { control: "boolean" },
        animation: {
            control: "select",
            options: ["idle", "walking", "running", "wave", "crouch", "hit", "flying", "swim", "torch", "none"],
        },
        yaw: { control: { type: "range", min: -180, max: 180, step: 5 } },
        pitch: { control: { type: "range", min: -89, max: 89, step: 1 } },
        interactive: { control: "boolean" },
    },
    args: {
        playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe",
        width: 300,
        height: 400,
        autoRotate: true,
        animation: "idle",
        interactive: true,
    },
};

export default meta;
type Story = StoryObj<typeof SkinViewer>;

export const Default: Story = {};

export const Walking: Story = {
    args: { animation: "walking" },
};

// 右手で松明を前方に掲げる独自ポーズ。炎のまわりを暖色のライトで照らす
export const Torch: Story = {
    args: { animation: "torch", autoRotate: false },
};

// yaw / pitch で視点の角度を固定した例。斜め前やや上から見下ろす。
// 固定中はドラッグ回転と autoRotate が無効になる(ズームは可能)
export const FixedAngle: Story = {
    args: { yaw: 30, pitch: 15 },
};

const posesStyle = css({
    display: "flex",
    flexWrap: "wrap",
    gap: "4",
});

const poseItemStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2",
    color: "colorPalette.fg.muted",
    textStyle: "sm",
});

// 追加したポーズを固定角度で並べた一覧。体を水平に倒す flying / swim は斜め上から見せる
const POSE_ANGLE = {
    crouch: { yaw: 30, pitch: 10 },
    hit: { yaw: 30, pitch: 10 },
    flying: { yaw: 60, pitch: 30 },
    swim: { yaw: 60, pitch: 30 },
    torch: { yaw: 30, pitch: 10 },
} as const;

// 追加したポーズの一覧
export const Poses: Story = {
    render: (args) => (
        <div className={posesStyle}>
            {(Object.keys(POSE_ANGLE) as (keyof typeof POSE_ANGLE)[]).map((pose) => (
                <div key={pose} className={poseItemStyle}>
                    <SkinViewer {...args} animation={pose} width={220} height={280} {...POSE_ANGLE[pose]} />
                    <span>{pose}</span>
                </div>
            ))}
        </div>
    ),
};

export const Static: Story = {
    args: { autoRotate: false, animation: "none" },
};

export const CustomSkinUrl: Story = {
    args: {
        playerId: undefined,
        skinUrl: "https://mc-heads.net/skin/f8b761ec-4a54-48eb-a040-c5604042bcc9",
    },
};

// マウス操作(回転・ズーム・パン)を全てロックした表示専用モード。
// autoRotate による自動回転は操作ロックとは独立して機能する
export const NonInteractive: Story = {
    args: {
        interactive: false,
        autoRotate: false,
        animation: "none",
    },
};

// MinecraftProvider の config.skinUrl でスキンテクスチャの取得先を差し替えた例。
// `skinUrl: (uuid) => ...` の形で任意の画像サービスや自前 API を使える
export const WithCustomSkinUrl: Story = {
    render: (args) => (
        <MinecraftProvider
            config={{
                // mc-heads.net の代わりに minotar.net から取得する(ハイフン無し UUID 形式)
                skinUrl: (playerId) => `https://minotar.net/skin/${playerId.replaceAll("-", "")}`,
            }}
        >
            <SkinViewer {...args} />
        </MinecraftProvider>
    ),
};
