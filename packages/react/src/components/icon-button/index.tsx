"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { cx } from "styled-system/css";
import { iconButton } from "styled-system/recipes";

type IconButtonVariant = "ghost" | "outline" | "solid";
type IconButtonSize = "sm" | "md" | "lg";
type IconButtonShape = "square" | "circle";

/**
 * アイコンだけを表示するボタン。
 * 見た目に文字が無いため、`aria-label`(または `aria-labelledby`)で必ず操作内容を伝えること
 */
interface IconButtonProps extends HTMLArkProps<"button"> {
    /** 見た目。ghost(既定・地なし) / outline(白い面 + 枠線) / solid(パレット色の塗り) */
    variant?: IconButtonVariant;
    /** 大きさ。sm 32px / md 40px(既定) / lg 48px */
    size?: IconButtonSize;
    /** 形。square(既定・角丸) / circle(正円) */
    shape?: IconButtonShape;
}

const IconButton = ({ className, variant, size, shape, ...props }: IconButtonProps) => {
    // フォーム内に置いたときに意図せず submit しないよう type="button" を既定にする。
    // props より前に置き、利用側が type を渡した場合はそちらを優先する。
    // asChild のときは子要素(<a> など)に type が渡ると意味が変わるため付けない
    return (
        <ark.button
            type={props.asChild ? undefined : "button"}
            {...props}
            className={cx(iconButton({ variant, size, shape }), className)}
        />
    );
};

export type { IconButtonProps, IconButtonShape, IconButtonSize, IconButtonVariant };
export { IconButton };
