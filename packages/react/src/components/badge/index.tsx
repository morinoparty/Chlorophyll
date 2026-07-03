"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { badge } from "styled-system/recipes";

interface BadgeProps extends HTMLArkProps<"span"> {
    /** 見た目のスタイル。塗り(solid)・淡色(subtle)・枠線(outline) */
    variant?: "solid" | "subtle" | "outline";
    /** タグの大きさ */
    size?: "sm" | "md";
}

// ステータスやラベルを示す小さなタグ。インライン要素として配置する
const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
    return <ark.span {...props} className={badge({ variant, size }).concat(" ", className || "")} />;
};

export { Badge };
export type { BadgeProps };
