"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { cx } from "styled-system/css";
import { guideCard } from "styled-system/recipes";

// カード全体を包む Root。asChild で <a> などに差し替えてリンクカードにもできる
const GuideCardRoot = ({ className, ...props }: HTMLArkProps<"div">) => {
    const styles = guideCard();
    return <ark.div {...props} className={cx(styles.root, className)} />;
};

// 左側に表示する正方形のサムネイル画像
const GuideCardImage = ({ className, alt, ...props }: HTMLArkProps<"img">) => {
    const styles = guideCard();
    return <ark.img {...props} alt={alt} className={cx(styles.image, className)} />;
};

// Title + Description を縦に並べるテキスト側の領域
const GuideCardContent = ({ className, ...props }: HTMLArkProps<"div">) => {
    const styles = guideCard();
    return <ark.div {...props} className={cx(styles.content, className)} />;
};

// カードの見出し。children の先頭にアイコン(svg)を置ける
const GuideCardTitle = ({ className, ...props }: HTMLArkProps<"h3">) => {
    const styles = guideCard();
    return <ark.h3 {...props} className={cx(styles.title, className)} />;
};

// カードの説明文
const GuideCardDescription = ({ className, ...props }: HTMLArkProps<"p">) => {
    const styles = guideCard();
    return <ark.p {...props} className={cx(styles.description, className)} />;
};

// Compound Component パターン: GuideCard.Root / Image / Content / Title / Description
const GuideCard = Object.assign(GuideCardRoot, {
    Root: GuideCardRoot,
    Image: GuideCardImage,
    Content: GuideCardContent,
    Title: GuideCardTitle,
    Description: GuideCardDescription,
});

export { GuideCard };
