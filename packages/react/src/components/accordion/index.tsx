"use client";
import { Accordion as ArkAccordion } from "@ark-ui/react/accordion";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { accordion } from "styled-system/recipes";

// variant を持たないためスロットクラスは一度だけ解決すれば済む
const styles = accordion();

type AccordionRootProps = ComponentProps<typeof ArkAccordion.Root>;

// アコーディオン全体を包むパネル
const AccordionRoot = ({ className, ...props }: AccordionRootProps) => {
    return <ArkAccordion.Root {...props} className={styles.root.concat(" ", className || "")} />;
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
export type { AccordionRootProps, AccordionItemProps, AccordionItemTriggerProps, AccordionItemContentProps };
