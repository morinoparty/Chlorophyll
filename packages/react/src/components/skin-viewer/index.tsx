"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { useEffect, useRef } from "react";
import {
    IdleAnimation,
    RunningAnimation,
    SkinViewer as SkinViewer3D,
    WalkingAnimation,
    WaveAnimation,
} from "skinview3d";
import { skinViewer as skinViewerRecipe } from "styled-system/recipes";
import { useMinecraftConfig } from "../minecraft-provider";

type SkinViewerAnimation = "idle" | "walking" | "running" | "wave" | "none";

// アニメーション名 -> skinview3d の PlayerAnimation インスタンスを作る関数。
// "none" は毎回 null を返す(インスタンス生成が不要なため関数化する必要はないが、
// 他のキーと同じ形にして Record で一括管理できるようにする)
const ANIMATION_FACTORY: Record<
    SkinViewerAnimation,
    () => IdleAnimation | WalkingAnimation | RunningAnimation | WaveAnimation | null
> = {
    idle: () => new IdleAnimation(),
    walking: () => new WalkingAnimation(),
    running: () => new RunningAnimation(),
    wave: () => new WaveAnimation(),
    none: () => null,
};

interface SkinViewerProps extends Omit<HTMLArkProps<"canvas">, "width" | "height"> {
    /** プレイヤーの UUID。skinUrl 省略時、MinecraftProvider の skinUrl でスキンテクスチャの URL に解決される */
    playerId?: string;
    /** skin テクスチャ画像の URL。指定した場合 playerId より優先される */
    skinUrl?: string;
    /** キャンバスの幅(px) */
    width?: number;
    /** キャンバスの高さ(px) */
    height?: number;
    /** 自動でぐるぐる回転させるか */
    autoRotate?: boolean;
    /** 再生するアニメーション。"none" ならポーズしたまま静止表示する */
    animation?: SkinViewerAnimation;
    /**
     * マウス操作(回転・ズーム・パン)を受け付けるか。false にすると操作を全てロックした
     * 表示専用モードになる。autoRotate による自動回転は操作ロックとは独立して機能する
     */
    interactive?: boolean;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 400;

// Minecraft のプレイヤースキンを 3D で表示するコンポーネント。
// skinview3d は react-three-fiber を介さず自前で WebGLRenderer / requestAnimationFrame ループを
// 持つため、canvas の ref を直接渡して命令的に SkinViewer3D インスタンスを生成・破棄する
const SkinViewer = ({
    className,
    playerId,
    skinUrl,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    autoRotate = true,
    animation = "idle",
    interactive = true,
    ...props
}: SkinViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<SkinViewer3D | null>(null);
    const styles = skinViewerRecipe({ interactive });
    // skinUrl 未指定時に playerId からテクスチャ URL を解決する(既定は mc-heads.net)
    const { skinUrl: resolveSkinUrl } = useMinecraftConfig();

    // マウント時に 1 度だけ SkinViewer3D を生成し、アンマウント時に必ず dispose する。
    // WebGL コンテキストはリークしやすく、StrictMode の二重実行下でも安全なように
    // 生成と破棄をこの effect だけに閉じ込める。width/height は生成時の初期値としてのみ使い、
    // 以降の変更は別 effect で同期するため、依存配列には含めない
    // biome-ignore lint/correctness/useExhaustiveDependencies: 上記コメントの通り意図的
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const viewer = new SkinViewer3D({ canvas: canvasRef.current, width, height });
        viewerRef.current = viewer;

        return () => {
            viewer.dispose();
            viewerRef.current = null;
        };
    }, []);

    // width/height の変更を、インスタンスを作り直さずに反映する
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) {
            return;
        }
        viewer.width = width;
        viewer.height = height;
    }, [width, height]);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) {
            return;
        }
        viewer.autoRotate = autoRotate;
    }, [autoRotate]);

    // マウス操作の受け付けを OrbitControls の enabled で一括制御する。
    // false で回転・ズーム・パンを全てロックし、表示専用にする
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) {
            return;
        }
        viewer.controls.enabled = interactive;
    }, [interactive]);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) {
            return;
        }
        viewer.animation = ANIMATION_FACTORY[animation]();
    }, [animation]);

    // skin の読み込みは非同期(内部で画像を fetch してからテクスチャ化する)なので、
    // 不正な URL でも例外で落ちないよう catch で握りつぶす(表示は前回のスキンのまま残る)
    useEffect(() => {
        const viewer = viewerRef.current;
        const resolvedSkinUrl = skinUrl ?? (playerId ? resolveSkinUrl(playerId) : undefined);
        if (!viewer || !resolvedSkinUrl) {
            return;
        }
        viewer.loadSkin(resolvedSkinUrl)?.catch(() => {
            // 読み込み失敗時は何もしない(前回表示していたスキンのままにする)
        });
    }, [skinUrl, playerId, resolveSkinUrl]);

    return (
        <ark.canvas
            {...props}
            ref={canvasRef}
            className={styles.concat(" ", className || "")}
            style={{ width: `${width}px`, height: `${height}px`, ...props.style }}
        />
    );
};

export { SkinViewer };
export type { SkinViewerProps, SkinViewerAnimation };
