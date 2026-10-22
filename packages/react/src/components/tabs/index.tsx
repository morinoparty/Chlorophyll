"use client";
import { Tabs as ArkTabs } from "@ark-ui/react/tabs";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { tabs } from "styled-system/recipes";

// タブ列の見せ方。line(下線) / enclosed(白い枠の中で選択中を塗る)
type TabsVariant = "line" | "enclosed";

// Button / Select の sm / md と同じスケール
type TabsSize = "sm" | "md";

// Root で解決したスロットのクラス名を List / Trigger / Content / Indicator に配るための Context。
// variant / size は Root でしか受け取らないので、各パーツが個別にレシピを解決し直さずに済む
const TabsStylesContext = createContext(tabs());

type TabsRootProps = ComponentProps<typeof ArkTabs.Root> & {
    /** タブ列の見せ方。既定は line */
    variant?: TabsVariant;
    /** 全体の大きさ。既定は md */
    size?: TabsSize;
};

// タブ全体の状態(選択中の value)を管理する Root。
// orientation="vertical" を渡すとタブ列が縦に並び、パネルはその右に置かれる
const TabsRoot = ({ className, variant = "line", size = "md", ...props }: TabsRootProps) => {
    const styles = tabs({ variant, size });
    return (
        <TabsStylesContext.Provider value={styles}>
            <ArkTabs.Root {...props} className={cx(styles.root, className)} />
        </TabsStylesContext.Provider>
    );
};

type TabsListProps = ComponentProps<typeof ArkTabs.List>;

// タブを並べる列(role="tablist")。矢印キーでの移動は zag が担う
const TabsList = ({ className, ...props }: TabsListProps) => {
    const styles = useContext(TabsStylesContext);
    return <ArkTabs.List {...props} className={cx(styles.list, className)} />;
};

type TabsTriggerProps = ComponentProps<typeof ArkTabs.Trigger>;

// 1 つのタブ(role="tab")。value で対応する Content と結び付く
const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => {
    const styles = useContext(TabsStylesContext);
    return <ArkTabs.Trigger {...props} className={cx(styles.trigger, className)} />;
};

type TabsContentProps = ComponentProps<typeof ArkTabs.Content>;

// タブで切り替わるパネル(role="tabpanel")。選択されていないパネルには zag が hidden を付ける
const TabsContent = ({ className, ...props }: TabsContentProps) => {
    const styles = useContext(TabsStylesContext);
    return <ArkTabs.Content {...props} className={cx(styles.content, className)} />;
};

type TabsIndicatorProps = ComponentProps<typeof ArkTabs.Indicator>;

// 選択中のタブを追いかける下線。line variant で List の末尾に置く。
// enclosed variant ではタブ自身が塗られるため、置いても描かれない
const TabsIndicator = ({ className, ...props }: TabsIndicatorProps) => {
    const styles = useContext(TabsStylesContext);
    return <ArkTabs.Indicator {...props} className={cx(styles.indicator, className)} />;
};

// Compound Component パターン: Tabs.Root / List / Trigger / Content / Indicator
const Tabs = Object.assign(TabsRoot, {
    Root: TabsRoot,
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent,
    Indicator: TabsIndicator,
});

export type {
    TabsContentProps,
    TabsIndicatorProps,
    TabsListProps,
    TabsRootProps,
    TabsSize,
    TabsTriggerProps,
    TabsVariant,
};
export { Tabs };
