"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { type RefObject, useEffect, useRef } from "react";
import {
    CrouchAnimation,
    HitAnimation,
    IdleAnimation,
    type PlayerAnimation,
    RunningAnimation,
    SkinViewer as SkinViewer3D,
    WalkingAnimation,
    WaveAnimation,
} from "skinview3d";
import { skinViewer as skinViewerRecipe } from "styled-system/recipes";
import { useMinecraftConfig } from "../minecraft-provider";
import { type Hand, type HeldItem, type HeldItemResolvers, loadHeldItem } from "./held-item";
import { RaiseAnimation } from "./raise-animation";

type SkinViewerAnimation = "idle" | "walking" | "running" | "wave" | "crouch" | "hit" | "raise" | "none";

// アニメーション名 -> skinview3d の PlayerAnimation インスタンスを作る関数。
// "none" は毎回 null を返す(インスタンス生成が不要なため関数化する必要はないが、
// 他のキーと同じ形にして Record で一括管理できるようにする)
const ANIMATION_FACTORY: Record<SkinViewerAnimation, () => PlayerAnimation | null> = {
    idle: () => new IdleAnimation(),
    walking: () => new WalkingAnimation(),
    running: () => new RunningAnimation(),
    wave: () => new WaveAnimation(),
    // CrouchAnimation は既定だとしゃがむ/立つを繰り返すので、1 回しゃがんだ姿勢で止める
    crouch: () => {
        const crouch = new CrouchAnimation();
        crouch.runOnce = true;
        return crouch;
    },
    hit: () => new HitAnimation(),
    // skinview3d には無い独自ポーズ。右腕を前に掲げる(rightHandItem="torch" で松明を掲げる)
    raise: () => new RaiseAnimation(),
    none: () => null,
};

// pitch を ±90 度ちょうどにするとカメラの up ベクトルと視線が平行になり向きが定まらないため、手前で止める
const MAX_PITCH_DEG = 89;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

interface SkinViewerProps extends Omit<HTMLArkProps<"canvas">, "width" | "height"> {
    /** プレイヤーの UUID。skinUrl 省略時、MinecraftProvider の skinUrl でスキンテクスチャの URL に解決される */
    playerId?: string;
    /** skin テクスチャ画像の URL。指定した場合 playerId より優先される */
    skinUrl?: string;
    /** キャンバスの幅(px) */
    width?: number;
    /** キャンバスの高さ(px) */
    height?: number;
    /** 自動でぐるぐる回転させるか。yaw / pitch で角度を固定している間は無効になる */
    autoRotate?: boolean;
    /**
     * 水平方向の視点角度(度)。0 で正面、90 でプレイヤーの左側面、180 で背面。
     * yaw / pitch のどちらかを指定すると角度が固定され、ドラッグによる回転と autoRotate が無効になる
     * (ズームは interactive に従う)
     */
    yaw?: number;
    /** 垂直方向の視点角度(度)。正の値で上から見下ろし、負の値で下から見上げる。±89 度に丸められる */
    pitch?: number;
    /** 再生するアニメーション。"none" ならポーズしたまま静止表示する */
    animation?: SkinViewerAnimation;
    /**
     * 右手に持たせるアイテムの ID(例: "torch" / "diamond_sword")。Minecraft のアイテム ID とそのまま対応する。
     * 平面スプライトのアイテム(item/generated・item/handheld 系)のみ対応し、ブロックは表示されない
     */
    rightHandItem?: string;
    /** 左手に持たせるアイテムの ID。rightHandItem と同じ */
    leftHandItem?: string;
    /** モデル JSON のファイルパスから URL を解決する関数。省略時は MinecraftProvider から受け取る */
    resolveModel?: (path: string) => string;
    /** テクスチャのファイル名から URL を解決する関数。省略時は MinecraftProvider から受け取る */
    resolveTexture?: (fileName: string) => string;
    /**
     * マウス操作(回転・ズーム・パン)を受け付けるか。false にすると操作を全てロックした
     * 表示専用モードになる。autoRotate による自動回転は操作ロックとは独立して機能する
     */
    interactive?: boolean;
}

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 400;

// 指定した手にアイテムを持たせ、ID や解決関数が変わったら持ち替える。
// 読み込みは非同期なので、完了前に持ち替え・アンマウントされた場合は結果を捨てて解放する
const useHeldItem = (
    viewerRef: RefObject<SkinViewer3D | null>,
    hand: Hand,
    id: string | undefined,
    { resolveModel, resolveTexture }: Partial<HeldItemResolvers>,
) => {
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || !id || !resolveModel || !resolveTexture) {
            return;
        }

        let cancelled = false;
        let heldItem: HeldItem | null = null;
        loadHeldItem(viewer.playerObject.skin, hand, id, { resolveModel, resolveTexture })
            .then((loaded) => {
                if (cancelled) {
                    loaded?.dispose();
                    return;
                }
                heldItem = loaded;
            })
            .catch(() => {
                // モデルやテクスチャが取得できない場合は何も持たせない
            });

        return () => {
            cancelled = true;
            heldItem?.dispose();
        };
    }, [viewerRef, hand, id, resolveModel, resolveTexture]);
};

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
    yaw,
    pitch,
    animation = "idle",
    interactive = true,
    rightHandItem,
    leftHandItem,
    resolveModel: resolveModelProp,
    resolveTexture: resolveTextureProp,
    ...props
}: SkinViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<SkinViewer3D | null>(null);
    const styles = skinViewerRecipe({ interactive });
    // skinUrl 未指定時に playerId からテクスチャ URL を解決する(既定は mc-heads.net)
    const config = useMinecraftConfig();
    const resolveSkinUrl = config.skinUrl;
    // アイテムのアセット解決は props を優先し、なければ MinecraftProvider から受け取る
    const itemResolvers = {
        resolveModel: resolveModelProp ?? config.resolveModel,
        resolveTexture: resolveTextureProp ?? config.resolveTexture,
    };

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

    // yaw / pitch が指定されていれば、カメラをその角度に固定する。
    // 固定中は autoRotate とドラッグ回転を止め、指定した見た目から動かないようにする
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) {
            return;
        }

        const isAngleFixed = yaw !== undefined || pitch !== undefined;
        viewer.autoRotate = autoRotate && !isAngleFixed;
        viewer.controls.enableRotate = !isAngleFixed;
        if (!isAngleFixed) {
            return;
        }

        // autoRotate はプレイヤー側(playerWrapper)を回すため、その回転を戻してからカメラで角度を作る
        viewer.playerWrapper.rotation.y = 0;
        const clampedPitch = Math.min(Math.max(pitch ?? 0, -MAX_PITCH_DEG), MAX_PITCH_DEG);
        // zoom で決まるカメラ距離はそのままに、球面座標で位置だけ差し替える。
        // phi は +y 軸からの角度、theta は +z(正面)から +x 方向への角度
        viewer.camera.position.setFromSphericalCoords(
            viewer.camera.position.length(),
            toRadians(90 - clampedPitch),
            toRadians(yaw ?? 0),
        );
        // OrbitControls が target(原点)を向くようカメラの向きを更新する
        viewer.controls.update();
    }, [autoRotate, yaw, pitch]);

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

    // 生成 effect より後に宣言し、viewer が作られてからアイテムを持たせる
    useHeldItem(viewerRef, "right", rightHandItem, itemResolvers);
    useHeldItem(viewerRef, "left", leftHandItem, itemResolvers);

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

    // Hooks をすべて呼んだ後で検査する(Rules of Hooks)。MinecraftItem と同じく設定漏れは例外にする
    if ((rightHandItem || leftHandItem) && (!itemResolvers.resolveModel || !itemResolvers.resolveTexture)) {
        throw new Error(
            "SkinViewer requires resolveModel/resolveTexture to show held items, either as props or via a wrapping MinecraftProvider.",
        );
    }

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
