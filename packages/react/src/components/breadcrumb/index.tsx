"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { ChevronRightIcon, EllipsisIcon } from "lucide-react";
import { cx } from "styled-system/css";
import { breadcrumb } from "styled-system/recipes";

// variant を持たないレシピなので、スロットのクラスは一度だけ解決すれば済む
const styles = breadcrumb();

// Ark UI にはパンくずのプリミティブが無いため、セマンティックな HTML(nav > ol > li)を
// ark ファクトリで描画する。ark 経由にしておくと全パーツで asChild が使え、
// ルーターの Link などを差し込める
//
// 組み立て方(Separator は <li> なので List 直下、Ellipsis は <span> なので Item の中に置く):
//
// <Breadcrumb.Root>
//   <Breadcrumb.List>
//     <Breadcrumb.Item>
//       <Breadcrumb.Link href="/">ホーム</Breadcrumb.Link>
//     </Breadcrumb.Item>
//     <Breadcrumb.Separator />
//     <Breadcrumb.Item>
//       <Breadcrumb.Ellipsis />
//     </Breadcrumb.Item>
//     <Breadcrumb.Separator />
//     <Breadcrumb.Item>
//       <Breadcrumb.Page>現在のページ</Breadcrumb.Page>
//     </Breadcrumb.Item>
//   </Breadcrumb.List>
// </Breadcrumb.Root>

type BreadcrumbRootProps = HTMLArkProps<"nav">;

// パンくず全体を包む <nav> landmark。
// 支援技術がページ内の複数の nav を区別できるよう既定で aria-label を持たせる。
// 日本語で読ませたい場合は aria-label="パンくずリスト" のように props で上書きする
const BreadcrumbRoot = ({ className, ...props }: BreadcrumbRootProps) => {
    return <ark.nav aria-label="Breadcrumb" {...props} className={cx(styles.root, className)} />;
};

type BreadcrumbListProps = HTMLArkProps<"ol">;

// 段を並べる <ol>。順序付きリストにすることで階層の並びが読み上げにも伝わる
const BreadcrumbList = ({ className, ...props }: BreadcrumbListProps) => {
    return <ark.ol {...props} className={cx(styles.list, className)} />;
};

type BreadcrumbItemProps = HTMLArkProps<"li">;

// 段ひとつ分の <li>。中に Link か Page(または Ellipsis)を 1 つ置く
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
    return <ark.li {...props} className={cx(styles.item, className)} />;
};

type BreadcrumbLinkProps = HTMLArkProps<"a">;

// 祖先ページへのリンク。既定では <a href> を描画する。
// SPA のルーターを使う場合は asChild でルーターの Link を差し込む(ルーター非依存):
//
//   // TanStack Router
//   <Breadcrumb.Link asChild>
//     <Link to="/railway" activeOptions={{ exact: true }}>鉄道</Link>
//   </Breadcrumb.Link>
//
//   // Next.js
//   <Breadcrumb.Link asChild>
//     <NextLink href="/railway">鉄道</NextLink>
//   </Breadcrumb.Link>
//
// TanStack Router の Link は「現在地の前方一致」で active と判定して aria-current="page" を
// 付けるため、祖先が軒並み現在ページを名乗ってしまう。exact 一致に絞ると末尾の Page だけが現在地になる
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
    return <ark.a {...props} className={cx(styles.link, className)} />;
};

type BreadcrumbPageProps = HTMLArkProps<"span">;

// 現在地の段。リンクにはせず aria-current="page" で現在のページであることを伝える
const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => {
    return <ark.span aria-current="page" {...props} className={cx(styles.page, className)} />;
};

type BreadcrumbSeparatorProps = HTMLArkProps<"li">;

// 段の区切り。children 未指定なら chevron を表示し、"/" などの文字にも差し替えられる。
// 読み上げでは不要な装飾なので aria-hidden にし、<li> には role="presentation" を付けて
// リストの項目数(「n 項目中 m 項目目」)を狂わせないようにする
const BreadcrumbSeparator = ({ className, children, ...props }: BreadcrumbSeparatorProps) => {
    return (
        <ark.li role="presentation" aria-hidden="true" {...props} className={cx(styles.separator, className)}>
            {children ?? <ChevronRightIcon />}
        </ark.li>
    );
};

type BreadcrumbEllipsisProps = HTMLArkProps<"span">;

// 長い階層を畳んだことを示す省略記号。Item の中に置いて使う。
// 畳まれた段はそもそも DOM に無く、省略記号を読み上げても辿れる先が無いので
// アイコンのみの aria-hidden な装飾にとどめる(aria-hidden の中に読み上げ用の
// 隠しテキストを置いても読まれないため、あえて入れない)
const BreadcrumbEllipsis = ({ className, children, ...props }: BreadcrumbEllipsisProps) => {
    return (
        <ark.span role="presentation" aria-hidden="true" {...props} className={cx(styles.ellipsis, className)}>
            {children ?? <EllipsisIcon />}
        </ark.span>
    );
};

// Compound Component パターン: Breadcrumb.Root / List / Item / Link / Page / Separator / Ellipsis
const Breadcrumb = Object.assign(BreadcrumbRoot, {
    Root: BreadcrumbRoot,
    List: BreadcrumbList,
    Item: BreadcrumbItem,
    Link: BreadcrumbLink,
    Page: BreadcrumbPage,
    Separator: BreadcrumbSeparator,
    Ellipsis: BreadcrumbEllipsis,
});

export { Breadcrumb };
export type {
    BreadcrumbRootProps,
    BreadcrumbListProps,
    BreadcrumbItemProps,
    BreadcrumbLinkProps,
    BreadcrumbPageProps,
    BreadcrumbSeparatorProps,
    BreadcrumbEllipsisProps,
};
