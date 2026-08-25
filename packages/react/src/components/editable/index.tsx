"use client";
import { Editable as ArkEditable, useEditableContext } from "@ark-ui/react/editable";
import { ark } from "@ark-ui/react/factory";
import { mergeProps } from "@ark-ui/react/utils";
import type { ComponentProps } from "react";
import { createContext, useContext } from "react";
import { cx } from "styled-system/css";
import { editable } from "styled-system/recipes";

// preview / input の大きさ。sm(表のセル向け) / md(単独で置く標準サイズ)
type EditableSize = "sm" | "md";

// Root で受け取った見た目のオプション(mono / size)を Preview / Input へ配るための Context。
// Compound Component なので Root と各パーツは別々に呼ばれる。props のバケツリレーを避け、
// 「Root に 1 回書けば preview と input の書体・寸法が必ず揃う」ことを保証する
interface EditableStyleContextValue {
    mono: boolean;
    size: EditableSize;
}

const EditableStyleContext = createContext<EditableStyleContextValue>({ mono: false, size: "md" });

// mono / size に依存しないスロット(root / label / area / control / 各トリガー)は一度だけ解決すれば済む
const styles = editable();

type EditableRootProps = ComponentProps<typeof ArkEditable.Root> & {
    /** 識別子や slug など、等幅フォントで読ませたいときに true。preview と input の両方に効く */
    mono?: boolean;
    /** preview / input の大きさ。sm(表のセル向け) / md(標準)。既定は md */
    size?: EditableSize;
};

/**
 * その場で値を書き換えるコンポーネントの Root。値・編集状態を管理し、DOM としては <div> を描画する。
 *
 * - クリック(activationMode="click")または フォーカスで編集モードに入り、Enter で確定・Esc で取り消す
 * - 確定した値は onValueCommit で受け取る。保存リクエスト自体は利用側が持つ
 * - 保存は非同期になるのが普通なので、リクエスト中は `disabled={saving}` を渡して
 *   編集に入れなくする(二重送信を防ぐ)。読み取り専用にしたいだけなら `readOnly` を使う
 * - `invalid` を渡すと input の枠がエラー色になる
 * - 幅を指定しない場合、編集モードの input は中身の文字幅に合わせる(field-sizing: content。
 *   Chrome / Edge)。未対応ブラウザでは input が固有幅になるため、表の列幅など横幅の安定が
 *   必要な場面では `Editable.Area`(または Root)に幅を指定する
 */
const EditableRoot = ({ className, mono = false, size = "md", ...props }: EditableRootProps) => {
    return (
        <EditableStyleContext.Provider value={{ mono, size }}>
            <ArkEditable.Root {...props} className={cx(styles.root, className)} />
        </EditableStyleContext.Provider>
    );
};

type EditableLabelProps = ComponentProps<typeof ArkEditable.Label>;

// 何を編集しているかを示すラベル。zag が htmlFor で input と関連付け、
// クリック時には preview にフォーカスを移してくれる
const EditableLabel = ({ className, ...props }: EditableLabelProps) => {
    return <ArkEditable.Label {...props} className={cx(styles.label, className)} />;
};

type EditableAreaProps = ComponentProps<typeof ArkEditable.Area>;

// Preview と Input を包む箱。編集状態に応じてどちらか一方だけが表示される
const EditableArea = ({ className, ...props }: EditableAreaProps) => {
    return <ArkEditable.Area {...props} className={cx(styles.area, className)} />;
};

type EditableInputProps = ComponentProps<typeof ArkEditable.Input>;

// 編集モードで表示される <input>。表示モードでは zag が hidden を付ける。
// 書体・寸法は Root の mono / size に追従し、Preview と必ず同じ箱になる
const EditableInput = ({ className, ...props }: EditableInputProps) => {
    const { mono, size } = useContext(EditableStyleContext);
    const inputClass = editable({ mono, size }).input;
    return <ArkEditable.Input {...props} className={cx(inputClass, className)} />;
};

type EditablePreviewProps = ComponentProps<typeof ArkEditable.Preview>;

// 表示モードで値を見せる要素。hover で破線の枠が出て編集できることを伝える。
// 値が空のときは Root の placeholder が表示され、data-placeholder-shown が付く。
//
// Ark の Editable.Preview は mergeProps(api.getPreviewProps(), props) を ark.span に流すだけなので、
// ここでは同じことを自前で行い、zag が付ける属性を 2 点だけ直している:
// - aria-readonly: role を持たない <span> には ARIA 上許可されておらず、axe の
//   aria-allowed-attr(critical)に引っかかるため外す
// - data-readonly: zag は readOnly ではなく disabled を映してしまうため、input 側の readOnly
//   (Root の readOnly を反映)から正しく付け直す。レシピはこの属性を `&[data-readonly]` セレクタで
//   直接参照する(Panda の _readOnly は `:read-only` を含み <span> に常にマッチするため使えない)
const EditablePreview = ({ className, ...props }: EditablePreviewProps) => {
    const { mono, size } = useContext(EditableStyleContext);
    const previewClass = editable({ mono, size }).preview;
    const api = useEditableContext();
    const { "aria-readonly": _ariaReadOnly, "data-readonly": _dataReadOnly, ...previewProps } = api.getPreviewProps();
    const readOnly = api.getInputProps().readOnly;
    const mergedProps = mergeProps(previewProps, readOnly ? { "data-readonly": "" } : {}, props);
    return <ark.span {...mergedProps} className={cx(previewClass, className)} />;
};

type EditableControlProps = ComponentProps<typeof ArkEditable.Control>;

// EditTrigger / SubmitTrigger / CancelTrigger を並べる箱
const EditableControl = ({ className, ...props }: EditableControlProps) => {
    return <ArkEditable.Control {...props} className={cx(styles.control, className)} />;
};

type EditableEditTriggerProps = ComponentProps<typeof ArkEditable.EditTrigger>;

// 編集モードに入るボタン。children(アイコンや文言)はそのまま描画する。編集中は zag が hidden を付ける
const EditableEditTrigger = ({ className, ...props }: EditableEditTriggerProps) => {
    return <ArkEditable.EditTrigger {...props} className={cx(styles.editTrigger, className)} />;
};

type EditableSubmitTriggerProps = ComponentProps<typeof ArkEditable.SubmitTrigger>;

// 編集を確定するボタン。表示モードでは zag が hidden を付ける
const EditableSubmitTrigger = ({ className, ...props }: EditableSubmitTriggerProps) => {
    return <ArkEditable.SubmitTrigger {...props} className={cx(styles.submitTrigger, className)} />;
};

type EditableCancelTriggerProps = ComponentProps<typeof ArkEditable.CancelTrigger>;

// 編集を取り消して元の値に戻すボタン。表示モードでは zag が hidden を付ける
const EditableCancelTrigger = ({ className, ...props }: EditableCancelTriggerProps) => {
    return <ArkEditable.CancelTrigger {...props} className={cx(styles.cancelTrigger, className)} />;
};

type EditableContextProps = ComponentProps<typeof ArkEditable.Context>;

// Ark の Context をそのまま再 export する。
// children の render prop から editing / edit() / submit() / cancel() などの API を受け取れる。
// 「編集中は Submit/Cancel、それ以外は Edit を出す」といった出し分けに使う
const EditableContext = ArkEditable.Context;

// Compound Component パターン:
// Editable.Root / Label / Area / Input / Preview / Control / EditTrigger / SubmitTrigger / CancelTrigger / Context
const Editable = Object.assign(EditableRoot, {
    Root: EditableRoot,
    Label: EditableLabel,
    Area: EditableArea,
    Input: EditableInput,
    Preview: EditablePreview,
    Control: EditableControl,
    EditTrigger: EditableEditTrigger,
    SubmitTrigger: EditableSubmitTrigger,
    CancelTrigger: EditableCancelTrigger,
    Context: EditableContext,
});

export { Editable };
export type {
    EditableRootProps,
    EditableLabelProps,
    EditableAreaProps,
    EditableInputProps,
    EditablePreviewProps,
    EditableControlProps,
    EditableEditTriggerProps,
    EditableSubmitTriggerProps,
    EditableCancelTriggerProps,
    EditableContextProps,
    EditableSize,
};
