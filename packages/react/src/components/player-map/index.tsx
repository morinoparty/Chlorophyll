"use client";
import { playerMap } from "styled-system/recipes";

// MoriPath 版に合わせた 3 サイズ(md がデフォルト)
type PlayerMapSize = "md" | "lg" | "xl";

// size ごとに mc-heads.net へ要求するアバター画像の実ピクセルサイズ。
// レシピの avatar 幅・高さと一致させる
const AVATAR_PIXEL_SIZE: Record<PlayerMapSize, number> = {
    md: 32,
    lg: 36,
    xl: 48,
};

interface PlayerMapProps {
    /** プレイヤーの UUID。mc-heads.net からアバター画像を取得するのに使う */
    playerId: string;
    /** プレイヤー名。アバターの alt とチップに並べるラベルの両方に使う */
    playerName: string;
    /** チップの大きさ */
    size?: PlayerMapSize;
}

// 地図上に置くプレイヤーマーカー。アバター画像に名前を添えた、白フチ + 淡い下地のチップ。
// MoriPath の player-map をそのまま移植している
const PlayerMap = ({ playerId, playerName, size = "md" }: PlayerMapProps) => {
    const styles = playerMap({ size });
    const pixelSize = AVATAR_PIXEL_SIZE[size];

    return (
        <div className={styles.root}>
            <img
                className={styles.avatar}
                src={`https://mc-heads.net/avatar/${playerId}/${pixelSize}`}
                alt={playerName}
                width={pixelSize}
                height={pixelSize}
            />
            <span className={styles.name}>{playerName}</span>
        </div>
    );
};

export { PlayerMap };
export type { PlayerMapProps, PlayerMapSize };
