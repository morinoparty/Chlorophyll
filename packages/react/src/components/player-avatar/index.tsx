"use client";
import { Avatar as ArkAvatar } from "@ark-ui/react/avatar";
import { playerAvatar } from "styled-system/recipes";

type PlayerAvatarSize = "sm" | "md" | "lg";

// レシピの size variant(sm/md/lg)と一致させる、mc-heads.net に渡す実ピクセルサイズ
const PIXEL_SIZE: Record<PlayerAvatarSize, number> = {
    sm: 32,
    md: 48,
    lg: 64,
};

interface PlayerAvatarProps {
    /** プレイヤーの UUID。mc-heads.net からアバター画像を取得するのに使う */
    playerId: string;
    /** alt テキスト、および画像読み込み失敗時のフォールバック表示に使うプレイヤー名 */
    playerName: string;
    /** アバターの大きさ */
    size?: PlayerAvatarSize;
}

// Minecraft プレイヤーの顔アイコンを表示するアバター。
// 汎用の Avatar コンポーネント(#42)がまだ実装されていないため、一旦 Ark UI の
// Avatar プリミティブを直接使って実装している。#42 が実装され次第、そちらに委譲する
const PlayerAvatar = ({ playerId, playerName, size = "md" }: PlayerAvatarProps) => {
    const styles = playerAvatar({ size });
    const pixelSize = PIXEL_SIZE[size];

    return (
        <ArkAvatar.Root className={styles.root}>
            <ArkAvatar.Fallback className={styles.fallback}>{playerName.slice(0, 2).toUpperCase()}</ArkAvatar.Fallback>
            <ArkAvatar.Image
                className={styles.image}
                src={`https://mc-heads.net/avatar/${playerId}/${pixelSize}`}
                alt={playerName}
                width={pixelSize}
                height={pixelSize}
            />
        </ArkAvatar.Root>
    );
};

export { PlayerAvatar };
export type { PlayerAvatarProps, PlayerAvatarSize };
