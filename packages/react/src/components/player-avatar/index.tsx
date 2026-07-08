"use client";
import { Avatar as ArkAvatar } from "@ark-ui/react/avatar";
import { playerAvatar } from "styled-system/recipes";
import { useMinecraftConfig } from "../minecraft-provider";

type PlayerAvatarSize = "sm" | "md" | "lg";

// レシピの size variant(sm/md/lg)と一致させる、画像サービスに渡す実ピクセルサイズ
const PIXEL_SIZE: Record<PlayerAvatarSize, number> = {
    sm: 32,
    md: 48,
    lg: 64,
};

interface PlayerAvatarProps {
    /** プレイヤーの UUID。MinecraftProvider の avatarUrl でアバター画像の URL に解決される */
    playerId: string;
    /** alt テキスト、および画像読み込み失敗時のフォールバック表示に使うプレイヤー名 */
    playerName: string;
    /** アバターの大きさ */
    size?: PlayerAvatarSize;
}

// Minecraft プレイヤーの顔アイコンを表示するアバター。
// 画像の取得先は MinecraftProvider の config.avatarUrl で差し替えられる(既定は mc-heads.net)。
// 汎用の Avatar コンポーネント(#42)がまだ実装されていないため、一旦 Ark UI の
// Avatar プリミティブを直接使って実装している。#42 が実装され次第、そちらに委譲する
const PlayerAvatar = ({ playerId, playerName, size = "md" }: PlayerAvatarProps) => {
    const styles = playerAvatar({ size });
    const { avatarUrl } = useMinecraftConfig();
    const pixelSize = PIXEL_SIZE[size];

    return (
        <ArkAvatar.Root className={styles.root}>
            <ArkAvatar.Fallback className={styles.fallback}>{playerName.slice(0, 2).toUpperCase()}</ArkAvatar.Fallback>
            <ArkAvatar.Image
                className={styles.image}
                src={avatarUrl(playerId, pixelSize)}
                alt={playerName}
                width={pixelSize}
                height={pixelSize}
            />
        </ArkAvatar.Root>
    );
};

export { PlayerAvatar };
export type { PlayerAvatarProps, PlayerAvatarSize };
