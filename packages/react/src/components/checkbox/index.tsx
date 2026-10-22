"use client";
import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { checkbox } from "styled-system/recipes";

// Field / Select の sm / md と同じスケール。表のセルなど狭い場所では sm を使う
type CheckboxSize = "sm" | "md";

// Group / Root で指定した size を Control / Label に配るための Context。
// Group の size は中の Root の既定値になり、Root 自身の size が優先される
const CheckboxSizeContext = createContext<CheckboxSize>("md");

// size に依存しないスロット(root / indicator / group)は一度だけ解決すれば済む
const styles = checkbox();

type CheckboxRootProps = ComponentProps<typeof ArkCheckbox.Root> & {
    /** 四角とラベルの大きさ。Control / Label に引き継がれる。未指定なら Group の size(Group の外では md)に従う */
    size?: CheckboxSize;
};

/**
 * チェックボックス 1 つ分(四角・ラベル・ネイティブ input)をまとめる Root。<label> として描画される。
 *
 * - checked / defaultChecked には true / false / "indeterminate"(未確定)を渡せる
 * - disabled / invalid / readOnly / required は Root に渡せば、Ark が Control / Label / HiddenInput に
 *   data-* 属性とネイティブ属性を配ってくれる
 * - <form> 送信や支援技術への公開は HiddenInput(ネイティブの checkbox)が担うので、必ず中に置く
 */
const CheckboxRoot = ({ className, size, ...props }: CheckboxRootProps) => {
    // Root 自身の size を優先し、無ければ Group から受け取った size で解決する
    const contextSize = useContext(CheckboxSizeContext);
    return (
        <CheckboxSizeContext.Provider value={size ?? contextSize}>
            <ArkCheckbox.Root {...props} className={cx(styles.root, className)} />
        </CheckboxSizeContext.Provider>
    );
};

type CheckboxControlProps = ComponentProps<typeof ArkCheckbox.Control>;

/**
 * チェックの四角。children を渡さなければ既定でチェック / マイナスの Indicator を 2 つ置き、
 * Ark が状態(checked / indeterminate)に応じて片方だけを表示する。
 * Ark が aria-hidden を付けるため、状態は HiddenInput を通して支援技術に伝わる
 */
const CheckboxControl = ({ className, children, ...props }: CheckboxControlProps) => {
    // 四角の大きさが size で変わるため Root から受け取った size で解決する
    const size = useContext(CheckboxSizeContext);
    const controlClass = checkbox({ size }).control;
    return (
        <ArkCheckbox.Control {...props} className={cx(controlClass, className)}>
            {children ?? (
                <>
                    <CheckboxIndicator>
                        <CheckIcon aria-hidden />
                    </CheckboxIndicator>
                    <CheckboxIndicator indeterminate>
                        <MinusIcon aria-hidden />
                    </CheckboxIndicator>
                </>
            )}
        </ArkCheckbox.Control>
    );
};

type CheckboxIndicatorProps = ComponentProps<typeof ArkCheckbox.Indicator>;

// 状態を示すアイコンの入れ物。indeterminate を付けると未確定のときだけ、付けなければチェック済みのときだけ表示される
const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
    return <ArkCheckbox.Indicator {...props} className={cx(styles.indicator, className)} />;
};

type CheckboxLabelProps = ComponentProps<typeof ArkCheckbox.Label>;

// チェックボックスの説明文。Ark が id を振り、HiddenInput の aria-labelledby に入れる
const CheckboxLabel = ({ className, ...props }: CheckboxLabelProps) => {
    // 文字サイズが size で変わるため Root から受け取った size で解決する
    const size = useContext(CheckboxSizeContext);
    const labelClass = checkbox({ size }).label;
    return <ArkCheckbox.Label {...props} className={cx(labelClass, className)} />;
};

type CheckboxHiddenInputProps = ComponentProps<typeof ArkCheckbox.HiddenInput>;

// ネイティブの <input type="checkbox"> を visually-hidden で描画し、<form> 送信に name/value を載せる。
// スタイルは zag がインラインで当てるためそのまま透過する
const CheckboxHiddenInput = ArkCheckbox.HiddenInput;

type CheckboxGroupProps = ComponentProps<typeof ArkCheckbox.Group> & {
    /** 中に置く Root の既定の大きさ。既定は md */
    size?: CheckboxSize;
};

/**
 * 複数のチェックボックスをまとめるグループ。role="group" の <div> として描画される。
 *
 * - value / defaultValue / onValueChange で、チェック済みの Root の value を配列で扱える
 * - name / disabled / invalid / readOnly は中の Root すべてに配られる
 * - グループの見出しは aria-label か aria-labelledby で付ける(Ark の Checkbox に見出しのパーツは無い)
 */
const CheckboxGroup = ({ className, size = "md", ...props }: CheckboxGroupProps) => {
    return (
        <CheckboxSizeContext.Provider value={size}>
            <ArkCheckbox.Group {...props} className={cx(styles.group, className)} />
        </CheckboxSizeContext.Provider>
    );
};

type CheckboxContextProps = ComponentProps<typeof ArkCheckbox.Context>;

// Ark の Context をそのまま再 export する。
// children の render prop から checked / indeterminate / setChecked などの API を受け取れる
const CheckboxContext = ArkCheckbox.Context;

// Compound Component パターン:
// Checkbox.Root / Control / Indicator / Label / HiddenInput / Group / Context
const Checkbox = Object.assign(CheckboxRoot, {
    Root: CheckboxRoot,
    Control: CheckboxControl,
    Indicator: CheckboxIndicator,
    Label: CheckboxLabel,
    HiddenInput: CheckboxHiddenInput,
    Group: CheckboxGroup,
    Context: CheckboxContext,
});

// 利用側が @ark-ui/react を直接 import せずに済むよう、状態の型も再 export する
type CheckboxCheckedState = ArkCheckbox.CheckedState;
type CheckboxCheckedChangeDetails = ArkCheckbox.CheckedChangeDetails;

export { Checkbox };
export type {
    CheckboxRootProps,
    CheckboxControlProps,
    CheckboxIndicatorProps,
    CheckboxLabelProps,
    CheckboxHiddenInputProps,
    CheckboxGroupProps,
    CheckboxContextProps,
    CheckboxCheckedState,
    CheckboxCheckedChangeDetails,
    CheckboxSize,
};
