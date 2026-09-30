"use client";
import { Field as ArkField } from "@ark-ui/react/field";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { field } from "styled-system/recipes";

// Select / Button の sm / md と同じスケール。テーブルのセルなど狭い場所では sm を使う
type FieldSize = "sm" | "md";

// Root で指定した size を Input / Textarea / HelperText / ErrorText に配るための Context。
// Field.Root の外(単体の Input)では Provider が無いので既定の md になる
const FieldSizeContext = createContext<FieldSize>("md");

// size に依存しないスロット(root / label / requiredIndicator)は一度だけ解決すれば済む
const styles = field();

type FieldRootProps = ComponentProps<typeof ArkField.Root> & {
    /** 入力欄と補足テキストの大きさ。Input / Textarea / HelperText / ErrorText に引き継がれる。既定は md */
    size?: FieldSize;
};

/**
 * フォーム項目 1 つ分(ラベル・入力欄・補足・エラー)をまとめる Root。
 *
 * - invalid / disabled / readOnly / required は Root に 1 回渡せば、Ark が Label / Input / Textarea に
 *   data-* 属性と aria-* 属性(aria-invalid / aria-describedby など)を配ってくれる
 * - ErrorText は invalid のときだけ描画される。HelperText と併用すると、エラー時は両方が
 *   aria-describedby に入る
 */
const FieldRoot = ({ className, size = "md", ...props }: FieldRootProps) => {
    return (
        <FieldSizeContext.Provider value={size}>
            <ArkField.Root {...props} className={cx(styles.root, className)} />
        </FieldSizeContext.Provider>
    );
};

type FieldLabelProps = ComponentProps<typeof ArkField.Label>;

// 入力欄のラベル。Ark が htmlFor で Input / Textarea と関連付ける
const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
    return <ArkField.Label {...props} className={cx(styles.label, className)} />;
};

type FieldRequiredIndicatorProps = ComponentProps<typeof ArkField.RequiredIndicator>;

// 必須項目の印。Root が required のときだけ描画され、children を渡さなければ「*」を表示する。
// Label の中に置く想定。aria-hidden なので、必須であることは input の required 属性で支援技術に伝わる
const FieldRequiredIndicator = ({ className, ...props }: FieldRequiredIndicatorProps) => {
    return <ArkField.RequiredIndicator {...props} className={cx(styles.requiredIndicator, className)} />;
};

// Input / Textarea を Field.Root の外で単体で使うときのための見た目のオプション
interface ControlOptions {
    /** 大きさ。未指定なら Field.Root の size(Root の外では md)に従う */
    size?: FieldSize;
    /**
     * エラー状態。Field.Root の外で単体で使うときに渡す。
     * Field.Root の中では Root の invalid を使う(Ark が aria-invalid / data-invalid を付ける)
     */
    invalid?: boolean;
}

// 単体利用時の invalid を、Field.Root と同じ属性(aria-invalid / data-invalid)に変換する。
// false のときは何も付けず、Field.Root から配られた属性を上書きしない
const invalidAttrs = (invalid: boolean | undefined) =>
    invalid ? { "aria-invalid": true as const, "data-invalid": "" } : {};

// <input> のネイティブ属性 size(文字数での幅指定)は、見た目の size と名前がぶつかるため取り除く。
// 幅は CSS(className や親の幅)で指定する
type FieldInputProps = Omit<ComponentProps<typeof ArkField.Input>, "size"> & ControlOptions;

// 1 行のテキスト入力。Field.Root の中では id / aria-* / required / disabled などを Ark が付ける。
// Field.Root の外でも(Ark の Field の Context は必須ではないため)そのまま <input> として使える
const FieldInput = ({ className, size, invalid, ...props }: FieldInputProps) => {
    // Input 自身の size を優先し、無ければ Root から受け取った size で解決する
    const contextSize = useContext(FieldSizeContext);
    const inputClass = field({ size: size ?? contextSize }).input;
    return <ArkField.Input {...invalidAttrs(invalid)} {...props} className={cx(inputClass, className)} />;
};

type FieldTextareaProps = ComponentProps<typeof ArkField.Textarea> & ControlOptions;

// 複数行のテキスト入力。autoresize を付けると入力に合わせて高さが伸びる(Ark の機能)
const FieldTextarea = ({ className, size, invalid, ...props }: FieldTextareaProps) => {
    const contextSize = useContext(FieldSizeContext);
    const textareaClass = field({ size: size ?? contextSize }).textarea;
    return <ArkField.Textarea {...invalidAttrs(invalid)} {...props} className={cx(textareaClass, className)} />;
};

type FieldHelperTextProps = ComponentProps<typeof ArkField.HelperText>;

// 入力の補足説明。Ark が id を振り、Input の aria-describedby に入れる
const FieldHelperText = ({ className, ...props }: FieldHelperTextProps) => {
    const size = useContext(FieldSizeContext);
    const helperTextClass = field({ size }).helperText;
    return <ArkField.HelperText {...props} className={cx(helperTextClass, className)} />;
};

type FieldErrorTextProps = ComponentProps<typeof ArkField.ErrorText>;

// バリデーションのエラーメッセージ。Root が invalid のときだけ描画され、aria-live で読み上げられる
const FieldErrorText = ({ className, ...props }: FieldErrorTextProps) => {
    const size = useContext(FieldSizeContext);
    const errorTextClass = field({ size }).errorText;
    return <ArkField.ErrorText {...props} className={cx(errorTextClass, className)} />;
};

type FieldContextProps = ComponentProps<typeof ArkField.Context>;

// Ark の Context をそのまま再 export する。
// children の render prop から invalid / required / ids などを受け取れる
const FieldContext = ArkField.Context;

// Compound Component パターン:
// Field.Root / Label / RequiredIndicator / Input / Textarea / HelperText / ErrorText / Context
const Field = Object.assign(FieldRoot, {
    Root: FieldRoot,
    Label: FieldLabel,
    RequiredIndicator: FieldRequiredIndicator,
    Input: FieldInput,
    Textarea: FieldTextarea,
    HelperText: FieldHelperText,
    ErrorText: FieldErrorText,
    Context: FieldContext,
});

// ラベルなどが要らない場所(検索欄やテーブルのセル)で単体で使うための別名。
// 中身は Field.Input / Field.Textarea と同じで、Field.Root の中に置けばそのまま Root の状態に従う
const Input = FieldInput;
const Textarea = FieldTextarea;

export { Field, Input, Textarea };
export type {
    FieldRootProps,
    FieldLabelProps,
    FieldRequiredIndicatorProps,
    FieldInputProps,
    FieldTextareaProps,
    FieldHelperTextProps,
    FieldErrorTextProps,
    FieldContextProps,
    FieldSize,
};
