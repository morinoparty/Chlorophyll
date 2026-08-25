"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { createContext, type ReactNode, type RefObject, useContext, useEffect, useRef, useState } from "react";
import { cx } from "styled-system/css";
import { table } from "styled-system/recipes";

type TableSize = "sm" | "md";

interface TableVariants {
    /** 表全体の大きさ。見出し・セルの余白に効く */
    size: TableSize;
    /** 本文の偶数行に薄い地色を敷く */
    striped: boolean;
}

// Root で指定した variant を各パーツにも伝えるための Context。
// Compound Component なので Root と Head / Cell / Body で同じスロットスタイルを共有する
const TableContext = createContext<TableVariants>({ size: "md", striped: false });

// Context の variant で各スロットのクラスを解決する
const useTableStyles = () => table(useContext(TableContext));

interface TableRootProps extends HTMLArkProps<"table"> {
    /** 表全体の大きさ。Head / Cell にも引き継がれる。既定は md */
    size?: TableSize;
    /** 本文の偶数行に薄い地色を敷いて行を追いやすくする */
    striped?: boolean;
    /**
     * 表が横にはみ出してスクロールできるようになったとき、スクロール領域(role="region")に付ける名前。
     * スクリーンリーダーが「何の領域に着地したか」を読み上げるために使う。既定は「横にスクロールできる表」
     */
    scrollAreaLabel?: string;
}

// スクロールコンテナが横にはみ出しているか(scrollWidth > clientWidth)を監視する。
// コンテナ自身の幅と、中身である <table> の幅のどちらが変わってもはみ出し具合が変わるため、
// ResizeObserver で両方を観測する。SSR や初回描画では false とし、マウント後の計測で更新する
const useIsOverflowingX = (ref: RefObject<HTMLElement | null>) => {
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const measure = () => setIsOverflowing(element.scrollWidth > element.clientWidth);
        measure();

        // ResizeObserver が無い環境(古いブラウザ・テスト環境)では初回計測だけで済ませる
        if (typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(measure);
        observer.observe(element);
        // 中身の <table> は列やデータの増減で幅が変わるので、こちらも観測対象にする
        const content = element.firstElementChild;
        if (content) observer.observe(content);

        return () => observer.disconnect();
    }, [ref]);

    return isOverflowing;
};

// 横スクロールコンテナ(div)と <table> をまとめて描画する Root。
// className と残りの props はスクロールコンテナではなく <table> に渡す。
// 利用側から見た「Table」は表そのものであり、asChild や aria 属性・className は
// <table> に当たるのが自然なため。コンテナは幅と枠線だけを担う内部要素として扱う
const TableRoot = ({
    className,
    children,
    size = "md",
    striped = false,
    scrollAreaLabel = "横にスクロールできる表",
    ...props
}: TableRootProps) => {
    const styles = table({ size, striped });
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const isOverflowing = useIsOverflowingX(scrollAreaRef);

    // 横にはみ出した表をキーボードでもスクロールできるよう、実際にはみ出しているときだけ
    // コンテナをフォーカス可能にする(axe の scrollable-region-focusable / WCAG 2.1.1)。
    // 常に tabIndex を付けると、収まっている表まで無名のタブストップになってしまうため条件付きにする。
    // フォーカスできる要素には何の領域かを伝える名前が必要なので、role="region" と aria-label を必ずセットで付ける
    // (role の無い div に aria-label だけ付けると axe の aria-prohibited-attr に引っかかる)。
    // フォーカス時のリングは recipe の root 側で描く
    const scrollAreaProps = isOverflowing ? { tabIndex: 0, role: "region", "aria-label": scrollAreaLabel } : {};

    return (
        <TableContext.Provider value={{ size, striped }}>
            <div ref={scrollAreaRef} className={styles.root} {...scrollAreaProps}>
                <ark.table {...props} className={cx(styles.table, className)}>
                    {children}
                </ark.table>
            </div>
        </TableContext.Provider>
    );
};

type TableHeaderProps = HTMLArkProps<"thead">;

// 見出し行のグループ(thead)
const TableHeader = ({ className, ...props }: TableHeaderProps) => {
    const styles = useTableStyles();
    return <ark.thead {...props} className={cx(styles.header, className)} />;
};

type TableBodyProps = HTMLArkProps<"tbody">;

// 本文の行グループ(tbody)。striped の縞模様と最終行の下線消しはここで扱う
const TableBody = ({ className, ...props }: TableBodyProps) => {
    const styles = useTableStyles();
    return <ark.tbody {...props} className={cx(styles.body, className)} />;
};

type TableFooterProps = HTMLArkProps<"tfoot">;

// 合計行などを置くフッター(tfoot)
const TableFooter = ({ className, ...props }: TableFooterProps) => {
    const styles = useTableStyles();
    return <ark.tfoot {...props} className={cx(styles.footer, className)} />;
};

type TableRowProps = HTMLArkProps<"tr">;

// 1 行(tr)。data-state="selected" を付けると選択中として淡く塗られる
const TableRow = ({ className, ...props }: TableRowProps) => {
    const styles = useTableStyles();
    return <ark.tr {...props} className={cx(styles.row, className)} />;
};

type TableHeadProps = HTMLArkProps<"th">;

// 見出しセル(th)。列見出しとして使うことが大半なので scope は col を既定にし、
// 行見出しに使う場合は scope="row" で上書きする
const TableHead = ({ className, scope = "col", ...props }: TableHeadProps) => {
    const styles = useTableStyles();
    return <ark.th scope={scope} {...props} className={cx(styles.head, className)} />;
};

type TableCellProps = HTMLArkProps<"td">;

// データセル(td)
const TableCell = ({ className, ...props }: TableCellProps) => {
    const styles = useTableStyles();
    return <ark.td {...props} className={cx(styles.cell, className)} />;
};

type TableCaptionProps = HTMLArkProps<"caption">;

// 表の説明文(caption)。HTML の制約で <table> の先頭に置く必要があるが、
// caption-side: bottom で見た目は表の下に表示される
const TableCaption = ({ className, ...props }: TableCaptionProps) => {
    const styles = useTableStyles();
    return <ark.caption {...props} className={cx(styles.caption, className)} />;
};

interface TableEmptyProps extends Omit<HTMLArkProps<"td">, "colSpan"> {
    /** プレースホルダーを表の全幅に広げるための列数。表の列数と一致させる */
    colSpan: number;
    /** 表示する文言。未指定なら「データがありません」 */
    children?: ReactNode;
}

// データが 1 件も無いときのプレースホルダー行。
// 一覧画面を作るたびに書くことになる colSpan 付きの行をまとめたもの。
// hover の地色が付かないよう tr には row のクラスを付けない(最終行の下線消しは tbody 側で効く)
const TableEmpty = ({ className, colSpan, children = "データがありません", ...props }: TableEmptyProps) => {
    const styles = useTableStyles();
    return (
        <tr>
            <ark.td colSpan={colSpan} {...props} className={cx(styles.empty, className)}>
                {children}
            </ark.td>
        </tr>
    );
};

// Compound Component パターン: Table.Root / Header / Body / Footer / Row / Head / Cell / Caption / Empty
const Table = Object.assign(TableRoot, {
    Root: TableRoot,
    Header: TableHeader,
    Body: TableBody,
    Footer: TableFooter,
    Row: TableRow,
    Head: TableHead,
    Cell: TableCell,
    Caption: TableCaption,
    Empty: TableEmpty,
});

export { Table };
export type {
    TableRootProps,
    TableHeaderProps,
    TableBodyProps,
    TableFooterProps,
    TableRowProps,
    TableHeadProps,
    TableCellProps,
    TableCaptionProps,
    TableEmptyProps,
    TableSize,
};
