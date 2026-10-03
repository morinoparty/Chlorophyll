import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, HomeIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Cozy Pattern(柄入りクッション)方向のボタン
 *
 * 面(face)にパレットの色味で描いた水玉 / ギンガムチェックを敷き、その外周をクリーム色の縁(rim)で囲った
 * ふかふかのクッションのようなボタン。大きな角丸、上辺の光と下辺の陰でふくらんだ面、クリームの「側面」+ 柔らかい接地影で床から浮かせる。
 * hover ではばね感のあるイージングでぽよんと持ち上がり、押下で横に潰れる(squash & stretch)。
 * 柄は hover で少しだけ流れる。動きを減らす設定では移動・変形・柄の流れをすべて止める。
 *
 * 柄の色はすべてパレットの段(step2〜5 / 9〜12)から作るので、mori / umi / red に追従する。
 * クリーム(縁・ページ)と木の色味の影だけは対応するトークンが無いため任意値で持つ。
 *
 * APCA(apca-w3 の calcAPCA)計測値。生成トークン(styled-system/styles.css)の oklch を culori で sRGB に解決し、
 * color-mix / 半透明の重なりも合成してから計算。柄は「文字の下に来うる最も不利な色」で計測している。
 *   primary   : contrast(白) on solid(step9 の地)              mori 79.1 / umi 78.5 / red 70.5(最悪値。玉 step9→12 45% は 90.4 / 89.4 / 85.6)
 *               hover / active(地 step10)                    mori 84.5 / umi 84.0 / red 74.5(最悪値。玉は 93.2 / 92.2 / 87.5)
 *   secondary : colorPalette.fg on step2 + step4 帯の交点(帯 50% が 2 枚重なり 75%)
 *                                                           mori 72.1 / umi 72.1 / red 68.8
 *               hover(地 step3 + step4 帯の交点)           mori 71.1 / umi 71.1 / red 67.5
 *               active(地 step3 + step5 帯の交点)          mori 66.4 / umi 66.7 / red 63.0
 *   plain     : colorPalette.fg on クリームのページ(#f6ecd4)   mori 71.1 / umi 71.3 / red 70.8
 *               on ページの水玉(#efe1c0)                     mori 65.0 / umi 65.2 / red 64.7
 *               on メニューカード(#fbf4e2) 75.7 / 75.9 / 75.4、on 白(bg.panel) 82.1 / 82.3 / 81.8
 *               hover(縁クリーム + step4 70% の水玉)        mori 72.6 / umi 72.6 / red 69.6
 *               active(step3 + step4 70% の水玉)            mori 71.2 / umi 71.2 / red 67.9
 *   disabled  : fg.disabled(gray.9) on 暖色寄せの bg.disabled 48.1 / on 暖色寄せの gray.5 の水玉 43.0
 *               plain の fg.disabled on クリームのページ 49.5 / on カード 54.0 / on 白 60.4(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs クリームのページ mori 62.7 / umi 62.1 / red 54.1
 *               vs ページの水玉 56.6 / 56.0 / 47.9、vs カード 67.3 / 66.7 / 58.6
 *               vs 白(bg.panel) 73.7 / 73.1 / 65.0、vs colorPalette.bg 65.5 / 65.0 / 56.3(目安 Lc 45 以上)
 */

// disabled 以外にだけ hover / active を効かせる(既存 Button レシピと同じガード)
const HOVER = "&:not(:disabled):not([data-disabled]):hover";
const ACTIVE = "&:not(:disabled):not([data-disabled]):active";

// クリーム色の縁。ゲームのメニュー枠のような、少しだけ黄みを帯びた生成り
const CREAM_RIM = "#fffaee";
// クリームのページ。disabled の面を暖色に寄せるときの混ぜ先にも使う
const CREAM_PAGE = "#f6ecd4";
// 縁の外周を締める細い線。縁とページが同じ明度帯(Lc 0)なので、この線と影で輪郭を出す
const HAIRLINE = "rgb(150 115 70 / 0.22)";
// クッションの側面。クリームが影に入った色を不透明で持ち、白いパネルの上でも濁らないようにする
const CREAM_LEDGE = "#dcc49b";
// 木の床に落ちるような暖色の接地影。グレーの影だとクリームの上で濁るため、茶系に寄せる
const WOOD_SHADOW = "rgb(120 85 40 / 0.3)";

// ばねのように少し行き過ぎてから戻るイージング。ぽよんとした手触りを出す
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// 面の内側のふくらみ(--cozy-inset)+ 外周の細い線 + 0 ぼかしの側面 + 柔らかい接地影
const shadowStack = (depth: string, blur: string) =>
    `var(--cozy-inset), 0 0 0 1px ${HAIRLINE}, 0 ${depth} 0 0 ${CREAM_LEDGE}, 0 calc(${depth} + 5px) ${blur} -3px ${WOOD_SHADOW}`;

// 水玉。2 枚のずらした格子で千鳥配置にする。玉の色は --cozy-dot、半径は --cozy-dot-r(size ごと)
const DOT = "radial-gradient(circle, var(--cozy-dot) 0 var(--cozy-dot-r), transparent calc(var(--cozy-dot-r) + 0.5px))";
const POLKA = [DOT, DOT].join(", ");
// ギンガムチェック。半透明の帯を縦横に重ね、交点だけが一段濃くなるようにする
const GINGHAM = [
    "linear-gradient(90deg, var(--cozy-dot) 50%, transparent 50%)",
    "linear-gradient(0deg, var(--cozy-dot) 50%, transparent 50%)",
].join(", ");

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// disabled 共通: 厚みを潰して床に置いたままにし、柄はグレーの水玉に落とす。
// 冷たいグレーがクリームの上で浮かないよう、bg.disabled をページのクリームに 40% 寄せる
const disabledFace = {
    bgColor: `[color-mix(in oklab, var(--mpc-colors-bg-disabled), ${CREAM_PAGE} 40%)]`,
    color: "fg.disabled",
    textShadow: "none",
    backgroundImage: POLKA,
    "--cozy-dot": `color-mix(in oklab, var(--mpc-colors-gray-5), ${CREAM_PAGE} 40%)`,
    boxShadow: `0 0 0 1px ${HAIRLINE}`,
    transform: "translateY(var(--cozy-depth))",
} as const;

export const cozyPatternButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        position: "relative",
        // 丸ゴシックで、ゲームの吹き出しのような柔らかい文字にする
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        fontWeight: "[800]",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 面の内側のふくらみ。intent ごとに上書きし、未指定時は何も描かない
        "--cozy-inset": "inset 0 0 0 0 transparent",
        // クリームの縁。height は border-box なので、縁を含めて control.sm/md/lg に収まる
        borderWidth: "[var(--cozy-rim)]",
        borderStyle: "solid",
        borderColor: CREAM_RIM,
        // 柄の格子。2 枚目を半マスずらして水玉を千鳥にする(ギンガムでは見た目は変わらない)
        backgroundSize: "[var(--cozy-tile) var(--cozy-tile)]",
        backgroundPosition: "[0 0, calc(var(--cozy-tile) / 2) calc(var(--cozy-tile) / 2)]",
        backgroundRepeat: "repeat",
        // 厚みは box-shadow なのでレイアウト上の高さを持たない。下に並ぶ要素と重ならないよう余白を確保する
        marginBlockEnd: "[var(--cozy-depth)]",
        boxShadow: shadowStack("var(--cozy-depth)", "10px"),
        transitionProperty: "transform, box-shadow, background-color, background-position, color",
        transitionDuration: "normal",
        transitionTimingFunction: SPRING,
        // 動きを減らす設定では、変形と柄の流れを遷移させない(色と影の変化だけ残す)
        _motionReduce: { transitionProperty: "background-color, box-shadow, color" },
        "& :where(svg)": {
            strokeWidth: "[2.6px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        [HOVER]: {
            boxShadow: shadowStack("calc(var(--cozy-depth) + 2px)", "14px"),
            _motionSafe: {
                // ぽよんと縦に伸びながら持ち上がり、柄も少しだけ流れる
                transform: "translateY(-3px) scale(1.03, 1.06)",
                backgroundPosition:
                    "[calc(var(--cozy-tile) / 2) calc(var(--cozy-tile) / 4), var(--cozy-tile) calc(var(--cozy-tile) * 3 / 4)]",
            },
        },
        [ACTIVE]: {
            boxShadow: shadowStack("1px", "4px"),
            // 押した瞬間は遅れを感じないよう速く潰す(戻りは base の SPRING で弾む)
            transitionDuration: "fast",
            _motionSafe: {
                // 厚みぶん沈みながら、横に広がり縦に潰れる
                transform: "translateY(calc(var(--cozy-depth) - 1px)) scale(1.06, 0.9)",
            },
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // 最も強い操作。solid の地に step12 寄りの濃い水玉。白文字の最悪値は地(step9)側になる
            primary: {
                bgColor: "colorPalette.solid",
                color: "colorPalette.contrast",
                // ゲームのボタン文字のような、ほんの少しの落ち影
                textShadow: "0 1px 0 rgb(0 0 0 / 0.2)",
                backgroundImage: POLKA,
                "--cozy-dot":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-9), var(--mpc-colors-color-palette-12) 45%)",
                // 上辺の光と下辺の陰で、面をふっくら膨らませる
                "--cozy-inset": "inset 0 2px 0 0 rgb(255 255 255 / 0.28), inset 0 -3px 0 0 rgb(0 0 0 / 0.12)",
                [HOVER]: {
                    bgColor: "colorPalette.solid.emphasized",
                    "--cozy-dot":
                        "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                },
                [ACTIVE]: {
                    bgColor: "colorPalette.solid.emphasized",
                    "--cozy-dot":
                        "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                },
                _disabled: disabledFace,
            },
            // 補助的な操作。ごく薄い地にギンガムチェック。帯は step4 を 50% 透かして 2 枚重ね、交点を 75% にする
            secondary: {
                bgColor: "colorPalette.surface.subtle",
                color: "colorPalette.fg",
                backgroundImage: GINGHAM,
                "--cozy-dot": "color-mix(in srgb, var(--mpc-colors-color-palette-4) 50%, transparent)",
                // 上辺は白く光らせ、下辺はパレットの step5 で陰を付ける(文字の位置には掛からない 3px)
                "--cozy-inset":
                    "inset 0 2px 0 0 rgb(255 255 255 / 0.9), inset 0 -3px 0 0 color-mix(in srgb, var(--mpc-colors-color-palette-5) 80%, transparent)",
                [HOVER]: {
                    bgColor: "colorPalette.surface",
                },
                [ACTIVE]: {
                    bgColor: "colorPalette.surface",
                    // 押下は帯を step5 に一段濃くする(交点の Lc は red でも 63.0 を保つ)
                    "--cozy-dot": "color-mix(in srgb, var(--mpc-colors-color-palette-5) 50%, transparent)",
                },
                _disabled: {
                    ...disabledFace,
                    "--cozy-dot": "color-mix(in srgb, var(--mpc-colors-gray-5) 50%, transparent)",
                    backgroundImage: GINGHAM,
                },
            },
            // 最も控えめな操作。静止時は縁も影も柄も持たず文字だけ。hover で初めてクリームのクッションが現れる
            plain: {
                bgColor: "transparent",
                color: "colorPalette.fg",
                borderColor: "transparent",
                backgroundImage: "none",
                "--cozy-dot": "color-mix(in srgb, var(--mpc-colors-color-palette-4) 70%, transparent)",
                boxShadow: "none",
                marginBlockEnd: "0",
                [HOVER]: {
                    bgColor: CREAM_RIM,
                    backgroundImage: POLKA,
                    borderColor: CREAM_RIM,
                    boxShadow: `0 0 0 1px ${HAIRLINE}, 0 4px 10px -4px ${WOOD_SHADOW}`,
                    // 厚みが無いので浮かせず、少し膨らむだけにする
                    _motionSafe: { transform: "scale(1.04)" },
                },
                [ACTIVE]: {
                    bgColor: "colorPalette.surface",
                    backgroundImage: POLKA,
                    borderColor: CREAM_RIM,
                    boxShadow: `0 0 0 1px ${HAIRLINE}`,
                    _motionSafe: { transform: "scale(1.04, 0.94)" },
                },
                _disabled: {
                    color: "fg.disabled",
                },
            },
        },
        // 面の高さは既存 Button と同じ control.sm/md/lg(36 / 40 / 44px)。厚みはその外側に足す。
        // 柄の格子と玉の大きさも size に合わせて縮め、sm で柄がうるさくならないようにする
        size: {
            sm: {
                height: "control.sm",
                px: "{spacing.3.5}",
                fontSize: "xs",
                "--cozy-depth": "4px",
                "--cozy-rim": "3px",
                "--cozy-tile": "10px",
                "--cozy-dot-r": "1.75px",
            },
            md: {
                height: "control.md",
                px: "{spacing.4}",
                fontSize: "sm",
                "--cozy-depth": "5px",
                "--cozy-rim": "3px",
                "--cozy-tile": "12px",
                "--cozy-dot-r": "2.25px",
            },
            lg: {
                height: "control.lg",
                px: "{spacing.5}",
                fontSize: "md",
                "--cozy-depth": "5px",
                "--cozy-rim": "4px",
                "--cozy-tile": "14px",
                "--cozy-dot-r": "2.75px",
            },
        },
        // 角の形。cushion はふっくらした角丸四角、pill は完全な丸
        shape: {
            cushion: { borderRadius: "[16px]" },
            pill: { borderRadius: "full" },
        },
    },
    // plain は厚みを持たないので、size の指定より後に 0 にする
    compoundVariants: [
        {
            intent: "plain",
            size: ["sm", "md", "lg"],
            css: { "--cozy-depth": "0px" },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "cushion",
    },
});

export type CozyPatternButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof cozyPatternButton>;

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う(他の LAB 案と同じ)
export const CozyPatternButton = forwardRef<HTMLButtonElement, CozyPatternButtonProps>(
    ({ intent, size, shape, className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cx(cozyPatternButton({ intent, size, shape }), className)}
            {...props}
        />
    ),
);
CozyPatternButton.displayName = "CozyPatternButton";

// 一覧表示用のレイアウト
const styles = {
    // ゲームのメニュー画面のような、クリームの地に淡い水玉を敷いたページ
    page: css({
        display: "flex",
        flexDirection: "column",
        gap: "6",
        p: "6",
        borderRadius: "[28px]",
        bg: "[#f6ecd4]",
        backgroundImage: "[radial-gradient(circle, #efe1c0 0 3px, transparent 3.5px)]",
        backgroundSize: "[22px 22px]",
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }),
    // メニューの 1 枚。縁をクリームで囲んで、カードもクッションの仲間に見せる
    card: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "[22px]",
        bg: "[#fbf4e2]",
        boxShadow: "0 4px 0 0 rgb(170 130 80 / 0.22)",
    }),
    // 白いパネル(bg.panel)の上での見え方を比べる
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "[22px]",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "[700]", color: "colorPalette.fg.subtle" }),
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={styles.row}>
                {SIZES.map((size) => (
                    <CozyPatternButton key={size} intent={intent} size={size}>
                        {intent} {size}
                    </CozyPatternButton>
                ))}
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={styles.row}>
        {INTENTS.map((intent) => (
            <CozyPatternButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </CozyPatternButton>
        ))}
        <CozyPatternButton disabled>
            <PlusIcon />
            disabled
        </CozyPatternButton>
    </div>
);

const meta: Meta<typeof CozyPatternButton> = {
    title: "LAB/Button Designs/Cozy Pattern",
    component: CozyPatternButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Cozy Pattern** — 面にパレットの色味で描いた水玉(primary)やギンガムチェック(secondary)を敷き、クリーム色の縁で囲んだ「柄入りクッション」のようなボタンです。",
                    "大きな角丸と、木の床に落ちるような暖色の厚み + 柔らかい影で浮かせ、hover でぽよんと持ち上がり、押すと横に潰れます(動きを減らす設定では変形・柄の流れを止めます)。",
                    "",
                    "**借りている雰囲気**: のんびりした箱庭ゲームのメニューやスマホ風アプリ画面。生成りの紙のような地、手縫いの布のような柄、丸ゴシックの文字、ぷにっと弾む反応。ロゴや固有の素材は使わず、色・形・動きの手触りだけを借りています。",
                    "",
                    "- 強み: 1 つ置くだけで画面がぱっと「遊び」の空気になる。柄があるので色覚に頼らずとも primary / secondary の違いが読める。",
                    "- 強み: 柄の色はすべてパレットの段から作るので、mori / umi / red に追従する。",
                    "- トレードオフ: 柄の上の文字は最悪値で測る必要があり、secondary の Lc は 67〜72(red の押下時 63.0)と本文の目安 75 には届かない。red の primary は既存 Button と同じく 70.5。",
                    "- トレードオフ: クリームの縁と影は任意値なので、ダークモードや白い面の上では浮いて見える。情報密度の高い業務画面には不向き。",
                    "- トレードオフ: 厚みぶん(4〜5px)見た目の高さが増え、hover のばねで一瞬はみ出すので、狭い行に詰めて並べにくい。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        shape: { control: "select", options: ["cushion", "pill"] },
        disabled: { control: "boolean" },
    },
    args: {
        children: "おでかけする",
        intent: "primary",
        size: "lg",
        shape: "cushion",
        disabled: false,
    },
    // クリームのメニュー画面の上に置いて見せる
    decorators: [
        (Story) => (
            <div className={styles.page}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof CozyPatternButton>;

export const Showcase: Story = {
    render: () => (
        <>
            <section className={styles.card}>
                <span className={styles.label}>mori(既定)— intent × size / クリームのメニューの上</span>
                <IntentRows />
            </section>
            <section className={styles.card}>
                <span className={styles.label}>アイコン(先頭 / 末尾)と pill</span>
                <div className={styles.row}>
                    <CozyPatternButton>
                        <HomeIcon />
                        おうちにかえる
                    </CozyPatternButton>
                    <CozyPatternButton intent="secondary">
                        つぎへ
                        <ArrowRightIcon />
                    </CozyPatternButton>
                    <CozyPatternButton intent="plain">
                        <PlusIcon />
                        ついか
                    </CozyPatternButton>
                    <CozyPatternButton shape="pill">
                        <HeartIcon />
                        おきにいり
                    </CozyPatternButton>
                    <CozyPatternButton intent="secondary" shape="pill" size="md">
                        <SparklesIcon />
                        かざる
                    </CozyPatternButton>
                </div>
            </section>
            <section className={styles.card}>
                <span className={styles.label}>disabled</span>
                <div className={styles.row}>
                    {INTENTS.map((intent) => (
                        <CozyPatternButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </CozyPatternButton>
                    ))}
                </div>
            </section>
            {/* クリーム以外の地での見え方も比べるため、白いパネルにも並べる */}
            <section className={styles.panel}>
                <span className={styles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            {/* colorPalette を切り替えて、地・柄・文字・フォーカスリングがパレットに追従することを確認する */}
            <section className={cx(css({ colorPalette: "umi" }), styles.card)}>
                <span className={styles.label}>colorPalette: umi</span>
                <PaletteRow />
            </section>
            <section className={cx(css({ colorPalette: "red" }), styles.card)}>
                <span className={styles.label}>colorPalette: red</span>
                <PaletteRow />
            </section>
        </>
    ),
};

export const Playground: Story = {};
