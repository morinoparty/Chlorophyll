import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const radioGroup = defineSlotRecipe({
    className: "radio-group",
    jsx: ["RadioGroup"],
    description: "The radio group component",
    // zag/Ark の anatomy に合わせたスロット名。
    // ItemHiddenInput(ネイティブ <input type="radio">、zag が visually-hidden を当てる)はスタイルを持たないため含めない
    slots: ["root", "label", "item", "itemControl", "itemText"],
    base: {
        root: {
            // 既定(vertical)はラベルと項目を縦に積む
            display: "flex",
            flexDirection: "column",
            gap: "component.gap.sm",
            // horizontal では項目を横に並べ、入りきらなければ折り返す。
            // ラベルも同じ flex の子なので、label 側で 1 行ぶんの幅を取らせて項目の上に置く
            _horizontal: {
                flexDirection: "row",
                flexWrap: "wrap",
                columnGap: "component.gap.lg",
            },
        },
        label: {
            // Select.Label / Field.Label と同じフォームのラベル
            display: "block",
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
            _horizontal: {
                width: "full",
            },
            _disabled: {
                color: "fg.disabled",
            },
        },
        item: {
            // 丸いコントロールとラベル文字を横に並べる 1 項目。<label> なので文字の上を押しても選べる
            display: "inline-flex",
            alignItems: "center",
            gap: "component.gap.sm",
            color: "colorPalette.fg",
            cursor: "pointer",
            userSelect: "none",
            _disabled: {
                cursor: "not-allowed",
            },
        },
        itemControl: {
            // ラジオボタンの丸。選択中の白い点は _after で中央に描く
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            bg: "bg.panel",
            borderWidth: "[1.5px]",
            borderStyle: "solid",
            // 未選択の丸は枠線だけが手がかりになるため、非テキスト要素の目安 Lc 45 を満たす濃さにする。
            // border.* は最も濃い border.emphasized(gray.8)でも 白 Lc 36.5 / colorPalette.bg(mori) Lc 28.3 で届かないので、
            // 中立な gray.11 を指す colorPalette.fg.muted を使う
            // (計測値: 白 Lc 79.8 / colorPalette.bg(mori) Lc 71.6)
            borderColor: "colorPalette.fg.muted",
            borderRadius: "full",
            transitionDuration: "fast",
            transitionProperty: "border-color, background, box-shadow",
            transitionTimingFunction: "easeInOut",
            _after: {
                content: '""',
                width: "40%",
                height: "40%",
                borderRadius: "full",
                bg: "colorPalette.contrast",
                // 未選択では点を隠しておき、選択時に拡大して見せる
                transform: "scale(0)",
                transitionDuration: "fast",
                transitionProperty: "transform",
                transitionTimingFunction: "easeOut",
            },
            // disabled / 選択中では hover を効かせない。
            // invalid も除外する。hover のセレクタの方が詳細度が高く、除外しないと hover 中にエラーの赤い枠線が消えるため
            "&[data-hover]:not([data-disabled]):not([data-invalid]):not([data-state=checked])": {
                borderColor: "colorPalette.fg",
            },
            // 選択中はブランド色で塗りつぶし、中央に白い点を出す
            // (colorPalette.solid = mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5。
            //  点の colorPalette.contrast(白) on mori.9 は Lc 79.1)
            _checked: {
                bg: "colorPalette.solid",
                borderColor: "colorPalette.solid",
                _after: {
                    transform: "scale(1)",
                },
            },
            // フォーカスは visually-hidden の <input> に当たるため、zag が丸に配る data-focus-visible でリングを描く。
            // outline: none だと利用側で outline-style が none のまま残るため outline 一式を明示する
            _focusVisible: focusRing,
            // エラー状態。Panda の _invalid は :invalid を含むため使わず、Ark が付ける data-invalid だけを見る。
            // パレットごと red に切り替えて、未選択の枠線・選択中の塗り・フォーカスリングをまとめて赤にする
            // (red.9 = colorPalette.solid の計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
            // disabled を優先するため、無効な項目は除く
            "&[data-invalid]:not([data-disabled])": {
                colorPalette: "red",
                borderColor: "colorPalette.solid",
            },
            // 無効: 面を沈めて枠線を落とす。選択中でも塗りを灰色にしてブランド色を外す
            // (fg.disabled = gray.9 の計測値: bg.disabled(gray.4) Lc 46.9 / 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2。
            //  選択中の点 bg.disabled(gray.4) on gray.9 は Lc 50.9)
            _disabled: {
                bg: "bg.disabled",
                borderColor: "fg.disabled",
                _checked: {
                    bg: "fg.disabled",
                    borderColor: "fg.disabled",
                    _after: {
                        bg: "bg.disabled",
                    },
                },
            },
        },
        itemText: {
            // 選択肢のラベル。本文と同じ濃さで読ませる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            color: "colorPalette.fg",
            _disabled: {
                color: "fg.disabled",
            },
        },
    },
    variants: {
        // Select / Field の sm / md と同じスケール。文字サイズを揃え、丸の大きさを文字に合わせる
        size: {
            sm: {
                itemControl: {
                    width: "4",
                    height: "4",
                },
                itemText: {
                    fontSize: "xs",
                },
            },
            md: {
                itemControl: {
                    width: "5",
                    height: "5",
                },
                itemText: {
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
