import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * Tonal ボタン(デザイン検証用のプロトタイプ)
 *
 * 影も枠線も使わず、塗りの「トーン(明度の段)」だけで階層と状態を表すフラットな方向性。
 * primary は solid の塗り、secondary はパレットを帯びた面、plain は文字だけ。
 * hover / active はいずれも 12 段階スケールを 1 段ずつ濃くするだけで表現する。
 *
 * secondary の静止面は step4(surface.hover)から始める。ページの地色(colorPalette.bg)は
 * step3 と同じ明度なので、step3(surface)だと地色の上で面が溶けて消えるため。
 * 面を 1 段濃くしたぶん、文字は colorPalette.fg ではなく step12 に沈めて Lc を確保する。
 *
 * APCA 計測値(apca-w3 の APCAcontrast。ビルド済み Storybook でトークンを sRGB に解決して算出):
 *   primary   : colorPalette.contrast(白) on colorPalette.solid(step9)
 *               mori Lc 79.1 / umi 78.5 / red 70.5(red の solid 自体の値。既存 Button と同じ)
 *               hover(solid.emphasized) mori 84.5 / umi 84.0 / red 74.5
 *               active(solid.active)    mori 88.7 / umi 87.7 / red 80.6
 *   secondary : colorPalette.12 on step4 mori 85.6 / umi 83.7 / red 79.8
 *               hover(step5)            mori 79.9 / umi 78.0 / red 73.9
 *               active(step5 + step6 半分) mori 75.9 / umi 74.2 / red 70.4
 *   plain     : colorPalette.fg on 白 mori 82.1 / umi 82.3 / red 81.8
 *               on colorPalette.bg mori 73.8 / umi 74.2 / red 73.1
 *               hover / active は文字も step12 に沈めるので secondary の静止 / hover と同値
 *               (step4: 85.6 / 83.7 / 79.8、step5: 79.9 / 78.0 / 73.9)
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) Lc 46.9
 *               on colorPalette.surface.subtle(step2) mori 57.1 / umi 56.9 / red 56.6
 *               on 白 60.4 / on colorPalette.bg mori 52.2 / umi 52.4 / red 51.7(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring vs 白 mori 73.7 / umi 73.1 / red 65.0
 *               vs colorPalette.bg mori 65.5 / umi 65.0 / red 56.3(目安 Lc 45 以上)
 */

// disabled 以外にだけ hover / active を効かせるためのセレクタ
// data-preview は Showcase で hover / active の段を静止状態のまま並べて見比べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// secondary の押下面。スケールの step5 と step6(枠線用)の間に一段だけ沈める。
// step6 そのものは文字の Lc が 60 を割るため半分だけ混ぜる
const SURFACE_PRESSED = "color-mix(in oklab, var(--mpc-colors-color-palette-5), var(--mpc-colors-color-palette-6) 50%)";

// フォーカスリング。shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// 押下時のわずかな縮み。影を使わない代わりに、押した手応えをここで返す。
// 動きを減らす設定のユーザーには縮みを無効化する
const pressed = {
    transform: "scale(0.98)",
    _motionReduce: { transform: "none" },
} as const;

export const tonalButtonStyle = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        // 枠線を持たないので、既存 Button と同じ角丸で輪郭を面だけで見せる
        borderRadius: "control",
        border: "none",
        fontWeight: "semibold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 色の切り替えと押下の縮みだけをなめらかにする。影は使わないので box-shadow は対象にしない
        transitionProperty: "background-color, color, transform",
        transitionDuration: "fast",
        transitionTimingFunction: "easeInOut",
        _motionReduce: { transitionProperty: "background-color, color" },
        // lucide-react のアイコンを文字サイズに合わせる(既存 Button のレシピと同じ比率)
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // 最も強い操作。solid の塗り 1 色で、hover / active は 1 段ずつ濃くする
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                [HOVER]: { bg: "colorPalette.solid.emphasized" },
                [ACTIVE]: { bg: "colorPalette.solid.active", ...pressed },
                // 無効状態は既存 Button と同じグレーの面に落とし、パレットの色味を抜く
                _disabled: {
                    bg: "bg.disabled",
                    color: "fg.disabled",
                },
            },
            // 補助的な操作。パレットを帯びた面に、面より 1 段深い文字を載せる。
            // 静止面を step4 にするのは、step3 だとページの地色と同じ明度で面が消えるため
            secondary: {
                bg: "colorPalette.surface.hover",
                color: "colorPalette.12",
                [HOVER]: { bg: "colorPalette.surface.active" },
                [ACTIVE]: { bg: SURFACE_PRESSED, ...pressed },
                // 面の存在は残しつつ薄くし、文字をグレーに落として無効を読ませる
                _disabled: {
                    bg: "colorPalette.surface.subtle",
                    color: "fg.disabled",
                },
            },
            // 最も控えめな操作。静止時は文字だけで、hover で初めて面が現れる。
            // ページの地色(colorPalette.bg)は surface(step3)と同じ明度なので、
            // hover は step4 から始めてどちらの地色の上でも面が見えるようにする。
            // 面が濃くなるぶん文字も step12 に沈め、red でも Lc 70 台を保つ
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                [HOVER]: { bg: "colorPalette.surface.hover", color: "colorPalette.12" },
                [ACTIVE]: { bg: "colorPalette.surface.active", color: "colorPalette.12", ...pressed },
                _disabled: {
                    bg: "transparent",
                    color: "fg.disabled",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)を使い、他の方向性・既存 Button と揃えて比較できるようにする
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

export type TonalButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof tonalButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージからは @ark-ui/react を解決できないため、ark.button ではなくネイティブの button を使う
export const TonalButton = forwardRef<HTMLButtonElement, TonalButtonProps>(
    ({ intent, size, className, ...props }, ref) => (
        <button ref={ref} type="button" className={cx(tonalButtonStyle({ intent, size }), className)} {...props} />
    ),
);
TonalButton.displayName = "TonalButton";

// 一覧表示用のレイアウト
const showcaseStyles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "6" }),
    // ページの地色(colorPalette.bg)の上に置くセクション
    section: css({
        display: "flex",
        flexDirection: "column",
        gap: "3",
        p: "5",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
    // 白いパネル(bg.panel)の上に置くセクション。secondary の面の見え方を地色と比べるために使う
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "3",
        p: "5",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <TonalButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </TonalButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active の段を静止状態で並べる。トーンの刻みが十分に見分けられるかを確認するため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <TonalButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </TonalButton>
                ))}
                <TonalButton intent={intent} disabled>
                    {intent} disabled
                </TonalButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <TonalButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </TonalButton>
        ))}
    </div>
);

const meta: Meta<typeof TonalButton> = {
    title: "LAB/Button Designs/Tonal",
    component: TonalButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Tonal** — 影も枠線も使わず、塗りのトーン(12 段階スケールの明度の段)だけで階層と状態を表すフラットな方向性です。",
                    "primary は solid の塗り、secondary はパレットを帯びた面(step4)、plain は文字だけ。hover / active はスケールを 1 段ずつ濃くし、押下時だけ 98% にわずかに縮みます(動きを減らす設定では縮みません)。",
                    "",
                    "**強み**: 静かで落ち着いており、1 画面に多く並べてもうるさくなりません。「枠線は控えめ・柔らかい面」という方針に素直に沿い、Card や Table の色づいた面とも馴染みます。影や疑似要素を持たないのでレシピが単純で、パレット(mori / umi / red)への追従もトークンの差し替えだけで完結します。",
                    "",
                    "**トレードオフ**: 立体感が無いぶん「押せる」手がかりは面の色だけです。secondary はページの地色(step3 相当)に溶けないよう静止面を step4 から始め、文字を step12 に沈めて Lc 80 前後を確保しています。plain は静止時に本文のリンクや見出しと見分けにくい場面があります。red の primary は solid 自体の明るさにより白文字が Lc 70.5 と、本文の目安 75 に届きません(既存 Button と共通の課題)。",
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
type Story = StoryObj<typeof TonalButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* secondary の面は地色と同じ明度帯なので、白いパネルの上での見え方も並べて比べる */}
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
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>状態の段 / 白いパネルの上</span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン</span>
                <div className={showcaseStyles.row}>
                    <TonalButton>
                        <SparklesIcon />
                        はじめる
                    </TonalButton>
                    <TonalButton intent="secondary">
                        次へ
                        <ArrowRightIcon />
                    </TonalButton>
                    <TonalButton intent="plain">
                        <PlusIcon />
                        追加
                    </TonalButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <TonalButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </TonalButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・文字・フォーカスリングがパレットに追従することを確認する */}
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
