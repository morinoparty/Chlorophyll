import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, PlusIcon, SparklesIcon, StarIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Sticker(ダイカットステッカー)方向のボタン
 *
 * 色の面(face)の周りに太い白フチ(ダイカットの余白)を持たせ、0 ぼかしのくっきりした落ち影で
 * 「紙に貼られたシール」のように見せる。静止時はわずかに傾けて、手で貼ったような遊びを出す。
 * hover では右上の角がめくれ(::after の折り返し)、少し持ち上がって傾きが戻る。押下では紙に押し付けられて影が縮む。
 *
 * 白フチは box-shadow ではなく実際の border で描く。boxSizing は border-box なので高さは control.sm/md/lg のまま、
 * フォーカスリング(outlineOffset: focus.ring.offset)は白フチの外側、ページの地色の上に出る。
 * 白フチは白いパネル・ページの地色のどちらに対してもほぼ Lc 0 なので、シルエットは
 * 白フチ外周の淡い 1px ヘアラインと、くっきりした落ち影(輪郭の主役)で出す。
 *
 * APCA(apca-w3 calcAPCA)計測値。storybook の生成トークン(styled-system/styles.css)を sRGB に解決して算出
 *   primary   : contrast(白) on solid(step9)               mori 79.1 / umi 78.5 / red 70.5(red は既存 Button と共通の課題)
 *               contrast(白) on solid.emphasized(押下)       mori 84.5 / umi 84.0 / red 74.5
 *   secondary : colorPalette.12 on surface.hover(step4)    mori 85.6 / umi 83.7 / red 79.8
 *               colorPalette.12 on surface.active(押下 step5) mori 79.9 / umi 78.0 / red 73.9
 *               (colorPalette.fg on step4 は 69.8 / 69.6 / 65.8 で目安 75 に届かないため、Tonal と同じく step12 に沈める)
 *   plain     : colorPalette.fg on 白(hover で現れる白いシール) mori 82.1 / umi 82.3 / red 81.8
 *               colorPalette.fg on colorPalette.bg(静止時)    mori 73.8 / umi 74.2 / red 73.1
 *               colorPalette.fg on surface.subtle(押下 step2)  mori 78.8 / umi 78.7 / red 78.0
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9 / plain の fg.disabled on colorPalette.bg 51.7〜52.4(目安 30 以上)
 *   輪郭      : 白フチ vs 白 0 / vs colorPalette.bg mori 0 / umi 0 / red 7.3(白フチ単体ではシルエットにならない)
 *               落ち影(step12 50% を合成)vs 白 mori 54.1 / umi 53.6 / red 54.6、vs colorPalette.bg 49.4 / 49.1 / 49.6
 *               シルエットの主役はこの落ち影(目安 45 以上)。step12 40% では 39.6〜44.2 に落ちるので 50% を下限にする
 *               ヘアライン(step7)vs 白 mori 33.8 / umi 33.6 / red 37.4、vs colorPalette.bg 25.6 / 25.5 / 28.7
 *               (白フチの外周をなぞるだけの装飾。step8 + step9 50% では緑の二重線に見えて「縁取りされたバッジ」になったため弱めた)
 *   disabled の輪郭: gray.7 vs 白 25.9 / vs colorPalette.bg 17.2〜17.8(面の bg.disabled で形は読めるため装飾扱い)
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0、vs colorPalette.bg 65.5 / 65.0 / 56.3
 *               落ち影の上に重なると vs 影(白に合成)17.5 / 17.5 / 8.4、vs 影(地色に合成)14.1 / 14.0 / 0 まで落ちるため、
 *               フォーカス中は落ち影を 1px に縮めてリングの下から外す
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)。
// data-preview は Showcase で hover / active の段を静止状態のまま並べて見比べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// 白フチの外周に引く 1px のヘアライン。輪郭そのものは落ち影が担うので、ここは白フチの縁をなぞる程度の淡い線にとどめる。
// 濃い線(step8 + step9)にすると白フチの内外に緑の線が 2 本見えて、シールではなく縁取りバッジに見える
const HAIRLINE = "var(--mpc-colors-color-palette-7)";
// disabled はパレットに追従させず、灰色の台紙に平らに貼られた見た目にする
const HAIRLINE_DISABLED = "var(--mpc-colors-gray-7)";
// 0 ぼかしの落ち影の色。黒ではなくパレットの最も深い段を半透明にして、地色になじませる。
// 35% では地色に対して Lc 35 前後と輪郭として弱いので、50% まで濃くする
const DROP = "color-mix(in oklab, var(--mpc-colors-color-palette-12) 50%, transparent)";

// 影は「面のつや → ヘアライン → くっきりした落ち影 → 柔らかい拡散影」の順に重ねる。
// 落ち影の x/y は変数(--sticker-drop-x/y)に逃がし、hover / active では変数だけを差し替える
const STICKER_SHADOW = [
    // ビニールシールのつや。inset は border の内側(色の面)にだけ描かれ、白フチには乗らない
    "inset 0 1.5px 0 rgb(255 255 255 / 0.32)",
    "inset 0 -2px 0 rgb(0 0 0 / 0.06)",
    `0 0 0 1px ${HAIRLINE}`,
    `var(--sticker-drop-x) var(--sticker-drop-y) 0 1px ${DROP}`,
    // 持ち上がりを柔らかく見せる拡散影。hover で --sticker-float を広げて浮き上がりを強める
    "0 var(--sticker-float) calc(var(--sticker-float) * 2) calc(var(--sticker-float) * -0.5) rgb(0 0 0 / 0.16)",
].join(", ");

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// フォーカス中の落ち影。spread 1px と合わせて白フチから 2px 以内に収め、outlineOffset(2px)より内側に留める
const FOCUS_DROP = { "--sticker-drop-x": "1px", "--sticker-drop-y": "1px" } as const;

// めくれた角の裏面。シールの裏紙(gray.6 → gray.2)を、折り目の対角線から角に向けてグラデーションで描く。
// 右上の三角形は透明にし、左下の三角形だけを「折り返した紙」として見せる。
// 折り目のすぐ外側に 1px の濃い段(gray.8)を置き、白フチの上でも折り返しの縁が読めるようにする
const CURL_GRADIENT =
    "linear-gradient(to bottom left, transparent calc(50% - 1px), var(--mpc-colors-gray-8) calc(50% - 1px), var(--mpc-colors-gray-6) 50%, var(--mpc-colors-gray-2) 100%)";

// disabled 共通: 傾き・持ち上げ・落ち影を消し、台紙に平らに貼り付いた「使えないシール」にする
const flat = {
    "--sticker-tilt": "0deg",
    "--sticker-lift": "0px",
    boxShadow: `0 0 0 1px ${HAIRLINE_DISABLED}`,
} as const;

export const stickerButton = cva({
    base: {
        // めくれ(::after)の位置の基準にする
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        // 白フチを含めて control.sm/md/lg の高さに収める
        boxSizing: "border-box",
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: "var(--sticker-edge)",
        borderRadius: "control",
        // シールの文字らしく、既存 Button(semibold)より一段太くする
        fontWeight: "bold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 傾き・影・白フチははみ出すので、並べたときに隣と重ならないよう外側に余白を取る
        margin: "1.5",
        // 落ち影の既定のずれ。右下にくっきり落とす
        "--sticker-drop-x": "2px",
        "--sticker-drop-y": "3px",
        "--sticker-lift": "0px",
        "--sticker-float": "4px",
        // 傾きは静的な見た目なので、motion 設定に関係なく常に適用する
        transform: "translateY(var(--sticker-lift)) rotate(var(--sticker-tilt))",
        boxShadow: STICKER_SHADOW,
        transitionProperty: "transform, box-shadow, background-color, color",
        transitionDuration: "normal",
        transitionTimingFunction: "[cubic-bezier(0.34, 1.56, 0.64, 1)]",
        _motionReduce: { transitionProperty: "background-color, color" },
        // lucide-react のアイコンを文字サイズに合わせる(既存 Button のレシピと同じ比率)
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        // めくれた角。静止時は大きさ 0 で、hover で --sticker-curl まで広がる。
        // 白フチの外角に合わせて配置し、padding の内側に収まる大きさにしてラベルの下には入らないようにする
        _after: {
            content: '""',
            position: "absolute",
            top: "calc(var(--sticker-edge) * -1)",
            right: "calc(var(--sticker-edge) * -1)",
            width: "0",
            height: "0",
            background: CURL_GRADIENT,
            borderBottomLeftRadius: "[40%]",
            // 折り返した紙の下にだけ小さな影を落とし、浮いている厚みを見せる
            filter: "drop-shadow(-1px 2px 1.5px rgb(0 0 0 / 0.28))",
            pointerEvents: "none",
            transitionProperty: "width, height",
            transitionDuration: "normal",
            transitionTimingFunction: "easeOut",
            _motionReduce: { transitionProperty: "none" },
        },
        [HOVER]: {
            // 持ち上げて傾きを戻し、影を遠くに伸ばす。動きを減らす設定では位置と傾きは変えない
            _motionSafe: { "--sticker-lift": "-2px", "--sticker-tilt": "0deg" },
            "--sticker-drop-x": "3px",
            "--sticker-drop-y": "5px",
            "--sticker-float": "8px",
            _after: { width: "var(--sticker-curl)", height: "var(--sticker-curl)" },
            // フォーカス中は hover でも落ち影を伸ばさず、リングの下に影が入らないようにする(_focusVisible のコメント参照)
            _focusVisible: FOCUS_DROP,
        },
        [ACTIVE]: {
            // 紙に押し付けたように影を詰め、めくれも戻す
            _motionSafe: { "--sticker-lift": "1px", "--sticker-tilt": "0deg" },
            "--sticker-drop-x": "1px",
            "--sticker-drop-y": "1px",
            "--sticker-float": "2px",
            transitionDuration: "fastest",
            _after: { width: "0", height: "0" },
        },
        // リングは白フチの 2〜4px 外に出るため、落ち影(右下へ 3〜5px)と重なると Lc 0〜18 まで落ちる。
        // フォーカス中は落ち影を 1px まで縮め、リングが必ずページの地色の上に乗るようにする
        _focusVisible: { ...focusRing, ...FOCUS_DROP },
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // 最も強い操作。solid の塗りに白い文字。白フチと同じ白なので、文字がフチと地続きに見える
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                [ACTIVE]: { bg: "colorPalette.solid.emphasized" },
                _disabled: { bg: "bg.disabled", color: "fg.disabled", ...flat },
            },
            // 補助的な操作。パレットを帯びた淡い面のシール。
            // step3 はページの地色と同じ明度で面が消えるため step4 から始め、文字は step12 に沈めて Lc を確保する
            secondary: {
                bg: "colorPalette.surface.hover",
                color: "colorPalette.12",
                [ACTIVE]: { bg: "colorPalette.surface.active" },
                _disabled: { bg: "bg.disabled", color: "fg.disabled", ...flat },
            },
            // 最も控えめな操作。静止時はフチも影も無い文字だけで、hover で白いシールが「貼られる」
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                borderColor: "transparent",
                boxShadow: "none",
                "--sticker-tilt": "0deg",
                [HOVER]: {
                    bg: "white",
                    borderColor: "white",
                    boxShadow: STICKER_SHADOW,
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface.subtle",
                    borderColor: "white",
                    boxShadow: STICKER_SHADOW,
                },
                _disabled: { color: "fg.disabled", boxShadow: "none" },
            },
        },
        // 面の高さは既存 Button と同じ control.sm/md/lg(白フチ込み)。
        // padding は白フチのぶんだけ既存より狭め、ラベル周りの余白を他の方向性と揃える
        size: {
            sm: {
                height: "control.sm",
                px: "[11px]",
                fontSize: "xs",
                "--sticker-edge": "3px",
                "--sticker-curl": "13px",
            },
            md: {
                height: "control.md",
                px: "[13px]",
                fontSize: "sm",
                "--sticker-edge": "3px",
                "--sticker-curl": "15px",
            },
            lg: {
                height: "control.lg",
                px: "[16px]",
                fontSize: "md",
                "--sticker-edge": "4px",
                "--sticker-curl": "18px",
            },
        },
        // 貼り方の傾き。並べたときに左右へ散らすと「集めたシール」らしさが出る
        tilt: {
            left: { "--sticker-tilt": "-1.5deg" },
            right: { "--sticker-tilt": "1.5deg" },
            none: { "--sticker-tilt": "0deg" },
        },
    },
    // plain は静止時に傾けない(文字だけが傾くと崩れて見えるため)。tilt より後に効かせるため compoundVariants で上書きする
    compoundVariants: [
        {
            intent: "plain",
            tilt: ["left", "right"],
            css: { "--sticker-tilt": "0deg" },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
        tilt: "left",
    },
});

export type StickerButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof stickerButton>;

// 既存 Button と同じ intent / size の props を受け取り、比較用の一覧ストーリーから差し替えて並べられるようにする。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う。
// 採用時は packages/react 側で ark.button に置き換える
export const StickerButton = forwardRef<HTMLButtonElement, StickerButtonProps>(
    ({ intent, size, tilt, className, ...props }, ref) => (
        <button ref={ref} type="button" className={cx(stickerButton({ intent, size, tilt }), className)} {...props} />
    ),
);
StickerButton.displayName = "StickerButton";

// 一覧表示用のレイアウト
const showcaseStyles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "6" }),
    // ページの地色(colorPalette.bg)の上に置くセクション
    section: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
    // 白いパネル(bg.panel)の上に置くセクション。白フチが溶ける条件でもシルエットが残るかを確認する
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const TILTS = ["left", "right", "none"] as const;

// intent × size の行をまとめて描く。傾きを左右に散らして、シールを並べたときの印象も見る
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size, i) => (
                    <StickerButton key={size} intent={intent} size={size} tilt={i % 2 === 0 ? "left" : "right"}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </StickerButton>
                ))}
            </div>
        ))}
    </>
);

// hover(めくれ)/ active(押し付け)の段を静止状態で並べる
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <StickerButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </StickerButton>
                ))}
                <StickerButton intent={intent} disabled>
                    {intent} disabled
                </StickerButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <StickerButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </StickerButton>
        ))}
    </div>
);

const meta: Meta<typeof StickerButton> = {
    title: "LAB/Button Designs/Sticker",
    component: StickerButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Sticker** — 色の面の周りに太い白フチ(ダイカットの余白)を持たせ、0 ぼかしのくっきりした落ち影で「貼られたシール」に見せる方向性です。静止時はわずかに傾き(tilt: left / right / none)、hover で右上の角がめくれて少し持ち上がり、押下で紙に押し付けられて影が縮みます。動きを減らす設定では持ち上げ・傾きの変化・めくれのアニメーションを止め、静的な傾きと影の変化だけを残します。",
                    "",
                    "**強み**: 楽しく、集めたくなる手触りがあります。白フチのおかげでどんな色の上でも面の色が濁らず、mori / umi / red のパレット差し替えにもそのまま追従します。hover のめくれは「触れると反応する」ことを動きの小さな遊びで伝えられ、どうぶつの森のような柔らかいゲーム的 UI と相性が良いです。",
                    "",
                    "**トレードオフ**: 白フチは白いパネル・ページの地色のどちらとも Lc 0 前後で溶けるため、シルエットは右下へ落ちるくっきりした影に頼っています(左上の縁は淡いヘアラインのみ)。傾き・影・白フチがボックスの外へはみ出すので、周囲に余白(margin)が必要で、密なツールバーやフォームでは収まりが悪くなります。白フチのぶんラベルの領域が狭く、sm では窮屈です。傾いた文字は長い日本語ラベルでは読みにくくなるため、短いラベル向きです。red の primary は solid 自体の明るさにより白文字が Lc 70.5 と、本文の目安 75 に届きません(既存 Button と共通の課題)。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        tilt: { control: "select", options: TILTS },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ボタンだよー",
        intent: "primary",
        size: "lg",
        tilt: "left",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof StickerButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* 白フチが完全に溶ける白いパネルの上でも、落ち影で輪郭が残るかを見る */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>
                    状態の段(rest → hover(めくれ)→ active(押し付け)→ disabled)/ ページの地色の上
                </span>
                <StateRows />
            </section>
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>状態の段 / 白いパネルの上</span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン(前置き / 後置き)と傾き</span>
                <div className={showcaseStyles.row}>
                    <StickerButton tilt="left">
                        <StarIcon />
                        あつめる
                    </StickerButton>
                    <StickerButton intent="secondary" tilt="right">
                        つぎへ
                        <ArrowRightIcon />
                    </StickerButton>
                    <StickerButton intent="secondary" tilt="none">
                        <HeartIcon />
                        お気に入り
                    </StickerButton>
                    <StickerButton intent="plain">
                        <PlusIcon />
                        追加
                    </StickerButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <StickerButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </StickerButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、面・文字・ヘアライン・落ち影・フォーカスリングがパレットに追従することを確認する */}
            <section className={cx(css({ colorPalette: "umi" }), showcaseStyles.section)}>
                <span className={showcaseStyles.label}>colorPalette: umi</span>
                <PaletteRow />
            </section>
            <section className={cx(css({ colorPalette: "red" }), showcaseStyles.section)}>
                <span className={showcaseStyles.label}>colorPalette: red</span>
                <PaletteRow />
            </section>
        </div>
    ),
};

export const Playground: Story = {};
