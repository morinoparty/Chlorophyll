"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { cx } from "styled-system/css";
import { modalDialog } from "styled-system/recipes";

// overlay/positioner 以外のスロットは variant に依存しないため一度だけ解決すれば済む
const styles = modalDialog();

type ModalDialogRootProps = HTMLArkProps<"div"> & {
    /** フルページ表示。暗幕とアニメーションを止め、ページの地色の上に直接置く */
    isPage?: boolean;
    /**
     * 閉じるときに呼ばれる。背景クリック → 退場アニメーション完了のタイミングで発火する。
     * 未指定のときだけ window.history.back() にフォールバックする(移植元の挙動)
     */
    onClose?: () => void;
};

// 暗幕 + 退場アニメーションを担う最上位。children には Container を置く
const ModalDialogRoot = ({ className, children, isPage = false, onClose, onClick, ...props }: ModalDialogRootProps) => {
    const [isExiting, setIsExiting] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    // animationend のリスナーを張り直さずに最新の onClose を読むための保持
    const onCloseRef = useRef(onClose);
    const slots = modalDialog({ isPage, isExiting });

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // モーダル表示中は背面のスクロールを止める(フルページ表示のときは不要)
    useEffect(() => {
        if (isPage) {
            return;
        }
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isPage]);

    // 退場アニメーションが終わってから実際のクローズ処理を走らせる
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!isExiting || !overlay) {
            return;
        }
        let hasClosed = false;

        const handleAnimationEnd = (event: AnimationEvent) => {
            // overlay 自身のアニメーションのみを処理し、子要素からの伝播や重複実行を防ぐ
            if (event.target !== overlay || hasClosed) {
                return;
            }
            hasClosed = true;
            if (onCloseRef.current) {
                onCloseRef.current();
            } else {
                // 移植元は履歴を1つ戻ることでモーダルを閉じていた
                window.history.back();
            }
        };

        overlay.addEventListener("animationend", handleAnimationEnd);
        return () => {
            overlay.removeEventListener("animationend", handleAnimationEnd);
        };
    }, [isExiting]);

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
        onClick?.(event);
        // 暗幕そのものを踏んだときだけ閉じる(中身のクリックでは閉じない)
        if (!isPage && event.target === event.currentTarget) {
            setIsExiting(true);
        }
    };

    return (
        <ark.div {...props} ref={overlayRef} className={cx(slots.overlay, className)} onClick={handleOverlayClick}>
            <div className={slots.positioner}>{children}</div>
        </ark.div>
    );
};

type ModalDialogContainerProps = HTMLArkProps<"div"> & {
    /** main 領域を title/footer と同じ左右余白に揃える */
    hasMainPadding?: boolean;
};

// ダイアログ本体の枠。Title / Content / Footer を grid に配置する
const ModalDialogContainer = ({ className, hasMainPadding = false, ...props }: ModalDialogContainerProps) => {
    // 余白の取り方が variant で変わるため container だけ variant 込みで解決する
    const containerClass = modalDialog({ hasMainPadding }).container;
    return <ark.div {...props} className={cx(containerClass, className)} />;
};

type ModalDialogTitleProps = HTMLArkProps<"div">;

// 見出し領域。asChild で <h2> などに差し替えられる
const ModalDialogTitle = ({ className, ...props }: ModalDialogTitleProps) => {
    return <ark.div {...props} className={cx(styles.title, className)} />;
};

type ModalDialogContentProps = HTMLArkProps<"div">;

// 本文領域(grid の main)
const ModalDialogContent = ({ className, ...props }: ModalDialogContentProps) => {
    return <ark.div {...props} className={cx(styles.content, className)} />;
};

type ModalDialogFooterProps = HTMLArkProps<"div">;

// 操作ボタンを並べる領域
const ModalDialogFooter = ({ className, ...props }: ModalDialogFooterProps) => {
    return <ark.div {...props} className={cx(styles.footer, className)} />;
};

// Compound Component パターン: ModalDialog.Root / Container / Title / Content / Footer
const ModalDialog = Object.assign(ModalDialogRoot, {
    Root: ModalDialogRoot,
    Container: ModalDialogContainer,
    Title: ModalDialogTitle,
    Content: ModalDialogContent,
    Footer: ModalDialogFooter,
});

export { ModalDialog };
export type {
    ModalDialogRootProps,
    ModalDialogContainerProps,
    ModalDialogTitleProps,
    ModalDialogContentProps,
    ModalDialogFooterProps,
};
