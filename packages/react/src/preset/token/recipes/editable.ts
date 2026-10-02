import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

// preview と input で共有する寸法。
// 表示モード(preview)と編集モード(input)で文字サイズ・行高・余白・枠線幅・角丸が
// 1px でもずれると、クリックした瞬間に行の高さが変わってレイアウトが跳ねる。
// そのため両スロットに同じ値をスプレッドして「見た目は違うが箱は同じ」を保証する。
// サイズ依存の値(fontSize/px/py/minHeight)は variants.size 側で同じ方針で両スロットに配る
const sharedMetrics = {
    boxSizing: "border-box",
    lineHeight: "normal",
    borderWidth: "1px",
    borderRadius: "item",
    // 表示モードと編集モードで同じ書体にする(mono variant で両方まとめて等幅に切り替える)
    fontFamily: "inherit",
    fontWeight: "inherit",
    letterSpacing: "inherit",
    // 値が短くてもある程度の幅を確保する(24 = 96px)。
    // input だけに付けると、短い値のとき編集に入った瞬間だけ箱が広がり横にずれるため両スロットで共有する
    minWidth: "24",
} as const;

// Edit / Submit / Cancel の 3 トリガーに共通する、控えめな小さいボタンの見た目。
// アイコンでも短い文字でも収まるよう中身は inline-flex で中央に寄せる
const triggerStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1",
    px: "1.5",
    py: "0.5",
    bg: "transparent",
    border: "none",
    borderRadius: "item",
    fontSize: "xs",
    fontWeight: "medium",
    lineHeight: "normal",
    color: "fg.muted",
    cursor: "pointer",
    userSelect: "none",
    transitionDuration: "fast",
    transitionProperty: "background, color",
    transitionTimingFunction: "easeInOut",
    // アイコンは文字サイズに追従させる
    "& :where(svg)": {
        width: "1em",
        height: "1em",
    },
    // disabled 状態では hover を効かせない
    "&:not(:disabled):not([data-disabled]):hover": {
        bg: "bg.muted",
        color: "fg",
    },
    _focusVisible: focusRing,
    _disabled: {
        cursor: "not-allowed",
        color: "fg.disabled",
    },
    // zag は編集状態に応じてトリガーに hidden 属性を付ける。
    // display を指定すると UA の [hidden] { display: none } に勝ってしまうため明示的に消す
    _hidden: {
        display: "none",
    },
} as const;

export const editable = defineSlotRecipe({
    className: "editable",
    jsx: ["Editable"],
    description: "The editable component",
    // zag/Ark の anatomy に合わせたスロット名
    slots: ["root", "label", "area", "input", "preview", "control", "editTrigger", "submitTrigger", "cancelTrigger"],
    base: {
        root: {
            // ラベル・編集領域・操作ボタンを横一列に並べる。
            // 表の中やテキストの流れに置ける想定なので inline-flex にする
            display: "inline-flex",
            // 操作ボタンや利用側が置く Spinner などは縦中央に置く。
            // ラベルと値だけは label / area 側の alignSelf でベースラインを揃える
            alignItems: "center",
            gap: "component.gap.sm",
        },
        label: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "fg",
            // Label をクリックすると zag が preview にフォーカスを移す。
            // ただし見た目は通常のフォーム項目のラベルに揃え、ボタンのようには見せない
            cursor: "default",
            whiteSpace: "nowrap",
            // 値(area)とベースラインを揃える。mono variant のように書体が違うと ascent が異なり、
            // 箱の中心揃えでは文字の高さが 1px 以上ずれるため
            alignSelf: "baseline",
        },
        area: {
            // preview / input のどちらか一方だけが表示される箱。
            // minWidth: 0 で flex の中で中身より縮められるようにし、長い値でも行からはみ出さない
            display: "inline-flex",
            alignItems: "center",
            minWidth: "0",
            // label とベースラインを揃える(理由は label 側のコメント参照)
            alignSelf: "baseline",
        },
        preview: {
            ...sharedMetrics,
            // 表示モード: 通常のテキストに見せつつ、hover で破線の枠が出て
            // 「ここは書き換えられる」と伝える(Kodama の editable-cell 由来の affordance)。
            // 待機中は枠を透明にして、テキストフィールドのように見せない
            display: "inline-block",
            borderStyle: "dashed",
            borderColor: "transparent",
            color: "fg",
            cursor: "text",
            // 改行を含む値は改行のまま表示し、長い値は折り返す
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            transitionDuration: "fast",
            transitionProperty: "background, border-color",
            transitionTimingFunction: "easeInOut",
            "&:not([data-disabled]):not([data-readonly]):hover": {
                borderColor: "border.subtle",
                bg: "bg.muted",
            },
            _focusVisible: focusRing,
            // 値が空でプレースホルダーが表示されているときは専用の文字色で弱める(濃さの根拠は fg.placeholder のコメント参照)
            _placeholderShown: {
                color: "fg.placeholder",
            },
            // 読み取り専用: 編集には入れないので text カーソルや hover の枠を出さない。
            // Panda の _readOnly 条件は `:read-only` 擬似クラスを含み、編集不可の <span> は常にこれに
            // マッチしてしまう(preview が常時 default カーソルになる)。そのため _readOnly ではなく、
            // コンポーネント側(EditablePreview)が Root の readOnly から付け直す data-readonly 属性を
            // 直接見る。上の hover 抑止セレクタも同じ属性を使っている
            "&[data-readonly]": {
                cursor: "default",
            },
            // 無効: 保存中など。文字色を落として押せないことを示す
            _disabled: {
                cursor: "not-allowed",
                color: "fg.disabled",
            },
            // 編集中は zag が hidden 属性を付ける。display 指定に負けないよう明示的に消す
            _hidden: {
                display: "none",
            },
        },
        input: {
            ...sharedMetrics,
            // 編集モード: 実線の枠と白背景で「入力中」であることをはっきり示す
            display: "inline-block",
            // 利用側が Area / Root に幅を与えた場合はその幅いっぱいに広がる
            width: "100%",
            // Area が中身に合わせて縮む(幅指定なし)場合、<input> は UA 既定の約 20 文字幅になり、
            // 表示モードとの切り替えで横幅が跳ねる(表のセルで列幅がずれる)。
            // field-sizing: content で入力欄を中身の文字幅に合わせ、preview と同じ書体・余白・枠線なので
            // 横幅もほぼ一致させる(Chrome / Edge)。未対応ブラウザ(Firefox / Safari)は従来どおり
            // 固有幅になるため、列幅の安定が必要な場面では利用側が Area / Root に幅を指定する
            fieldSizing: "content",
            borderStyle: "solid",
            borderColor: "border.interactive",
            bg: "bg.panel",
            color: "fg",
            // preview 側のプレースホルダーと同じ色で、モードを切り替えても見え方を揃える
            _placeholder: {
                color: "fg.placeholder",
            },
            _focusVisible: focusRing,
            _invalid: {
                borderColor: "border.error",
            },
            _readOnly: {
                cursor: "default",
            },
            _disabled: {
                cursor: "not-allowed",
                color: "fg.disabled",
                bg: "bg.disabled",
                borderColor: "border.muted",
            },
            // 表示中は zag が hidden 属性を付ける。display 指定に負けないよう明示的に消す
            _hidden: {
                display: "none",
            },
        },
        control: {
            // EditTrigger / SubmitTrigger / CancelTrigger を並べる箱
            display: "inline-flex",
            alignItems: "center",
            gap: "component.gap.xs",
        },
        editTrigger: triggerStyle,
        submitTrigger: triggerStyle,
        cancelTrigger: triggerStyle,
    },
    variants: {
        // 識別子や slug など、等幅で読ませたい値のための variant。
        // preview / input の両方に同じ書体を当て、モード切り替えで幅が変わらないようにする
        mono: {
            true: {
                preview: { fontFamily: "mono" },
                input: { fontFamily: "mono" },
            },
            false: {},
        },
        // サイズ依存の値も preview / input で必ず同じにする(行高の跳ねを防ぐ)。
        // 「行高 + 上下 padding + 上下枠線」がちょうど minHeight になるよう行高を決める。
        // 自然な高さが minHeight に満たないと、余りの分だけ preview(上寄せ)と input(中央寄せ)で
        // 文字の縦位置がずれるため、minHeight は保険としてだけ置く
        size: {
            // sm: 12px * 1.5 + 2px * 2 + 1px * 2 = 24px = sizes.6
            sm: {
                preview: { fontSize: "xs", px: "1.5", py: "0.5", minHeight: "6" },
                input: { fontSize: "xs", px: "1.5", py: "0.5", minHeight: "6" },
            },
            // md: 22px + 4px * 2 + 1px * 2 = 32px = sizes.8
            // (行高 normal の 14px * 1.5 = 21px だと 31px になり 1px 余るので 22px に広げる)
            md: {
                preview: { fontSize: "sm", lineHeight: "22px", px: "2", py: "1", minHeight: "8" },
                input: { fontSize: "sm", lineHeight: "22px", px: "2", py: "1", minHeight: "8" },
            },
        },
    },
    defaultVariants: {
        mono: false,
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
