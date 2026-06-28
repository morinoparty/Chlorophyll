"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { button } from "styled-system/recipes";

interface ButtonProps extends HTMLArkProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
}

const Button = ({ className, intent, size, ...props }: ButtonProps) => {
    return <ark.button {...props} className={button({ intent, size }).concat(" ", className || "")} />;
};

export { Button };
export type { ButtonProps };
