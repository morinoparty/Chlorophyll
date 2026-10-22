"use client";
import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { dialog } from "styled-system/recipes";

// Content の最大幅。sm = 確認ダイアログ、md = 標準、lg = フォームや長文
type DialogSize = "sm" | "md" | "lg";

// Portal は DOM の描画先を変えるだけで React ツリー(Context)は分断されないが、
// Content は独立した子コンポーネントとして呼び出されるため、
// props のバケツリレーを避けて Context で size を配る
const DialogSizeContext = createContext<DialogSize>("md");

// size に依存しないスロットは一度だけ解決すれば済む
const styles = dialog();

type DialogRootProps = ComponentProps<typeof ArkDialog.Root> & {
    /** Content の最大幅。sm / md / lg。既定は md */
    size?: DialogSize;
};

/**
 * Dialog 全体の開閉状態を管理する Root。zag の Dialog と同じく DOM は持たない。
 *
 * - フォーカストラップ・背面のスクロール抑止・Esc / 背景クリックで閉じる挙動は Ark が担う
 * - 確認ダイアログなど、ユーザーの応答が必要なものは role="alertdialog" を渡す
 *   (開いたときに CloseTrigger へ初期フォーカスが移る)
 */
const DialogRoot = ({ size = "md", ...props }: DialogRootProps) => {
    return (
        <DialogSizeContext.Provider value={size}>
            <ArkDialog.Root {...props} />
        </DialogSizeContext.Provider>
    );
};

type DialogTriggerProps = ComponentProps<typeof ArkDialog.Trigger>;

// Dialog を開くトリガー。asChild で Button などに差し替え可能
const DialogTrigger = ({ className, ...props }: DialogTriggerProps) => {
    // asChild のときは差し替え先(Button など)の見た目を優先する。
    // slotRecipes の base は recipes の base より後のレイヤーに出るため、混ぜると角丸などを上書きしてしまう
    return <ArkDialog.Trigger {...props} className={props.asChild ? className : cx(styles.trigger, className)} />;
};

type DialogBackdropProps = ComponentProps<typeof ArkDialog.Backdrop>;

// 画面全体を覆う半透明の暗転レイヤー。開閉に合わせてフェードする
const DialogBackdrop = ({ className, ...props }: DialogBackdropProps) => {
    return <ArkDialog.Backdrop {...props} className={cx(styles.backdrop, className)} />;
};

type DialogPositionerProps = ComponentProps<typeof ArkDialog.Positioner>;

// Content を画面中央に配置するレイヤー
const DialogPositioner = ({ className, ...props }: DialogPositionerProps) => {
    return <ArkDialog.Positioner {...props} className={cx(styles.positioner, className)} />;
};

type DialogContentProps = ComponentProps<typeof ArkDialog.Content>;

// ダイアログ本体のパネル。最大幅は Root の size から Context 経由で受け取る
const DialogContent = ({ className, ...props }: DialogContentProps) => {
    const size = useContext(DialogSizeContext);
    const contentClass = dialog({ size }).content;
    return <ArkDialog.Content {...props} className={cx(contentClass, className)} />;
};

type DialogHeaderProps = HTMLArkProps<"div">;

// Title と Description をまとめる見出し領域
const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
    return <ark.div {...props} className={cx(styles.header, className)} />;
};

type DialogTitleProps = ComponentProps<typeof ArkDialog.Title>;

// 見出し。Ark が Content の aria-labelledby と関連付ける
const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
    return <ArkDialog.Title {...props} className={cx(styles.title, className)} />;
};

type DialogDescriptionProps = ComponentProps<typeof ArkDialog.Description>;

// 見出しの補足。Ark が Content の aria-describedby と関連付ける
const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
    return <ArkDialog.Description {...props} className={cx(styles.description, className)} />;
};

type DialogBodyProps = HTMLArkProps<"div">;

// 本文。内容が画面に収まらないときはここだけがスクロールする
const DialogBody = ({ className, ...props }: DialogBodyProps) => {
    return <ark.div {...props} className={cx(styles.body, className)} />;
};

type DialogFooterProps = HTMLArkProps<"div">;

// 操作ボタンを右寄せで並べる領域
const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
    return <ark.div {...props} className={cx(styles.footer, className)} />;
};

type DialogCloseTriggerProps = ComponentProps<typeof ArkDialog.CloseTrigger>;

/**
 * 閉じるボタン。children を渡さなければ右上に ×アイコンを表示する。
 * Footer の「キャンセル」ボタンとして使うときは asChild で Button に差し替える
 */
const DialogCloseTrigger = ({ className, children, ...props }: DialogCloseTriggerProps) => {
    // 既定の ×アイコンは文字を持たないため、支援技術向けの名前を補う
    const ariaLabel = props["aria-label"] ?? (children ? undefined : "閉じる");
    // asChild のときは Footer のボタンとして使う想定なので、右上に固定する見た目を当てない
    return (
        <ArkDialog.CloseTrigger
            {...props}
            aria-label={ariaLabel}
            className={props.asChild ? className : cx(styles.closeTrigger, className)}
        >
            {children ?? <XIcon />}
        </ArkDialog.CloseTrigger>
    );
};

// Compound Component パターン:
// Dialog.Root / Trigger / Backdrop / Positioner / Content / Header / Title / Description / Body / Footer / CloseTrigger
const Dialog = Object.assign(DialogRoot, {
    Root: DialogRoot,
    Trigger: DialogTrigger,
    Backdrop: DialogBackdrop,
    Positioner: DialogPositioner,
    Content: DialogContent,
    Header: DialogHeader,
    Title: DialogTitle,
    Description: DialogDescription,
    Body: DialogBody,
    Footer: DialogFooter,
    CloseTrigger: DialogCloseTrigger,
});

export { Dialog };
export type {
    DialogRootProps,
    DialogTriggerProps,
    DialogBackdropProps,
    DialogPositionerProps,
    DialogContentProps,
    DialogHeaderProps,
    DialogTitleProps,
    DialogDescriptionProps,
    DialogBodyProps,
    DialogFooterProps,
    DialogCloseTriggerProps,
    DialogSize,
};
