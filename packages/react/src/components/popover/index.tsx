"use client";
import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cx } from "styled-system/css";
import { popover } from "styled-system/recipes";

// variant を持たないため一度だけ解決すれば済む
const styles = popover();

type PopoverRootProps = ComponentProps<typeof ArkPopover.Root>;

// ポップオーバー全体の開閉状態を管理する Provider。自身は DOM を描画しない。
// positioning / modal / closeOnInteractOutside などは ArkPopover.Root の props としてそのまま透過する
const PopoverRoot = (props: PopoverRootProps) => {
    return <ArkPopover.Root {...props} />;
};

type PopoverTriggerProps = ComponentProps<typeof ArkPopover.Trigger>;

// ポップオーバーを開くトリガー。asChild で Button などに差し替えられる
const PopoverTrigger = ({ className, ...props }: PopoverTriggerProps) => {
    return <ArkPopover.Trigger {...props} className={cx(styles.trigger, className)} />;
};

type PopoverPositionerProps = ComponentProps<typeof ArkPopover.Positioner>;

// floating-ui による位置決めを担うラッパー。Portal でくるんで使うことを想定
const PopoverPositioner = ({ className, ...props }: PopoverPositionerProps) => {
    return <ArkPopover.Positioner {...props} className={cx(styles.positioner, className)} />;
};

type PopoverContentProps = ComponentProps<typeof ArkPopover.Content>;

// 白い浮遊パネル本体。role="dialog" になるため、Title を置いてアクセシブルな名前を与える
const PopoverContent = ({ className, ...props }: PopoverContentProps) => {
    return <ArkPopover.Content {...props} className={cx(styles.content, className)} />;
};

type PopoverArrowProps = ComponentProps<typeof ArkPopover.Arrow>;

// パネルの先端の三角形。表示は任意で、Content の中に置く
const PopoverArrow = ({ className, ...props }: PopoverArrowProps) => {
    return (
        <ArkPopover.Arrow {...props} className={cx(styles.arrow, className)}>
            <ArkPopover.ArrowTip />
        </ArkPopover.Arrow>
    );
};

type PopoverTitleProps = ComponentProps<typeof ArkPopover.Title>;

// 見出し。Content の aria-labelledby に結び付く
const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => {
    return <ArkPopover.Title {...props} className={cx(styles.title, className)} />;
};

type PopoverDescriptionProps = ComponentProps<typeof ArkPopover.Description>;

// 補足の説明文。Content の aria-describedby に結び付く
const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => {
    return <ArkPopover.Description {...props} className={cx(styles.description, className)} />;
};

type PopoverCloseTriggerProps = ComponentProps<typeof ArkPopover.CloseTrigger>;

// 閉じるボタン。children を渡さなければ既定で ×アイコンを表示する(読み上げ用のラベルは Ark が付ける)
const PopoverCloseTrigger = ({ className, children, ...props }: PopoverCloseTriggerProps) => {
    return (
        <ArkPopover.CloseTrigger {...props} className={cx(styles.closeTrigger, className)}>
            {children ?? <XIcon />}
        </ArkPopover.CloseTrigger>
    );
};

// Compound Component パターン: Popover.Root / Trigger / Positioner / Content / Arrow / Title / Description / CloseTrigger
const Popover = Object.assign(PopoverRoot, {
    Root: PopoverRoot,
    Trigger: PopoverTrigger,
    Positioner: PopoverPositioner,
    Content: PopoverContent,
    Arrow: PopoverArrow,
    Title: PopoverTitle,
    Description: PopoverDescription,
    CloseTrigger: PopoverCloseTrigger,
});

export type {
    PopoverArrowProps,
    PopoverCloseTriggerProps,
    PopoverContentProps,
    PopoverDescriptionProps,
    PopoverPositionerProps,
    PopoverRootProps,
    PopoverTitleProps,
    PopoverTriggerProps,
};
export { Popover };
