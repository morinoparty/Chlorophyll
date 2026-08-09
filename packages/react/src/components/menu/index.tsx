"use client";
import { Menu as ArkMenu } from "@ark-ui/react/menu";
import type { ComponentProps } from "react";
import { cx } from "styled-system/css";
import { menu } from "styled-system/recipes";

// item 以外のスロットは variant に依存しないため一度だけ解決すれば済む
const styles = menu();

// 通常項目(colorPalette 追従)か、削除/ログアウトなど危険な操作向けの danger か
type MenuItemVariant = "default" | "danger";

type MenuRootProps = ComponentProps<typeof ArkMenu.Root>;

// メニュー全体の状態(開閉・選択)を管理する Provider。自身は DOM を描画しない
const MenuRoot = (props: MenuRootProps) => {
    return <ArkMenu.Root {...props} />;
};

type MenuTriggerProps = ComponentProps<typeof ArkMenu.Trigger>;

// メニューを開くトリガー。asChild で任意の要素(IconButton など)に差し替えられる
const MenuTrigger = ({ className, ...props }: MenuTriggerProps) => {
    return <ArkMenu.Trigger {...props} className={cx(styles.trigger, className)} />;
};

type MenuPositionerProps = ComponentProps<typeof ArkMenu.Positioner>;

// Content の位置決めを行う要素。Portal でくるんで使うことを想定
const MenuPositioner = ({ className, ...props }: MenuPositionerProps) => {
    return <ArkMenu.Positioner {...props} className={cx(styles.positioner, className)} />;
};

type MenuContentProps = ComponentProps<typeof ArkMenu.Content>;

// ポップオーバー風のカード。項目一覧を内包する
const MenuContent = ({ className, ...props }: MenuContentProps) => {
    return <ArkMenu.Content {...props} className={cx(styles.content, className)} />;
};

type MenuItemProps = ComponentProps<typeof ArkMenu.Item> & {
    /** 見た目のバリエーション。default(通常) / danger(削除・ログアウトなど破壊的な操作) */
    variant?: MenuItemVariant;
};

// 1 項目。ホバー/キーボード操作時は data-highlighted に応じたハイライトが付く
const MenuItem = ({ className, variant = "default", ...props }: MenuItemProps) => {
    // variant によって色が変わるため item だけ variant 込みで解決する
    const itemClass = menu({ variant }).item;
    return <ArkMenu.Item {...props} className={cx(itemClass, className)} />;
};

type MenuSeparatorProps = ComponentProps<typeof ArkMenu.Separator>;

// 項目同士を区切る横線
const MenuSeparator = ({ className, ...props }: MenuSeparatorProps) => {
    return <ArkMenu.Separator {...props} className={cx(styles.separator, className)} />;
};

type MenuItemGroupProps = ComponentProps<typeof ArkMenu.ItemGroup>;

// ItemGroupLabel と Item をまとめる論理的なグループ
const MenuItemGroup = ({ className, ...props }: MenuItemGroupProps) => {
    return <ArkMenu.ItemGroup {...props} className={cx(styles.itemGroup, className)} />;
};

type MenuItemGroupLabelProps = ComponentProps<typeof ArkMenu.ItemGroupLabel>;

// ItemGroup の見出し
const MenuItemGroupLabel = ({ className, ...props }: MenuItemGroupLabelProps) => {
    return <ArkMenu.ItemGroupLabel {...props} className={cx(styles.itemGroupLabel, className)} />;
};

// Compound Component パターン: Menu.Root / Trigger / Positioner / Content / Item / Separator / ItemGroup / ItemGroupLabel
const Menu = Object.assign(MenuRoot, {
    Root: MenuRoot,
    Trigger: MenuTrigger,
    Positioner: MenuPositioner,
    Content: MenuContent,
    Item: MenuItem,
    Separator: MenuSeparator,
    ItemGroup: MenuItemGroup,
    ItemGroupLabel: MenuItemGroupLabel,
});

export { Menu };
export type {
    MenuRootProps,
    MenuTriggerProps,
    MenuPositionerProps,
    MenuContentProps,
    MenuItemProps,
    MenuSeparatorProps,
    MenuItemGroupProps,
    MenuItemGroupLabelProps,
    MenuItemVariant,
};
