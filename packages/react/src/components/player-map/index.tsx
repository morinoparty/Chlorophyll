"use client";
import { playerMap } from "styled-system/recipes";
import { PlayerAvatar, type PlayerAvatarSize } from "../player-avatar";

// チップの大きさ。中の PlayerAvatar のサイズにそのまま対応させる
type PlayerMapSize = PlayerAvatarSize;

interface PlayerMapProps {
    /** プレイヤーの UUID。PlayerAvatar 経由でアバター画像の取得に使う */
    playerId: string;
    /** プレイヤー名。アバターの alt とチップに並べるラベルの両方に使う */
    playerName: string;
    /** チップの大きさ */
    size?: PlayerMapSize;
}

// 地図上に置くプレイヤーマーカー。PlayerAvatar(#48) の顔アイコンに名前を添えた、
// 白フチ + 薄緑のチップ。地図のどんな背景に載せても浮いて見えるようにする
const PlayerMap = ({ playerId, playerName, size = "sm" }: PlayerMapProps) => {
    const styles = playerMap({ size });

    return (
        <div className={styles.root}>
            <PlayerAvatar playerId={playerId} playerName={playerName} size={size} />
            <span className={styles.name}>{playerName}</span>
        </div>
    );
};

export { PlayerMap };
export type { PlayerMapProps, PlayerMapSize };
