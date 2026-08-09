"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { spinner } from "styled-system/recipes";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps extends HTMLArkProps<"div"> {
    /** 円の大きさ。sm(16px) / md(24px) / lg(32px) */
    size?: SpinnerSize;
}

// 読み込み中を示す回転インジケーター。colorPalette に応じて弧の色が変わる
const Spinner = ({ className, size, ...props }: SpinnerProps) => {
    return (
        <ark.div
            role="status"
            aria-label="読み込み中"
            {...props}
            className={spinner({ size }).concat(" ", className || "")}
        />
    );
};

export { Spinner };
export type { SpinnerProps, SpinnerSize };
