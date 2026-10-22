"use client";
import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { radioGroup } from "styled-system/recipes";

// Select / Field の sm / md と同じスケール。テーブルのセルなど狭い場所では sm を使う
type RadioGroupSize = "sm" | "md";

// Root で指定した size を ItemControl / ItemText に配るための Context
const RadioGroupSizeContext = createContext<RadioGroupSize>("md");

// size に依存しないスロット(root / label / item)は一度だけ解決すれば済む
const styles = radioGroup();

type RadioGroupRootProps = ComponentProps<typeof ArkRadioGroup.Root> & {
    /** 丸と文字の大きさ。ItemControl / ItemText に引き継がれる。既定は md */
    size?: RadioGroupSize;
};

/**
 * 選択肢から 1 つを選ぶラジオボタンのグループ。
 *
 * - orientation="horizontal" で項目を横に並べる(既定は vertical)。矢印キーの向きも zag が合わせる
 * - disabled / invalid / required / readOnly は Root に 1 回渡せば、Ark が各項目に data-* 属性を配る。
 *   特定の項目だけ無効にするときは Item に disabled を渡す
 * - <form> 送信に値を載せるには name を渡し、各 Item に ItemHiddenInput を置く
 * - Ark の Indicator(選択中の項目へ動く 1 枚の装飾)は含めない。選択中の点は ItemControl の擬似要素で描くため、
 *   併用すると印が二重になる。useRadioGroup で状態を外に持つ RootProvider も現状の用途が無いため出していない
 */
const RadioGroupRoot = ({ className, size = "md", ...props }: RadioGroupRootProps) => {
    return (
        <RadioGroupSizeContext.Provider value={size}>
            <ArkRadioGroup.Root {...props} className={cx(styles.root, className)} />
        </RadioGroupSizeContext.Provider>
    );
};

type RadioGroupLabelProps = ComponentProps<typeof ArkRadioGroup.Label>;

// グループ全体の見出し。Ark が Root の aria-labelledby と紐付ける
const RadioGroupLabel = ({ className, ...props }: RadioGroupLabelProps) => {
    return <ArkRadioGroup.Label {...props} className={cx(styles.label, className)} />;
};

type RadioGroupItemProps = ComponentProps<typeof ArkRadioGroup.Item>;

// 1 項目。<label> として描画されるので、ItemText を押しても選択できる
const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps) => {
    return <ArkRadioGroup.Item {...props} className={cx(styles.item, className)} />;
};

type RadioGroupItemControlProps = ComponentProps<typeof ArkRadioGroup.ItemControl>;

// ラジオボタンの丸。選択中の点はレシピの擬似要素で描くため children は不要
const RadioGroupItemControl = ({ className, ...props }: RadioGroupItemControlProps) => {
    // 丸の大きさが size で変わるため Root から受け取った size で解決する
    const size = useContext(RadioGroupSizeContext);
    const itemControlClass = radioGroup({ size }).itemControl;
    return <ArkRadioGroup.ItemControl {...props} className={cx(itemControlClass, className)} />;
};

type RadioGroupItemTextProps = ComponentProps<typeof ArkRadioGroup.ItemText>;

// 選択肢のラベル文字
const RadioGroupItemText = ({ className, ...props }: RadioGroupItemTextProps) => {
    // 文字サイズが size で変わるため Root から受け取った size で解決する
    const size = useContext(RadioGroupSizeContext);
    const itemTextClass = radioGroup({ size }).itemText;
    return <ArkRadioGroup.ItemText {...props} className={cx(itemTextClass, className)} />;
};

type RadioGroupItemHiddenInputProps = ComponentProps<typeof ArkRadioGroup.ItemHiddenInput>;

// ネイティブの <input type="radio"> を visually-hidden で描画し、フォーカスと <form> 送信を担う。
// スタイルは zag がインラインで当てるためそのまま透過する
const RadioGroupItemHiddenInput = ArkRadioGroup.ItemHiddenInput;

type RadioGroupContextProps = ComponentProps<typeof ArkRadioGroup.Context>;

// Ark の Context をそのまま再 export する。
// children の render prop から value / setValue / clearValue などの API を受け取れる
const RadioGroupContext = ArkRadioGroup.Context;

// Compound Component パターン:
// RadioGroup.Root / Label / Item / ItemControl / ItemText / ItemHiddenInput / Context
const RadioGroup = Object.assign(RadioGroupRoot, {
    Root: RadioGroupRoot,
    Label: RadioGroupLabel,
    Item: RadioGroupItem,
    ItemControl: RadioGroupItemControl,
    ItemText: RadioGroupItemText,
    ItemHiddenInput: RadioGroupItemHiddenInput,
    Context: RadioGroupContext,
});

export { RadioGroup };
export type {
    RadioGroupContextProps,
    RadioGroupItemControlProps,
    RadioGroupItemHiddenInputProps,
    RadioGroupItemProps,
    RadioGroupItemTextProps,
    RadioGroupLabelProps,
    RadioGroupRootProps,
    RadioGroupSize,
};
