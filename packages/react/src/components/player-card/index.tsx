"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { createContext, type ReactNode, useContext } from "react";
import { cx } from "styled-system/css";
import { playerCard } from "styled-system/recipes";
import { Card, type CardRootProps } from "../card";
import { PlayerAvatar, type PlayerAvatarSize } from "../player-avatar";

interface PlayerCardContextValue {
    playerId: string;
    playerName: string;
    description?: string;
}

// Root で受け取ったプレイヤー情報を配下の Avatar / Name / Description に配る Context
const PlayerCardContext = createContext<PlayerCardContextValue | null>(null);

const usePlayerCardContext = (component: string): PlayerCardContextValue => {
    const context = useContext(PlayerCardContext);
    if (!context) {
        throw new Error(`PlayerCard.${component} must be used within PlayerCard.Root`);
    }
    return context;
};

// スロットはどれも variant を持たないので、一度だけ解決すれば済む
const styles = playerCard();

// asChild は受け付けない。Root の直下に Card.Body を挟むため、差し替え先の要素に中身を渡せないため。
// interactive も受け付けない。asChild で <a> / <button> に差し替えられない以上、Root は div のままで
// フォーカスもリンク先も持てず、押せる見た目だけが付いてしまうため
interface PlayerCardRootProps extends Omit<CardRootProps, "children" | "asChild" | "interactive"> {
    /** プレイヤーの UUID。PlayerAvatar に渡してアバター画像を解決する */
    playerId: string;
    /** プレイヤー名 */
    playerName: string;
    /** 名前の下に添える一言(例: 「あの多趣味なタイプ」) */
    description?: string;
    /**
     * カードの中身。省略すると Avatar + Body(Name / Description)の既定のレイアウトで描画する。
     * 並びを変えたいときだけ、各パーツを子として組み立てる
     */
    children?: ReactNode;
}

/**
 * プレイヤーのアバター・名前・一言を並べたカード。面と余白は Card(#40)に委譲する。
 *
 * - variant / size など Card.Root の props(asChild / interactive を除く)はそのまま渡せる
 * - children を省略すると既定のレイアウト(左にアバター、右に名前と一言)で描画する
 */
const PlayerCardRoot = ({ playerId, playerName, description, children, ...props }: PlayerCardRootProps) => {
    // 既定のレイアウト。description が無ければ Description は何も描画しない
    const content = children ?? (
        <>
            <PlayerCardAvatar />
            <PlayerCardBody>
                <PlayerCardName />
                <PlayerCardDescription />
            </PlayerCardBody>
        </>
    );

    return (
        <PlayerCardContext.Provider value={{ playerId, playerName, description }}>
            <Card.Root {...props}>
                <Card.Body>
                    <div className={styles.layout}>{content}</div>
                </Card.Body>
            </Card.Root>
        </PlayerCardContext.Provider>
    );
};

interface PlayerCardAvatarProps {
    /** アバターの大きさ。既定は md(48px) */
    size?: PlayerAvatarSize;
}

// プレイヤーのアバター画像。実体は PlayerAvatar(#48)にそのまま委譲する。
// すぐ隣の Name が同じプレイヤー名を文字で示すので、名前が 2 回読み上げられないよう装飾扱いにする
const PlayerCardAvatar = ({ size }: PlayerCardAvatarProps) => {
    const { playerId, playerName } = usePlayerCardContext("Avatar");
    return <PlayerAvatar playerId={playerId} playerName={playerName} size={size} decorative />;
};

type PlayerCardBodyProps = HTMLArkProps<"div">;

// Name + Description を縦に並べるテキスト側の領域
const PlayerCardBody = ({ className, ...props }: PlayerCardBodyProps) => {
    return <ark.div {...props} className={cx(styles.body, className)} />;
};

type PlayerCardNameProps = HTMLArkProps<"p">;

// プレイヤー名。children を渡さなければ Root の playerName を表示する
const PlayerCardName = ({ className, children, ...props }: PlayerCardNameProps) => {
    const { playerName } = usePlayerCardContext("Name");
    return (
        <ark.p {...props} className={cx(styles.name, className)}>
            {children ?? playerName}
        </ark.p>
    );
};

type PlayerCardDescriptionProps = HTMLArkProps<"p">;

// 名前を補足する一言。children も Root の description も無ければ何も描画しない
const PlayerCardDescription = ({ className, children, ...props }: PlayerCardDescriptionProps) => {
    const { description } = usePlayerCardContext("Description");
    const text = children ?? description;
    if (text === undefined || text === null || text === "") {
        return null;
    }
    return (
        <ark.p {...props} className={cx(styles.description, className)}>
            {text}
        </ark.p>
    );
};

// Compound Component パターン: PlayerCard.Root / Avatar / Body / Name / Description
const PlayerCard = Object.assign(PlayerCardRoot, {
    Root: PlayerCardRoot,
    Avatar: PlayerCardAvatar,
    Body: PlayerCardBody,
    Name: PlayerCardName,
    Description: PlayerCardDescription,
});

export { PlayerCard };
export type {
    PlayerCardRootProps,
    PlayerCardAvatarProps,
    PlayerCardBodyProps,
    PlayerCardNameProps,
    PlayerCardDescriptionProps,
};
