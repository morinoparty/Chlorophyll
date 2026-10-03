import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, PlusIcon, ScissorsIcon, ShirtIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * Stitched(フェルトのワッペン)ボタン(デザイン検証用のプロトタイプ)
 *
 * マットなフェルト地の面に、縁から 4px 内側を走る破線の「縫い目」(::after の dashed border)を重ね、
 * 縫い付けたワッペンのように見せる方向性。面には細かいドット(radial-gradient)で布目をうっすら乗せる。
 * 面の下には厚みのある柔らかい影(0 ぼかしの縁 + ぼかした接地影)を敷き、押すと影の厚みぶん沈んで
 * 横に少しつぶれる(squash)。離すとバネのような cubic-bezier で少し行き過ぎて戻る(stretch)。
 * 動きを減らす設定では移動・変形をすべて止め、色と影の変化だけで状態を伝える。
 *
 * APCA(apca-w3 calcAPCA)計測値。storybook/styled-system/tokens の light ランプから解決し、
 * color-mix は CSS と同じ補間空間(fg: oklch / それ以外: oklab)、半透明のドットは sRGB で合成して算出。
 * 布目のドットがある面は「文字の下にドットが重なった色」を最悪値として記載する。
 *   primary   : colorPalette.contrast(白) on solid(step9)
 *               無地 mori 79.1 / umi 78.5 / red 70.5、白ドット 7% の上 mori 75.3 / umi 74.8 / red 67.8
 *               hover(solid.emphasized)無地 mori 84.5 / umi 84.0 / red 74.5、+ ドット 80.6 / 80.1 / 71.6
 *               red は solid 自体が明るく目安 75 に届かない(既存 Button と共通の課題。下限 60 は満たす)
 *               縫い目(白 85%)vs 面 mori 64.0 / umi 63.7 / red 56.3
 *               縁(step10 + step12 45%)vs colorPalette.bg mori 80.4 / umi 79.5 / red 73.7、vs 白 88.6 / 87.5 / 82.4
 *   secondary : colorPalette.fg on クリーム #FFF7E4
 *               無地 mori 77.5 / umi 77.7 / red 77.3、茶ドット 6% の上 mori 72.3 / umi 72.5 / red 72.0
 *               hover #FFFBF1 + ドット mori 74.0 / umi 74.2 / red 73.7
 *               active #FFF1D6 + ドット mori 69.3 / umi 69.5 / red 69.0
 *               縫い目(colorPalette.solid)vs クリーム mori 69.2 / umi 68.5 / red 60.5
 *               縁(茶 #B8925C)vs 白 54.9、vs colorPalette.bg mori 46.7 / umi 46.8 / red 46.2
 *               (クリームの面とページの地色は Lc ほぼ 0 なので、輪郭はこの縁が担う。非テキストの目安 45 以上)
 *   plain     : colorPalette.fg on 白 mori 82.1 / umi 82.3 / red 81.8、on colorPalette.bg 73.8 / 74.2 / 73.1
 *               hover(surface.subtle)78.8 / 78.7 / 78.0、active(surface)74.6 / 74.6 / 72.4
 *               縫い線ガイド(border.emphasized = step8)vs 白 46.7 / 46.1 / 50.1、vs colorPalette.bg 38.4 / 38.0 / 41.4
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9 / on 白 60.4 / on colorPalette.bg 51.7〜52.4(目安 30 以上)
 *               disabled では布目のドットを消す(ドットを残すと 41.8 まで下がるため)
 *   focus ring: colorPalette.focus.ring(step9)vs 白 mori 73.7 / umi 73.1 / red 65.0、
 *               vs colorPalette.bg 65.5 / 65.0 / 56.3(目安 45 以上)
 */

// disabled 以外にだけ hover / active を効かせるためのセレクタ。
// data-preview は Showcase で hover / active の見た目を静止状態のまま並べて見比べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// バネのように少し行き過ぎて戻るイージング。押下からの戻りで「ぽよん」と弾ませるために使う
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// クリーム色のフェルト地。トークンに暖色の面が無いため任意値で持つ(ブランド色は縫い目と文字で追従させる)
const CREAM = "#FFF7E4";
// hover は「持ち上がって光が当たる」ので明るく、active は押しつけて少し影になる
const CREAM_HOVER = "#FFFBF1";
const CREAM_ACTIVE = "#FFF1D6";
// クリーム地の下に敷く縁の色。木の家具のような温かい茶。白・地色の両方で Lc 45 以上を確保して輪郭を担わせる
const CREAM_EDGE = "#B8925C";

// 縁(0 ぼかし)と接地影(ぼかし)の 2 本で、ワッペンが少し浮いた厚みを描く。
// 厚み(--felt-depth)と縁の色(--felt-edge)を変数に逃がし、size と intent が片方ずつ差し替えられるようにする
// 内側の上端ハイライトと下端の陰で、フェルトがぽってり膨らんだ「ふかふか感」を足す
const PUFF = "inset 0 2px 0 0 rgb(255 255 255 / 0.22), inset 0 -3px 0 0 rgb(0 0 0 / 0.07)";
const feltShadow = (depth: string, blur: string) =>
    `${PUFF}, 0 ${depth} 0 0 var(--felt-edge), 0 calc(${depth} + 4px) ${blur} -3px color-mix(in oklab, var(--felt-edge) 45%, transparent)`;
const SHADOW_REST = feltShadow("var(--felt-depth)", "8px");
// hover では持ち上がった 2px ぶん縁を伸ばし、縁の下端(接地点)を動かさない
const SHADOW_HOVER = feltShadow("calc(var(--felt-depth) + 2px)", "12px");
// 押下中は縁をほぼ潰し、接地影も消して布が平たく押しつけられたように見せる
// 内側の陰を上側に回し、指で押し込んだくぼみに見せる
const SHADOW_PRESSED = "inset 0 3px 4px 0 rgb(0 0 0 / 0.12), 0 1px 0 0 var(--felt-edge)";

// フォーカスリング。shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// disabled 共通: 押しつけられたまま平らになったワッペン。影と布目を消し、面を厚みぶん沈めた位置に置く。
// 沈めた位置は押下時の接地点と同じなので、並んだ有効なボタンと下端が揃う(静的な位置なので motion 設定に関係なく適用)
const flattened = {
    boxShadow: "none",
    bgImage: "none",
    transform: "translateY(var(--felt-depth))",
    "--stitch-color": "var(--mpc-colors-gray-8)",
} as const;

export const stitchedButtonStyle = cva({
    base: {
        position: "relative",
        // ::after の縫い目を面の上・文字の下に収めるため、ボタン自身でスタッキングコンテキストを作る
        isolation: "isolate",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        borderRadius: "var(--patch-radius)",
        border: "none",
        // 丸ゴシックで、手芸メニューのような柔らかい文字にする(preview-head で読み込み済み)
        fontFamily: "['M PLUS Rounded 1c', sans-serif]",
        fontWeight: "bold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 布目: 2 枚のドット格子を半分ずらして重ね、フェルトの細かな毛羽のように見せる。
        // ドットの色(--felt-dot)は intent ごとに差し替える。bg ショートハンドは使わず bgColor と分けて上書きを防ぐ
        bgImage:
            "radial-gradient(var(--felt-dot) 0.9px, transparent 1.3px), radial-gradient(var(--felt-dot) 0.9px, transparent 1.3px)",
        bgSize: "6px 6px",
        bgPosition: "0 0, 3px 3px",
        // 縁は box-shadow なのでレイアウト上の高さを持たない。下の要素と重ならないよう厚みぶんの余白を確保する
        marginBlockEnd: "var(--felt-depth)",
        boxShadow: SHADOW_REST,
        // 変形はバネのイージングで弾ませ、色と影は通常のイージングでなめらかに切り替える
        transitionProperty: "transform, box-shadow, background-color, color",
        transitionDuration: "260ms, 200ms, 200ms, 200ms",
        transitionTimingFunction: `${SPRING}, ease-out, ease-out, ease-out`,
        _motionReduce: {
            transitionProperty: "box-shadow, background-color, color",
            transitionDuration: "fast",
        },
        // 縫い目: 縁から 4px 内側に破線を引く。角丸は外側の角丸から 4px 引いて同心円にする
        _after: {
            content: '""',
            position: "absolute",
            inset: "4px",
            zIndex: "-1",
            borderRadius: "calc(var(--patch-radius) - 4px)",
            // 遠目にも「縫ってある」と分かるよう、太めの糸にする
            borderWidth: "2px",
            borderStyle: "dashed",
            borderColor: "var(--stitch-color)",
            pointerEvents: "none",
            transitionProperty: "border-color",
            transitionDuration: "fast",
        },
        // lucide-react のアイコンを文字サイズに合わせる。丸ゴシックの太さに合わせて線を少し太くする
        "& :where(svg)": {
            strokeWidth: "[2.6px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        // hover: ふわっと 2px 持ち上がる。動きを減らす設定では影の伸びだけ残す
        [HOVER]: {
            boxShadow: SHADOW_HOVER,
            _motionSafe: { transform: "translateY(-2px)" },
        },
        // 押下: 厚みぶん沈み、横に広がって縦につぶれる(squash)。
        // 押した瞬間は遅れを感じさせないよう、戻り(バネ)より速く沈める
        [ACTIVE]: {
            boxShadow: SHADOW_PRESSED,
            transitionDuration: "90ms",
            transitionTimingFunction: "ease-out",
            _motionSafe: { transform: "translateY(calc(var(--felt-depth) - 1px)) scale(1.03, 0.94)" },
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // 最も強い操作: パレット色のフェルトに白い糸の縫い目
            primary: {
                bgColor: "colorPalette.solid",
                color: "colorPalette.contrast",
                "--felt-dot": "rgb(255 255 255 / 0.07)",
                "--stitch-color": "rgb(255 255 255 / 0.85)",
                // solid.active では面と縁が溶けるため、step10 に step12 を 45% 混ぜてもう一段沈める
                "--felt-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                [HOVER]: { bgColor: "colorPalette.solid.emphasized" },
                [ACTIVE]: { bgColor: "colorPalette.solid.emphasized" },
                _disabled: {
                    bgColor: "bg.disabled",
                    color: "fg.disabled",
                    ...flattened,
                },
            },
            // 補助的な操作: クリーム色のフェルトに、パレット色の糸で縫い目を入れる。
            // 面は暖色の任意値だが、糸・文字・フォーカスリングはパレットに追従する
            secondary: {
                bgColor: CREAM,
                color: "colorPalette.fg",
                "--felt-dot": "rgb(122 90 46 / 0.06)",
                "--stitch-color": "var(--mpc-colors-color-palette-solid)",
                "--felt-edge": CREAM_EDGE,
                [HOVER]: { bgColor: CREAM_HOVER },
                [ACTIVE]: { bgColor: CREAM_ACTIVE },
                _disabled: {
                    bgColor: "bg.disabled",
                    color: "fg.disabled",
                    ...flattened,
                },
            },
            // 最も控えめな操作: 布を当てる前の「縫い線のガイド」だけが見える状態。
            // hover で薄い布が現れ、縫い目もパレット色に濃くなる。厚みは compoundVariants で 0 にする
            plain: {
                bgColor: "transparent",
                bgImage: "none",
                color: "colorPalette.fg",
                "--felt-edge": "transparent",
                // 縫い線のガイドは border.emphasized(step8)で、地色の上でも見失わない濃さにする
                "--stitch-color": "var(--mpc-colors-color-palette-border-emphasized)",
                boxShadow: "none",
                [HOVER]: {
                    bgColor: "colorPalette.surface.subtle",
                    boxShadow: "none",
                    "--stitch-color": "var(--mpc-colors-color-palette-solid)",
                    // 厚みの無い面が浮くと不自然なので、hover では持ち上げない
                    _motionSafe: { transform: "none" },
                },
                [ACTIVE]: {
                    bgColor: "colorPalette.surface",
                    boxShadow: "none",
                    "--stitch-color": "var(--mpc-colors-color-palette-solid)",
                    _motionSafe: { transform: "translateY(1px) scale(1.02, 0.96)" },
                },
                _disabled: {
                    color: "fg.disabled",
                    "--stitch-color": "var(--mpc-colors-gray-6)",
                },
            },
        },
        // 面の高さは既存 Button と同じ control.sm/md/lg に揃え、縁の厚みはその外側に足す。
        // 縫い目が 4px 内側を走るぶん、左右の余白は既存 Button より少し広めにとる
        size: {
            sm: { height: "control.sm", px: "{spacing.4}", fontSize: "xs", "--felt-depth": "3px" },
            md: { height: "control.md", px: "{spacing.5}", fontSize: "sm", "--felt-depth": "4px" },
            // 既定の lg はぽってり厚く、ゲームのメニューボタンらしい存在感にする
            lg: { height: "control.lg", px: "{spacing.6}", fontSize: "md", "--felt-depth": "5px" },
        },
        // 形: 角丸のワッペン(既定)と、まるいタグ型のピル
        shape: {
            patch: { "--patch-radius": "16px" },
            pill: { "--patch-radius": "9999px" },
        },
    },
    // plain は size より後に厚みを 0 にしたいので、compoundVariants で size の指定を上書きする
    compoundVariants: [
        {
            intent: "plain",
            size: ["sm", "md", "lg"],
            css: { "--felt-depth": "0px" },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "patch",
    },
});

export type StitchedButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof stitchedButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージからは @ark-ui/react を解決できないため、他の LAB 案と同じくネイティブの button を使う
export const StitchedButton = forwardRef<HTMLButtonElement, StitchedButtonProps>(
    ({ intent, size, shape, className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cx(stitchedButtonStyle({ intent, size, shape }), className)}
            {...props}
        />
    ),
);
StitchedButton.displayName = "StitchedButton";

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
    // 白いパネル(bg.panel)の上に置くセクション。クリームの面の見え方を地色と比べるために使う
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
const SHAPES = ["patch", "pill"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <StitchedButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </StitchedButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active の段を静止状態で並べる。押下時のつぶれ具合と縫い目の見え方を確認するため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <StitchedButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </StitchedButton>
                ))}
                <StitchedButton intent={intent} disabled>
                    {intent} disabled
                </StitchedButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <StitchedButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </StitchedButton>
        ))}
    </div>
);

const meta: Meta<typeof StitchedButton> = {
    title: "LAB/Button Designs/Stitched",
    component: StitchedButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Stitched** — フェルトのワッペンを縫い付けたようなボタンです。マットな面の縁から 4px 内側に破線の「縫い目」が走り、面にはごく細かいドットで布目を乗せています。",
                    "primary はパレット色のフェルトに白い糸、secondary はクリーム色のフェルトにパレット色の糸、plain は布を当てる前の縫い線ガイドだけが見え、hover で薄い布が現れます。",
                    "面の下には厚みのある柔らかい影があり、hover でふわっと持ち上がり、押すと平たくつぶれて(squash)、離すとバネのように少し弾んで戻ります。動きを減らす設定では移動・変形を止め、影と色の変化だけになります。",
                    "",
                    "**借りている雰囲気**: のんびりした生活シミュレーションゲームの、手芸・おさいほう系メニューのような温かさ。クリームの地、ぽってりした角丸、厚い下影、丸ゴシック(M PLUS Rounded 1c)、ぽよんと弾む押し心地を組み合わせています(特定作品のロゴや素材は使っていません)。",
                    "",
                    "- 強み: 手触りのある素材感で、触りたくなる親しみやすさがある。縫い目が「押せる領域」をやさしく縁取るので、枠線を強くしなくても輪郭が分かる。",
                    "- 強み: 糸・文字・フォーカスリングがパレットに追従するので、mori / umi / red でもクリームの地のまま世界観を保てる。",
                    "- トレードオフ: 縫い目とドットで情報量が多く、小さいサイズ(sm)や密度の高い画面では縫い目がうるさく見える。業務画面よりも、ゲーム内メニューやイベントページ向き。",
                    "- トレードオフ: クリームの面はページの地色(colorPalette.bg)との明度差がほぼ無く、輪郭は茶色の縁(Lc 46〜55)と接地影頼み。布目のドットで文字の Lc が 4〜5 下がる(secondary active で 69 台)。",
                    "- トレードオフ: クリーム・タン・ドットの色は任意値で、トークン化されていない。縁の厚み(3〜5px)ぶん見た目の高さが増え、Select などと下端が揃わない。red の primary は白文字が Lc 67.8(ドット上)と目安 75 に届かない。",
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
        children: "ぬいつける",
        intent: "primary",
        size: "lg",
        shape: "patch",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof StitchedButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* クリームの面は地色と同じ明度帯なので、白いパネルの上での見え方も並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>状態の段(rest → hover → active → disabled)</span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>shape: pill</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <StitchedButton key={intent} intent={intent} shape="pill">
                            <HeartIcon />
                            {intent}
                        </StitchedButton>
                    ))}
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン(前 / 後ろ)</span>
                <div className={showcaseStyles.row}>
                    <StitchedButton>
                        <ScissorsIcon />
                        つくる
                    </StitchedButton>
                    <StitchedButton intent="secondary">
                        つぎへ
                        <ArrowRightIcon />
                    </StitchedButton>
                    <StitchedButton intent="plain">
                        <PlusIcon />
                        追加
                    </StitchedButton>
                    <StitchedButton intent="secondary" shape="pill">
                        <ShirtIcon />
                        きせかえ
                    </StitchedButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <StitchedButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </StitchedButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・糸・文字・フォーカスリングがパレットに追従することを確認する */}
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
