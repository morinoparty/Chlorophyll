import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Clay(クレイモーフィズム)方向のボタン
 *
 * 大きな角丸の面に「外側の落ち影」「左上の内側ハイライト」「右下の内側シェード」の 3 層を重ね、
 * 粘土をこねたようなぷっくりした立体に見せる。枠線は使わず、輪郭は影の重なりと上辺の光の縁(リップ)だけで出す。
 * 左上には小さな「つや玉」を 1 つ置き、こねたての粘土らしい愛嬌を足す。
 * hover でふわっと膨らんで浮き(わずかに拡大 + 持ち上げ)、押下で横に広がりながら潰れる(スクワッシュ)。
 * 押下中は内側の光と影の向きを反転させ、面が押し込まれてへこんだように見せる。
 *
 * primary はパレットの solid を色粘土として使い、secondary はパステルの面(step5)、
 * plain は静止時は文字だけで、hover で初めてクリーム色(step3)の粘土が膨らむ。
 *
 * APCA(apca-w3 calcAPCA)計測値。storybook の生成トークン(styled-system/styles.css)の oklch を sRGB に解決して算出。
 * 文字は面の中央にあり、内側の光と影は負の spread でふちの 12px 前後にしか届かないが、sm(36px)では文字の端にかかりうるため
 * 「ハイライト / シェードが最も強く乗った色」もワーストケースとして併記する。
 *   primary   : contrast(白) on solid(step9)                     mori 79.1 / umi 78.5 / red 70.5
 *               ワーストケース(step9 に白 15% が乗った左上。推定) mori 70.0 / umi 69.6 / red 62.2
 *               押下(solid.emphasized = step10)                 mori 84.5 / umi 84.0 / red 74.5
 *   secondary : colorPalette.12 on step5(パステル)               mori 79.9 / umi 78.0 / red 73.9
 *               ワーストケース(step5 に step7 30% が乗った右下。推定) mori 74.1 / umi 72.7 / red 68.6
 *               hover(step4 に膨らんで明るくなる)               mori 85.6 / umi 83.7 / red 79.8
 *               押下(step5 + step6 50%)                         mori 75.9 / umi 74.2 / red 70.4
 *   plain     : colorPalette.fg on colorPalette.bg(静止)         mori 73.8 / umi 74.2 / red 73.1(白の上 82.1 / 82.3 / 81.8)
 *               hover / 押下: colorPalette.12 on step3           mori 90.4 / umi 88.6 / red 86.4
 *               ワーストケース(step3 + step5 40%)               mori 85.9 / umi 84.5 / red 81.5
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9
 *               plain の fg.disabled on 白 60.4 / on colorPalette.bg 51.7〜52.4(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0、
 *               vs colorPalette.bg 65.5 / 65.0 / 56.3(目安 Lc 45 以上。offset の外側に描くので地色に対して測る)
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)
// data-preview は Showcase で hover / active の段を静止状態のまま並べて見比べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// 粘土の影は 5 層で組む。色は intent ごとに CSS 変数で差し替え、層の形(オフセット・ぼかし)だけをここで共有する
//   --clay-drop : 外側の落ち影(右下)。黒ではなくパレットの色味を帯びさせ、パステルでも濁らせない
//   --clay-light: 内側のハイライト(左上)。光が左上から当たっている前提
//   --clay-shade: 内側のシェード(右下)。面の丸みを出す
// 外側の白いにじみ(ニューモーフィズム的な表現)は白いパネルの上で消えて見え方が揺れるため使わない。
// 代わりに上辺 1.5px の鋭い光の縁(リップ)を入れ、どの地色の上でも面の厚みが読めるようにする。
// 内側の光と影は負の spread でふちから 12px 程度までに留め、中央の文字の下へは広げない
const CLAY_REST = [
    "8px 10px 20px -6px var(--clay-drop)",
    "2px 3px 6px -2px var(--clay-drop)",
    "inset 0 1.5px 0 0 var(--clay-lip)",
    "inset 8px 8px 14px -6px var(--clay-light)",
    "inset -8px -10px 16px -6px var(--clay-shade)",
].join(", ");

// hover: 膨らんで浮いたぶん落ち影を遠く・大きくし、内側の丸みも少し深める
const CLAY_HOVER = [
    "12px 16px 28px -8px var(--clay-drop)",
    "3px 4px 8px -2px var(--clay-drop)",
    "inset 0 1.5px 0 0 var(--clay-lip)",
    "inset 9px 9px 16px -6px var(--clay-light)",
    "inset -9px -11px 18px -6px var(--clay-shade)",
].join(", ");

// 押下: 地面に押し付けられたので落ち影はほぼ消え、内側の光と影の向きを反転させて「へこみ」にする
const CLAY_PRESSED = [
    "2px 3px 6px -3px var(--clay-drop)",
    "inset 5px 6px 12px -5px var(--clay-shade)",
    "inset -4px -4px 10px -5px var(--clay-light)",
].join(", ");

// 乾いて固まった粘土: 落ち影を消し、内側の丸みだけをごく薄く残して無効を読ませる
const CLAY_DRIED = [
    "inset 2px 2px 4px -1px rgb(255 255 255 / 0.6)",
    "inset -2px -3px 5px -2px color-mix(in oklab, var(--mpc-colors-gray-6) 70%, transparent)",
].join(", ");

// 弾むようなイージング。膨らむ・潰れる動きにわずかなオーバーシュートを付けて「ぷにっ」とした手触りにする
const SQUISHY_EASING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// 無効状態の共通部分。グレーの乾いた粘土にして、パレットの色味と動きを抜く
const dried = {
    bg: "bg.disabled",
    color: "fg.disabled",
    boxShadow: CLAY_DRIED,
    transform: "none",
} as const;

export const clayButtonStyle = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        border: "none",
        // 丸みのある粘土らしさを出すため、既存 Button(semibold)より一段太くする
        fontWeight: "bold",
        letterSpacing: "wide",
        position: "relative",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        boxShadow: CLAY_REST,
        // 膨らむ・潰れる起点を下辺に置き、潰れたときに接地面が動かないようにする
        transformOrigin: "center bottom",
        transitionProperty: "transform, box-shadow, background-color, color",
        transitionDuration: "normal",
        transitionTimingFunction: SQUISHY_EASING,
        // 動きを減らす設定では変形のトランジションを外し、影と色の変化だけで状態を伝える
        _motionReduce: { transitionProperty: "box-shadow, background-color, color" },
        // lucide-react のアイコンを文字サイズに合わせる(既存 Button のレシピと同じ比率)
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        [HOVER]: {
            boxShadow: CLAY_HOVER,
            // ふわっと膨らんで持ち上がる
            _motionSafe: { transform: "translateY(-2px) scale(1.03)" },
        },
        [ACTIVE]: {
            boxShadow: CLAY_PRESSED,
            // 押した瞬間は遅延を感じさせないよう速く潰し、離したときだけ弾ませて戻す
            transitionDuration: "faster",
            transitionTimingFunction: "easeOut",
            // 横に広がりながら縦に潰れるスクワッシュ。粘土の柔らかさをここで返す
            _motionSafe: { transform: "scale(1.04, 0.92)" },
        },
        // 左上の小さなつや玉。こねた粘土の表面に光が一点だけ乗ったように見せ、愛嬌を足す。
        // 上辺から 4px・高さ 5px で文字(上端はおよそ 12px 以降)には重ならない
        _before: {
            content: '""',
            position: "absolute",
            top: "[4px]",
            left: "[10px]",
            width: "[12px]",
            height: "[5px]",
            borderRadius: "full",
            bg: "[var(--clay-gloss, transparent)]",
            transform: "rotate(-14deg)",
            pointerEvents: "none",
            transitionProperty: "background-color",
            transitionDuration: "normal",
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
            "--clay-gloss": "transparent",
        },
    },
    variants: {
        intent: {
            // 最も強い操作。solid の色粘土。白文字の Lc を守るため、ハイライトは白 38% に抑える
            // (ぼかしの重なりで文字の下に乗りうる量は白 15% 相当。ワーストケース Lc はファイル冒頭)
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                "--clay-drop": "color-mix(in oklab, var(--mpc-colors-color-palette-10) 45%, transparent)",
                "--clay-light": "rgb(255 255 255 / 0.38)",
                "--clay-lip": "rgb(255 255 255 / 0.35)",
                "--clay-gloss": "rgb(255 255 255 / 0.55)",
                "--clay-shade": "color-mix(in oklab, var(--mpc-colors-color-palette-12) 45%, transparent)",
                [ACTIVE]: { bg: "colorPalette.solid.emphasized" },
                _disabled: dried,
            },
            // 補助的な操作。パステル(step5)の粘土に step12 の文字を載せる。
            // hover で膨らむと同時に step4 へ明るくなり、空気を含んだように見せる
            secondary: {
                bg: "colorPalette.5",
                color: "colorPalette.12",
                "--clay-drop": "color-mix(in oklab, var(--mpc-colors-color-palette-8) 55%, transparent)",
                "--clay-light": "rgb(255 255 255 / 0.9)",
                "--clay-lip": "rgb(255 255 255 / 0.9)",
                "--clay-gloss": "rgb(255 255 255 / 0.9)",
                "--clay-shade": "color-mix(in oklab, var(--mpc-colors-color-palette-7) 75%, transparent)",
                [HOVER]: { bg: "colorPalette.surface.hover" },
                // 押下面は step5 と step6 の中間。step6 そのものは red で Lc 70 を割るため半分だけ混ぜる
                [ACTIVE]: {
                    bg: "color-mix(in oklab, var(--mpc-colors-color-palette-5), var(--mpc-colors-color-palette-6) 50%)",
                },
                _disabled: dried,
            },
            // 最も控えめな操作。静止時は影も面も持たない文字だけで、hover でクリーム色(step3)の粘土が膨らむ
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                boxShadow: "none",
                "--clay-drop": "color-mix(in oklab, var(--mpc-colors-color-palette-7) 50%, transparent)",
                "--clay-light": "rgb(255 255 255 / 0.9)",
                "--clay-lip": "rgb(255 255 255 / 0.9)",
                "--clay-shade": "color-mix(in oklab, var(--mpc-colors-color-palette-6) 70%, transparent)",
                // つや玉は粘土が膨らんだ hover / 押下のときだけ出す
                [HOVER]: {
                    bg: "colorPalette.surface",
                    color: "colorPalette.12",
                    "--clay-gloss": "rgb(255 255 255 / 0.9)",
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface",
                    color: "colorPalette.12",
                    "--clay-gloss": "rgb(255 255 255 / 0.9)",
                },
                _disabled: {
                    bg: "transparent",
                    color: "fg.disabled",
                    boxShadow: "none",
                    transform: "none",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)を使い、他の方向性・既存 Button と揃えて比較できるようにする。
        // 影はレイアウト上の大きさを持たないので、落ち影は高さの外側にはみ出す
        size: {
            sm: { height: "control.sm", px: "{spacing.4}", fontSize: "xs" },
            md: { height: "control.md", px: "{spacing.5}", fontSize: "sm" },
            lg: { height: "control.lg", px: "{spacing.6}", fontSize: "md" },
        },
        // 輪郭の形。puffy は角の立たないクッション型、pill は完全な丸薬型
        shape: {
            puffy: { borderRadius: "2xl" },
            pill: { borderRadius: "full" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "puffy",
    },
});

export type ClayButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof clayButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージからは @ark-ui/react を解決できないため、ark.button ではなくネイティブの button を使う
export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
    ({ intent, size, shape, className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cx(clayButtonStyle({ intent, size, shape }), className)}
            {...props}
        />
    ),
);
ClayButton.displayName = "ClayButton";

// 一覧表示用のレイアウト。落ち影が右下に大きくはみ出すため、行と列の間隔を広めに取る
const showcaseStyles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "6" }),
    // ページの地色(colorPalette.bg)の上に置くセクション
    section: css({
        display: "flex",
        flexDirection: "column",
        gap: "5",
        p: "6",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
    // 白いパネル(bg.panel)の上に置くセクション
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "5",
        p: "6",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const SHAPES = ["puffy", "pill"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <ClayButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </ClayButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active の段を静止状態で並べる。膨らみ・潰れの影の違いを見比べるため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <ClayButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </ClayButton>
                ))}
                <ClayButton intent={intent} disabled>
                    {intent} disabled
                </ClayButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <ClayButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </ClayButton>
        ))}
    </div>
);

const meta: Meta<typeof ClayButton> = {
    title: "LAB/Button Designs/Clay",
    component: ClayButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Clay** — クレイモーフィズム。大きな角丸の面に「外側の落ち影」「左上の内側ハイライト」「右下の内側シェード」を重ね、粘土をこねたようなぷっくりした立体に見せる方向性です。",
                    "primary は solid の色粘土、secondary はパステル(step5)の粘土、plain は静止時は文字だけで hover でクリーム色の粘土が膨らみます。hover でふわっと膨らんで浮き、押下で横に広がりながら潰れ、内側の光と影が反転してへこみます(動きを減らす設定では変形せず、影と色だけが変わります)。",
                    "",
                    "**強み**: 枠線を使わずに面の輪郭と「押せる」手がかりを強く出せ、柔らかく親しみやすい印象になります。影の色をパレットから取っているので、パステルでも濁らず mori / umi / red にそのまま追従します。押下のスクワッシュは手触りのフィードバックとして分かりやすいです。",
                    "",
                    "**トレードオフ**: 影が 5 層あり、落ち影がボタンの外側(右下に 15px 前後)へ大きくはみ出すため、密に並べたり、狭いツールバーやテーブル内に置くのには向きません。内側のハイライトが文字の端にかかると primary の Lc が下がり、red ではワーストケースで Lc 62 前後です(静止面の中央は 70.5。既存 Button と同じく red の solid 自体が明るいことによる課題)。装飾が強いので、1 画面に多く並べるとうるさくなります。",
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
        children: "ボタンだよー",
        intent: "primary",
        size: "lg",
        shape: "puffy",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof ClayButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* 白いパネルの上でも上辺のリップと内側の陰影で立体感が保てるかを並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>
                    状態の段(rest → hover → active → disabled)/ ページの地色の上
                </span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン / shape: pill</span>
                <div className={showcaseStyles.row}>
                    <ClayButton>
                        <SparklesIcon />
                        はじめる
                    </ClayButton>
                    <ClayButton intent="secondary">
                        次へ
                        <ArrowRightIcon />
                    </ClayButton>
                    <ClayButton intent="plain">
                        <PlusIcon />
                        追加
                    </ClayButton>
                    <ClayButton shape="pill">
                        <HeartIcon />
                        いいね
                    </ClayButton>
                    <ClayButton intent="secondary" shape="pill">
                        もっと見る
                        <ArrowRightIcon />
                    </ClayButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <ClayButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </ClayButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・影の色・文字・フォーカスリングがパレットに追従することを確認する */}
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
