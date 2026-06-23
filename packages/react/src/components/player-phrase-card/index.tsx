"use client";
import { playerPhraseCard } from "styled-system/recipes";
import { randomPhrase } from "../../lib/random-phrase";

interface PlayerPhraseCardProps {
    playerId: string;
    playerName: string;
    /** フレーズ生成に使う基準時刻(ms)。未指定なら現在時刻(VRT では固定して決定的にする) */
    referenceTime?: number;
}

const PlayerPhraseCard = ({ playerId, playerName, referenceTime }: PlayerPhraseCardProps) => {
    const styles = playerPhraseCard();
    const phrase = `あの${randomPhrase("first", playerId, referenceTime)}${randomPhrase("last", playerId, referenceTime)}`;

    return (
        <div className={styles.root}>
            <div className={styles.item}>
                <img src={`https://mc-heads.net/avatar/${playerId}/48`} alt={playerName} width={48} height={48} />
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
