"use client";
import { ark } from "@ark-ui/react/factory";
import { SegmentGroup as ArkSegmentGroup } from "@ark-ui/react/segment-group";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { segmentGroup } from "styled-system/recipes";

// Select / Field / Button の sm / md と同じスケール。テーブルのセルなど狭い場所では sm を使う
type SegmentGroupSize = "sm" | "md";

// Root で指定した size を Control / Item に配るための Context。
// Compound Component なので Root と各パーツは別々に呼ばれる。props のバケツリレーを避ける
const SegmentGroupSizeContext = createContext<SegmentGroupSize>("md");

// size に依存しないスロット(root / label / indicator / itemText / itemControl)は一度だけ解決すれば済む
const styles = segmentGroup();

type SegmentGroupRootProps = ComponentProps<typeof ArkSegmentGroup.Root> & {
    /** 全体の大きさ。Control と Item に引き継がれる。既定は md */
    size?: SegmentGroupSize;
};

/**
 * 少数の選択肢から 1 つを選ぶ、スライドするつまみ付きのトグル(中身は radio group)。
 *
 * - 値は value / defaultValue / onValueChange で扱う(Ark の radio group と同じ)
 * - zag の radio group は orientation の既定が vertical なので、SegmentGroup らしく既定を horizontal にする
 * - 名前は Label か、Label を置かない場合は aria-label で付ける(Root が role="radiogroup" になる)
 */
const SegmentGroupRoot = ({ className, size = "md", orientation = "horizontal", ...props }: SegmentGroupRootProps) => {
    return (
        <SegmentGroupSizeContext.Provider value={size}>
            <ArkSegmentGroup.Root {...props} orientation={orientation} className={cx(styles.root, className)} />
        </SegmentGroupSizeContext.Provider>
    );
};

type SegmentGroupLabelProps = ComponentProps<typeof ArkSegmentGroup.Label>;

// グループのラベル。Ark が Root の aria-labelledby と関連付ける
const SegmentGroupLabel = ({ className, ...props }: SegmentGroupLabelProps) => {
    return <ArkSegmentGroup.Label {...props} className={cx(styles.label, className)} />;
};

type SegmentGroupControlProps = ComponentProps<typeof ark.div>;

/**
 * Indicator と Item を並べるトラック。Ark の anatomy には無い、見た目のための要素。
 *
 * Label をトラックの外(上)に置けるよう、Root とは別に用意している。
 * Indicator と Item は必ずこの中に並べる(Indicator の位置は Item の offsetLeft を基準に決まるため、
 * 両方が同じ Control を基準にしている必要がある)
 */
const SegmentGroupControl = ({ className, ...props }: SegmentGroupControlProps) => {
    // 高さが size で変わるため Root から受け取った size で解決する
    const size = useContext(SegmentGroupSizeContext);
    const controlClass = segmentGroup({ size }).control;
    return <ark.div {...props} data-part="control" className={cx(controlClass, className)} />;
};

type SegmentGroupIndicatorProps = ComponentProps<typeof ArkSegmentGroup.Indicator>;

/**
 * 選択中の Item の下に敷くつまみ。Control の中に 1 つだけ置く。
 * 位置と大きさは zag が CSS 変数(--left / --top / --width / --height)で渡し、値が未選択の間は hidden になる
 */
const SegmentGroupIndicator = ({ className, ...props }: SegmentGroupIndicatorProps) => {
    return <ArkSegmentGroup.Indicator {...props} className={cx(styles.indicator, className)} />;
};

type SegmentGroupItemProps = ComponentProps<typeof ArkSegmentGroup.Item>;

// 1 つの選択肢(<label>)。children には ItemText と ItemControl / ItemHiddenInput を並べる想定
const SegmentGroupItem = ({ className, ...props }: SegmentGroupItemProps) => {
    // 余白・文字サイズが size で変わるため Root から受け取った size で解決する
    const size = useContext(SegmentGroupSizeContext);
    const itemClass = segmentGroup({ size }).item;
    return <ArkSegmentGroup.Item {...props} className={cx(itemClass, className)} />;
};

type SegmentGroupItemTextProps = ComponentProps<typeof ArkSegmentGroup.ItemText>;

// 選択肢の表示名。アイコンは ItemText の前後(Item の直下)に並べる
const SegmentGroupItemText = ({ className, ...props }: SegmentGroupItemTextProps) => {
    return <ArkSegmentGroup.ItemText {...props} className={cx(styles.itemText, className)} />;
};

type SegmentGroupItemControlProps = ComponentProps<typeof ArkSegmentGroup.ItemControl>;

// radio の丸に当たる要素。SegmentGroup では Indicator が選択を表すため見た目は持たない(Ark の anatomy に合わせて置く)
const SegmentGroupItemControl = ({ className, ...props }: SegmentGroupItemControlProps) => {
    return <ArkSegmentGroup.ItemControl {...props} className={cx(styles.itemControl, className)} />;
};

type SegmentGroupItemHiddenInputProps = ComponentProps<typeof ArkSegmentGroup.ItemHiddenInput>;

// 視覚的に隠したネイティブの radio。フォーカスとキーボード操作(矢印キー)、フォーム送信の値を担うので必ず置く
const SegmentGroupItemHiddenInput = ArkSegmentGroup.ItemHiddenInput;

type SegmentGroupContextProps = ComponentProps<typeof ArkSegmentGroup.Context>;

// Ark の Context をそのまま再 export する。children の render prop から value などを受け取れる
const SegmentGroupContext = ArkSegmentGroup.Context;

// Compound Component パターン:
// SegmentGroup.Root / Label / Control / Indicator / Item / ItemText / ItemControl / ItemHiddenInput / Context
const SegmentGroup = Object.assign(SegmentGroupRoot, {
    Root: SegmentGroupRoot,
    Label: SegmentGroupLabel,
    Control: SegmentGroupControl,
    Indicator: SegmentGroupIndicator,
    Item: SegmentGroupItem,
    ItemText: SegmentGroupItemText,
    ItemControl: SegmentGroupItemControl,
    ItemHiddenInput: SegmentGroupItemHiddenInput,
    Context: SegmentGroupContext,
});

export { SegmentGroup };
export type {
    SegmentGroupContextProps,
    SegmentGroupControlProps,
    SegmentGroupIndicatorProps,
    SegmentGroupItemControlProps,
    SegmentGroupItemHiddenInputProps,
    SegmentGroupItemProps,
    SegmentGroupItemTextProps,
    SegmentGroupLabelProps,
    SegmentGroupRootProps,
    SegmentGroupSize,
};
