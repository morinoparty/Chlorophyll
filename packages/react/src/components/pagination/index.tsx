"use client";
import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import type { ComponentProps } from "react";
import { cx } from "styled-system/css";
import { pagination } from "styled-system/recipes";

// variant を持たないレシピなので、スロットのクラスは一度だけ解決すれば済む
const styles = pagination();

type PaginationRootProps = ComponentProps<typeof ArkPagination.Root>;

// ページ送り全体を包む <nav>。
// count(総件数) と pageSize からページ数を計算する。
// ?page= のリンク遷移で使うときは type="link" と getPageUrl を渡し、
// page を props で制御する(クライアント状態に持たない)
const PaginationRoot = ({ className, ...props }: PaginationRootProps) => {
    return <ArkPagination.Root {...props} className={cx(styles.root, className)} />;
};

type PaginationPrevTriggerProps = ComponentProps<typeof ArkPagination.PrevTrigger>;

// 前ページへ。asChild で <a>/<Link> を差し込める。
// 先頭ページでは zag が data-disabled を付けるので、href を外したアンカーを渡せばよい
const PaginationPrevTrigger = ({ className, ...props }: PaginationPrevTriggerProps) => {
    return <ArkPagination.PrevTrigger {...props} className={cx(styles.prevTrigger, className)} />;
};

type PaginationNextTriggerProps = ComponentProps<typeof ArkPagination.NextTrigger>;

// 次ページへ。末尾ページで data-disabled が付く
const PaginationNextTrigger = ({ className, ...props }: PaginationNextTriggerProps) => {
    return <ArkPagination.NextTrigger {...props} className={cx(styles.nextTrigger, className)} />;
};

type PaginationItemProps = ComponentProps<typeof ArkPagination.Item>;

// ページ番号ひとつ。type="page" と value(ページ番号)が必須。
// 現在ページには data-selected と aria-current="page" が自動で付く
const PaginationItem = ({ className, ...props }: PaginationItemProps) => {
    return <ArkPagination.Item {...props} className={cx(styles.item, className)} />;
};

type PaginationEllipsisProps = ComponentProps<typeof ArkPagination.Ellipsis>;

// 省略記号。children に "…" などを自分で入れる
const PaginationEllipsis = ({ className, ...props }: PaginationEllipsisProps) => {
    return <ArkPagination.Ellipsis {...props} className={cx(styles.ellipsis, className)} />;
};

type PaginationContextProps = ComponentProps<typeof ArkPagination.Context>;

// Ark の Context をそのまま再 export する。
// children の render prop から pages / previousPage / nextPage などの API を受け取れる
const PaginationContext = ArkPagination.Context;

// Compound Component パターン: Pagination.Root / PrevTrigger / NextTrigger / Item / Ellipsis / Context
const Pagination = Object.assign(PaginationRoot, {
    Root: PaginationRoot,
    PrevTrigger: PaginationPrevTrigger,
    NextTrigger: PaginationNextTrigger,
    Item: PaginationItem,
    Ellipsis: PaginationEllipsis,
    Context: PaginationContext,
});

export { Pagination };
export type {
    PaginationRootProps,
    PaginationPrevTriggerProps,
    PaginationNextTriggerProps,
    PaginationItemProps,
    PaginationEllipsisProps,
    PaginationContextProps,
};
