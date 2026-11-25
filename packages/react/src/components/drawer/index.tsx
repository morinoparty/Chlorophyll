"use client";
import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { drawer } from "styled-system/recipes";

// アンカー位置とスライド方向。start = 画面左、end = 画面右、bottom = 画面下(ボトムシート)、top = 画面上
type DrawerPlacement = "start" | "end" | "bottom" | "top";

// Portal は DOM の描画先を変えるだけで React ツリー(Context)は分断されないが、
// Positioner/Content は独立した子コンポーネントとして呼び出されるため、
// props のバケツリレーを避けて Context で placement を配る
const DrawerPlacementContext = createContext<DrawerPlacement>("end");

// placement に依存しないスロットは一度だけ解決すれば済む
const styles = drawer();

type DrawerRootProps = ComponentProps<typeof ArkDialog.Root> & {
    /** スライド方向とアンカー位置。start(画面左) / end(画面右) / bottom(画面下) / top(画面上)。既定は end */
    placement?: DrawerPlacement;
};

// Drawer 全体の開閉状態を管理する Root。zag の Dialog と同じく DOM は持たない
const DrawerRoot = ({ placement = "end", ...props }: DrawerRootProps) => {
    return (
        <DrawerPlacementContext.Provider value={placement}>
            <ArkDialog.Root {...props} />
        </DrawerPlacementContext.Provider>
    );
};

type DrawerTriggerProps = ComponentProps<typeof ArkDialog.Trigger>;

// Drawer を開くトリガー。asChild で IconButton などに差し替え可能
const DrawerTrigger = ({ className, ...props }: DrawerTriggerProps) => {
    return <ArkDialog.Trigger {...props} className={cx(styles.trigger, className)} />;
};

type DrawerBackdropProps = ComponentProps<typeof ArkDialog.Backdrop>;

// 画面全体を覆う半透明の暗転レイヤー。開くときにフェードインし、閉じるときにフェードアウトする
const DrawerBackdrop = ({ className, ...props }: DrawerBackdropProps) => {
    return <ArkDialog.Backdrop {...props} className={cx(styles.backdrop, className)} />;
};

type DrawerPositionerProps = ComponentProps<typeof ArkDialog.Positioner>;

// Content を画面端に寄せて配置するレイヤー。placement は Root から Context 経由で受け取る
const DrawerPositioner = ({ className, ...props }: DrawerPositionerProps) => {
    const placement = useContext(DrawerPlacementContext);
    const positionerClass = drawer({ placement }).positioner;
    return <ArkDialog.Positioner {...props} className={cx(positionerClass, className)} />;
};

type DrawerContentProps = ComponentProps<typeof ArkDialog.Content>;

// 画面端からスライドインしてくるパネル本体。閉じるときは同じ画面端へスライドアウトする
const DrawerContent = ({ className, ...props }: DrawerContentProps) => {
    const placement = useContext(DrawerPlacementContext);
    const contentClass = drawer({ placement }).content;
    return <ArkDialog.Content {...props} className={cx(contentClass, className)} />;
};

type DrawerHandleProps = ComponentProps<"div">;

// bottom / top のシート上端に置くつまみ。ドラッグ操作は持たない見た目だけのパーツなので、支援技術からは隠す
const DrawerHandle = ({ className, ...props }: DrawerHandleProps) => {
    return <div aria-hidden="true" {...props} className={cx(styles.handle, className)} />;
};

type DrawerCloseTriggerProps = ComponentProps<typeof ArkDialog.CloseTrigger>;

// 閉じるボタン。children を渡さなければ既定で ×アイコンを表示する
const DrawerCloseTrigger = ({ className, children, ...props }: DrawerCloseTriggerProps) => {
    return (
        <ArkDialog.CloseTrigger {...props} className={cx(styles.closeTrigger, className)}>
            {children ?? <XIcon />}
        </ArkDialog.CloseTrigger>
    );
};

type DrawerTitleProps = ComponentProps<typeof ArkDialog.Title>;

// 見出し
const DrawerTitle = ({ className, ...props }: DrawerTitleProps) => {
    return <ArkDialog.Title {...props} className={cx(styles.title, className)} />;
};

// Compound Component パターン: Drawer.Root / Trigger / Backdrop / Positioner / Content / Handle / CloseTrigger / Title
const Drawer = Object.assign(DrawerRoot, {
    Root: DrawerRoot,
    Trigger: DrawerTrigger,
    Backdrop: DrawerBackdrop,
    Positioner: DrawerPositioner,
    Content: DrawerContent,
    Handle: DrawerHandle,
    CloseTrigger: DrawerCloseTrigger,
    Title: DrawerTitle,
});

export type {
    DrawerBackdropProps,
    DrawerCloseTriggerProps,
    DrawerContentProps,
    DrawerHandleProps,
    DrawerPlacement,
    DrawerPositionerProps,
    DrawerRootProps,
    DrawerTitleProps,
    DrawerTriggerProps,
};
export { Drawer };
