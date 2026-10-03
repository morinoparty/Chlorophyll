import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, CandyIcon, HeartIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Jelly(グミ / ゼリー菓子)方向のボタン
 *
 * 透き通ったグミのような「つやのある塗り」を、不透明な塗り + 左上の大きなハイライト + 下側のインナーシャドウで表現する。
 * 半透明にはせず、文字の下は常に不透明な色にしてコントラストを保つ(半透明は合成先で Lc が変わるため)。
 * 形はぷっくりしたピル型。hover で一度だけぷるんと揺れ(jiggle)、押下でむにっと潰れる(squash)。
 * 離した瞬間に hover の jiggle が再生されるので、潰れた状態から跳ね返るように見える。
 * 動きを減らす設定のユーザーには揺れ・潰れを付けず、色の変化だけで状態を伝える。
 *
 * どうぶつの森のようなゲーム UI の「おもちゃっぽさ」(丸ゴシック・厚い柔らかな下影・弾む動き)を借りるが、
 * ロゴや素材はいっさい使わず、パレット(mori / umi / red)に追従するトークンで組み立てている。
 *
 * APCA(apca-w3 calcAPCA)計測値。styled-system/styles.css のトークンを culori で sRGB に解決して計算。
 * グラデーションは「文字の下に来る最悪の色」で測っている(mori / umi / red)
 *   primary   : 文字帯(高さ 34〜72%)は step10 以上に保つ。上端の step9 は照りの帯だけに使う
 *               contrast(白) on step10(文字帯の最も明るい色)          85.2 / 84.4 / 74.5
 *               active(solid.active)                                88.7 / 88.0 / 80.6
 *               照りの裾(白 12% 以下)に文字の頭が触れた場合の最悪値   77.8 / 77.3 / 69.3
 *               下のリップ(step10 + step12 35%)vs colorPalette.bg    78.4 / 77.6 / 70.8、vs 白 86.6 / 85.7 / 79.5
 *   secondary : colorPalette.12 on step4(文字帯の中央)                85.6 / 83.7 / 80.2
 *               on step5(文字帯の最悪値。hover も step6 は下端だけ)  79.9 / 78.0 / 73.9
 *               下のリップ(step8 + step9 40%)vs colorPalette.bg      49.9 / 49.7 / 47.7、vs 白 58.2 / 57.7 / 56.4
 *   plain     : colorPalette.fg on 白 82.1 / 82.3 / 81.8、on colorPalette.bg 73.8 / 74.2 / 73.1
 *               hover は step12 on step4 85.6 / 83.7 / 80.2、active は step12 on step5 79.9 / 78.0 / 73.9
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9、plain の fg.disabled on 白 60.4(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs 白 73.7 / 73.1 / 65.0、vs colorPalette.bg 65.5 / 65.0 / 56.3
 */

// 丸ゴシック。Storybook の preview-head.html で 500 / 700 / 800 を読み込み済み
const ROUNDED_FONT = "'M PLUS Rounded 1c', sans-serif";

// グローバル設定に keyframes を足さずに済むよう、コンポーネント自身が <style> を持つ。
// React 19 の href + precedence 付き <style> は head に巻き上げられ、同じ href は 1 度だけ挿入される
const KEYFRAMES_ID = "mpc-jelly-button-keyframes";
const KEYFRAMES_CSS = `
@keyframes mpc-jelly-jiggle {
    0% { transform: scale(1, 1) rotate(0deg); }
    18% { transform: scale(1.08, 0.9) rotate(0deg); }
    38% { transform: scale(0.94, 1.08) rotate(-1.2deg); }
    56% { transform: scale(1.04, 0.96) rotate(0.8deg); }
    74% { transform: scale(0.98, 1.02) rotate(-0.3deg); }
    100% { transform: scale(1, 1) rotate(0deg); }
}
`;

// バネのように少し行き過ぎてから戻るイージング(押下の潰れ・戻りに使う)
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// disabled 以外にだけ hover / active を効かせる。
// data-preview は Showcase で hover / active の見た目を静止状態のまま並べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";
// 揺れは押下中には止める。animation は通常の宣言より優先されるため、animation: none で打ち消すと
// 生成 CSS の並び順次第で潰れ(transform)が負ける。セレクタ側で押下中を除外しておく。
// 離した瞬間にこのセレクタへ戻るので揺れが頭から再生され、潰れから跳ね返るように見える
const JIGGLE = "&:not(:disabled):not([data-disabled]):not(:active):is(:hover, [data-preview=hover])";

// 塗りより一段濃い色を混ぜた、ぷっくりした厚みを出す下のリップ + 柔らかい接地影。
// 色は intent ごとに --jelly-lip へ逃がし、影の形はここで共通化する
// ゲームのメニューボタンのように分厚く見せるため、リップは 5px と厚めにする
const OUTER_REST =
    "0 5px 0 0 var(--jelly-lip), 0 10px 16px -6px color-mix(in oklab, var(--jelly-lip) 55%, transparent)";
// hover では少し浮いたように影をにじませる
const OUTER_HOVER =
    "0 6px 0 0 var(--jelly-lip), 0 14px 20px -6px color-mix(in oklab, var(--jelly-lip) 60%, transparent)";
// 押下中はリップを潰し、地面に押し付けられたように見せる
const OUTER_PRESSED = "0 1px 0 0 var(--jelly-lip)";

// グミの内側の陰影。上端の白い照り返し + 下側にたまる濃い色で、中身の詰まった厚みを出す
// 最下端の細い明るい線は、光がグミの中を通って底から抜ける(透けている)感じを出すためのもの。文字帯より下にしか届かない
const INNER_GLOSS =
    "inset 0 2px 0 0 rgba(255, 255, 255, 0.5), inset 0 -2px 0 0 rgba(255, 255, 255, 0.22), inset 0 -7px 10px -4px color-mix(in oklab, var(--jelly-deep) 70%, transparent)";

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// 押下時の潰れ。横に広がりながら縦に縮み、接地面(下端)は動かさない
const squash = {
    transitionDuration: "fastest",
    _motionSafe: { transform: "scale(1.06, 0.88)" },
} as const;

// 無効状態の共通部分。照りも影も消し、溶けて平らになったグミのように見せる
const disabledFlat = {
    bg: "bg.disabled",
    color: "fg.disabled",
    boxShadow: "none",
    "&::before, &::after": { opacity: "0" },
} as const;

export const jellyButtonStyle = cva({
    base: {
        position: "relative",
        // ハイライト(疑似要素)を z-index: -1 で文字の下に敷くため、ボタン内で重なりを閉じる
        isolation: "isolate",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        border: "none",
        fontFamily: ROUNDED_FONT,
        // 丸ゴシックは細いと頼りなく見えるので、おもちゃらしく太めにする
        fontWeight: "extrabold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 潰れ・揺れは下端を支点にする(地面に置いたグミのように)
        transformOrigin: "bottom center",
        // リップは box-shadow でレイアウト上の高さを持たないため、下に並ぶ要素と重ならないよう余白を取る
        marginBlockEnd: "1.5",
        boxShadow: `${INNER_GLOSS}, ${OUTER_REST}`,
        transitionProperty: "background, color, box-shadow, transform",
        transitionDuration: "normal",
        transitionTimingFunction: SPRING,
        // 左上の大きな照り(グミの表面に映り込んだ光)。豆のように下がふくらんだ形にする。
        // 照りの高さ 69% 付近(かなの頭の位置。sm / md / lg 共通)で白 11% まで抜け、80% で完全に透明になる。文字に触れる裾は白 12% 以下
        _before: {
            content: '""',
            position: "absolute",
            zIndex: "-1",
            top: "[3px]",
            left: "[9%]",
            width: "[38%]",
            height: "[36%]",
            borderRadius: "[60% 40% 45% 55% / 70% 60% 40% 30%]",
            background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.35) 45%, rgba(255, 255, 255, 0) 80%)",
            pointerEvents: "none",
            transitionProperty: "opacity, transform",
            transitionDuration: "normal",
            transitionTimingFunction: SPRING,
        },
        // 照りの横の大小 2 つの粒。気泡のようなアクセントで「透けている」印象を足す
        _after: {
            content: '""',
            position: "absolute",
            zIndex: "-1",
            top: "[4px]",
            left: "[calc(9% + 38% + 3px)]",
            width: "[14px]",
            height: "[7px]",
            background:
                "radial-gradient(circle at 3px 3px, rgba(255, 255, 255, 0.85) 2.6px, transparent 3.2px), radial-gradient(circle at 11px 4px, rgba(255, 255, 255, 0.6) 1.5px, transparent 2.1px)",
            pointerEvents: "none",
            transitionProperty: "opacity, transform",
            transitionDuration: "normal",
            transitionTimingFunction: SPRING,
        },
        // lucide-react のアイコンを文字サイズに合わせる(既存 Button のレシピと同じ比率)。
        // 丸ゴシックの太さに合わせて線も太めにする
        "& :where(svg)": {
            strokeWidth: "[2.6px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        [HOVER]: {
            boxShadow: `${INNER_GLOSS}, ${OUTER_HOVER}`,
            // 光が表面をすべるように、照りと粒を少し右へ流す
            "&::before, &::after": { _motionSafe: { transform: "translateX(6px)" } },
        },
        // 一度だけぷるんと揺れる。動きを減らす設定では付けない
        [JIGGLE]: {
            _motionSafe: { animation: `mpc-jelly-jiggle 560ms ${SPRING} 1` },
        },
        [ACTIVE]: {
            boxShadow: `${INNER_GLOSS}, ${OUTER_PRESSED}`,
            ...squash,
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // 最も強い操作。solid のグミ。文字帯は step9 以上の濃さに保ち、明るい照りは文字より上だけに置く
            primary: {
                // 上 1/3(照りの帯)だけ step9 で明るく、文字帯(34〜72%)は step10、底は solid.active でたまった色を出す
                bg: "linear-gradient(180deg, var(--mpc-colors-color-palette-solid) 0%, var(--mpc-colors-color-palette-solid-emphasized) 34%, var(--mpc-colors-color-palette-solid-emphasized) 72%, var(--mpc-colors-color-palette-solid-active) 100%)",
                color: "colorPalette.contrast",
                // おもちゃのロゴ文字のような、下に落ちた濃い影。照りの裾と重なっても文字の縁が溶けない
                textShadow: "0 1.5px 0 color-mix(in oklab, var(--mpc-colors-color-palette-12) 45%, transparent)",
                "--jelly-lip":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 35%)",
                "--jelly-deep": "var(--mpc-colors-color-palette-12)",
                [HOVER]: {
                    bg: "linear-gradient(180deg, var(--mpc-colors-color-palette-solid) 0%, var(--mpc-colors-color-palette-solid-emphasized) 28%, var(--mpc-colors-color-palette-solid-active) 100%)",
                },
                [ACTIVE]: {
                    bg: "colorPalette.solid.active",
                },
                _disabled: { ...disabledFlat, textShadow: "none" },
            },
            // 補助的な操作。パレットのパステルで作ったソーダ味のグミ。
            // 面が明るいので文字は colorPalette.fg ではなく step12 に沈め、グラデーション下端でも Lc 74 以上を保つ
            secondary: {
                bg: "linear-gradient(180deg, var(--mpc-colors-color-palette-surface) 0%, var(--mpc-colors-color-palette-surface-hover) 50%, var(--mpc-colors-color-palette-surface-active) 100%)",
                color: "colorPalette.12",
                // 面と地色(colorPalette.bg)の差が小さいので、枠線の代わりに step8 のリップで輪郭を出す
                // step8 だけだと地色に対して Lc 38〜41 と弱いので、step9 を 40% 混ぜて Lc 48〜50 まで上げる
                "--jelly-lip":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-8), var(--mpc-colors-color-palette-9) 40%)",
                "--jelly-deep": "var(--mpc-colors-color-palette-7)",
                [HOVER]: {
                    // step6 は文字帯より下(78% 以降)にだけ置き、文字の下は step5 までに保つ
                    bg: "linear-gradient(180deg, var(--mpc-colors-color-palette-surface-hover) 0%, var(--mpc-colors-color-palette-surface-active) 70%, var(--mpc-colors-color-palette-6) 100%)",
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface.active",
                },
                _disabled: disabledFlat,
            },
            // 最も控えめな操作。静止時は文字だけで、照りも影も持たない。
            // hover で初めてパステルのグミが現れ、同じように揺れる
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                "--jelly-lip": "var(--mpc-colors-color-palette-7)",
                "--jelly-deep": "var(--mpc-colors-color-palette-6)",
                boxShadow: "none",
                marginBlockEnd: "0",
                "&::before, &::after": { opacity: "0" },
                [HOVER]: {
                    bg: "colorPalette.surface.hover",
                    color: "colorPalette.12",
                    boxShadow: INNER_GLOSS,
                    "&::before, &::after": { opacity: "1" },
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface.active",
                    color: "colorPalette.12",
                    boxShadow: INNER_GLOSS,
                    "&::before, &::after": { opacity: "1" },
                },
                _disabled: {
                    bg: "transparent",
                    color: "fg.disabled",
                    boxShadow: "none",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)。リップと接地影はその外側に描く
        size: {
            sm: { height: "control.sm", px: "{spacing.4}", fontSize: "xs" },
            md: { height: "control.md", px: "{spacing.5}", fontSize: "sm" },
            lg: { height: "control.lg", px: "{spacing.6}", fontSize: "md" },
        },
        // pill は定番のぷっくりした形。gummy は角丸の値を少しずつ崩した、手でこねたような形。
        // 横方向を % にすると幅に比例して巨大になりレンズ形に潰れるので、横は em、縦は左右それぞれ合計 100% に収める
        shape: {
            pill: { borderRadius: "full" },
            gummy: { borderRadius: "[1.3em 1.8em 1.4em 1.7em / 46% 56% 44% 54%]" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "pill",
    },
});

export type JellyButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof jellyButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る(shape はこの案だけの追加)。
// storybook パッケージからは @ark-ui/react を解決できないため、他の LAB 案と同じくネイティブの button を使う
export const JellyButton = forwardRef<HTMLButtonElement, JellyButtonProps>(
    ({ intent, size, shape, className, ...props }, ref) => (
        <>
            {/* 揺れの keyframes。同じ href の <style> は React が 1 つにまとめる */}
            <style href={KEYFRAMES_ID} precedence="default">
                {KEYFRAMES_CSS}
            </style>
            <button
                ref={ref}
                type="button"
                className={cx(jellyButtonStyle({ intent, size, shape }), className)}
                {...props}
            />
        </>
    ),
);
JellyButton.displayName = "JellyButton";

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
    // 白いパネル(bg.panel)の上に置くセクション。secondary のリップの見え方を地色と比べるために使う
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    // のんびりしたゲームの会話ウィンドウ風の吹き出し。枠線は使わず、ふっくらした角丸と柔らかい影で浮かせる
    dialog: css({
        display: "flex",
        flexDirection: "column",
        gap: "5",
        maxWidth: "[420px]",
        px: "7",
        py: "6",
        borderRadius: "[32px 36px 30px 34px]",
        bg: "bg.panel",
        boxShadow: "0 10px 24px -12px color-mix(in oklab, var(--mpc-colors-color-palette-12) 35%, transparent)",
        fontFamily: ROUNDED_FONT,
    }),
    dialogText: css({ fontSize: "md", fontWeight: "bold", lineHeight: "relaxed", color: "colorPalette.fg" }),
    // 選択肢は縦に積み、幅をそろえてゲームのメニューのように見せる
    choices: css({ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "3" }),
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const SHAPES = ["pill", "gummy"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <JellyButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </JellyButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active の見た目を静止状態で並べる(揺れは実際にカーソルを乗せて確認する)
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <JellyButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </JellyButton>
                ))}
                <JellyButton intent={intent} disabled>
                    {intent} disabled
                </JellyButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <JellyButton key={intent} intent={intent}>
                <CandyIcon />
                {intent}
            </JellyButton>
        ))}
        <JellyButton shape="gummy">
            <HeartIcon />
            gummy
        </JellyButton>
    </div>
);

const meta: Meta<typeof JellyButton> = {
    title: "LAB/Button Designs/Jelly",
    component: JellyButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Jelly** — グミ / ゼリー菓子のような、つやのある「ぷるぷる」したボタンです。不透明なパレットの塗りに、左上の大きな照り・下側にたまるインナーシャドウ・ぷっくりしたピル型を重ねて、透き通ったお菓子の質感を演出します。",
                    "hover で一度だけぷるんと揺れ(jiggle)、押すと横に広がりながらむにっと潰れ(squash)、離すと跳ね返ります。文字は丸ゴシック(M PLUS Rounded 1c)の極太。動きを減らす設定では揺れ・潰れを付けず、色と影の変化だけで状態を伝えます。",
                    "",
                    "**借りている雰囲気**: どうぶつの森のようなのんびりしたゲーム UI の「おもちゃ感」— 丸くて分厚い形、柔らかい下影、バネのように弾む小さな動き、丸い書体。ロゴや素材は使わず、色はすべてパレット(mori / umi / red)のトークンから作っているので、パレットを切り替えるとグミの味(色)も変わります。",
                    "",
                    "**強み**: 触りたくなる楽しさがあり、イベントページ・ガチャ・報酬の受け取りなど「うれしい操作」の主役にすると効果的です。照りは文字帯より上に、文字の下は常に不透明な色に保っているので、見た目のわりにコントラストは安定しています(primary は既存 Button と同値、secondary は step12 の文字で Lc 74〜86)。shape=gummy にすると手でこねたような不揃いな形になります。",
                    "",
                    "**トレードオフ**: 装飾(照り・リップ・影・揺れ)が多く、1 画面に並べるとにぎやかになりすぎます。管理画面や密度の高いフォームには不向きです。リップと接地影はボタンの外側に描くため、下に 4px の余白を取っています。照りは sm サイズで小文字のアセンダーにわずかに近づきます(重なった場合の最悪値は Lc 46〜50)。red の primary は solid 自体の明るさにより白文字が Lc 70.5 と、本文の目安 75 に届きません(既存 Button と共通の課題)。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        shape: { control: "select", options: SHAPES },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ぷるぷるボタン",
        intent: "primary",
        size: "lg",
        shape: "pill",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof JellyButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* secondary のリップは地色の上と白い面の上で見え方が変わるので並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>状態(rest → hover → active → disabled)</span>
                <StateRows />
            </section>
            {/* 実際の使われ方のイメージ。会話ウィンドウの選択肢として並べる */}
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>使用例 — 会話ウィンドウの選択肢</span>
                <div className={showcaseStyles.dialog}>
                    <p className={showcaseStyles.dialogText}>
                        きょうは いい天気だね!
                        <br />
                        いっしょに 虫とりに いかない?
                    </p>
                    <div className={showcaseStyles.choices}>
                        <JellyButton shape="gummy">
                            <SparklesIcon />
                            いく いく!
                        </JellyButton>
                        <JellyButton intent="secondary" shape="gummy">
                            また こんど
                        </JellyButton>
                    </div>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン / shape</span>
                <div className={showcaseStyles.row}>
                    <JellyButton>
                        <SparklesIcon />
                        はじめる
                    </JellyButton>
                    <JellyButton intent="secondary">
                        つぎへ
                        <ArrowRightIcon />
                    </JellyButton>
                    <JellyButton intent="plain">
                        <PlusIcon />
                        ついか
                    </JellyButton>
                    {SHAPES.map((shape) => (
                        <JellyButton key={shape} shape={shape} intent="secondary">
                            <CandyIcon />
                            shape: {shape}
                        </JellyButton>
                    ))}
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <JellyButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </JellyButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・リップ・文字・フォーカスリングがパレットに追従することを確認する */}
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
