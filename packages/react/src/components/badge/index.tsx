"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { css, cx } from "styled-system/css";
import { badge } from "styled-system/recipes";

type BadgeStatus = "success" | "warning" | "error" | "info";

// status ごとの colorPalette 切り替えクラス。
// panda は css() 呼び出し内のリテラル文字列を静的解析して CSS を生成するため、
// colorPalette に変数を渡さずここで個別に css() を呼び出して事前生成する
const STATUS_CLASS_NAME: Record<BadgeStatus, string> = {
    success: css({ colorPalette: "mori" }),
    warning: css({ colorPalette: "yellow" }),
    error: css({ colorPalette: "red" }),
    info: css({ colorPalette: "blue" }),
};

interface BadgeProps extends HTMLArkProps<"span"> {
    /** 見た目のスタイル。塗り(solid)・淡色(subtle)・枠線(outline)・淡色+枠線(surface) */
    variant?: "solid" | "subtle" | "outline" | "surface";
    /** タグの大きさ */
    size?: "sm" | "md";
    /** 状態に応じた colorPalette を自動で適用する。指定時は colorPalette prop より優先される */
    status?: BadgeStatus;
    /** ラベルの前に状態を示す小さなドットを表示する */
    dot?: boolean;
}

// ステータスやラベルを示す小さなタグ。インライン要素として配置する
const Badge = ({ className, variant, size, status, dot, children, ...props }: BadgeProps) => {
    // status が指定された場合、対応する colorPalette のクラスで上書きする
    const statusClassName = status ? STATUS_CLASS_NAME[status] : undefined;

    return (
        <ark.span {...props} className={cx(badge({ variant, size }), statusClassName, className)}>
            {dot && <span className={dotStyle} aria-hidden="true" />}
            {children}
        </ark.span>
    );
};

// ドット単体には意味がないため、装飾として扱い aria-hidden にする
const dotStyle = css({
    display: "inline-block",
    width: "0.55em",
    height: "0.55em",
    borderRadius: "full",
    bg: "colorPalette.solid",
    flexShrink: 0,
});

export { Badge };
export type { BadgeProps, BadgeStatus };
