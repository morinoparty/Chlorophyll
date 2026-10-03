import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, PencilIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * Sketch ボタン(デザイン検証用のプロトタイプ)
 *
 * ノートの落書きのような「手描き」の方向性。
 * - 輪郭: 楕円半径を左右・上下で大きく食い違わせた border-radius で、線がよれた手描きの枠に見せる
 * - 線: マーカーで引いたような 2px のインクの線。::before にもう 1 本、半透明で少し傾いた線を重ねて
 *   「なぞり直した二度書き」の線にする(装飾なのでコントロールの高さの外にはみ出してよい)
 * - hover: 蛍光ペン(highlighter)の塗りが左から右へ引かれる。ペン先の斜めの端を gradient の角度で出す。
 *   primary は面全体、secondary / plain は文字を横切る帯(高さ 62%)
 * - disabled: 線を破線にして「下書きのまま」を表す
 *
 * APCA 計測値(apca-w3 の calcAPCA。styled-system/styles.css のトークンを sRGB に解決して算出)
 *   primary   : colorPalette.contrast(白) on solid(step9)          mori 79.1 / umi 78.5 / red 70.5
 *               on solid.active(hover の蛍光ペン)                   mori 88.7 / umi 87.7 / red 80.6
 *               塗りが左から伸びる途中は step9 と solid.active が文字の下で混在するので、最悪値は静止時の step9
 *               インクの線 colorPalette.12 vs colorPalette.bg      mori 89.6 / umi 88.2 / red 87.1(vs 面 step9 は 22〜29)
 *   secondary : colorPalette.fg on bg.panel(白)                    mori 82.1 / umi 82.3 / red 81.8
 *               hover: colorPalette.12 on step5(蛍光ペンの帯)      mori 79.9 / umi 78.0 / red 73.9
 *               (帯の外は白のまま。12 on 白は 95.8〜97.9 なので、文字が帯をまたいでも最悪値は step5)
 *               active: colorPalette.12 on step6                    mori 72.0 / umi 70.3 / red 67.1(押下中だけの一瞬なので 60 以上で許容)
 *               インクの線 colorPalette.fg vs 白 81.8〜82.3 / vs colorPalette.bg mori 73.8 / umi 74.2 / red 73.1
 *   plain     : colorPalette.fg on colorPalette.bg                  mori 73.8 / umi 74.2 / red 73.1(on 白 81.8〜82.3)
 *               hover / active は secondary と同じ帯と文字(step5: 73.9〜79.9 / step6: 67.1〜72.0)
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9 / on 白 60.4 / on colorPalette.bg 51.7〜52.4
 *               破線の線(gray.9)も同じ値。目安 Lc 30 以上
 *   focus ring: colorPalette.focus.ring vs 白 mori 73.7 / umi 73.1 / red 65.0
 *               vs colorPalette.bg mori 65.5 / umi 65.0 / red 56.3(目安 Lc 45 以上)
 */

// disabled 以外にだけ hover / active を効かせるためのセレクタ。
// data-preview は Showcase で hover / active の見た目を静止状態のまま並べて見比べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// 手描きの輪郭。角ごとに水平・垂直の楕円半径を食い違わせ、「平たく流れる角」と「縦に切り立つ角」を混ぜてよれた線に見せる。
// 値はコントロールの高さ(sm 36px)に収まる大きさにしている。合計が辺の長さを超えるとブラウザが全半径を同率で縮め、
// 横長のボタンではほぼ直角の四角に潰れてしまうため(255px / 15px のような定番の値はこの理由で効かない)
const WOBBLE = {
    a: "20px 6px 18px 4px / 4px 16px 6px 18px",
    b: "6px 22px 5px 18px / 18px 5px 16px 4px",
    c: "16px 5px 22px 7px / 6px 20px 4px 14px",
} as const;

// 二度書きの線(::before)は、本体と違う形でよれさせる。同じ形だと線が重なって 1 本に見えるため
const WOBBLE_ECHO = {
    a: WOBBLE.b,
    b: WOBBLE.c,
    c: WOBBLE.a,
} as const;

// 蛍光ペンの塗り。右端を 105deg の斜めで切り、ペン先を斜めに当てて引いたように見せる。
// background-size の幅を 0 → 100%+ペン先ぶん に伸ばすことで、左から右へ塗りが引かれる。
// 高さは --sketch-marker-h で intent ごとに変え、secondary / plain は文字の上を横切る「帯」にする
const HIGHLIGHTER =
    "linear-gradient(105deg, var(--sketch-marker) 0, var(--sketch-marker) calc(100% - 0.6em), transparent calc(100% - 0.5em))";
const MARKER_REST = "0% var(--sketch-marker-h)";
const MARKER_FULL = "calc(100% + 0.6em) var(--sketch-marker-h)";

// フォーカスリング。shared/focus-ring.ts と同じくロングハンドで明示する(#78)。
// outline は border-radius に沿うので、よれた輪郭のままリングも手描きの形になる
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

export const sketchButtonStyle = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        position: "relative",
        // ::before の二度書き線を本体の背面に置くため、ボタン単位で重なりの文脈を閉じる
        isolation: "isolate",
        // マーカーで引いた 2px の線。色は intent ごとに --sketch-ink で差し替える
        borderWidth: "2",
        borderStyle: "solid",
        borderColor: "var(--sketch-ink)",
        fontWeight: "semibold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 蛍光ペンの塗りは background-image で重ね、幅だけを伸ばしてアニメーションさせる
        backgroundImage: HIGHLIGHTER,
        backgroundRepeat: "no-repeat",
        // 帯は中心より少し下に引く。蛍光ペンは文字の下半分に寄りがちなので、その手癖を真似る
        backgroundPosition: "left 0 top 58%",
        backgroundSize: MARKER_REST,
        transitionProperty: "background-size, background-color, color, transform",
        transitionDuration: "slow",
        transitionTimingFunction: "easeOut",
        // 動きを減らす設定では塗りを伸ばさず、色の切り替えだけで hover を表す
        _motionReduce: { transitionProperty: "background-color, color" },
        // 二度書きの線。本体より少し外にずらし、わずかに傾けてなぞり直したズレを出す
        _before: {
            content: '""',
            position: "absolute",
            inset: "[-4px -3px -3px -4px]",
            borderWidth: "[1.5px]",
            borderStyle: "solid",
            borderColor: "var(--sketch-ink)",
            borderRadius: "var(--sketch-echo-radius)",
            opacity: "0.45",
            transform: "rotate(-1.2deg)",
            transitionProperty: "transform, opacity",
            transitionDuration: "slow",
            transitionTimingFunction: "easeOut",
            pointerEvents: "none",
            zIndex: "-1",
            _motionReduce: { transform: "none", transitionProperty: "opacity" },
        },
        // lucide-react のアイコンを文字サイズに合わせる(既存 Button のレシピと同じ比率)
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        [HOVER]: {
            backgroundSize: MARKER_FULL,
            // hover では二度書きの線が逆向きに傾き、線が揺れたように見せる
            _before: {
                opacity: "0.7",
                _motionSafe: { transform: "rotate(0.8deg)" },
            },
        },
        [ACTIVE]: {
            backgroundSize: MARKER_FULL,
            // 押下は紙を押し込んだように 1px だけ沈める。押した瞬間は速く反応させる
            transitionDuration: "fastest",
            _motionSafe: { transform: "translateY(1px)" },
        },
        // フォーカス中は二度書きの線を消し、リングが「なぞり直しの線」の役を引き継ぐ。
        // 両方を出すと 3〜4px の範囲に線が 3 本重なり、リングがどれか見分けられなくなるため
        _focusVisible: { ...focusRing, _before: { opacity: "0" } },
        // 無効状態は「下書きのまま」の破線にし、蛍光ペンと二度書きの線を外す
        _disabled: {
            cursor: "not-allowed",
            borderStyle: "dashed",
            borderColor: "fg.disabled",
            backgroundImage: "none",
            _before: { display: "none" },
        },
    },
    variants: {
        intent: {
            // 最も強い操作。solid で塗りつぶし、輪郭は step12 の濃いインクで描く。
            // 蛍光ペンは solid.active を重ね、塗りが引かれるほど白文字のコントラストが上がる
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                "--sketch-ink": "var(--mpc-colors-color-palette-12)",
                "--sketch-marker": "var(--mpc-colors-color-palette-solid-active)",
                // primary は面全体を塗り替える。帯にすると solid と solid.active の差が小さく hover が読み取りにくい
                "--sketch-marker-h": "100%",
                _disabled: {
                    bg: "bg.disabled",
                    color: "fg.disabled",
                },
            },
            // 補助的な操作。白い紙(bg.panel)にインク(colorPalette.fg)で枠と文字を描く。
            // 蛍光ペンは step4 の淡い面。面が濃くなるので文字は step12 に沈めて Lc を保つ
            secondary: {
                bg: "bg.panel",
                color: "colorPalette.fg",
                "--sketch-ink": "var(--mpc-colors-color-palette-fg)",
                // 蛍光ペンは step5 の帯。押下では step6 に濃くなり、ペンを強く押しつけたように見せる
                "--sketch-marker": "var(--mpc-colors-color-palette-5)",
                "--sketch-marker-h": "62%",
                [HOVER]: { color: "colorPalette.12" },
                [ACTIVE]: {
                    color: "colorPalette.12",
                    "--sketch-marker": "var(--mpc-colors-color-palette-6)",
                },
                _disabled: {
                    bg: "bg.panel",
                    color: "fg.disabled",
                },
            },
            // 最も控えめな操作。静止時は文字だけで、枠も二度書きも見せない。
            // hover で蛍光ペンを引くと、よれた輪郭の形に塗りが現れる
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                "--sketch-ink": "transparent",
                // 蛍光ペンは step5 の帯。押下では step6 に濃くなり、ペンを強く押しつけたように見せる
                "--sketch-marker": "var(--mpc-colors-color-palette-5)",
                "--sketch-marker-h": "62%",
                [HOVER]: { color: "colorPalette.12" },
                [ACTIVE]: {
                    color: "colorPalette.12",
                    "--sketch-marker": "var(--mpc-colors-color-palette-6)",
                },
                _disabled: {
                    bg: "transparent",
                    color: "fg.disabled",
                    // plain は枠を持たないので、無効でも破線は描かない
                    borderColor: "transparent",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)を使い、他の方向性・既存 Button と揃えて比較できるようにする。
        // 二度書きの線はこの高さの外側(上下 3〜4px)にはみ出す
        size: {
            sm: { height: "control.sm", px: "{spacing.3.5}", fontSize: "xs" },
            md: { height: "control.md", px: "{spacing.4}", fontSize: "sm" },
            lg: { height: "control.lg", px: "{spacing.5}", fontSize: "md" },
        },
        // よれ方の型。同じ形が並ぶと機械的に見えるので、隣り合うボタンで型を変えられるようにする
        shape: {
            a: { borderRadius: WOBBLE.a, "--sketch-echo-radius": WOBBLE_ECHO.a },
            b: { borderRadius: WOBBLE.b, "--sketch-echo-radius": WOBBLE_ECHO.b },
            c: { borderRadius: WOBBLE.c, "--sketch-echo-radius": WOBBLE_ECHO.c },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "a",
    },
});

export type SketchButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof sketchButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る(shape は Sketch 独自の追加 variant)。
// storybook パッケージからは @ark-ui/react を解決できないため、他の LAB と同じくネイティブの button を使う
export const SketchButton = forwardRef<HTMLButtonElement, SketchButtonProps>(
    ({ intent, size, shape, className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cx(sketchButtonStyle({ intent, size, shape }), className)}
            {...props}
        />
    ),
);
SketchButton.displayName = "SketchButton";

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
    // 白いパネル(bg.panel)の上に置くセクション。secondary の白い紙が地色なしでも読めるかを確かめる
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    // 二度書きの線が外にはみ出すぶん、通常より行間・列間を広めに取る
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const SHAPES = ["a", "b", "c"] as const;

// intent × size の行をまとめて描く。size ごとに shape を変え、よれ方の違いも同時に見せる
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size, index) => (
                    <SketchButton key={size} intent={intent} size={size} shape={SHAPES[index]}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </SketchButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active を静止状態で並べる。蛍光ペンの塗りが引き終わった状態を比べるため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <SketchButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </SketchButton>
                ))}
                <SketchButton intent={intent} disabled>
                    {intent} disabled
                </SketchButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent, index) => (
            <SketchButton key={intent} intent={intent} shape={SHAPES[index]}>
                <SparklesIcon />
                {intent}
            </SketchButton>
        ))}
        <SketchButton intent="secondary" data-preview="hover">
            <PencilIcon />
            hover
        </SketchButton>
    </div>
);

const meta: Meta<typeof SketchButton> = {
    title: "LAB/Button Designs/Sketch",
    component: SketchButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Sketch** — ノートの余白に描いた落書きのような、手描きの方向性です。",
                    "角ごとに楕円半径を食い違わせた border-radius で線がよれた輪郭を作り、マーカーで引いたような 2px のインクの線と、少し傾いた半透明の「二度書き」の線を重ねます。hover では蛍光ペンが左から右へ引かれ(ペン先の斜めの端つき。secondary / plain は文字を横切る帯、primary は面全体)、押すと 1px 沈みます。disabled は破線の「下書き」になります。動きを減らす設定では塗りの伸びと傾きを止め、色の切り替えだけにします。",
                    "",
                    "**強み**: 一目で温かく親しみやすい印象になり、どうぶつの森的な手作り感・遊び心のあるトーンと相性が良いです。塗りではなく線で形を出すので白い面の上でも輪郭がはっきりし、蛍光ペンの演出は「なぞって選ぶ」行為として hover の意味づけが直感的です。shape variant で隣同士のよれ方を変えられ、並べても機械的に見えません。",
                    "",
                    "**トレードオフ**: 線と二度書きが主張するため、業務画面のような密度の高い UI では騒がしくなります。二度書きの線がコントロールの高さの外へ 3〜4px はみ出すので、詰めて並べると隣と干渉します。よれた輪郭は既存の `control` 角丸や Input などの直線的なコンポーネントと揃わず、フォーカスリングもよれた形になります(フォーカス中は二度書きの線を消してリングと重ねないようにしています)。plain の hover の帯は地色との差が小さく(Lc 7〜11)、変化は控えめです。red の primary は solid 自体の明るさにより白文字が Lc 70.5 と本文の目安 75 に届きません(既存 Button と共通の課題。hover の蛍光ペンが引かれると 80.6 に上がります)。",
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
        shape: "a",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof SketchButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* secondary の白い紙は地色がないと面として見えにくいので、白いパネルの上でも並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>
                    状態(rest → hover → active → disabled)/ 蛍光ペンを引き終えた状態
                </span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン(leading / trailing / icon only)</span>
                <div className={showcaseStyles.row}>
                    <SketchButton>
                        <SparklesIcon />
                        はじめる
                    </SketchButton>
                    <SketchButton intent="secondary" shape="b">
                        次へ
                        <ArrowRightIcon />
                    </SketchButton>
                    <SketchButton intent="plain" shape="c">
                        <PlusIcon />
                        追加
                    </SketchButton>
                    <SketchButton intent="secondary" shape="c" aria-label="編集">
                        <PencilIcon />
                    </SketchButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled(破線の下書き)</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent, index) => (
                        <SketchButton key={intent} intent={intent} shape={SHAPES[index]} disabled>
                            <PlusIcon />
                            {intent}
                        </SketchButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・インク・蛍光ペン・フォーカスリングがパレットに追従することを確認する */}
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
