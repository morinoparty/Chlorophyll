"use client";
import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import type { ComponentProps } from "react";
import { cx } from "styled-system/css";
import { tooltip } from "styled-system/recipes";

// content/arrow 以外は variant を持たないため一度だけ解決すれば済む
const styles = tooltip();

type TooltipRootProps = ComponentProps<typeof ArkTooltip.Root>;

// ツールチップ全体の開閉状態を管理する Provider。自身は DOM を描画しない。
// openDelay/closeDelay などは ArkTooltip.Root の props としてそのまま透過する
const TooltipRoot = (props: TooltipRootProps) => {
    return <ArkTooltip.Root {...props} />;
};

type TooltipTriggerProps = ComponentProps<typeof ArkTooltip.Trigger>;

// ツールチップを表示させる対象。見た目は持たせず素の button として描画する
const TooltipTrigger = (props: TooltipTriggerProps) => {
    return <ArkTooltip.Trigger {...props} />;
};

type TooltipPositionerProps = ComponentProps<typeof ArkTooltip.Positioner>;

// floating-ui による位置決めを担うラッパー。Portal でくるんで使うことを想定
const TooltipPositioner = ({ className, ...props }: TooltipPositionerProps) => {
    return <ArkTooltip.Positioner {...props} className={cx(styles.positioner, className)} />;
};

type TooltipContentProps = ComponentProps<typeof ArkTooltip.Content>;

// 実際に表示される吹き出し本体
const TooltipContent = ({ className, ...props }: TooltipContentProps) => {
    return <ArkTooltip.Content {...props} className={cx(styles.content, className)} />;
};

type TooltipArrowProps = ComponentProps<typeof ArkTooltip.Arrow>;

// 吹き出しの先端の三角形。表示は任意
const TooltipArrow = ({ className, ...props }: TooltipArrowProps) => {
    return (
        <ArkTooltip.Arrow {...props} className={cx(styles.arrow, className)}>
            <ArkTooltip.ArrowTip />
        </ArkTooltip.Arrow>
    );
};

// Compound Component パターン: Tooltip.Root / Trigger / Positioner / Content / Arrow
const Tooltip = Object.assign(TooltipRoot, {
    Root: TooltipRoot,
    Trigger: TooltipTrigger,
    Positioner: TooltipPositioner,
    Content: TooltipContent,
    Arrow: TooltipArrow,
});

export { Tooltip };
export type { TooltipRootProps, TooltipTriggerProps, TooltipPositionerProps, TooltipContentProps, TooltipArrowProps };
