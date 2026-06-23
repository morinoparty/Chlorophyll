"use client";
import { playerPhraseCard } from "styled-system/recipes";
import { randomPhrase } from "../../lib/random-phrase";

interface PlayerPhraseCardProps {
    playerId: string;
    playerName: string;
    /** アバター画像の URL。未指定なら mc-heads.net を使う(テスト/VRT では固定画像を渡す) */
    avatarSrc?: string;
    /** フレーズ生成に使う基準時刻(ms)。未指定なら現在時刻(VRT では固定して決定的にする) */
    referenceTime?: number;
}

const PlayerPhraseCard = ({ playerId, playerName, avatarSrc, referenceTime }: PlayerPhraseCardProps) => {
    const styles = playerPhraseCard();
    const phrase = `あの${randomPhrase("first", playerId, referenceTime)}${randomPhrase("last", playerId, referenceTime)}`;
    const src = avatarSrc ?? `https://mc-heads.net/avatar/${playerId}/48`;

    return (
        <div className={styles.root}>
            <div className={styles.item}>
                <img src={src} alt={playerName} width={48} height={48} />
                <div>
                    <p className={styles.phrase}>{phrase}</p>
                    <p className={styles.name}>{playerName}</p>
                </div>
            </div>
        </div>
    );
};

export { PlayerPhraseCard };
export type { PlayerPhraseCardProps };
