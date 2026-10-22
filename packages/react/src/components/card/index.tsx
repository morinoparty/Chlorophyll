"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { card } from "styled-system/recipes";

type CardVariant = "elevated" | "outline" | "subtle";
type CardSize = "sm" | "md" | "lg";

// Root で解決したスロットのクラス名を、Header / Title / Body などの各パーツに配る Context。
// variant / size に応じてスロットの見た目が変わるため、Root で 1 回だけ解決して共有する
type CardStyles = ReturnType<typeof card>;
const CardStylesContext = createContext<CardStyles | null>(null);

const useCardStyles = (component: string): CardStyles => {
    const styles = useContext(CardStylesContext);
    if (!styles) {
        throw new Error(`Card.${component} must be used within Card.Root`);
    }
    return styles;
};

interface CardRootProps extends HTMLArkProps<"div"> {
    /**
     * 面の見せ方。既定は elevated
     * - elevated: 白いパネルを影で浮かせる(ページの地色の上に置く標準のカード)
     * - outline: 白いパネルを枠線で囲む(白い面の上に置くとき)
     * - subtle: colorPalette の淡い地色で塗る、影も枠線も無い控えめなカード
     */
    variant?: CardVariant;
    /** 余白と文字サイズ。既定は md */
    size?: CardSize;
    /**
     * リンクやボタンとして押せるカードにするか。
     * true にすると hover / active で面に色が差し、キーボード操作時にフォーカスリングが出る。
     * 要素自体は asChild で <a> / <button> に差し替える
     */
    interactive?: boolean;
}

/**
 * カード全体を包む Root。
 *
 * - asChild で <a> などに差し替えると、カード全体をリンクにできる(interactive と併用する)
 * - Header / Body / Footer は Root の直下に置く。Image は Root の先頭か末尾に置くと角丸で切り取られる
 */
const CardRoot = ({ className, variant, size, interactive, ...props }: CardRootProps) => {
    const styles = card({ variant, size, interactive });
    return (
        <CardStylesContext.Provider value={styles}>
            <ark.div {...props} className={cx(styles.root, className)} />
        </CardStylesContext.Provider>
    );
};

type CardHeaderProps = HTMLArkProps<"div">;

// Title と Description をまとめる見出し領域
const CardHeader = ({ className, ...props }: CardHeaderProps) => {
    const styles = useCardStyles("Header");
    return <ark.div {...props} className={cx(styles.header, className)} />;
};

type CardTitleProps = HTMLArkProps<"h3">;

// カードの見出し。既定は h3 で、文書構造に合わせて asChild で別の見出しレベルに差し替えられる
const CardTitle = ({ className, ...props }: CardTitleProps) => {
    const styles = useCardStyles("Title");
    return <ark.h3 {...props} className={cx(styles.title, className)} />;
};

type CardDescriptionProps = HTMLArkProps<"p">;

// 見出しを補足する説明文。本文より一段引いた文字色で表示する
const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
    const styles = useCardStyles("Description");
    return <ark.p {...props} className={cx(styles.description, className)} />;
};

type CardBodyProps = HTMLArkProps<"div">;

// 本文領域。カードの高さが揃えられたときは余白を吸収して Footer を下端へ押しやる
const CardBody = ({ className, ...props }: CardBodyProps) => {
    const styles = useCardStyles("Body");
    return <ark.div {...props} className={cx(styles.body, className)} />;
};

type CardFooterProps = HTMLArkProps<"div">;

// ボタンやメタ情報を横に並べるフッター領域
const CardFooter = ({ className, ...props }: CardFooterProps) => {
    const styles = useCardStyles("Footer");
    return <ark.div {...props} className={cx(styles.footer, className)} />;
};

type CardImageProps = HTMLArkProps<"img">;

// カードの横幅いっぱいに広げる画像。装飾目的なら alt="" を渡す
const CardImage = ({ className, ...props }: CardImageProps) => {
    const styles = useCardStyles("Image");
    return <ark.img {...props} className={cx(styles.image, className)} />;
};

// Compound Component パターン: Card.Root / Header / Title / Description / Body / Footer / Image
const Card = Object.assign(CardRoot, {
    Root: CardRoot,
    Header: CardHeader,
    Title: CardTitle,
    Description: CardDescription,
    Body: CardBody,
    Footer: CardFooter,
    Image: CardImage,
});

export { Card };
export type {
    CardRootProps,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardBodyProps,
    CardFooterProps,
    CardImageProps,
    CardVariant,
    CardSize,
};
