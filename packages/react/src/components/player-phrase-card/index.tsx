"use client";
import { sva } from "styled-system/css";
import { randomPhrase } from "../../lib/random-phrase";

const playerPhraseCardStyles = sva({
    slots: ["root", "item", "phrase", "name"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
        },
        item: {
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            gap: "3",
            "& img": {
                width: "[48px]",
                height: "[48px]",
                borderRadius: "lg",
            },
        },
        phrase: {
            textStyle: "sm",
            color: "colorPalette.fg.subtle/70",
            fontWeight: "normal",
            lineHeight: "[1.2]",
        },
        name: {
            textStyle: "lg",
            marginTop: "1.5",
            color: "colorPalette.fg.subtle",
            fontWeight: "extrabold",
            fontVariationSettings: "'wght' 800",
            lineHeight: "[1.2]",
        },
    },
});

interface PlayerPhraseCardProps {
    playerId: string;
    playerName: string;
}

const PlayerPhraseCard = ({ playerId, playerName }: PlayerPhraseCardProps) => {
    const styles = playerPhraseCardStyles();
    const phrase = `あの${randomPhrase("first", playerId)}${randomPhrase("last", playerId)}`;

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
