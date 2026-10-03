import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * Neo Brutal ボタン(デザイン検証用のプロトタイプ)
 *
 * 2px の濃いインク色の枠線と、ぼかしの無い固い影(4px 4px 0)で「紙を切って貼った」ような
 * 強い存在感を出す方向性。hover で影の方へ 2px 沈み、active で影を完全に潰して押し込んだ手応えを返す。
 *
 * インク(枠線・影)は colorPalette.12 を使い、mori / umi / red などパレットに追従させる。
 * colorPalette.fg だと solid の塗りとの差が Lc 0〜14.8 しかなく、primary の枠と影が塗りに溶けて
 * 「固い輪郭」が出なかったため、スケールで最も濃い step12 に寄せている。文字色は colorPalette.fg のまま。
 *
 * APCA 計測値(apca-w3 の calcAPCA 相当。トークンの oklch 値から算出):
 *   primary   : colorPalette.contrast(白) on colorPalette.solid
 *               mori Lc -79.1 / umi -78.5 / red -70.5
 *               hover(solid.emphasized) mori -84.5 / umi -84.0 / red -74.5
 *               active(solid.active)    mori -88.7 / umi -87.7 / red -80.6
 *   secondary : colorPalette.fg on bg.panel(白) mori 82.1 / umi 82.3 / red 81.8
 *               hover(colorPalette.surface)    mori 74.6 / umi 74.6 / red 72.4
 *               active(colorPalette.surface.hover) mori 69.8 / umi 69.6 / red 65.8
 *   plain     : colorPalette.fg on colorPalette.bg mori 73.8 / umi 74.2 / red 73.1
 *   インク(枠線・影 = colorPalette.12):
 *               vs 白 mori 97.9 / umi 96.3 / red 95.8
 *               vs colorPalette.bg mori 89.6 / umi 88.2 / red 87.1
 *               vs colorPalette.solid mori 22.2 / umi 21.3 / red 28.8(塗りとの境目が見える)
 *   disabled  : fg.disabled on bg.disabled Lc 46.9 / on 白 Lc 60.4 / on colorPalette.bg Lc 51.7〜52.4(目安 Lc 30 以上)
 *               枠線も fg.disabled(border.emphasized は colorPalette.bg に対して Lc 27.8〜28.4 で下限 30 を割るため)
 *   red primary の白文字は Lc 70.5 で本文目安 75 に届かない(red.9 トークン自体の性質。太字なので 60 は満たす)
 *   focus ring: colorPalette.focus.ring vs 白 mori 73.7 / umi 73.1 / red 65.0
 *               vs colorPalette.bg mori 65.5 / umi 65.0 / red 56.3(目安 Lc 45 以上)
 */

// 枠線と影に使うインク色。パレットに追従させつつ solid の塗りから輪郭を分離するため、最も濃い step12 を参照する
const INK = "{colors.colorPalette.12}";

// 影のオフセット 3 段階。静止 → hover → active の順に影へ沈み込む
const shadowRest = `4px 4px 0 0 ${INK}`;
const shadowHover = `2px 2px 0 0 ${INK}`;
const shadowActive = `0 0 0 0 ${INK}`;

// disabled 以外にだけ hover / active を効かせるためのセレクタ
const HOVER = "&:not(:disabled):not([data-disabled]):hover";
const ACTIVE = "&:not(:disabled):not([data-disabled]):active";

// フォーカスリング。shared/focus-ring.ts と同じくロングハンドで明示する(#78)。
// 既定の offset(2px)だとリングが右下の 4px の影の内側を横切るため、影の外側まで逃がす
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "1.5",
} as const;

export const brutalButtonStyle = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        // 角丸は小さめにして、切り貼りしたような硬い輪郭を強調する
        borderRadius: "item",
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: INK,
        fontWeight: "bold",
        letterSpacing: "wide",
        position: "relative",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 影と位置を同じ速さで動かし、ボタンが影へ沈み込むように見せる
        transitionDuration: "fast",
        transitionProperty: "transform, box-shadow, background, color, border-color",
        transitionTimingFunction: "easeInOut",
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
        },
        _disabled: {
            cursor: "not-allowed",
            // 無効状態では沈み込まない平らな見た目にする
            boxShadow: "none",
            transform: "none",
        },
        _focusVisible: focusRing,
        // 動きを減らす設定では移動とアニメーションを止め、影の変化だけで押下を伝える
        _motionReduce: {
            transitionProperty: "background, color, border-color",
            "&:hover, &:active": {
                transform: "none !important",
            },
        },
    },
    variants: {
        intent: {
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                boxShadow: shadowRest,
                // hover で影の方へ 2px 沈み、影を半分にする
                [HOVER]: {
                    bg: "colorPalette.solid.emphasized",
                    transform: "translate(2px, 2px)",
                    boxShadow: shadowHover,
                },
                // active で影を完全に潰し、押し込んだ手応えを返す。hover と同じ詳細度なので後に書いて優先させる
                [ACTIVE]: {
                    bg: "colorPalette.solid.active",
                    transform: "translate(4px, 4px)",
                    boxShadow: shadowActive,
                },
                _disabled: {
                    bg: "bg.disabled",
                    borderColor: "fg.disabled",
                    color: "fg.disabled",
                },
            },
            secondary: {
                bg: "bg.panel",
                color: "colorPalette.fg",
                boxShadow: shadowRest,
                [HOVER]: {
                    bg: "colorPalette.surface",
                    transform: "translate(2px, 2px)",
                    boxShadow: shadowHover,
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface.hover",
                    transform: "translate(4px, 4px)",
                    boxShadow: shadowActive,
                },
                _disabled: {
                    bg: "bg.panel",
                    borderColor: "fg.disabled",
                    color: "fg.disabled",
                },
            },
            plain: {
                // 静止時は枠と影を消して文字だけにし、hover で初めて枠と影が「飛び出す」遊びを入れる。
                // 枠線は透明で幅を確保し、hover 時にレイアウトがずれないようにする
                bg: "transparent",
                borderColor: "transparent",
                color: "colorPalette.fg",
                [HOVER]: {
                    bg: "bg.panel",
                    borderColor: INK,
                    // 他の intent とは逆に、浮き上がる方向(左上)へ動かして影を出す
                    transform: "translate(-2px, -2px)",
                    boxShadow: shadowHover,
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface",
                    borderColor: INK,
                    transform: "translate(0, 0)",
                    boxShadow: shadowActive,
                },
                _disabled: {
                    bg: "transparent",
                    borderColor: "transparent",
                    color: "fg.disabled",
                },
            },
        },
        // 高さは sizes.control を共有し、他の方向性・既存 Button と並べて比較できるようにする
        size: {
            sm: { height: "control.sm", px: "{spacing.3.5}", fontSize: "xs" },
            md: { height: "control.md", px: "{spacing.4}", fontSize: "sm" },
            lg: { height: "control.lg", px: "{spacing.5}", fontSize: "md" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う。
// 採用時は packages/react 側で ark.button に置き換える
export type BrutalButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof brutalButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る
export const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
    ({ intent, size, className, ...props }, ref) => (
        <button type="button" ref={ref} className={cx(brutalButtonStyle({ intent, size }), className)} {...props} />
    ),
);
BrutalButton.displayName = "BrutalButton";

// 一覧表示用のセクション。地色だけを差し替えられるよう素のスタイルオブジェクトで持つ
const sectionBase = {
    display: "flex",
    flexDirection: "column",
    gap: "3",
    p: "5",
    borderRadius: "panel",
} as const;

// 一覧表示用のレイアウト
const showcaseStyles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "6" }),
    section: css(sectionBase, { bg: "colorPalette.bg" }),
    // 白いパネル上での見え方を確認するセクション
    panelSection: css(sectionBase, { bg: "bg.panel" }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    // 影が右下へはみ出すぶん、行間を広めに取る
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <BrutalButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </BrutalButton>
                ))}
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <BrutalButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </BrutalButton>
        ))}
    </div>
);

const meta: Meta<typeof BrutalButton> = {
    title: "LAB/Button Designs/Neo Brutal",
    component: BrutalButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Neo Brutal** — 2px のインク色の枠線と、ぼかしの無い固い影(4px 4px 0)で構成するネオブルータリズムの方向性です。",
                    "hover で影の方へ 2px 沈み、active で影を潰して完全に押し込みます。plain は静止時は文字だけで、hover で枠と影が飛び出します。",
                    "",
                    "**強み**: 押せる場所が一目で分かり、押下のフィードバックが物理的で楽しい。枠と影がパレットの最も濃いステップ(step12)に追従するので、mori / umi / red どれでもブランド色を保ったまま強い個性が出ます。",
                    "",
                    "**トレードオフ**: 「枠線は控えめ・影は柔らかく」という Chlorophyll の既定のトーンとは正反対の、意図的にうるさい選択肢です。主張が非常に強く、1 画面に多く並べるとうるさくなります。影が右下に 4px はみ出すため、周囲の余白や整列(特にフォームの右端揃え)に気を遣う必要があります。既存の柔らかい影・角丸のコンポーネントとはトーンが揃わないため、採用する場合は Card や Input など周辺にも波及させる判断が必要です。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ボタンだよー",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof BrutalButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン</span>
                <div className={showcaseStyles.row}>
                    <BrutalButton>
                        <SparklesIcon />
                        はじめる
                    </BrutalButton>
                    <BrutalButton intent="secondary">
                        次へ
                        <ArrowRightIcon />
                    </BrutalButton>
                    <BrutalButton intent="plain">
                        <PlusIcon />
                        追加
                    </BrutalButton>
                </div>
            </section>
            {/* 白いパネル(bg.panel)の上でも枠と影の輪郭が保てるかを確認する */}
            <section className={showcaseStyles.panelSection}>
                <span className={showcaseStyles.label}>on bg.panel</span>
                <PaletteRow />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <BrutalButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </BrutalButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・インク・フォーカスリングがパレットに追従することを確認する */}
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
