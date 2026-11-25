"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { createContext, useContext, useMemo } from "react";
import { cx } from "styled-system/css";
import { playerAvatarGroup } from "styled-system/recipes";
import { PlayerAvatar, type PlayerAvatarSize } from "../player-avatar";

type PlayerAvatarGroupSpacing = "tight" | "normal";

// 各パーツには Ark UI と同じ data-scope / data-part を付ける(他のコンポーネントと揃える)

// Root で解決したスロットのクラス名と、Item が PlayerAvatar に渡す size を配る Context。
// size / spacing でスロットの見た目が変わるため、Root で 1 回だけ解決して共有する
interface PlayerAvatarGroupContextValue {
    styles: ReturnType<typeof playerAvatarGroup>;
    size: PlayerAvatarSize;
}
const PlayerAvatarGroupContext = createContext<PlayerAvatarGroupContextValue | null>(null);

const usePlayerAvatarGroupContext = (component: string): PlayerAvatarGroupContextValue => {
    const context = useContext(PlayerAvatarGroupContext);
    if (!context) {
        throw new Error(`PlayerAvatarGroup.${component} must be used within PlayerAvatarGroup.Root`);
    }
    return context;
};

// 隠れた人数を読み上げる既定のラベル
const defaultOverflowLabel = (hiddenCount: number) => `ほか ${hiddenCount} 人`;

interface PlayerAvatarGroupRootProps extends HTMLArkProps<"div"> {
    /** アバターの大きさ。PlayerAvatar の size と同じ(sm 32px / md 48px / lg 64px)。既定は md */
    size?: PlayerAvatarSize;
    /** 重なり幅。normal は頭の 1/4、tight は 3/8 を重ねる。既定は normal */
    spacing?: PlayerAvatarGroupSpacing;
}

/**
 * アバターを横一列に重ねて並べる Root。中に PlayerAvatarGroup.Item / Overflow を置く。
 * 1 つのまとまりとして読ませるため role="group" にする。何の集まりかは aria-label で付ける
 * (例: aria-label="この日記にいた人")
 */
const PlayerAvatarGroupRoot = ({ className, size = "md", spacing, ...props }: PlayerAvatarGroupRootProps) => {
    // Root が再描画されても size / spacing が同じなら同じオブジェクトを渡し、子の再描画を避ける
    const context = useMemo(() => ({ styles: playerAvatarGroup({ size, spacing }), size }), [size, spacing]);
    const { styles } = context;
    return (
        <PlayerAvatarGroupContext.Provider value={context}>
            <ark.div
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- 代替候補の fieldset などはフォーム向けで、アバターの集まりには role="group" が適切
                role="group"
                data-scope="player-avatar-group"
                data-part="root"
                {...props}
                className={cx(styles.root, className)}
            />
        </PlayerAvatarGroupContext.Provider>
    );
};

interface PlayerAvatarGroupItemProps extends Omit<HTMLArkProps<"div">, "children"> {
    /** プレイヤーの UUID。PlayerAvatar を通して MinecraftProvider の avatarUrl で画像の URL に解決される */
    playerId: string;
    /** alt テキスト、および画像読み込み失敗時のフォールバック表示に使うプレイヤー名 */
    playerName: string;
    /** 装飾として扱うか。隣に名前を文字で並べているときに true にして、名前の重複読み上げを防ぐ */
    decorative?: boolean;
}

// 1 人分のアバター。画像の解決は PlayerAvatar に任せ、ここではリングと重なりを付ける枠だけを持つ
const PlayerAvatarGroupItem = ({
    className,
    playerId,
    playerName,
    decorative,
    ...props
}: PlayerAvatarGroupItemProps) => {
    const { styles, size } = usePlayerAvatarGroupContext("Item");
    return (
        <ark.div data-scope="player-avatar-group" data-part="item" {...props} className={cx(styles.item, className)}>
            <PlayerAvatar playerId={playerId} playerName={playerName} size={size} decorative={decorative} />
        </ark.div>
    );
};

interface PlayerAvatarGroupOverflowProps extends HTMLArkProps<"div"> {
    /** 表示しきれずに隠れている人数。既定の表示「+N」と読み上げ「ほか N 人」に使う */
    count: number;
}

/**
 * 列に収まらなかった人数を示す「+N」のチップ。
 * 見た目の「+N」だけでは意味が伝わらないため role="img" にして、aria-label で隠れた人数を読ませる。
 * 読み上げを変えたいときは aria-label を、表示を変えたいときは children を渡す
 */
const PlayerAvatarGroupOverflow = ({ className, count, children, ...props }: PlayerAvatarGroupOverflowProps) => {
    const { styles } = usePlayerAvatarGroupContext("Overflow");
    return (
        <ark.div
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- 画像ではなく文字「+N」を描くため <img> にできない
            role="img"
            aria-label={defaultOverflowLabel(count)}
            data-scope="player-avatar-group"
            data-part="overflow"
            {...props}
            className={cx(styles.overflow, className)}
        >
            {children ?? `+${count}`}
        </ark.div>
    );
};

interface PlayerAvatarGroupPlayer {
    /** プレイヤーの UUID */
    id: string;
    /** プレイヤー名 */
    name: string;
}

interface PlayerAvatarGroupProps extends Omit<PlayerAvatarGroupRootProps, "children"> {
    /** 並べるプレイヤー。先頭から max 人までをアバターで表示する */
    players: PlayerAvatarGroupPlayer[];
    /** アバターで表示する最大人数。超えた分は「+N」にまとめる。省略すると全員を表示する */
    max?: number;
    /** overflow の読み上げを差し替える。隠れた人数と隠れたプレイヤーを受け取る(既定は「ほか N 人」) */
    overflowLabel?: (hiddenCount: number, hiddenPlayers: PlayerAvatarGroupPlayer[]) => string;
}

/**
 * players を渡すだけで、max 人までのアバターと「+N」を並べる。
 * 並べ方を細かく変えたいときは PlayerAvatarGroup.Root / Item / Overflow を組み合わせる
 */
const PlayerAvatarGroupBase = ({
    players,
    max,
    overflowLabel = defaultOverflowLabel,
    ...props
}: PlayerAvatarGroupProps) => {
    // max が無い、または人数が max 以下なら全員を表示し、チップは出さない
    const visibleCount = max === undefined ? players.length : Math.max(0, Math.min(max, players.length));
    const visiblePlayers = players.slice(0, visibleCount);
    const hiddenPlayers = players.slice(visibleCount);
    return (
        <PlayerAvatarGroupRoot {...props}>
            {visiblePlayers.map((player) => (
                <PlayerAvatarGroupItem key={player.id} playerId={player.id} playerName={player.name} />
            ))}
            {hiddenPlayers.length > 0 && (
                <PlayerAvatarGroupOverflow
                    count={hiddenPlayers.length}
                    aria-label={overflowLabel(hiddenPlayers.length, hiddenPlayers)}
                />
            )}
        </PlayerAvatarGroupRoot>
    );
};

// Compound Component パターン: PlayerAvatarGroup(props 版)/ Root / Item / Overflow
const PlayerAvatarGroup = Object.assign(PlayerAvatarGroupBase, {
    Root: PlayerAvatarGroupRoot,
    Item: PlayerAvatarGroupItem,
    Overflow: PlayerAvatarGroupOverflow,
});

export type {
    PlayerAvatarGroupItemProps,
    PlayerAvatarGroupOverflowProps,
    PlayerAvatarGroupPlayer,
    PlayerAvatarGroupProps,
    PlayerAvatarGroupRootProps,
    PlayerAvatarGroupSpacing,
};
export { PlayerAvatarGroup };
