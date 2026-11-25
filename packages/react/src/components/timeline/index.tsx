"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { timeline } from "styled-system/recipes";

type TimelineSize = "sm" | "md";
type TimelineVariant = "subtle" | "outline";

// 各パーツには Ark UI と同じ data-scope / data-part を付ける。
// レシピから隣り合うパーツ(最後の項目の Connector、Time の後の Title など)を参照するときに使う

// Root で解決したスロットのクラス名を各パーツに配る Context。
// variant / size でスロットの見た目が変わるため、Root で 1 回だけ解決して共有する
type TimelineStyles = ReturnType<typeof timeline>;
const TimelineStylesContext = createContext<TimelineStyles | null>(null);

const useTimelineStyles = (component: string): TimelineStyles => {
    const styles = useContext(TimelineStylesContext);
    if (!styles) {
        throw new Error(`Timeline.${component} must be used within Timeline.Root`);
    }
    return styles;
};

interface TimelineRootProps extends HTMLArkProps<"ol"> {
    /** 点・文字の大きさと項目の間隔。既定は md */
    size?: TimelineSize;
    /**
     * 本文の見せ方。既定は subtle
     * - subtle: 本文をページの地にそのまま並べる
     * - outline: 本文を白いパネルの枠付きカードにする
     */
    variant?: TimelineVariant;
}

/**
 * タイムライン全体を包む Root。時系列の順番を伝えるため <ol> で描画する。
 * 中に Timeline.Item を並べて使う
 */
const TimelineRoot = ({ className, size, variant, ...props }: TimelineRootProps) => {
    const styles = timeline({ size, variant });
    return (
        <TimelineStylesContext.Provider value={styles}>
            <ark.ol data-scope="timeline" data-part="root" {...props} className={cx(styles.root, className)} />
        </TimelineStylesContext.Provider>
    );
};

type TimelineItemProps = HTMLArkProps<"li">;

// 1 件分の項目(<li>)。Indicator / Connector / Content を子に置く
const TimelineItem = ({ className, ...props }: TimelineItemProps) => {
    const styles = useTimelineStyles("Item");
    return <ark.li data-scope="timeline" data-part="item" {...props} className={cx(styles.item, className)} />;
};

type TimelineIndicatorProps = HTMLArkProps<"div">;

// 時系列上の位置を示す点。子にアイコンを入れると円の中に描き、空なら小さな点として表示する。
// 意味は Content 側の文字が担うため、支援技術からは隠す
const TimelineIndicator = ({ className, ...props }: TimelineIndicatorProps) => {
    const styles = useTimelineStyles("Indicator");
    return (
        <ark.div
            data-scope="timeline"
            data-part="indicator"
            aria-hidden
            {...props}
            className={cx(styles.indicator, className)}
        />
    );
};

type TimelineConnectorProps = HTMLArkProps<"div">;

// 点と次の点をつなぐ縦線。最後の項目ではレシピ側で非表示になる。装飾なので支援技術からは隠す
const TimelineConnector = ({ className, ...props }: TimelineConnectorProps) => {
    const styles = useTimelineStyles("Connector");
    return (
        <ark.div
            data-scope="timeline"
            data-part="connector"
            aria-hidden
            {...props}
            className={cx(styles.connector, className)}
        />
    );
};

type TimelineContentProps = HTMLArkProps<"div">;

// 本文領域。Time / Title / Description / Meta を子に置く。outline では枠付きカードになる
const TimelineContent = ({ className, ...props }: TimelineContentProps) => {
    const styles = useTimelineStyles("Content");
    return <ark.div data-scope="timeline" data-part="content" {...props} className={cx(styles.content, className)} />;
};

type TimelineTimeProps = HTMLArkProps<"time">;

// 項目の時刻。機械可読な値を dateTime に渡す(例: dateTime="2026-11-25T05:00")
const TimelineTime = ({ className, ...props }: TimelineTimeProps) => {
    const styles = useTimelineStyles("Time");
    return <ark.time data-scope="timeline" data-part="time" {...props} className={cx(styles.time, className)} />;
};

type TimelineTitleProps = HTMLArkProps<"p">;

// 項目の見出し。文書構造に合わせて asChild で見出し要素に差し替えられる
const TimelineTitle = ({ className, ...props }: TimelineTitleProps) => {
    const styles = useTimelineStyles("Title");
    return <ark.p data-scope="timeline" data-part="title" {...props} className={cx(styles.title, className)} />;
};

type TimelineDescriptionProps = HTMLArkProps<"p">;

// 見出しを補足する説明文。本文より一段引いた文字色で表示する
const TimelineDescription = ({ className, ...props }: TimelineDescriptionProps) => {
    const styles = useTimelineStyles("Description");
    return (
        <ark.p data-scope="timeline" data-part="description" {...props} className={cx(styles.description, className)} />
    );
};

type TimelineMetaProps = HTMLArkProps<"div">;

// 本文の右端に寄せる補助領域(アバターやバッジなど)。Content の中に置く
const TimelineMeta = ({ className, ...props }: TimelineMetaProps) => {
    const styles = useTimelineStyles("Meta");
    return <ark.div data-scope="timeline" data-part="meta" {...props} className={cx(styles.meta, className)} />;
};

// Compound Component パターン: Timeline.Root / Item / Indicator / Connector / Content / Time / Title / Description / Meta
const Timeline = Object.assign(TimelineRoot, {
    Root: TimelineRoot,
    Item: TimelineItem,
    Indicator: TimelineIndicator,
    Connector: TimelineConnector,
    Content: TimelineContent,
    Time: TimelineTime,
    Title: TimelineTitle,
    Description: TimelineDescription,
    Meta: TimelineMeta,
});

export type {
    TimelineConnectorProps,
    TimelineContentProps,
    TimelineDescriptionProps,
    TimelineIndicatorProps,
    TimelineItemProps,
    TimelineMetaProps,
    TimelineRootProps,
    TimelineSize,
    TimelineTimeProps,
    TimelineTitleProps,
    TimelineVariant,
};
export { Timeline };
