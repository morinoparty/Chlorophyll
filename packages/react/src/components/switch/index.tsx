"use client";
import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { switchRecipe } from "styled-system/recipes";

// Field / Select の sm / md と同じ呼び名のスケール。表のセルなど狭い場所では sm を使う
type SwitchSize = "sm" | "md";

// Root で指定した size を Control / Thumb / Label に配るための Context
const SwitchSizeContext = createContext<SwitchSize>("md");

// 渡された size でスロットのクラス名を解決する
const useSwitchStyles = () => {
    const size = useContext(SwitchSizeContext);
    return switchRecipe({ size });
};

type SwitchRootProps = ComponentProps<typeof ArkSwitch.Root> & {
    /** トラック・つまみ・ラベルの大きさ。Control / Thumb / Label に引き継がれる。既定は md */
    size?: SwitchSize;
};

/**
 * オン / オフを切り替える Switch の Root(<label> として描画される)。
 *
 * - checked / onCheckedChange で制御、defaultChecked で非制御として使う
 * - disabled / invalid / readOnly / required は Root に 1 回渡せば、Ark が Control / Thumb / Label に
 *   data-* 属性を配り、HiddenInput(<input type="checkbox">)に属性を付ける
 * - Root が <label> なので、ラベルの文字をクリックしても切り替わる
 * - HiddenInput を必ず中に置く。フォーカスとキーボード操作(Space)、フォーム送信はこの input が担う
 */
const SwitchRoot = ({ className, size = "md", ...props }: SwitchRootProps) => {
    const rootClass = switchRecipe({ size }).root;
    return (
        <SwitchSizeContext.Provider value={size}>
            <ArkSwitch.Root {...props} className={cx(rootClass, className)} />
        </SwitchSizeContext.Provider>
    );
};

type SwitchControlProps = ComponentProps<typeof ArkSwitch.Control>;

// つまみが左右に動くトラック。中に Switch.Thumb を置く
const SwitchControl = ({ className, ...props }: SwitchControlProps) => {
    const styles = useSwitchStyles();
    return <ArkSwitch.Control {...props} className={cx(styles.control, className)} />;
};

type SwitchThumbProps = ComponentProps<typeof ArkSwitch.Thumb>;

// トラックの中で動く丸いつまみ。オンのとき右(dir="rtl" では左)へ動く
const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
    const styles = useSwitchStyles();
    return <ArkSwitch.Thumb {...props} className={cx(styles.thumb, className)} />;
};

type SwitchLabelProps = ComponentProps<typeof ArkSwitch.Label>;

// 切り替える内容を説明するラベル。アイコンを前に並べてもよい(svg は文字サイズに合わせる)
const SwitchLabel = ({ className, ...props }: SwitchLabelProps) => {
    const styles = useSwitchStyles();
    return <ArkSwitch.Label {...props} className={cx(styles.label, className)} />;
};

type SwitchHiddenInputProps = ComponentProps<typeof ArkSwitch.HiddenInput>;

// 実際にフォーカスを受ける <input type="checkbox">。zag が visually-hidden を当てるのでスタイルは持たない。
// zag は role を付けず、このままでは支援技術に「チェックボックス」と読まれる。
// role="switch" を足して「スイッチ、オン / オフ」と読ませる(Control / Thumb は aria-hidden なので、ここが唯一の手がかり)
const SwitchHiddenInput = (props: SwitchHiddenInputProps) => <ArkSwitch.HiddenInput role="switch" {...props} />;

type SwitchContextProps = ComponentProps<typeof ArkSwitch.Context>;

// Ark の Context をそのまま再 export する。children の render prop から checked などを受け取れる
const SwitchContext = ArkSwitch.Context;

// Compound Component パターン:
// Switch.Root / Control / Thumb / Label / HiddenInput / Context
const Switch = Object.assign(SwitchRoot, {
    Root: SwitchRoot,
    Control: SwitchControl,
    Thumb: SwitchThumb,
    Label: SwitchLabel,
    HiddenInput: SwitchHiddenInput,
    Context: SwitchContext,
});

export { Switch };
export type {
    SwitchContextProps,
    SwitchControlProps,
    SwitchHiddenInputProps,
    SwitchLabelProps,
    SwitchRootProps,
    SwitchSize,
    SwitchThumbProps,
};
