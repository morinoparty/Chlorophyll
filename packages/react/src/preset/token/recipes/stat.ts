import { defineSlotRecipe } from "@pandacss/dev";

export const stat = defineSlotRecipe({
    className: "stat",
    jsx: ["Stat"],
    description: "The stat component (labelled numeric values such as currency or play time)",
    // Label(<dt>)の下に Value(<dd>)を置き、Value の中に Unit を並べる。
    // Group は複数の Root を横一列に並べ、間に縦の区切り線を引く
    slots: ["root", "label", "value", "unit", "helpText", "group"],
    base: {
        root: {
            // 単独で使うときは <dl>、Group の中では <div> になる。どちらも既定の余白を消して縦に積む
            display: "flex",
            flexDirection: "column",
            // Label / Value / HelpText の間をわずかに空ける(行高に加えて 2px)
            gap: "0.5",
            margin: "0",
            minWidth: "0",
            // 既定の文字色を colorPalette に追従させる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            color: "colorPalette.fg",
        },
        label: {
            fontWeight: "medium",
            // 値の意味を伝える情報なので、半透明の fg.subtle ではなく不透明な fg.muted を使う
            // (colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg(mori) Lc 71.6)
            color: "colorPalette.fg.muted",
        },
        value: {
            // <dd> の既定のインデントを消す
            margin: "0",
            // 数値と Unit をベースラインで揃えて横に並べる
            display: "flex",
            alignItems: "baseline",
            // 数値と単位は 1 つの値として読ませたいので、幅が狭くても単位だけを次の行に送らない
            whiteSpace: "nowrap",
            columnGap: "1",
            fontWeight: "bold",
            // 桁がそろうよう等幅数字にする(Group で並べたときや値が更新されたときに幅がぶれない)
            fontVariantNumeric: "tabular-nums",
            color: "colorPalette.fg",
        },
        unit: {
            // 値より小さく細い補助テキストにして、数値を主役にする
            fontWeight: "medium",
            // (colorPalette.fg.muted の計測値は label と同じ)
            color: "colorPalette.fg.muted",
        },
        helpText: {
            // <dd> の既定のインデントを消す
            margin: "0",
            // 前回比などの補足。補助テキストとして一段引いた色にする(計測値は label と同じ)
            color: "colorPalette.fg.muted",
        },
        group: {
            // 複数の Stat を横一列に並べる <dl>。既定の余白を消す
            display: "flex",
            alignItems: "stretch",
            margin: "0",
            width: "full",
            // 値が収まりきらないときは、隣の Stat に重ねず次の行へ送る。行の間も区切りと同じ余白を取る
            flexWrap: "wrap",
            rowGap: "var(--stat-group-gap)",
            // 各 Stat は中身の幅を基準に残りの幅を分け合う。等分(flex-basis: 0)にすると、
            // スマホ幅で「保護ブロック」のような長いラベルだけが途中で折り返されるため。
            // data-part だけだと他のコンポーネントのパーツにも当たるため data-scope で Stat に絞る
            "& > [data-scope='stat'][data-part='root']": {
                flex: "1 1 auto",
                // root の既定の minWidth: 0 を戻し、折り返さない値(value)の幅より狭く縮めない。
                // 0 のままだと長い値(例: 1,234,567)が Root からはみ出し、隣の区切り線とラベルに重なる
                minWidth: "auto",
            },
            // 2 つ目以降の Stat の左に縦の区切り線を引く。区切りの前後の余白は size ごとに
            // group の columnGap と root の paddingInlineStart で同じ値を取る。
            // 区切りはマークアップ(<dl> の各組)が伝えるので線は装飾として控えめな border(gray.6)にする
            // (border の calcAPCA 計測値: 白 Lc 19.3 / colorPalette.bg(mori) Lc 11.1。装飾なので意味のある非テキストの目安 Lc 45・下限 Lc 30 は適用しない)
            "& > [data-scope='stat'][data-part='root'] + [data-scope='stat'][data-part='root']": {
                borderInlineStartWidth: "1px",
                borderInlineStartStyle: "solid",
                borderInlineStartColor: "border",
                paddingInlineStart: "var(--stat-group-gap)",
            },
        },
    },
    variants: {
        size: {
            sm: {
                group: { "--stat-group-gap": "token(spacing.component.gap.sm)", columnGap: "var(--stat-group-gap)" },
                label: { textStyle: "xs" },
                value: { textStyle: "lg" },
                unit: { textStyle: "xs" },
                helpText: { textStyle: "xs" },
            },
            md: {
                group: { "--stat-group-gap": "token(spacing.component.gap.md)", columnGap: "var(--stat-group-gap)" },
                label: { textStyle: "sm" },
                value: { textStyle: "2xl" },
                unit: { textStyle: "sm" },
                helpText: { textStyle: "xs" },
            },
            lg: {
                group: { "--stat-group-gap": "token(spacing.component.gap.lg)", columnGap: "var(--stat-group-gap)" },
                label: { textStyle: "sm" },
                value: { textStyle: "3xl" },
                unit: { textStyle: "md" },
                helpText: { textStyle: "sm" },
            },
        },
        align: {
            // 左(RTL では右)揃え。一覧やカードの中で文字の頭を揃えたいとき向け
            start: {
                root: { alignItems: "flex-start", textAlign: "start" },
                value: { justifyContent: "flex-start" },
            },
            // 中央揃え。プロフィールの統計の帯など、Group で等分に並べるとき向け。
            // Value は flex なので textAlign ではなく justifyContent で数値と Unit を中央に寄せる
            center: {
                root: { alignItems: "center", textAlign: "center" },
                value: { justifyContent: "center" },
            },
        },
    },
    defaultVariants: {
        size: "md",
        align: "start",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
