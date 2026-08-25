"use client";
import { type CollectionItem, createListCollection, type ListCollection } from "@ark-ui/react/collection";
import { Select as ArkSelect } from "@ark-ui/react/select";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { select } from "styled-system/recipes";

// Button の sm / md と同じスケール。テーブルのセルなど狭い場所では sm を使う
type SelectSize = "sm" | "md";

// Root で指定した size を Trigger / Item に伝えるための Context。
// Positioner/Content は Portal 越しに描画されるが、React ツリー(Context)は分断されないので
// props のバケツリレーをせずに size を配れる
const SelectSizeContext = createContext<SelectSize>("md");

// size に依存しないスロットは一度だけ解決すれば済む
const styles = select();

type SelectRootProps<T extends CollectionItem = CollectionItem> = ArkSelect.RootComponentProps<
    T,
    {
        /** 全体の大きさ。Trigger と Item に引き継がれる。既定は md */
        size?: SelectSize;
    }
>;

// Select 全体の状態(開閉・選択値)を管理する Root。
// collection は createListCollection で作った ListCollection を渡す。
//
// Positioner / Content は自動では Portal されない。Menu / Drawer / Tooltip と同じく、
// 利用側で `<Portal><Select.Positioner>…</Select.Positioner></Portal>` と明示的にくるむ
// (overflow: auto なテーブルの中でも Portal に入れればクリップされない)
const SelectRoot = <T extends CollectionItem>({
    className,
    size = "md",
    positioning,
    ...props
}: SelectRootProps<T>) => {
    return (
        <SelectSizeContext.Provider value={size}>
            <ArkSelect.Root
                {...props}
                // zag の既定では Content が max-content 幅になり、width: 100% の Trigger より狭く見えてしまう。
                // フォーム欄らしく既定で Trigger と同じ幅に揃え、利用側が渡した positioning
                // (例: `positioning={{ sameWidth: false }}`) で上書きできるよう後ろに展開する
                positioning={{ sameWidth: true, ...positioning }}
                className={cx(styles.root, className)}
            />
        </SelectSizeContext.Provider>
    );
};

type SelectLabelProps = ComponentProps<typeof ArkSelect.Label>;

// フォームのラベル。Trigger の aria-labelledby と HiddenSelect の htmlFor を Ark が紐付ける
const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
    return <ArkSelect.Label {...props} className={cx(styles.label, className)} />;
};

type SelectControlProps = ComponentProps<typeof ArkSelect.Control>;

// Trigger と ClearTrigger を包む要素。ClearTrigger を absolute で重ねるための基準になる
const SelectControl = ({ className, ...props }: SelectControlProps) => {
    return <ArkSelect.Control {...props} className={cx(styles.control, className)} />;
};

type SelectTriggerProps = ComponentProps<typeof ArkSelect.Trigger>;

// 一覧を開くボタン。children には ValueText と Indicator を並べる想定
const SelectTrigger = ({ className, ...props }: SelectTriggerProps) => {
    // 高さ・文字サイズが size で変わるため Root から受け取った size で解決する
    const size = useContext(SelectSizeContext);
    const triggerClass = select({ size }).trigger;
    return <ArkSelect.Trigger {...props} className={cx(triggerClass, className)} />;
};

type SelectValueTextProps = ComponentProps<typeof ArkSelect.ValueText>;

// 選択中のラベル。未選択のときは placeholder を表示する
const SelectValueText = ({ className, ...props }: SelectValueTextProps) => {
    return <ArkSelect.ValueText {...props} className={cx(styles.valueText, className)} />;
};

type SelectIndicatorProps = ComponentProps<typeof ArkSelect.Indicator>;

// 開閉を示すアイコン。children を渡さなければ既定でシェブロンを表示する
const SelectIndicator = ({ className, children, ...props }: SelectIndicatorProps) => {
    return (
        <ArkSelect.Indicator {...props} className={cx(styles.indicator, className)}>
            {children ?? <ChevronDownIcon />}
        </ArkSelect.Indicator>
    );
};

type SelectClearTriggerProps = ComponentProps<typeof ArkSelect.ClearTrigger>;

// 選択を解除するボタン。children を渡さなければ既定で ×アイコンを表示する。
// <button> の入れ子を避けるため Trigger の中ではなく Control 直下(Trigger の兄弟)に置く
const SelectClearTrigger = ({ className, children, ...props }: SelectClearTriggerProps) => {
    // Indicator の左隣に重ねる位置が size で変わるため Root から受け取った size で解決する
    const size = useContext(SelectSizeContext);
    const clearTriggerClass = select({ size }).clearTrigger;
    return (
        <ArkSelect.ClearTrigger {...props} className={cx(clearTriggerClass, className)}>
            {children ?? <XIcon />}
        </ArkSelect.ClearTrigger>
    );
};

type SelectPositionerProps = ComponentProps<typeof ArkSelect.Positioner>;

// Content の位置決めを行う要素。Menu / Drawer / Tooltip と同じく自動では Portal しないので、
// 利用側で <Portal> にくるんで使う(スタッキングコンテキストやクリッピングの影響を避けるため)
const SelectPositioner = ({ className, ...props }: SelectPositionerProps) => {
    return <ArkSelect.Positioner {...props} className={cx(styles.positioner, className)} />;
};

type SelectContentProps = ComponentProps<typeof ArkSelect.Content>;

// ポップオーバー風のカード。項目一覧を内包する
const SelectContent = ({ className, ...props }: SelectContentProps) => {
    return <ArkSelect.Content {...props} className={cx(styles.content, className)} />;
};

type SelectItemGroupProps = ComponentProps<typeof ArkSelect.ItemGroup>;

// ItemGroupLabel と Item をまとめる論理的なグループ
const SelectItemGroup = ({ className, ...props }: SelectItemGroupProps) => {
    return <ArkSelect.ItemGroup {...props} className={cx(styles.itemGroup, className)} />;
};

type SelectItemGroupLabelProps = ComponentProps<typeof ArkSelect.ItemGroupLabel>;

// ItemGroup の見出し
const SelectItemGroupLabel = ({ className, ...props }: SelectItemGroupLabelProps) => {
    return <ArkSelect.ItemGroupLabel {...props} className={cx(styles.itemGroupLabel, className)} />;
};

type SelectItemProps = ComponentProps<typeof ArkSelect.Item>;

// 1 項目。item に collection の要素を渡す。
// ホバー/キーボード操作時は data-highlighted、選択中は data-state=checked が付く
const SelectItem = ({ className, ...props }: SelectItemProps) => {
    // 余白・文字サイズが size で変わるため Root から受け取った size で解決する
    const size = useContext(SelectSizeContext);
    const itemClass = select({ size }).item;
    return <ArkSelect.Item {...props} className={cx(itemClass, className)} />;
};

type SelectItemTextProps = ComponentProps<typeof ArkSelect.ItemText>;

// 項目のラベル。選択後に ValueText へ表示される文字列にもなる
const SelectItemText = ({ className, ...props }: SelectItemTextProps) => {
    return <ArkSelect.ItemText {...props} className={cx(styles.itemText, className)} />;
};

type SelectItemIndicatorProps = ComponentProps<typeof ArkSelect.ItemIndicator>;

// 選択中の項目に付くマーク。children を渡さなければ既定でチェックアイコンを表示する
const SelectItemIndicator = ({ className, children, ...props }: SelectItemIndicatorProps) => {
    return (
        <ArkSelect.ItemIndicator {...props} className={cx(styles.itemIndicator, className)}>
            {children ?? <CheckIcon />}
        </ArkSelect.ItemIndicator>
    );
};

type SelectHiddenSelectProps = ComponentProps<typeof ArkSelect.HiddenSelect>;

// ネイティブの <select> を visually-hidden で描画し、<form> 送信に name/value を載せる。
// スタイルは zag がインラインで当てるためそのまま透過する
const SelectHiddenSelect = ArkSelect.HiddenSelect;

type SelectContextProps<T extends CollectionItem = CollectionItem> = ArkSelect.ContextProps<T>;

// Ark の Context をそのまま再 export する。
// children の render prop から value / open / clearValue などの API を受け取れる
const SelectContext = ArkSelect.Context;

// Compound Component パターン:
// Select.Root / Label / Control / Trigger / ValueText / Indicator / ClearTrigger /
// Positioner / Content / ItemGroup / ItemGroupLabel / Item / ItemText / ItemIndicator / HiddenSelect / Context
const Select = Object.assign(SelectRoot, {
    Root: SelectRoot,
    Label: SelectLabel,
    Control: SelectControl,
    Trigger: SelectTrigger,
    ValueText: SelectValueText,
    Indicator: SelectIndicator,
    ClearTrigger: SelectClearTrigger,
    Positioner: SelectPositioner,
    Content: SelectContent,
    ItemGroup: SelectItemGroup,
    ItemGroupLabel: SelectItemGroupLabel,
    Item: SelectItem,
    ItemText: SelectItemText,
    ItemIndicator: SelectItemIndicator,
    HiddenSelect: SelectHiddenSelect,
    Context: SelectContext,
});

// 利用側が @ark-ui/react を直接 import せずに済むよう、collection の生成関数と型も再 export する
export { Select, createListCollection };
export type {
    CollectionItem,
    ListCollection,
    SelectRootProps,
    SelectLabelProps,
    SelectControlProps,
    SelectTriggerProps,
    SelectValueTextProps,
    SelectIndicatorProps,
    SelectClearTriggerProps,
    SelectPositionerProps,
    SelectContentProps,
    SelectItemGroupProps,
    SelectItemGroupLabelProps,
    SelectItemProps,
    SelectItemTextProps,
    SelectItemIndicatorProps,
    SelectHiddenSelectProps,
    SelectContextProps,
    SelectSize,
};
