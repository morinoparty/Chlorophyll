"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { ChevronRightIcon } from "lucide-react";
import { createContext, type ReactNode, useContext } from "react";
import { list } from "styled-system/recipes";

type ListSize = "sm" | "md";
// パネル(白カード)か、背景を透過してページ地に馴染ませる ghost か
type ListVariant = "panel" | "ghost";

// Root で指定した size を Item にも伝えるための Context。
// Compound Component なので Root と Item で同じ variant を共有する
const ListContext = createContext<ListSize>("md");

interface ListProps extends HTMLArkProps<"div"> {
    /** リスト全体の大きさ。Item にも引き継がれる */
    size?: ListSize;
    /** 背景の見せ方。panel(白カード) / ghost(背景透過) */
    variant?: ListVariant;
}

// リスト全体を包むパネル。中に ListItem を並べて使う
const ListRoot = ({ className, children, size = "md", variant = "panel", ...props }: ListProps) => {
    const styles = list({ size, variant });

    return (
        <ListContext.Provider value={size}>
            <ark.div {...props} className={styles.root.concat(" ", className || "")}>
                {children}
            </ark.div>
        </ListContext.Provider>
    );
};

interface ListItemProps extends HTMLArkProps<"button"> {
    /** 行末に表示するアイコン。未指定なら chevron-right を表示する */
    icon?: ReactNode;
}

// 押せる 1 行。ラベル(children)と行末のシェブロンで構成する
const ListItem = ({ className, children, icon, ...props }: ListItemProps) => {
    // Root から伝わった size で同じスロットスタイルを解決する
    const size = useContext(ListContext);
    const styles = list({ size });

    return (
        <ark.button type="button" {...props} className={styles.item.concat(" ", className || "")}>
            <span className={styles.label}>{children}</span>
            <span className={styles.icon}>{icon ?? <ChevronRightIcon />}</span>
        </ark.button>
    );
};

// Compound Component パターン: List.Root / List.Item で組み立てられるようにする
const List = Object.assign(ListRoot, {
    Root: ListRoot,
    Item: ListItem,
});

export { List, ListItem };
export type { ListProps, ListItemProps, ListSize, ListVariant };
