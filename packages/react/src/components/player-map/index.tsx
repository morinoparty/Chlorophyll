"use client";
import { playerMap } from "styled-system/recipes";

// チップの大きさ。外枠(白 + 薄緑リング)を含めたアバターの寸法に対応する
type PlayerMapSize = "sm" | "md" | "lg";

// size ごとの、mc-heads.net に要求するアバター画像の実ピクセルサイズ。
// 外枠(白 2px + 薄緑 2px)を含めた寸法に合わせておけば、頭は十分な解像度で表示できる
const AVATAR_PIXEL_SIZE: Record<PlayerMapSize, number> = {
    sm: 28,
    md: 40,
    lg: 52,
};

interface PlayerMapProps {
    /** プレイヤーの UUID。mc-heads.net からアバター画像を取得するのに使う */
    playerId: string;
    /** プレイヤー名。アバターの alt とチップに並べるラベルの両方に使う */
    playerName: string;
    /** チップの大きさ */
    size?: PlayerMapSize;
}

// 地図上に置くプレイヤーマーカー。頭(アバター)を「白 2px + 薄緑 2px」の枠で囲み、
// 名前を添えた白フチ + 薄緑のチップ。地図のどんな背景に載せても浮いて見えるようにする
const PlayerMap = ({ playerId, playerName, size = "sm" }: PlayerMapProps) => {
    const styles = playerMap({ size });
    const pixelSize = AVATAR_PIXEL_SIZE[size];

    return (
        <div className={styles.root}>
            <span className={styles.avatar}>
                <img
                    className={styles.avatarImage}
                    src={`https://mc-heads.net/avatar/${playerId}/${pixelSize}`}
                    alt={playerName}
                    width={pixelSize}
                    height={pixelSize}
                />
            </span>
            <span className={styles.name}>{playerName}</span>
        </div>
    );
};

export { PlayerMap };
export type { PlayerMapProps, PlayerMapSize };
