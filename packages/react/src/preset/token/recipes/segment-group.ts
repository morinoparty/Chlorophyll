import { defineSlotRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const segmentGroup = defineSlotRecipe({
    className: "segmentGroup",
    jsx: ["SegmentGroup"],
    description: "The segment group component (segmented toggle with a sliding indicator)",
    // Ark UI SegmentGroup の anatomy に、項目と Indicator を並べる「トラック」の control を足したスロット名。
    // ItemHiddenInput(zag が visually-hidden を当てる)と Context(DOM を持たない)はスタイルを持たないため含めない
    slots: ["root", "label", "control", "indicator", "item", "itemText", "itemControl"],
    base: {
        root: {
            // ラベルとトラックを縦に積む。トラックは項目の幅だけに縮める(横幅いっぱいには広げない)
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1.5",
        },
        label: {
            // Select.Label / Field.Label と同じフォームのラベル
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
            _disabled: {
                color: "fg.disabled",
            },
        },
        control: {
            // 項目と Indicator を並べるトラック。Select の trigger / Input と同じ「フォームコントロール」の面にして、
            // フォームの中で並べたときに同じ種類の部品に見えるようにする。
            // colorPalette.surface(mori.3 = #e7f6ef)のトラックはページの地色(colorPalette.bg = #ebf3f1)と
            // ほぼ同じ色で埋もれるため、白い面(bg.panel) + 控えめな枠線で輪郭を出す
            // 項目を等幅に並べる。1fr の列は shrink-to-fit なトラックの中で一番長い項目の幅に揃うため、
            // flex: 1(ブラウザによって最長のラベルがはみ出す)より描画が安定する
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "1fr",
            // Indicator(position: absolute)の基準。zag は項目の offsetLeft / offsetTop(= offsetParent からの距離)を
            // --left / --top に入れるので、項目と Indicator が同じ要素を基準にするよう Control を positioned にする
            position: "relative",
            bg: "bg.panel",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "border.subtle",
            borderRadius: "control",
            // Indicator がトラックの内側に浮いて見えるよう、枠線との間に少し隙間を空ける
            p: "1",
            // 縦向き(orientation="vertical")では項目を縦に積み、高さの固定を外す。Root に zag が data-orientation を付ける。
            // Accordion(既定が vertical)など他の Ark 部品も data-orientation を出すため、自分の Root に絞って見る
            "[data-scope=segment-group][data-part=root][data-orientation=vertical] &": {
                gridAutoFlow: "row",
                height: "auto",
            },
            // エラー状態。Root の invalid で zag が data-invalid を付ける。
            // Select の trigger / Field と同じ border.error.emphasized(red.9)で非テキスト要素の目安 Lc 45 を満たす
            // (計測値: 白 Lc 65.0 / colorPalette.bg(mori) Lc 56.8)
            "[data-scope=segment-group][data-part=root][data-invalid] &": {
                borderColor: "border.error.emphasized",
            },
        },
        indicator: {
            // 選択中の項目の下に敷く「つまみ」。位置と大きさは zag がインラインの CSS 変数で渡す。
            // zag のインラインスタイルは position: absolute と(横向きなら)left: var(--left) しか当てないため、
            // 残りの top / width / height はここで変数から受け取る(無いと大きさ 0 で描画されない)。
            // left / top を両方書いておけば、縦向き(zag が top を当てる)でも同じ値になる
            left: "var(--left)",
            top: "var(--top)",
            width: "var(--width)",
            height: "var(--height)",
            // 項目の文字より下に敷く(項目は zIndex: 1)
            zIndex: "0",
            borderRadius: "item",
            // 選択中を伝える唯一の面なので、非テキスト要素の目安 Lc 45 以上を満たす solid で塗る
            // (colorPalette.solid = mori.9 の計測値: 白(bg.panel のトラック) Lc 73.7 / colorPalette.bg(mori) Lc 65.5 /
            //  colorPalette.surface(mori.3) Lc 66.2。
            //  白い Indicator は mori.3 のトラックに対して Lc 0.0、gray.3 に対しても Lc 7.4 で届かないため採用しない)
            bg: "colorPalette.solid",
            boxShadow: "raised",
            // zag の既定(150ms)をトークンの速さ・緩急に揃える。インラインの transition がこの変数を参照する
            "--transition-duration": "token(durations.fast)",
            "--transition-timing-function": "token(easings.easeInOut)",
            // 動きを減らす設定では滑らせずに切り替える
            _motionReduce: {
                "--transition-duration": "0s",
            },
            // 全体が無効なときは面を沈め、選べないことを伝える
            _disabled: {
                bg: "bg.disabled",
                boxShadow: "none",
            },
        },
        item: {
            // 1 つの選択肢。<label> の中に視覚的に隠した radio(ItemHiddenInput)を持つ
            position: "relative",
            // Indicator(zIndex: 0)の上に文字を描く
            zIndex: "1",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "component.gap.sm",
            // 横向きではトラックの高さまで伸びるので効かないが、縦向き(高さ auto)で項目の高さを確保する
            py: "1.5",
            borderRadius: "item",
            fontWeight: "medium",
            whiteSpace: "nowrap",
            // 未選択の項目は一段引いた文字色で並べる
            // (colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.surface(mori.3) Lc 72.3)
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            userSelect: "none",
            transitionDuration: "fast",
            transitionProperty: "background, color",
            transitionTimingFunction: "easeInOut",
            // 未選択の項目だけ hover で面を薄く差し、押せることを伝える。
            // 選択中は Indicator が下にあるため面を重ねない。disabled / readOnly では hover を効かせない
            // (hover 中の文字 colorPalette.fg の計測値: colorPalette.surface(mori.3) Lc 74.6。
            //  本文の目安 Lc 75 をわずかに下回るが、選択肢の短いラベルなので補助テキストの目安 Lc 60 で評価している)
            "&:not([data-disabled]):not([data-readonly]):not([data-state=checked]):hover": {
                bg: "colorPalette.surface",
                color: "colorPalette.fg",
            },
            // 選択中の項目は solid の Indicator の上に載るので contrast(白)で読ませる
            // (白 on colorPalette.solid(mori.9) の計測値: Lc 79.1。本文の目安 Lc 75 を満たす)
            _checked: {
                color: "colorPalette.contrast",
            },
            // フォーカスは隠した radio に入るが、zag が項目に data-focus-visible を付けるので項目にリングを描く。
            // outline: none だと利用側で outline-style が none のまま残るため outline 一式を明示する
            _focusVisible: focusRing,
            // 無効: 文字を落として選べないことを示す
            // (fg.disabled = gray.9 の計測値: 白 Lc 60.4 / bg.disabled(gray.4) Lc 46.9。無効状態の目安 Lc 30 以上)
            _disabled: {
                color: "fg.disabled",
                cursor: "not-allowed",
            },
            // 読み取り専用: zag が値の変更を止めるので、押せるように見せない(hover も上で除外している)
            "&[data-readonly]": {
                cursor: "default",
            },
            // グループ全体が無効なときは Indicator が bg.disabled に沈むので、選択中の項目も白ではなく fg.disabled にする。
            // _checked は _disabled より後に出力されて勝つため、Root の data-disabled を見て詳細度を上げて上書きする
            // (fg.disabled on bg.disabled(gray.4) の計測値: Lc 46.9)。
            // 有効なグループの中の無効な項目は、選択中なら solid の Indicator の上に載るので白のまま読ませる
            "[data-scope=segment-group][data-part=root][data-disabled] &": {
                color: "fg.disabled",
            },
            "& :where(svg)": {
                width: "1em",
                height: "1em",
                flexShrink: "0",
            },
        },
        itemText: {
            // アイコンと並べたときに縦位置が揃うよう、行の高さを詰める
            lineHeight: "1",
        },
        itemControl: {
            // radio の丸に当たる要素。SegmentGroup では Indicator が選択を表すので見た目を持たせない
            display: "none",
        },
    },
    variants: {
        // Select / Field / Button の sm / md と同じスケール。トラックの高さを control.* に揃え、
        // 横に並べたときに入力欄と高さが合うようにする
        size: {
            sm: {
                control: {
                    height: "control.sm",
                },
                item: {
                    px: "3",
                    fontSize: "xs",
                },
            },
            md: {
                control: {
                    height: "control.md",
                },
                item: {
                    px: "3.5",
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
