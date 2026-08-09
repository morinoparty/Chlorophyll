"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { skeleton } from "styled-system/recipes";

type SkeletonVariant = "text" | "rect" | "circle";

interface SkeletonProps extends HTMLArkProps<"div"> {
    /** プレースホルダの形状。text(1行のテキスト) / rect(矩形) / circle(円形) */
    variant?: SkeletonVariant;
}

// 読み込み中のコンテンツ位置を示す、パルス点滅するプレースホルダ
const Skeleton = ({ className, variant, ...props }: SkeletonProps) => {
    return <ark.div aria-hidden="true" {...props} className={skeleton({ variant }).concat(" ", className || "")} />;
};

export { Skeleton };
export type { SkeletonProps, SkeletonVariant };
