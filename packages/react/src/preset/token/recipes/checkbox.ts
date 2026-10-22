import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const checkbox = defineSlotRecipe({
    className: "checkbox",
    jsx: ["Checkbox"],
    description: "The checkbox component",
    // Ark UI Checkbox の anatomy に合わせたスロット名。
    // HiddenInput(zag が visually-hidden を当てるネイティブ <input>)と
    // Context(render prop のみで DOM を持たない)はスタイルを持たないため含めない
    slots: ["root", "control", "indicator", "label", "group"],
    base: {
        root: {
            // Root は <label> として描画される。四角いコントロールとラベルを横に並べ、
            // ラベルをクリックしても切り替えられるようにする
            display: "inline-flex",
            alignItems: "center",
            gap: "component.gap.sm",
            // HiddenInput は zag が position: absolute で隠すため、はみ出さないよう基準をここに置く
            position: "relative",
            cursor: "pointer",
            userSelect: "none",
            verticalAlign: "middle",
            _disabled: {
                cursor: "not-allowed",
            },
            // 読み取り専用は zag が切り替えを止めるため、押せるように見せない
            "&[data-readonly]": {
                cursor: "default",
            },
        },
        control: {
            // チェックの四角。中に Indicator(チェック / マイナスのアイコン)を中央寄せで置く
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            bg: "bg.panel",
            borderWidth: "1px",
            borderStyle: "solid",
            // 未チェックの四角は枠線が唯一の手がかりになるため、非テキスト要素の目安 Lc 45 を満たす gray.9 を使う。
            // Input / Select のような border.subtle(gray.4: 白 Lc 11.1)や border.emphasized(gray.8: 白 Lc 36.5 /
            // colorPalette.bg(mori) Lc 28.3)では、小さな四角が地色に溶けて見落とされる
            // (gray.9 の計測値: 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2)
            borderColor: "gray.9",
            // 角丸は Menu / Select の項目と同じ「面の内側に置く小さな要素」の段
            borderRadius: "item",
            color: "colorPalette.contrast",
            transitionDuration: "fast",
            transitionProperty: "border-color, background, color, box-shadow",
            transitionTimingFunction: "easeInOut",
            // ホバーで枠線を一段濃くして押せることを伝える。Ark は Root にポインタが乗ると
            // Control にも data-hover を付けるので、ラベルの上でも四角が反応する
            // (gray.10 の計測値: 白 Lc 65.6 / colorPalette.bg(mori) Lc 57.4)。
            // invalid / disabled は除外する(hover の方が詳細度が高く、赤い枠線や無効の見た目が消えるため)。
            // readOnly も Field / Editable と同じく除外し、切り替えられない四角が押せるように見えないようにする
            "&:is(:hover, [data-hover]):not([data-disabled]):not([data-readonly]):not([data-invalid])": {
                borderColor: "gray.10",
            },
            // チェック済み・未確定(indeterminate)は colorPalette の solid で塗り、白いアイコンを載せる。
            // (colorPalette.solid = mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5。
            //  上に載せる colorPalette.contrast(白)のアイコン: mori.9 の上で Lc 79.1)。
            // 計測値は mori のもの。step9 が明るいパレット(yellow.9: 白 Lc 12.9)では塗りが手がかりにならず、
            // パレット側で暗いインクに差し替えた colorPalette.contrast のアイコンで状態を示す(Button の solid と同じ扱い)
            "&:is([data-state=checked], [data-state=indeterminate])": {
                bg: "colorPalette.solid",
                borderColor: "colorPalette.solid",
                // ホバー時の塗り(colorPalette.solid.emphasized = mori.10 の計測値: 白 Lc 79.3 / colorPalette.bg(mori) Lc 71.0)
                "&:is(:hover, [data-hover]):not([data-disabled]):not([data-readonly]):not([data-invalid])": {
                    bg: "colorPalette.solid.emphasized",
                    borderColor: "colorPalette.solid.emphasized",
                },
                // 下の data-invalid と詳細度が同じになり出力順で負けることがあるため、
                // チェック済みのエラー枠線はここでも指定して確実に赤くする
                "&[data-invalid]": {
                    borderColor: "border.error.emphasized",
                },
            },
            // HiddenInput にキーボードでフォーカスすると、Ark が Control に data-focus-visible を付ける。
            // outline のロングハンドで明示しないと outline-style が消えるため共通のフォーカスリングを使う(#78)
            _focusVisible: focusRing,
            // エラー状態。Panda の _invalid は :invalid を含むため、Ark が付ける data-invalid だけを見る。
            // チェック済みでも枠線を赤にして、塗りの上からエラーと分かるようにする
            // (border.error.emphasized = red.9 の計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
            "&[data-invalid]": {
                borderColor: "border.error.emphasized",
                // エラー時のフォーカスリングは赤で揃える(focus.ring.error の計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
                _focusVisible: {
                    outlineColor: "focus.ring.error",
                },
            },
            // 無効: Input / Select と同じく面を沈め、チェック済みでも塗りを外して操作できないことを示す。
            // 枠線は border.emphasized(gray.8)に落とす(計測値: 白 Lc 36.5 / colorPalette.bg(mori) Lc 28.3。
            // 無効状態のため非テキスト要素の目安 Lc 45 は求めず、絶対下限の Lc 30 付近で控えめに見せる)。
            // アイコンは fg.disabled(gray.9 の計測値: bg.disabled(gray.4)の上で Lc 46.9)
            _disabled: {
                bg: "bg.disabled",
                borderColor: "border.emphasized",
                color: "fg.disabled",
                "&:is([data-state=checked], [data-state=indeterminate])": {
                    bg: "bg.disabled",
                    borderColor: "border.emphasized",
                },
            },
        },
        indicator: {
            // チェック / マイナスのアイコン。アイコンは四角の大きさに追従させる。
            // 自身の大きさを明示しないと、svg の width/height 属性(24px)で広がって四角からはみ出すため、
            // 四角の内側(padding を除いた領域)いっぱいに固定する
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "full",
            height: "full",
            "& :where(svg)": {
                width: "full",
                height: "full",
                // 小さな四角の中でも形が潰れないよう、線を少し太くする
                strokeWidth: "3",
            },
            // display を指定すると UA の [hidden] { display: none } に勝ってしまうため明示的に隠す。
            // Ark は未チェックの Indicator(indeterminate 用は未確定でないとき)に hidden を付ける
            _hidden: {
                display: "none",
            },
        },
        label: {
            // チェックボックスの説明文。本文と同じ濃さで読ませる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            color: "colorPalette.fg",
            lineHeight: "normal",
            // 無効(fg.disabled の計測値: 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2。無効状態の目安 Lc 30 以上)
            _disabled: {
                color: "fg.disabled",
            },
        },
        group: {
            // 複数のチェックボックスを縦に積む。横並びにしたいときは className で flexDirection を上書きする
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "component.gap.md",
        },
    },
    variants: {
        // Field / Select の sm / md に合わせたスケール。
        // ラベルの文字サイズは同じ size の入力欄の文字サイズに揃える(sm: xs / md: sm)
        size: {
            sm: {
                control: {
                    width: "4",
                    height: "4",
                    // 枠線の内側に収まるようアイコンを一回り小さくする
                    p: "0.5",
                },
                label: {
                    fontSize: "xs",
                },
            },
            md: {
                control: {
                    width: "5",
                    height: "5",
                    p: "0.5",
                },
                label: {
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
