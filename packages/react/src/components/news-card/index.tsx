"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import type { ReactNode } from "react";
import { cx } from "styled-system/css";
import { newsCard } from "styled-system/recipes";
import { PlayerAvatar } from "../player-avatar";

// カード全体を包む Root。asChild で <a> などに差し替えてリンクカードにもできる
const NewsCardRoot = ({ className, ...props }: HTMLArkProps<"div">) => {
    const styles = newsCard();
    return <ark.div {...props} className={cx(styles.root, className)} />;
};

interface NewsCardThumbnailProps extends HTMLArkProps<"figure"> {
    /** サムネイル画像の URL。未指定の場合は children をプレースホルダーとして表示する */
    src?: string;
    /** サムネイル画像の alt テキスト */
    alt?: string;
    /** src 未指定時に表示するプレースホルダー(ロゴなど) */
    children?: ReactNode;
}

// 16:9 のサムネイル領域。画像がなければ淡い面 + プレースホルダーを表示する
const NewsCardThumbnail = ({ className, src, alt = "", children, ...props }: NewsCardThumbnailProps) => {
    const styles = newsCard();
    return (
        <ark.figure {...props} className={cx(styles.thumbnail, className)}>
            {src ? <img src={src} alt={alt} className={styles.image} /> : children}
        </ark.figure>
    );
};

// Category + Title を縦に並べるテキスト側の領域
const NewsCardContent = ({ className, ...props }: HTMLArkProps<"div">) => {
    const styles = newsCard();
    return <ark.div {...props} className={cx(styles.content, className)} />;
};

// 記事のカテゴリラベル(お知らせ / イベント情報 など)
const NewsCardCategory = ({ className, ...props }: HTMLArkProps<"p">) => {
    const styles = newsCard();
    return <ark.p {...props} className={cx(styles.category, className)} />;
};

// 記事タイトル。1 行に収まらない分は省略記号で切る
const NewsCardTitle = ({ className, ...props }: HTMLArkProps<"h3">) => {
    const styles = newsCard();
    return <ark.h3 {...props} className={cx(styles.title, className)} />;
};

// 日付と投稿者を左右に並べるフッター領域
const NewsCardFooter = ({ className, ...props }: HTMLArkProps<"div">) => {
    const styles = newsCard();
    return <ark.div {...props} className={cx(styles.footer, className)} />;
};

interface NewsCardDateProps extends HTMLArkProps<"time"> {
    /** time 要素の dateTime 属性に渡す機械可読な日付(例: 2026-05-18) */
    dateTime?: string;
}

// 記事の公開日
const NewsCardDate = ({ className, ...props }: NewsCardDateProps) => {
    const styles = newsCard();
    return <ark.time {...props} className={cx(styles.date, className)} />;
};

interface NewsCardPlayer {
    /** 投稿者(プレイヤー)の UUID */
    playerId: string;
    /** 投稿者のプレイヤー名 */
    playerName: string;
}

interface NewsCardAuthorProps {
    /** 投稿者の一覧。先頭が最前面に表示され、2 人目以降は少し傾けて背後に重なる */
    players: NewsCardPlayer[];
}

// 投稿者のアバター。複数人の場合は扇状に重ねて表示し、hover で広がって各人が見える。
// "group" クラスを付けて、この領域への hover を子(author)の展開スタイルから参照する。
// アバターの実体は PlayerAvatar(#48)にそのまま委譲する
const NewsCardAuthor = ({ players }: NewsCardAuthorProps) => {
    const styles = newsCard();
    return (
        <span className={cx(styles.authors, "group")}>
            {players.map((player) => (
                <span key={player.playerId} className={styles.author}>
                    <PlayerAvatar playerId={player.playerId} playerName={player.playerName} size="sm" />
                </span>
            ))}
        </span>
    );
};

// Compound Component パターン: NewsCard.Root / Thumbnail / Content / Category / Title / Footer / Date / Author
const NewsCard = Object.assign(NewsCardRoot, {
    Root: NewsCardRoot,
    Thumbnail: NewsCardThumbnail,
    Content: NewsCardContent,
    Category: NewsCardCategory,
    Title: NewsCardTitle,
    Footer: NewsCardFooter,
    Date: NewsCardDate,
    Author: NewsCardAuthor,
});

export { NewsCard };
export type { NewsCardThumbnailProps, NewsCardDateProps, NewsCardAuthorProps, NewsCardPlayer };
