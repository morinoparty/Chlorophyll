import { defineSlotRecipe } from "@pandacss/dev";

export const timeline = defineSlotRecipe({
    className: "timeline",
    jsx: ["Timeline"],
    description: "The vertical timeline component (diary entries, activity feeds)",
    // Indicator(点)と Connector(縦線)を左の列に、Content を右の列に置く縦型タイムライン
    slots: ["root", "item", "indicator", "connector", "content", "time", "title", "description", "meta"],
    base: {
        root: {
            // <ol> の既定スタイル(番号・余白)を消して、項目を縦に積む
            display: "flex",
            flexDirection: "column",
            listStyle: "none",
            margin: "0",
            padding: "0",
            width: "full",
            // 既定の文字色を colorPalette に追従させる
            // (colorPalette.fg の計測値: 白 Lc 82.1 / colorPalette.bg(mori) Lc 73.8)
            color: "colorPalette.fg",
            // Indicator を下にずらす量。outline で面の 1 行目に点を揃えるときだけ compoundVariants で設定する
            "--timeline-indicator-offset": "0px",
        },
        item: {
            // 左に Indicator の列(幅は size ごとの --timeline-indicator-size)、右に Content の列を置く
            position: "relative",
            display: "grid",
            gridTemplateColumns: "var(--timeline-indicator-size) minmax(0, 1fr)",
            alignItems: "start",
            // 項目同士の間隔は item の下余白で取る。Connector はこの余白も含めて次の Indicator の手前まで伸びる
            _last: {
                pb: "0",
            },
            // 最後の項目の後には次の項目が無いので、Connector を出さない。
            // data-part だけだと他のコンポーネントのパーツにも当たるため data-scope で Timeline に絞る
            "&:last-child > [data-scope='timeline'][data-part='connector']": {
                display: "none",
            },
        },
        indicator: {
            // 時系列上の位置を示す点。中にアイコンを入れられるよう円形のボックスにする
            gridColumn: "1",
            gridRow: "1",
            position: "relative",
            // Connector より前面に出す
            zIndex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "var(--timeline-indicator-size)",
            height: "var(--timeline-indicator-size)",
            borderRadius: "full",
            // 非テキストの意味を持つ要素なので Lc 45 以上が必要。step8 は地色に対して届かないため solid(step9)を使う
            // (colorPalette.solid = mori.9 の計測値: 白 Lc 73.7 / colorPalette.bg(mori) Lc 65.5)
            bg: "colorPalette.solid",
            // アイコンは solid の上に載せる文字色(白)で描く
            // (白の計測値: colorPalette.solid(mori.9) に対して Lc 79.1)
            color: "colorPalette.contrast",
            flexShrink: "0",
            mt: "var(--timeline-indicator-offset)",
            // アイコンを入れない点だけの Indicator は半分の大きさに縮める。
            // 列の幅と中心は変えないので、アイコンの有無が混ざっても Connector の位置は揃う
            _empty: {
                transform: "scale(0.5)",
            },
        },
        connector: {
            // Indicator の下から次の Indicator の手前まで伸びる縦線。
            // 位置は Indicator の大きさ(--timeline-indicator-size)から計算し、点の中心に合わせる。
            // 線幅の半分は transform ではなく論理プロパティの計算で引き、RTL でも中心がずれないようにする
            position: "absolute",
            insetInlineStart: "calc((var(--timeline-indicator-size) - token(sizes.0.5)) / 2)",
            top: "calc(var(--timeline-indicator-offset) + var(--timeline-indicator-size) + token(spacing.component.gap.xs))",
            // 次の項目の Indicator は --timeline-indicator-offset だけ下がっているので、その分だけ次の項目へはみ出させ、
            // 線の上下の隙間を同じ gap.xs に揃える(はみ出した部分は zIndex を持つ次の Indicator が上に重なる)
            bottom: "calc(token(spacing.component.gap.xs) - var(--timeline-indicator-offset))",
            width: "0.5",
            borderRadius: "full",
            // 項目の並びはマークアップ(<ol>)が伝えるため、線は装飾的な輪郭として控えめな枠線色にする
            // (colorPalette.border = mori.6 の計測値: 白 Lc 23.6 / colorPalette.bg(mori) Lc 15.3。非テキストの目安 Lc 45 は適用しない)
            bg: "colorPalette.border",
        },
        content: {
            // 本文側の列。Time / Title / Description を左の列に、Meta を右端の列に置く
            gridColumn: "2",
            gridRow: "1",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignContent: "start",
            // Time / Title / Description の 3 行。Meta が文字より高いときに余った高さを最後の行だけに回し、
            // 時刻と見出しの間が開かないようにする
            gridTemplateRows: "auto auto 1fr",
            columnGap: "component.gap.md",
            minWidth: "0",
            // Meta 以外のパーツは左の列に積む
            "& > :not([data-scope='timeline'][data-part='meta'])": {
                gridColumn: "1",
            },
        },
        time: {
            display: "block",
            // 時刻の桁がずれないよう等幅数字にする
            fontVariantNumeric: "tabular-nums",
            fontWeight: "medium",
            // 本文より一段引いた補助テキスト
            // (colorPalette.fg.muted = gray.11 の計測値: 白 Lc 79.8 / colorPalette.bg(mori) Lc 71.6)
            color: "colorPalette.fg.muted",
        },
        title: {
            fontWeight: "bold",
            color: "colorPalette.fg",
            // 時刻の下に置いたときだけ間を空ける(Meta を挟んでも効くよう一般兄弟セレクタにする)
            "[data-scope='timeline'][data-part='time'] ~ &": {
                mt: "0.5",
            },
        },
        description: {
            // 補助テキスト(colorPalette.fg.muted の計測値は time と同じ)
            color: "colorPalette.fg.muted",
            // 時刻・見出しの下に置いたときだけ間を空ける
            "[data-scope='timeline'][data-part='time'] ~ &, [data-scope='timeline'][data-part='title'] ~ &": {
                mt: "1",
            },
        },
        meta: {
            // アバターなどを右端に寄せる列。Time / Title / Description の 3 行にまたがって上端に揃える
            gridColumn: "2",
            gridRow: "1 / span 3",
            alignSelf: "start",
            display: "flex",
            alignItems: "center",
            gap: "component.gap.xs",
            flexShrink: "0",
            color: "colorPalette.fg.muted",
        },
    },
    variants: {
        variant: {
            // 枠を持たず、本文をページの地にそのまま並べる控えめな表示
            subtle: {},
            // 本文を地色より一段明るい面に載せ、1 件ずつ区切って見せる。
            // 白いパネル + 枠線だとページの地色(colorPalette.bg)の上で箱っぽく強調されすぎるため、
            // 枠線を付けず、bg より一段明るい surface.subtle(step2)の低コントラストな面で区切る。
            // API 互換のため variant 名は outline のまま据え置く
            // (面の上の文字の計測値: colorPalette.fg Lc 78.8 / colorPalette.fg.muted Lc 76.6(mori)。
            // 面と地色の差は Lc 0.0 で、区切りは輪郭ではなく面の明度差で淡く見せる)
            outline: {
                content: {
                    bg: "colorPalette.surface.subtle",
                    borderRadius: "panel",
                },
            },
        },
        size: {
            sm: {
                // Indicator は 20px(sizes.5)。Connector の位置と Indicator の列幅もこの値から決まる
                root: { "--timeline-indicator-size": "token(sizes.5)" },
                item: {
                    columnGap: "component.gap.sm",
                    pb: "component.gap.lg",
                },
                // アイコンは 12px(sizes.3)
                indicator: { "& :where(svg)": { width: "3", height: "3" } },
                // 1 行目(時刻、行高 1rem 前後)の中心を 20px の Indicator の中心に揃える
                content: { pt: "0.5" },
                time: { textStyle: "xs" },
                title: { textStyle: "sm" },
                description: { textStyle: "xs" },
            },
            md: {
                // Indicator は 24px(sizes.6)
                root: { "--timeline-indicator-size": "token(sizes.6)" },
                item: {
                    columnGap: "component.gap.md",
                    pb: "component.gap.xl",
                },
                // アイコンは 14px(sizes.3.5)
                indicator: { "& :where(svg)": { width: "3.5", height: "3.5" } },
                // 1 行目(時刻、行高 1.25rem 前後)の中心を 24px の Indicator の中心に揃える
                content: { pt: "0.5" },
                time: { textStyle: "sm" },
                title: { textStyle: "md" },
                description: { textStyle: "sm" },
            },
        },
    },
    compoundVariants: [
        // outline の面は size に応じて内側の余白を取る。
        // 面の上余白ぶん Indicator を下げ、点の中心を面の 1 行目(時刻)に揃える
        {
            variant: "outline",
            size: "sm",
            css: {
                root: { "--timeline-indicator-offset": "token(spacing.component.padding.sm)" },
                content: {
                    pl: "component.padding.md",
                    pr: "component.padding.md",
                    pt: "component.padding.sm",
                    pb: "component.padding.sm",
                },
            },
        },
        {
            variant: "outline",
            size: "md",
            css: {
                root: { "--timeline-indicator-offset": "token(spacing.component.padding.md)" },
                content: {
                    pl: "component.padding.lg",
                    pr: "component.padding.lg",
                    pt: "component.padding.md",
                    pb: "component.padding.md",
                },
            },
        },
    ],
    defaultVariants: {
        variant: "subtle",
        size: "md",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
