"use client";
import { Accordion as ArkAccordion } from "@ark-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { accordion } from "styled-system/recipes";

// root 以外のスロットは variant に依存しないため一度だけ解決すれば済む
const styles = accordion();

// パネル(白カード)か、背景を透過してページ地に馴染ませる ghost か
type AccordionVariant = "panel" | "ghost";

type AccordionRootProps = ComponentProps<typeof ArkAccordion.Root> & {
    /** 背景の見せ方。panel(白カード) / ghost(背景透過) */
    variant?: AccordionVariant;
};

// アコーディオン全体を包むパネル
const AccordionRoot = ({ className, variant = "panel", ...props }: AccordionRootProps) => {
    // 背景色は variant で変わるため root だけ variant 込みで解決する
    const rootClass = accordion({ variant }).root;
    return <ArkAccordion.Root {...props} className={rootClass.concat(" ", className || "")} />;
};

type AccordionItemProps = ComponentProps<typeof ArkAccordion.Item>;

// 1 項目。value で開閉状態を識別する
const AccordionItem = ({ className, ...props }: AccordionItemProps) => {
    return <ArkAccordion.Item {...props} className={styles.item.concat(" ", className || "")} />;
};

type AccordionItemTriggerProps = ComponentProps<typeof ArkAccordion.ItemTrigger>;

// 見出し行。children(タイトル)の右に開閉インジケーターを自動で付ける
const AccordionItemTrigger = ({ className, children, ...props }: AccordionItemTriggerProps) => {
    return (
        <ArkAccordion.ItemTrigger {...props} className={styles.itemTrigger.concat(" ", className || "")}>
            {children}
            <ArkAccordion.ItemIndicator className={styles.itemIndicator}>
                <ChevronDownIcon />
            </ArkAccordion.ItemIndicator>
        </ArkAccordion.ItemTrigger>
    );
};

type AccordionItemContentProps = ComponentProps<typeof ArkAccordion.ItemContent>;

// 開いたときに表示される本文
const AccordionItemContent = ({ className, ...props }: AccordionItemContentProps) => {
    return <ArkAccordion.ItemContent {...props} className={styles.itemContent.concat(" ", className || "")} />;
};

// Compound Component パターン: Accordion.Root / Item / ItemTrigger / ItemContent
const Accordion = Object.assign(AccordionRoot, {
    Root: AccordionRoot,
    Item: AccordionItem,
    ItemTrigger: AccordionItemTrigger,
    ItemContent: AccordionItemContent,
});

export { Accordion };
export type {
    AccordionRootProps,
    AccordionItemProps,
    AccordionItemTriggerProps,
    AccordionItemContentProps,
    AccordionVariant,
};
