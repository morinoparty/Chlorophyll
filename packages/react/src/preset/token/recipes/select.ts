import { defineSlotRecipe } from "@pandacss/dev";

export const select = defineSlotRecipe({
    className: "select",
    jsx: ["Select"],
    description: "The select component",
    // zag/Ark の anatomy に合わせたスロット名。
    // HiddenSelect(ネイティブ <select>、zag が visually-hidden を当てる)と
    // Context(render prop のみで DOM を持たない)はスタイルを持たないため含めない
    slots: [
        "root",
        "label",
        "control",
        "trigger",
        "valueText",
        "indicator",
        "clearTrigger",
        "positioner",
        "content",
        "itemGroup",
        "itemGroupLabel",
        "item",
        "itemText",
        "itemIndicator",
    ],
    base: {
        root: {
            // ラベルとコントロールを縦に積む。横幅は親に任せる(Trigger が width: 100% で追従する)
            display: "flex",
            flexDirection: "column",
            width: "full",
        },
        label: {
            // フォームのラベル。Trigger の上に控えめに置く
            display: "block",
            mb: "1.5",
            fontSize: "sm",
            fontWeight: "medium",
            color: "fg",
            _disabled: {
                color: "fg.disabled",
            },
        },
        control: {
            // Trigger と ClearTrigger を重ねる基準。ClearTrigger を absolute で置く前提
            position: "relative",
            // ClearTrigger は absolute で Trigger に重なっており、Trigger の flex レイアウトからは
            // 見えていない。そのままだと ValueText が×の下まで伸びて文字が重なるため、
            // ×(20px)とその左の隙間(4px)ぶんだけ ValueText を内側に寄せて省略記号を手前で効かせる。
            // padding ではなく margin にしているのは、padding は overflow の内側に入って
            // text-overflow: ellipsis の位置が狂うため。
            // sm: 右余白 12 + Indicator 12 + gap 8 = 32px の右端に対し×の左端は 52px、
            // md: 右余白 14 + Indicator 14 + gap 8 = 36px に対し×の左端は 56px。どちらも 24px 空ければ足りる。
            // hidden の有無で出し分けると選ぶたびに幅が跳ねるので、ClearTrigger を置いた構成では常に空ける。
            // スロットのクラス名ではなく Ark が保証する data-part を参照する(クラス名は Panda の生成に依存するため)
            "&:has([data-part='clear-trigger']) [data-part='value-text']": {
                marginEnd: "6",
            },
        },
        trigger: {
            // 入力欄と同じ「フォームコントロール」の見た目。
            // 選択中の文字を左、シェブロンを右に振り分ける
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "component.gap.sm",
            width: "full",
            bg: "bg.panel",
            borderWidth: "1px",
            borderStyle: "solid",
            // ライブラリ方針: 枠線は控えめに。hover で一段濃くして押せることを伝える
            borderColor: "border.subtle",
            borderRadius: "lg",
            color: "fg",
            textAlign: "start",
            cursor: "pointer",
            transitionDuration: "fast",
            transitionProperty: "border-color, background, color, box-shadow",
            transitionTimingFunction: "easeInOut",
            // disabled 状態では hover を効かせない
            "&:not(:disabled):not([data-disabled]):hover": {
                borderColor: "border.interactive",
            },
            // 未選択で placeholder を表示しているときは文字を弱める。
            // fg.subtle(75% 透過)は白地で WCAG AA のコントラストを満たせず axe が失敗するため、
            // 不透明な fg.muted で読める濃さを保つ
            "&[data-placeholder-shown]": {
                color: "fg.muted",
            },
            // outline: none だと利用側で outline-style が none のまま残り、
            // フォーカスリングが描かれないため outline 一式を明示する
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "2px",
                outlineColor: "colorPalette.focus.ring",
                outlineOffset: "2px",
            },
            "&[data-invalid]": {
                borderColor: "border.error",
            },
            _disabled: {
                bg: "bg.disabled",
                color: "fg.disabled",
                cursor: "not-allowed",
            },
        },
        valueText: {
            // 長いラベルは折り返さず省略記号で切る
            flex: "1",
            minWidth: "0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        indicator: {
            // 開閉を示すシェブロン。開いているときは上向きに回す
            display: "inline-flex",
            alignItems: "center",
            flexShrink: "0",
            color: "fg.muted",
            transitionDuration: "fast",
            transitionProperty: "transform",
            transitionTimingFunction: "easeInOut",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
            },
            // Ark は indicator にも data-state=open/closed を付けるので自身の状態で回転できる
            _open: {
                transform: "rotate(180deg)",
            },
            _disabled: {
                color: "fg.disabled",
            },
        },
        clearTrigger: {
            // 選択を解除する小さなアイコンボタン。何も選ばれていないときは zag が hidden を付ける。
            // <button> の中に <button> は置けないため Trigger の兄弟として Control に置き、
            // Indicator の左隣に重なるよう absolute で配置する(横位置は variants.size 側)
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "5",
            height: "5",
            p: "0",
            bg: "transparent",
            border: "none",
            borderRadius: "md",
            color: "fg.muted",
            cursor: "pointer",
            transitionDuration: "fast",
            transitionProperty: "background, color",
            transitionTimingFunction: "easeInOut",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
            },
            _hover: {
                bg: "colorPalette.surface",
                color: "fg",
            },
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "2px",
                outlineColor: "colorPalette.focus.ring",
                outlineOffset: "2px",
            },
            // display を指定すると UA の [hidden] { display: none } に勝ってしまうため明示的に隠す
            _hidden: {
                display: "none",
            },
        },
        positioner: {
            // 実際の位置決めは zag のインラインスタイルが担う。重なり順だけここで持つ。
            // ただし zag は `z-index: var(--z-index)` を **インラインで** 当てるため、
            // クラス側の zIndex は必ず負ける。変数そのものを与えて重なり順を通す
            // zag は positioner に `--z-index: auto; z-index: var(--z-index)` を
            // **インラインで** 当てるため、クラス側の指定は !important でないと勝てない
            zIndex: "popover!",
        },
        content: {
            // Menu.Content と同じポップオーバー風カード: 白背景・角丸・浮き上がる影
            display: "flex",
            flexDirection: "column",
            maxHeight: "96",
            overflowY: "auto",
            bg: "bg.panel",
            borderWidth: "1px",
            borderColor: "border.subtle",
            borderRadius: "xl",
            boxShadow: "floating",
            p: "1.5",
            outline: "none",
            // Ark が付与する data-state=open で開閉アニメーションを再生する
            _open: {
                animationName: "slideDownIn",
                animationDuration: "fast",
                animationTimingFunction: "easeOut",
            },
        },
        itemGroup: {
            display: "flex",
            flexDirection: "column",
        },
        itemGroupLabel: {
            // ItemGroup の見出し。Menu と同じ小さな大文字のラベル
            px: "component.padding.md",
            pt: "component.padding.sm",
            pb: "1",
            fontSize: "xs",
            fontWeight: "semibold",
            letterSpacing: "wide",
            textTransform: "uppercase",
            color: "fg.muted",
        },
        item: {
            display: "flex",
            alignItems: "center",
            gap: "component.gap.sm",
            borderRadius: "md",
            px: "component.padding.md",
            color: "fg",
            cursor: "pointer",
            userSelect: "none",
            outline: "none",
            transitionDuration: "fast",
            transitionProperty: "background, color",
            transitionTimingFunction: "easeInOut",
            // キーボード操作 / ポインター両方で Ark が付与する data-highlighted な行の見た目
            _highlighted: {
                bg: "colorPalette.surface",
            },
            // 選択中の項目(data-state=checked)はブランド色で強調する
            _checked: {
                color: "colorPalette.fg",
                fontWeight: "medium",
            },
            _disabled: {
                cursor: "not-allowed",
                color: "fg.disabled",
                _highlighted: {
                    bg: "transparent",
                },
            },
        },
        itemText: {
            // ラベルが余白を取り、ItemIndicator を右端に押し出す
            flex: "1",
        },
        itemIndicator: {
            // 選択中の項目に付くチェック。未選択の項目では zag が hidden を付ける
            display: "inline-flex",
            alignItems: "center",
            flexShrink: "0",
            marginLeft: "auto",
            color: "colorPalette.fg",
            "& :where(svg)": {
                width: "1em",
                height: "1em",
            },
            // display を指定すると UA の [hidden] { display: none } に勝ってしまうため明示的に隠す
            _hidden: {
                display: "none",
            },
        },
    },
    variants: {
        // Button の sm / md と同じスケール。テーブルのセルなど狭い場所では sm を使う
        size: {
            sm: {
                trigger: {
                    height: "{sizes.9}",
                    px: "3",
                    fontSize: "xs",
                },
                // 右余白(12px) + Indicator(12px) + gap(8px) の左に置く
                clearTrigger: {
                    insetEnd: "8",
                },
                item: {
                    py: "1.5",
                    fontSize: "xs",
                },
            },
            md: {
                trigger: {
                    height: "{sizes.10}",
                    px: "3.5",
                    fontSize: "sm",
                },
                // 右余白(14px) + Indicator(14px) + gap(8px) の左に置く
                clearTrigger: {
                    insetEnd: "9",
                },
                item: {
                    py: "component.padding.sm",
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
