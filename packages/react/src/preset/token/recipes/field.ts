import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

// Input / Textarea で共有するフォームコントロールの見た目。
// Select の trigger と同じ面・枠線・角丸・hover・フォーカスリングにして、
// フォームの中で Input と Select を並べたときに同じ種類の部品に見えるようにする
const controlStyle = {
    display: "block",
    width: "full",
    minWidth: "0",
    bg: "bg.panel",
    borderWidth: "1px",
    borderStyle: "solid",
    // ライブラリ方針: 枠線は控えめに(Select の trigger と同じ border.subtle)。
    // 白い面(bg.panel)がページの地色(colorPalette.bg)から浮くことで入力欄の輪郭を伝え、
    // hover で一段濃くして操作できることを示す
    borderColor: "border.subtle",
    borderRadius: "control",
    // 入力した文字は本文と同じ濃さで読ませる
    // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
    color: "colorPalette.fg",
    fontFamily: "inherit",
    lineHeight: "normal",
    outline: "none",
    transitionDuration: "fast",
    transitionProperty: "border-color, background, color, box-shadow",
    transitionTimingFunction: "easeInOut",
    // 未入力時のプレースホルダー(計測値は fg.placeholder のコメント参照: 白 Lc 79.8 / bg.disabled Lc 66.3)
    _placeholder: {
        color: "fg.placeholder",
        opacity: "1",
    },
    // disabled / readOnly では hover を効かせない。
    // readOnly は Ark が付ける data-readonly を見る(Panda の _readOnly は :read-only を含み、
    // disabled な input にもマッチしてしまうため)
    "&:not(:disabled):not([data-disabled]):not([data-readonly]):not([readonly]):hover": {
        borderColor: "border.interactive",
    },
    // outline: none だと利用側で outline-style が none のまま残るため outline 一式を明示する
    _focusVisible: focusRing,
    // エラー状態。Panda の _invalid は :invalid を含み、required な空欄が操作前から赤くなるため使わない。
    // Field.Root の invalid(Ark が付ける data-invalid)と、単体利用時の aria-invalid だけを見る。
    // 枠線は Select の trigger と同じ border.error(red.7)。
    // (計測値: 白 Lc 37.4 / colorPalette.bg(mori) Lc 29.2。非テキスト要素の目安 Lc 45 には届かないため、
    //  エラーであることは枠線だけに頼らず、ErrorText(fg.error)と下の赤いフォーカスリングで伝える)
    "&:is([data-invalid], [aria-invalid=true])": {
        borderColor: "border.error",
        // エラー時のフォーカスリングは赤で揃える(focus.ring.error の計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
        _focusVisible: {
            outlineColor: "focus.ring.error",
        },
    },
    // 読み取り専用: 値は本文と同じ濃さで読ませたまま、面をわずかに沈めて編集できないことを示す
    // (colorPalette.fg on bg.subtle(gray.2) の計測値: Lc 78.4。本文の目安 Lc 75 を満たす)
    "&:is([data-readonly], [readonly]):not(:disabled)": {
        bg: "bg.subtle",
        cursor: "default",
    },
    // 無効: Select の trigger と同じく面を沈めて文字を落とす
    // (fg.disabled の計測値: bg.disabled(gray.4) Lc 46.9 / colorPalette.bg(mori) Lc 52.2。無効状態の目安 Lc 30 以上)
    _disabled: {
        bg: "bg.disabled",
        color: "fg.disabled",
        cursor: "not-allowed",
        _placeholder: {
            color: "fg.disabled",
        },
    },
} as const;

export const field = defineSlotRecipe({
    className: "field",
    jsx: ["Field", "Input", "Textarea"],
    description: "The field component (label / input / helper text / error text)",
    // Ark UI Field の anatomy に合わせたスロット名
    slots: ["root", "label", "requiredIndicator", "input", "textarea", "helperText", "errorText"],
    base: {
        root: {
            // ラベル・入力欄・補足テキストを縦に積む。横幅は親に任せる
            display: "flex",
            flexDirection: "column",
            gap: "1.5",
            width: "full",
        },
        label: {
            // Select.Label と同じフォームのラベル
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.5",
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
            _disabled: {
                color: "fg.disabled",
            },
        },
        requiredIndicator: {
            // 必須を示す「*」。意味を持つ記号なのでエラーと同じ赤の文字色で目立たせる
            // (fg.error の計測値: 白 Lc 81.8 / colorPalette.bg(mori) Lc 73.6)
            color: "fg.error",
        },
        input: controlStyle,
        textarea: {
            ...controlStyle,
            // 複数行の入力。縦方向だけ利用者が広げられるようにする
            resize: "vertical",
        },
        helperText: {
            // 入力の補足説明。本文より一段引いた補助テキスト
            // (colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg(mori) Lc 71.6)
            color: "colorPalette.fg.muted",
            _disabled: {
                color: "fg.disabled",
            },
        },
        errorText: {
            // バリデーションのエラーメッセージ。Field.Root が invalid のときだけ Ark が描画する
            // (fg.error の計測値: 白 Lc 81.8 / colorPalette.bg(mori) Lc 73.6)
            color: "fg.error",
        },
    },
    variants: {
        // Select / Button の sm / md と同じスケール。横に並べたときに高さと文字サイズが揃う
        size: {
            sm: {
                input: {
                    height: "control.sm",
                    px: "3",
                    fontSize: "xs",
                },
                // 1 行ぶんの高さでは複数行の入力に見えないため、およそ 3 行分を最低の高さにする
                textarea: {
                    minHeight: "20",
                    px: "3",
                    py: "2",
                    fontSize: "xs",
                },
                helperText: {
                    fontSize: "xs",
                },
                errorText: {
                    fontSize: "xs",
                },
            },
            md: {
                input: {
                    height: "control.md",
                    px: "3.5",
                    fontSize: "sm",
                },
                textarea: {
                    minHeight: "24",
                    px: "3.5",
                    py: "2.5",
                    fontSize: "sm",
                },
                helperText: {
                    fontSize: "sm",
                },
                errorText: {
                    fontSize: "sm",
                },
            },
        },
    },
    defaultVariants: {
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
