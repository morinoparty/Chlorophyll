"use client";
import { Portal } from "@ark-ui/react/portal";
import {
    Toaster as ArkToaster,
    type CreateToasterProps,
    type CreateToasterReturn,
    createToaster as createArkToaster,
    Toast,
    type ToastOptions,
    type ToastType,
} from "@ark-ui/react/toast";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "styled-system/css";
import { toast as toastRecipe } from "styled-system/recipes";

// toast は variant を持たず、種別の出し分けは root の data-type で行うため一度だけ解決すれば済む
const styles = toastRecipe();

// 種別ごとの既定アイコン。loading だけはレシピ側でスピナーとして回る
const typeIcons: Record<string, ReactNode> = {
    success: <CircleCheckIcon />,
    error: <CircleAlertIcon />,
    warning: <TriangleAlertIcon />,
    info: <InfoIcon />,
    loading: <LoaderCircleIcon />,
};

/**
 * createToaster の薄いラッパー。
 * placement / pauseOnPageIdle の既定値だけ与え、残りは Ark にそのまま渡す。
 */
const createToaster = (props: CreateToasterProps = {}): CreateToasterReturn =>
    createArkToaster({
        // 画面右下に積む。日本語 UI で本文を隠しにくい位置
        placement: "bottom-end",
        // タブが非アクティブな間はタイマーを止め、戻ってきたときに読めるようにする
        pauseOnPageIdle: true,
        ...props,
    });

type ToastRootProps = ComponentProps<typeof Toast.Root>;

// 1 件分の toast のカード。Ark の Toast.Root に見た目を与えるだけ
const ToastRoot = ({ className, ...props }: ToastRootProps) => {
    return <Toast.Root {...props} className={cx(styles.root, className)} />;
};

type ToastIndicatorProps = ComponentProps<"span"> & {
    /** 表示する種別。未指定なら info 扱い */
    type?: ToastType;
};

// 種別アイコン。data-type を自分にも付けて、loading のときだけ回るようにする
const ToastIndicator = ({ className, type = "info", children, ...props }: ToastIndicatorProps) => {
    return (
        <span {...props} aria-hidden data-type={type} className={cx(styles.indicator, className)}>
            {children ?? typeIcons[type] ?? typeIcons.info}
        </span>
    );
};

type ToastContentProps = ComponentProps<"div">;

// Title + Description を縦に積むテキスト領域
const ToastContent = ({ className, ...props }: ToastContentProps) => {
    return <div {...props} className={cx(styles.content, className)} />;
};

type ToastTitleProps = ComponentProps<typeof Toast.Title>;

const ToastTitle = ({ className, ...props }: ToastTitleProps) => {
    return <Toast.Title {...props} className={cx(styles.title, className)} />;
};

type ToastDescriptionProps = ComponentProps<typeof Toast.Description>;

const ToastDescription = ({ className, ...props }: ToastDescriptionProps) => {
    return <Toast.Description {...props} className={cx(styles.description, className)} />;
};

type ToastActionTriggerProps = ComponentProps<typeof Toast.ActionTrigger>;

// 押すとアクションを実行して toast を閉じるボタン
const ToastActionTrigger = ({ className, ...props }: ToastActionTriggerProps) => {
    return <Toast.ActionTrigger {...props} className={cx(styles.actionTrigger, className)} />;
};

type ToastCloseTriggerProps = ComponentProps<typeof Toast.CloseTrigger>;

// 右肩の × ボタン。children を渡さなければ X アイコンを描く
const ToastCloseTrigger = ({ className, children, ...props }: ToastCloseTriggerProps) => {
    return (
        <Toast.CloseTrigger aria-label="閉じる" {...props} className={cx(styles.closeTrigger, className)}>
            {children ?? <XIcon />}
        </Toast.CloseTrigger>
    );
};

// children を渡さなかったときに使う既定の描画。
// indicator / title / description / action / close を toast の内容に応じて出し分ける
const renderToast = (toast: ToastOptions) => (
    <ToastRoot>
        <ToastIndicator type={toast.type} />
        <ToastContent>
            {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
            {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
        </ToastContent>
        {toast.action ? <ToastActionTrigger>{toast.action.label}</ToastActionTrigger> : null}
        {toast.closable ? <ToastCloseTrigger /> : null}
    </ToastRoot>
);

type ToasterRootProps = Omit<ComponentProps<typeof ArkToaster>, "children"> & {
    /** 描画をまるごと差し替えたいときの render prop。省略すると既定のカードを描く */
    children?: (toast: ToastOptions) => ReactNode;
    /** false にすると Portal を使わず、その場に描画する */
    portalled?: boolean;
};

// toast を積むリージョン。アプリのルート付近に 1 つだけ置いて使う
const ToasterRoot = ({ children, portalled = true, ...props }: ToasterRootProps) => {
    return (
        <Portal disabled={!portalled}>
            <ArkToaster {...props}>{children ?? renderToast}</ArkToaster>
        </Portal>
    );
};

// Compound Component パターン: Toaster.Root / Toast / Indicator / Content / Title / Description / ActionTrigger / CloseTrigger
const Toaster = Object.assign(ToasterRoot, {
    Root: ToasterRoot,
    Toast: ToastRoot,
    Indicator: ToastIndicator,
    Content: ToastContent,
    Title: ToastTitle,
    Description: ToastDescription,
    ActionTrigger: ToastActionTrigger,
    CloseTrigger: ToastCloseTrigger,
});

export { createToaster, Toaster };
export type {
    CreateToasterProps,
    CreateToasterReturn,
    ToastOptions,
    ToastType,
    ToasterRootProps,
    ToastRootProps,
    ToastIndicatorProps,
    ToastContentProps,
    ToastTitleProps,
    ToastDescriptionProps,
    ToastActionTriggerProps,
    ToastCloseTriggerProps,
};
