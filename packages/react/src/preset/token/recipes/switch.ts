import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

/**
 * Switch(トグル)のレシピ。
 *
 * - トラック(control)の中でつまみ(thumb)が左右に動き、オン / オフを伝える
 * - 枠線は持たず、トラックの塗りそのものを非テキスト要素の目安 Lc 45 以上にして輪郭を伝える
 *   (白い面 bg.panel とページの地色 colorPalette.bg のどちらに置いても見えるようにするため)
 * - つまみの移動距離は「トラック幅 - つまみ - 内側の余白 × 2」。size ごとに variants 側で指定する
 */
export const switchRecipe = defineSlotRecipe({
    className: "switch",
    jsx: ["Switch"],
    description: "The switch (toggle) component",
    // Ark UI Switch の anatomy に合わせたスロット名。
    // HiddenInput(zag が visually-hidden を当てる)と Context(render prop のみ)はスタイルを持たないため含めない
    slots: ["root", "control", "thumb", "label"],
    base: {
        root: {
            // トラックとラベルを横に並べる。ラベルをクリックしても切り替わるよう Root 全体を押せる見た目にする
            display: "inline-flex",
            alignItems: "center",
            position: "relative",
            cursor: "pointer",
            // ラベルの文字を選択状態にせず、連打してもトグルだけが反応するようにする
            userSelect: "none",
            verticalAlign: "middle",
            _disabled: {
                cursor: "not-allowed",
            },
            // 読み取り専用: クリックしても切り替わらないので、押せる見た目をやめる。
            // Panda の _readOnly は :read-only を含み、編集できない要素(この <label> 自体)に常にマッチするため、
            // Ark が付ける data-readonly だけを見る
            "&[data-readonly]": {
                cursor: "default",
            },
        },
        control: {
            // つまみを左端に置き、_checked で右へ送る
            display: "inline-flex",
            alignItems: "center",
            flexShrink: "0",
            boxSizing: "border-box",
            // 内側の余白 2px。wiki-frontend の手書きトグル(36x20 / つまみ 16)と同じ寸法
            p: "0.5",
            borderRadius: "full",
            // オフのトラック。中立な gray.solid(gray.9)で塗る。
            // border.emphasized(gray.8)は白 Lc 36.5 / colorPalette.bg(mori) Lc 28.3 で輪郭として足りないため、
            // 枠線を足すのではなく塗りを一段濃くして目安の Lc 45 を満たす
            // (gray.9 の計測値: 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2)
            bg: "gray.solid",
            transitionDuration: "fast",
            transitionProperty: "background, box-shadow",
            transitionTimingFunction: "easeInOut",
            // 無効 / エラー / 読み取り専用では hover の色替えを効かせない
            // (エラーの赤を hover 中も保つため。読み取り専用は押しても変わらないため、押せそうに見せない)。
            // Ark は Root にポインタが乗っている間 Control に data-hover を付けるので、ラベルの hover でも反応する
            "&:is(:hover, [data-hover]):not([data-disabled]):not([data-invalid]):not([data-readonly])": {
                // gray.10 の計測値: 白 Lc 65.6 / colorPalette.bg(mori) Lc 57.4
                bg: "gray.solid.emphasized",
            },
            // オン: パレットの solid で塗る(mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5)。
            // 注意: colorPalette="gray" ではオン / オフのトラックが同じ gray.9 になり、
            // "yellow" ではオンの yellow.9 が白に対して Lc 15.5 しかない。どちらもオン / オフはつまみの位置で読ませる前提になるため、
            // Switch にはこの 2 つ以外のパレット(mori / umi など)を使う
            _checked: {
                bg: "colorPalette.solid",
                "&:is(:hover, [data-hover]):not([data-disabled]):not([data-invalid]):not([data-readonly])": {
                    // mori.10 の計測値: 白 Lc 79.3 / colorPalette.bg(mori) Lc 71.0
                    bg: "colorPalette.solid.emphasized",
                },
            },
            // フォーカスは HiddenInput が受け取り、Ark が Control に data-focus-visible を付ける。
            // outline-style が消えないよう共通のロングハンド(focusRing)で描く
            _focusVisible: focusRing,
            // エラー状態。Panda の _invalid は :invalid も含むため、Ark が付ける data-invalid だけを見る。
            // オン / オフはつまみの位置で読めるので、トラックはどちらも赤にしてエラーを優先して伝える
            // (red.solid = red.9 = border.error.emphasized と同じ色。計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
            "&[data-invalid]": {
                bg: "red.solid",
                // エラー時のフォーカスリングは赤で揃える(focus.ring.error の計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
                _focusVisible: {
                    outlineColor: "focus.ring.error",
                },
            },
            // 無効: Field / Select と同じく面を沈める。オン / オフはつまみの位置で読ませる
            // (トラック bg.disabled = gray.4 は輪郭を持たないが、無効状態は非テキストの目安の対象外。
            //  つまみ fg.disabled の計測値: gray.4 の上 Lc 46.9 / colorPalette.bg(mori) Lc 52.2)
            _disabled: {
                bg: "bg.disabled",
            },
            // 動きを減らす設定では色の切り替えも即時にする
            _motionReduce: {
                transitionDuration: "0s",
            },
        },
        thumb: {
            // 丸いつまみ。オフでは白(bg.panel)
            // (白の計測値: gray.9 の上 Lc 65.9 / gray.10 の上 Lc 71.1 / red.9 の上 Lc 70.5)
            display: "block",
            flexShrink: "0",
            borderRadius: "full",
            bg: "bg.panel",
            transitionDuration: "fast",
            transitionProperty: "transform, background",
            transitionTimingFunction: "easeInOut",
            // オンでは solid の上に載せる色(colorPalette.contrast)にする。
            // mori などでは白のまま(白 on mori.9 の計測値: Lc 79.1)、solid が明るい yellow では暗いインクに替わる
            _checked: {
                bg: "colorPalette.contrast",
            },
            // エラーの赤いトラックの上ではオン / オフとも白にそろえる
            "&[data-invalid]": {
                bg: "bg.panel",
            },
            _disabled: {
                bg: "fg.disabled",
            },
            _motionReduce: {
                transitionDuration: "0s",
            },
        },
        label: {
            // ラベル。アイコンを前に置けるよう inline-flex で並べる
            display: "inline-flex",
            alignItems: "center",
            gap: "1",
            // 本文と同じ濃さで読ませる(colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            color: "colorPalette.fg",
            fontWeight: "medium",
            lineHeight: "normal",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
                flexShrink: "0",
            },
            // fg.disabled の計測値: 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2(無効状態の目安 Lc 30 以上)
            _disabled: {
                color: "fg.disabled",
            },
        },
    },
    variants: {
        // Field / Select の sm / md と並べたときに文字サイズが揃うスケール。
        // トラックの高さはコントロール(36 / 40px)よりかなり低いので、行の中では上下中央に置く
        size: {
            sm: {
                root: {
                    gap: "1.5",
                },
                // 28x16 / つまみ 12。移動距離は 28 - 12 - 2 × 2 = 12px
                control: {
                    width: "7",
                    height: "4",
                },
                thumb: {
                    width: "3",
                    height: "3",
                    _checked: {
                        transform: "translateX({spacing.3})",
                        // 右から左に書く言語では、Ark が付ける dir="rtl" を見て逆向きに送る
                        "&[dir=rtl]": {
                            transform: "translateX(calc({spacing.3} * -1))",
                        },
                    },
                },
                label: {
                    fontSize: "xs",
                },
            },
            md: {
                root: {
                    gap: "2",
                },
                // 36x20 / つまみ 16。移動距離は 36 - 16 - 2 × 2 = 16px
                control: {
                    width: "9",
                    height: "5",
                },
                thumb: {
                    width: "4",
                    height: "4",
                    _checked: {
                        transform: "translateX({spacing.4})",
                        // 右から左に書く言語では、Ark が付ける dir="rtl" を見て逆向きに送る
                        "&[dir=rtl]": {
                            transform: "translateX(calc({spacing.4} * -1))",
                        },
                    },
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
