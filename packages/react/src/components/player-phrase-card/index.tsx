"use client";
import { createContext, type ReactNode, useContext } from "react";
import { playerPhraseCard } from "styled-system/recipes";
import { randomPhrase } from "../../lib/random-phrase";
import { PlayerAvatar } from "../player-avatar";

interface PlayerPhraseCardContextValue {
    playerId: string;
    playerName: string;
    phrase: string;
}

// Root で計算した値(playerId/playerName/生成済みフレーズ)を配下の各パーツに配る Context
const PlayerPhraseCardContext = createContext<PlayerPhraseCardContextValue | null>(null);

const usePlayerPhraseCardContext = (component: string): PlayerPhraseCardContextValue => {
    const context = useContext(PlayerPhraseCardContext);
    if (!context) {
        throw new Error(`PlayerPhraseCard.${component} must be used within PlayerPhraseCard.Root`);
    }
    return context;
};

interface PlayerPhraseCardRootProps {
    playerId: string;
    playerName: string;
    /** フレーズ生成に使う基準時刻(ms)。未指定なら現在時刻(VRT では固定して決定的にする) */
    referenceTime?: number;
    children: ReactNode;
}

// カード全体を包む Root。playerId/playerName/referenceTime からフレーズを生成し、
// 配下の Avatar/Body/Phrase/Name に Context 経由で配る
const PlayerPhraseCardRoot = ({ playerId, playerName, referenceTime, children }: PlayerPhraseCardRootProps) => {
    const styles = playerPhraseCard();
    const phrase = `あの${randomPhrase("first", playerId, referenceTime)}${randomPhrase("last", playerId, referenceTime)}`;

    return (
        <PlayerPhraseCardContext.Provider value={{ playerId, playerName, phrase }}>
            <div className={styles.root}>{children}</div>
        </PlayerPhraseCardContext.Provider>
    );
};

// プレイヤーのアバター画像。実体は PlayerAvatar(#48)にそのまま委譲する
const PlayerPhraseCardAvatar = () => {
    const { playerId, playerName } = usePlayerPhraseCardContext("Avatar");
    return <PlayerAvatar playerId={playerId} playerName={playerName} />;
};

interface PlayerPhraseCardBodyProps {
    children: ReactNode;
}

// Phrase + Name を縦に並べるテキスト側の領域
const PlayerPhraseCardBody = ({ children }: PlayerPhraseCardBodyProps) => {
    const styles = playerPhraseCard();
    return <div className={styles.body}>{children}</div>;
};

// ランダム生成されたフレーズ本文
const PlayerPhraseCardPhrase = () => {
    const { phrase } = usePlayerPhraseCardContext("Phrase");
    const styles = playerPhraseCard();
    return <p className={styles.phrase}>{phrase}</p>;
};

// プレイヤー名
const PlayerPhraseCardName = () => {
    const { playerName } = usePlayerPhraseCardContext("Name");
    const styles = playerPhraseCard();
    return <p className={styles.name}>{playerName}</p>;
};

// Compound Component パターン: PlayerPhraseCard.Root / Avatar / Body / Phrase / Name
const PlayerPhraseCard = Object.assign(PlayerPhraseCardRoot, {
    Root: PlayerPhraseCardRoot,
    Avatar: PlayerPhraseCardAvatar,
    Body: PlayerPhraseCardBody,
    Phrase: PlayerPhraseCardPhrase,
    Name: PlayerPhraseCardName,
});

export { PlayerPhraseCard };
export type { PlayerPhraseCardRootProps, PlayerPhraseCardBodyProps };
