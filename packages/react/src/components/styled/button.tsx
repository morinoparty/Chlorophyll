"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { button } from "styled-system/recipes";

interface ButtonProps extends HTMLArkProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    /** 大きさ。xs 32px / sm 36px / md 40px / lg 44px(既定) / xl 48px。xs はデスクトップの密な UI 向け */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Button = ({ className, intent, size, ...props }: ButtonProps) => {
    return <ark.button {...props} className={button({ intent, size }).concat(" ", className || "")} />;
};

export type { ButtonProps };
export { Button };
