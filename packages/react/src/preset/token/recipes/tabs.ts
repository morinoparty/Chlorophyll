import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const tabs = defineSlotRecipe({
    className: "tabs",
    jsx: ["Tabs"],
    description: "The tabs component",
    // zag/Ark の anatomy に合わせたスロット名
    slots: ["root", "list", "trigger", "content", "indicator"],
    base: {
        root: {
            // 横並びのタブはタブ列の下にパネルを積み、縦並びはタブ列の右にパネルを置く。
            // zag が root に data-orientation を付けるのでそれで向きを切り替える
            display: "flex",
            width: "full",
            _horizontal: {
                flexDirection: "column",
            },
            _vertical: {
                flexDirection: "row",
            },
        },
        list: {
            // Indicator は zag が position: absolute と --left / --top をインラインで当てる。
            // その基準(offsetParent)になるよう relative にする
            position: "relative",
            display: "flex",
            flexShrink: "0",
            _horizontal: {
                flexDirection: "row",
                alignItems: "center",
            },
            _vertical: {
                flexDirection: "column",
                alignItems: "stretch",
            },
        },
        trigger: {
            // Indicator より手前に描き、選択中の文字が下線や塗りに隠れないようにする
            position: "relative",
            zIndex: "1",
            display: "inline-flex",
            alignItems: "center",
            gap: "component.gap.sm",
            flexShrink: "0",
            // button のデフォルト見た目をリセットする
            bg: "transparent",
            border: "none",
            // 未選択のタブは一段引いて見せる。補助テキストの目安 Lc 60 を満たす
            // (fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg(mori) Lc 71.6)
            color: "colorPalette.fg.muted",
            // 選択の有無で太さを変えると文字幅が変わって隣のタブが揺れるため、常に medium で固定する
            fontWeight: "medium",
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            transitionDuration: "fast",
            transitionProperty: "background, color",
            transitionTimingFunction: "easeInOut",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
            },
            // 縦並びではラベルを左に揃える
            _vertical: {
                justifyContent: "flex-start",
            },
            // 選択中・無効のタブには hover を効かせない。
            // _selected と :hover は詳細度が同じため、hover 側を明示的に除外しないと選択中の見た目が塗り替わる
            "&:not([data-selected]):not(:disabled):not([data-disabled]):hover": {
                color: "colorPalette.fg",
            },
            // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
            // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
            _focusVisible: focusRing,
            // 選択中のタブは本文色で読ませる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            _selected: {
                color: "colorPalette.fg",
            },
            // 無効状態の目安 Lc 30 を満たす(fg.disabled = gray.9 の計測値: 白 Lc 60.4 / colorPalette.bg(mori) Lc 52.2)
            _disabled: {
                color: "fg.disabled",
                cursor: "not-allowed",
            },
        },
        content: {
            // タブで切り替わるパネル本体。非選択のパネルには zag が hidden を付けるので display は指定しない
            flex: "1",
            minWidth: "0",
            color: "colorPalette.fg",
            fontSize: "sm",
            lineHeight: "relaxed",
            // tabpanel は zag が tabIndex=0 を付けてフォーカス可能にするため、リングを明示する
            _focusVisible: focusRing,
            _horizontal: {
                pt: "component.padding.lg",
            },
            _vertical: {
                ps: "component.padding.xl",
            },
        },
        indicator: {
            // 選択中のタブを追いかける印。位置は zag がインラインで当てる --left / --top / --width / --height を読む。
            // zag は transition-duration / timing-function を CSS 変数経由で受け取るので、他のレシピと同じ速さに揃える
            "--transition-duration": "token(durations.fast)",
            "--transition-timing-function": "token(easings.easeInOut)",
            pointerEvents: "none",
            // 選択中のタブが決まる前(rect が空)は zag が hidden を付ける。
            // display を指定すると UA の [hidden] { display: none } に勝ってしまうため明示的に隠す
            _hidden: {
                display: "none",
            },
        },
    },
    variants: {
        // タブ列の見せ方。
        // line はタブ列の下に下線を引き、選択中のタブを太い下線で示す(ページ内のセクション切り替え向け)。
        // enclosed は白い枠の中で選択中のタブを solid で塗る(セグメントのような小さな切り替え向け)
        variant: {
            line: {
                list: {
                    // タブ列の区切り線。選択の状態は Indicator が担うので、この線は装飾として控えめにする
                    // (border.subtle = gray.4 の計測値: 白 Lc 11.1 / colorPalette.bg(mori) Lc 0.0。意味を持たせない)
                    borderColor: "border.subtle",
                    borderStyle: "solid",
                    borderWidth: "0",
                    _horizontal: {
                        borderBottomWidth: "1px",
                    },
                    _vertical: {
                        borderInlineEndWidth: "1px",
                    },
                },
                trigger: {
                    // 角丸はフォーカスリングの形を整えるためだけに持つ
                    borderRadius: "item",
                },
                indicator: {
                    // 選択中を示す下線。意味のある非テキスト要素なので Lc 45 以上を満たす solid を使う
                    // (colorPalette.solid = mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5)
                    bg: "colorPalette.solid",
                    // 区切り線(1px)の上に重ねるため、list の border の分だけ外へずらす
                    _horizontal: {
                        bottom: "-1px",
                        width: "var(--width)",
                        height: "0.5",
                    },
                    _vertical: {
                        insetInlineEnd: "-1px",
                        height: "var(--height)",
                        width: "0.5",
                    },
                },
            },
            enclosed: {
                list: {
                    // 白い枠でタブ列をひとまとめにする。枠線は控えめにというライブラリ方針に合わせて border.subtle。
                    // ページの地色から浮かせるのは白い面が担い、選択の状態は塗り(solid)が担う
                    gap: "1",
                    p: "1",
                    bg: "bg.panel",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "border.subtle",
                    borderRadius: "control",
                    _horizontal: {
                        width: "fit-content",
                    },
                },
                trigger: {
                    justifyContent: "center",
                    borderRadius: "item",
                    "&:not([data-selected]):not(:disabled):not([data-disabled]):hover": {
                        bg: "colorPalette.surface",
                    },
                    // 選択中のタブは solid で塗る。塗りは意味のある非テキスト要素なので Lc 45 以上を満たす
                    // (colorPalette.solid = mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5)。
                    // 上に載る文字は contrast(白)で、本文の目安 Lc 75 を満たす(計測値: 白 on mori.9 Lc 79.1)
                    _selected: {
                        bg: "colorPalette.solid",
                        color: "colorPalette.contrast",
                    },
                },
                // 塗りはタブ自身(_selected)が持つため Indicator は使わない。
                // 置かれていても描かないよう常に隠す(切り替えのアニメーションも出さず、VRT を安定させる)
                indicator: {
                    display: "none",
                },
            },
        },
        // Button / Select の sm / md と同じスケール
        size: {
            sm: {
                trigger: {
                    px: "3",
                    fontSize: "xs",
                },
            },
            md: {
                trigger: {
                    px: "3.5",
                    fontSize: "sm",
                },
            },
        },
    },
    compoundVariants: [
        // line はタブ自身の高さを control.* に揃え、Button / Select と横に並べたときに高さを合わせる
        {
            variant: "line",
            size: "sm",
            css: { trigger: { height: "control.sm" } },
        },
        {
            variant: "line",
            size: "md",
            css: { trigger: { height: "control.md" } },
        },
        // enclosed は枠(1px × 2)と内側の余白(4px × 2)を含めた全体の高さを control.* に揃える
        {
            variant: "enclosed",
            size: "sm",
            css: { trigger: { height: "calc(token(sizes.control.sm) - token(spacing.2) - 2px)" } },
        },
        {
            variant: "enclosed",
            size: "md",
            css: { trigger: { height: "calc(token(sizes.control.md) - token(spacing.2) - 2px)" } },
        },
    ],
    defaultVariants: {
        variant: "line",
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
