"use client";
import { Avatar as ArkAvatar } from "@ark-ui/react/avatar";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { avatar } from "styled-system/recipes";

// sizes.avatar のトークン(24 / 32 / 40 / 48 / 64px)と 1 対 1 で対応する大きさ。
// PlayerAvatar(sm / md / lg = 32 / 48 / 64px)とは名前が sm 以外ずれている。
// PlayerAvatar を Avatar に委譲するときは sm → sm、md → lg、lg → xl と読み替えること
// (そのまま渡すと md が 40px に縮み、48px 前提の PlayerPhraseCard などのレイアウトが崩れる)
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

// circle: 人物(既定) / rounded: サーバーやチームなど人以外
type AvatarShape = "circle" | "rounded";

// Root で解決したスロットのクラス名を Image / Fallback に配るための Context。
// 頭文字の文字サイズは Root の size で決まるため、size ごとに解決した結果をそのまま渡す。
// Root の外で使われた場合に備えて既定値(md / circle)で解決したものを初期値にする
const AvatarStylesContext = createContext(avatar());

type AvatarRootProps = ComponentProps<typeof ArkAvatar.Root> & {
    /** アバターの大きさ。既定は md(40px) */
    size?: AvatarSize;
    /** アバターの形。既定は circle */
    shape?: AvatarShape;
};

/**
 * アバター全体。Image と Fallback を重ねて置き、画像の読み込み状態に応じてどちらかだけを表示する。
 *
 * - 読み込み中・失敗時は Ark が Image に hidden を付けて Fallback を出し、読み込めたら Fallback を隠す
 * - そのため支援技術に読まれるのは常にどちらか一方だけで、名前が二重に読み上げられることはない
 */
const AvatarRoot = ({ className, size, shape, ...props }: AvatarRootProps) => {
    const styles = avatar({ size, shape });
    return (
        <AvatarStylesContext.Provider value={styles}>
            <ArkAvatar.Root {...props} className={cx(styles.root, className)} />
        </AvatarStylesContext.Provider>
    );
};

type AvatarImageProps = Omit<ComponentProps<typeof ArkAvatar.Image>, "alt"> & {
    /**
     * 画像の代替テキスト。通常は人物名を渡す。
     * 隣に名前が書いてあるなど、画像が装飾にすぎない場合は空文字("")を渡して読み上げから外す。
     * そのときは Fallback にも aria-hidden を渡すこと。渡さないと読み込み中・失敗時だけ
     * Fallback の aria-label(name)が読まれ、隣の名前と二重に読み上げられる
     */
    alt: string;
};

// アバター画像。alt を必須にして、代替テキストの付け忘れを型で防ぐ
const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
    const styles = useContext(AvatarStylesContext);
    return <ArkAvatar.Image {...props} className={cx(styles.image, className)} />;
};

type AvatarFallbackProps = ComponentProps<typeof ArkAvatar.Fallback> & {
    /**
     * 人物名。children を省略すると、ここから頭文字(最大 2 文字)を作って表示する。
     * 指定すると Fallback 全体が role="img" + aria-label={name} になり、
     * 頭文字ではなく名前そのものが読み上げられる。
     * 装飾的なアバター(Image の alt="")では aria-hidden を併せて渡し、頭文字は見せたまま読み上げから外す
     */
    name?: string;
};

/**
 * 名前から頭文字を作る。
 *
 * - 空白区切りで 2 語以上あれば、最初の語と最後の語の先頭 1 文字ずつ(例: "Ada Lovelace" → "AL")
 * - 1 語なら先頭 2 文字(PlayerAvatar と同じ規則。例: "Chocolatt" → "CH")
 * - 絵文字やサロゲートペアを途中で割らないよう、Array.from でコードポイント単位に分割する
 */
const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return "";
    }
    if (words.length === 1) {
        return Array.from(words[0]).slice(0, 2).join("").toUpperCase();
    }
    const first = Array.from(words[0])[0];
    const last = Array.from(words[words.length - 1])[0];
    return `${first}${last}`.toUpperCase();
};

// 画像が無いとき・読み込めなかったときに代わりに表示する中身(頭文字やアイコン)
const AvatarFallback = ({ className, name, children, ...props }: AvatarFallbackProps) => {
    const styles = useContext(AvatarStylesContext);

    // name があるときは、頭文字ではなく名前そのものを読ませる。
    // 「AL」のような頭文字だけを読み上げても誰なのか分からないため、
    // Fallback を 1 枚の画像として扱い、中の頭文字は読み上げから外す。
    // a11y 属性を先に置き、利用側が role や aria-* を渡した場合はそちらを優先する
    const a11yProps = name ? { role: "img", "aria-label": name } : {};

    return (
        <ArkAvatar.Fallback {...a11yProps} {...props} className={cx(styles.fallback, className)}>
            {children ?? (name ? <span aria-hidden="true">{getInitials(name)}</span> : null)}
        </ArkAvatar.Fallback>
    );
};

// Compound Component パターン: Avatar.Root / Image / Fallback
const Avatar = Object.assign(AvatarRoot, {
    Root: AvatarRoot,
    Image: AvatarImage,
    Fallback: AvatarFallback,
});

export type { AvatarFallbackProps, AvatarImageProps, AvatarRootProps, AvatarShape, AvatarSize };
export { Avatar };
