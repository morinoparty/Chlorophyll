import type { Meta, StoryObj } from "@storybook/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { userEvent } from "storybook/test";
import { Pagination } from "../../../packages/react/src/components/pagination";

const meta: Meta<typeof Pagination> = {
    title: "NAVIGATION/Pagination",
    component: Pagination,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// 10 件 x 10 ページ = 100 件のリストを想定する
const PAGE_SIZE = 10;
const TOTAL_COUNT = 100;

// ページ移動はクライアント状態ではなく ?page= のリンク遷移で行う。
// Root の getPageUrl と <a href> で同じ規則を使い、生成される href を一致させる
const pageUrl = (page: number) => `?page=${page}`;

// aria-label は zag が各トリガー/アイテムに付けてくれるので、翻訳だけ渡せばよい
const translations = {
    rootLabel: "ページ送り",
    prevTriggerLabel: "前のページ",
    nextTriggerLabel: "次のページ",
    itemLabel: ({ page }: { page: number }) => `${page} ページ目`,
};

/**
 * 現在ページを props で受け取り、リンクだけでページ送りする例。
 * 実際のアプリでは currentPage はサーバー側(searchParams など)から渡し、
 * <a> の代わりに next/link や TanStack Router の <Link> を asChild で差し込む。
 */
const LinkPagination = ({ currentPage }: { currentPage: number }) => (
    <Pagination.Root
        count={TOTAL_COUNT}
        pageSize={PAGE_SIZE}
        page={currentPage}
        siblingCount={1}
        translations={translations}
        // type="link" にすると zag が <a> に載せられない disabled 属性を付けなくなる
        type="link"
        getPageUrl={({ page }) => pageUrl(page)}
    >
        <Pagination.Context>
            {(api) => (
                <>
                    <Pagination.PrevTrigger asChild>
                        {/* 先頭ページでは遷移先が無いのでリンクではない要素に差し替える(見た目は data-disabled が担当) */}
                        {api.previousPage ? (
                            <a href={pageUrl(api.previousPage)}>
                                <ChevronLeftIcon />
                            </a>
                        ) : (
                            <span>
                                <ChevronLeftIcon />
                            </span>
                        )}
                    </Pagination.PrevTrigger>
                    {api.pages.map((entry, index) =>
                        entry.type === "page" ? (
                            <Pagination.Item key={`page-${entry.value}`} type="page" value={entry.value} asChild>
                                {/* 現在ページには data-selected と aria-current="page" が自動で付く */}
                                <a href={pageUrl(entry.value)}>{entry.value}</a>
                            </Pagination.Item>
                        ) : (
                            // biome-ignore lint/suspicious/noArrayIndexKey: 省略記号は pages 配列の位置そのものが識別子
                            <Pagination.Ellipsis key={`ellipsis-${index}`} index={index}>
                                &#8230;
                            </Pagination.Ellipsis>
                        ),
                    )}
                    <Pagination.NextTrigger asChild>
                        {api.nextPage ? (
                            <a href={pageUrl(api.nextPage)}>
                                <ChevronRightIcon />
                            </a>
                        ) : (
                            <span>
                                <ChevronRightIcon />
                            </span>
                        )}
                    </Pagination.NextTrigger>
                </>
            )}
        </Pagination.Context>
    </Pagination.Root>
);

// 中ほどのページ。前後に省略記号が出る
export const Default: Story = {
    render: () => <LinkPagination currentPage={5} />,
};

// 先頭ページ。前へ戻るトリガーが data-disabled になる
export const FirstPage: Story = {
    render: () => <LinkPagination currentPage={1} />,
};

// 末尾ページ。次へ進むトリガーが data-disabled になる
export const LastPage: Story = {
    render: () => <LinkPagination currentPage={TOTAL_COUNT / PAGE_SIZE} />,
};

// 総ページ数が少なく省略記号が出ないケース。ページ番号だけを並べる最小構成
export const FewPages: Story = {
    render: () => (
        <Pagination.Root
            count={30}
            pageSize={10}
            page={2}
            translations={translations}
            type="link"
            getPageUrl={({ page }) => pageUrl(page)}
        >
            <Pagination.Context>
                {(api) =>
                    api.pages.map((entry, index) =>
                        entry.type === "page" ? (
                            <Pagination.Item key={`page-${entry.value}`} type="page" value={entry.value} asChild>
                                <a href={pageUrl(entry.value)}>{entry.value}</a>
                            </Pagination.Item>
                        ) : (
                            // biome-ignore lint/suspicious/noArrayIndexKey: 省略記号は pages 配列の位置そのものが識別子
                            <Pagination.Ellipsis key={`ellipsis-${index}`} index={index}>
                                &#8230;
                            </Pagination.Ellipsis>
                        ),
                    )
                }
            </Pagination.Context>
        </Pagination.Root>
    ),
};

// キーボードフォーカス時のリングを VRT で押さえるためのストーリー。
// play で Tab キーを送り、先頭の「前のページ」リンクに :focus-visible を発火させる
export const Focused: Story = {
    render: () => <LinkPagination currentPage={5} />,
    play: async () => {
        await userEvent.tab();
    },
};
