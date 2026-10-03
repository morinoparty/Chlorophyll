import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftIcon, ArrowRightIcon, PickaxeIcon, SwordIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * 「Pixel」方向のボタン試作(デザイン検討用。本番の button レシピには反映していない)。
 *
 * Minecraft の UI ボタンを下敷きに、角丸なし・ぼかしのない 2px 単位の「ピクセルのベベル」で
 * ブロックのような立体感を出す。右下に 4px の段(レッジ)を付けて「押せるブロック」に見せ、
 * 押下でレッジが消えて中身が 2px 沈む。輪郭線は黒ではなく同系色の暗いトーンにして、線の主張を抑える。
 *
 * APCA(apca-w3 の calcAPCA で計測。styled-system/tokens の oklch を sRGB に変換して算出):
 *   primary  : colorPalette.contrast(白) on solid.emphasized(step10) mori 84.5 / umi 84.0 / red 74.5
 *              hover on solid(step9)                              mori 79.1 / umi 78.5 / red 70.5
 *              押下 on solid.active                                mori 88.7 / umi 87.7 / red 80.6
 *   secondary: colorPalette.fg on bg.panel(白)                    mori 82.1 / umi 82.3 / red 81.8
 *              hover on surface.subtle(step2)                    mori 78.8 / umi 78.7 / red 78.0
 *              押下 on surface(step3)                             mori 74.6 / umi 74.6 / red 72.4
 *   plain    : colorPalette.fg on colorPalette.bg(ページ地色)       mori 73.8 / umi 74.2 / red 73.1(白の上 81.8〜82.3)
 *              hover / 押下 on surface(step3)                     mori 74.6 / umi 74.6 / red 72.4
 *   disabled : fg.disabled on bg.disabled 46.9 / on 白 60.4 / on colorPalette.bg 51.7〜52.2
 *   輪郭線   : primary solid.active on colorPalette.bg 75.5 / 74.6 / 66.5、on 白 83.7 / 82.6 / 75.2
 *              secondary border.interactive(step7) on 白 33.8 / 33.6 / 37.4(白い面そのものが地色から浮くため装飾扱い)
 *   focus    : colorPalette.focus.ring on 白 mori 73.7 / umi 73.1 / red 65.0、on colorPalette.bg 65.5 / 65.0 / 56.3
 */

// ピクセルのベベル。ぼかし 0 の inset シャドウで、光(左上 2px)と影(右 2px・下 4px のレッジ)を描く。
// 既存の shadows.inset.raised はぼかし入りでピクセル感が出ないため、ここだけ任意値で書く
const bevel = {
    // 濃い solid 面用: 左上に白のハイライト、右下に黒のレッジ
    solid: "inset 2px 2px 0 0 rgba(255,255,255,0.28), inset -2px -4px 0 0 rgba(0,0,0,0.22)",
    // hover はハイライトを強め、面の明るさと合わせて「光った」と読ませる
    solidHover: "inset 2px 2px 0 0 rgba(255,255,255,0.45), inset -2px -4px 0 0 rgba(0,0,0,0.22)",
    // 押下はレッジを消し、左上に影を落として凹んだ見た目にする
    solidActive: "inset 2px 4px 0 0 rgba(0,0,0,0.28), inset -2px -2px 0 0 rgba(255,255,255,0.12)",
    // 明るい面用: 白地に白のハイライトは見えないため、右下のレッジだけをパレットの step6 で描く
    light: "inset -2px -4px 0 0 var(--mpc-colors-color-palette-border)",
    // plain の hover 用。休止時にレッジが無いので、中身がずれないよう下の段は 2px に留める
    lightFlat: "inset -2px -2px 0 0 var(--mpc-colors-color-palette-border)",
    lightActive: "inset 2px 4px 0 0 var(--mpc-colors-color-palette-border)",
};

// フォーカスリング(recipes/shared/focus-ring.ts と同じロングハンド指定)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// hover / active は disabled 中に効かせない
const hover = "&:not(:disabled):not([data-disabled]):hover";
const active = "&:not(:disabled):not([data-disabled]):active";

export const pixelButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        // 角丸なし。ピクセルの矩形らしさを最優先する
        borderRadius: "none",
        // 2px の輪郭。色は intent ごとに指定し、plain は透明のまま残して他の intent と寸法を揃える
        borderWidth: "2",
        borderStyle: "solid",
        borderColor: "transparent",
        fontWeight: "bold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 8bit らしく 2 段階のステップで切り替える。動きを減らす設定では切り替えを即時にする
        transitionProperty: "background-color, box-shadow, border-color, color, padding",
        transitionDuration: "fastest",
        transitionTimingFunction: "[steps(2, end)]",
        _motionReduce: {
            transitionProperty: "none",
        },
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
            // 無効状態は凹凸を消して「押せない平面」に見せ、レッジ分の持ち上げも戻す
            boxShadow: "none",
            pb: "0",
        },
    },
    variants: {
        intent: {
            primary: {
                // 休止時は step10 の面にして白文字の Lc を確保する(step9 だと red が 70.5 まで落ちる)
                bg: "colorPalette.solid.emphasized",
                color: "colorPalette.contrast",
                // 輪郭は黒ではなく同系色の暗いトーン。線ではなくブロックの縁として読ませる
                borderColor: "colorPalette.solid.active",
                boxShadow: bevel.solid,
                // 下 4px のレッジの分だけ中身を 2px 持ち上げ、見えている面の中央に置く
                pb: "1",
                [hover]: {
                    // 「明るくなる」を素直に面の色で表現する
                    bg: "colorPalette.solid",
                    boxShadow: bevel.solidHover,
                },
                [active]: {
                    bg: "colorPalette.solid.active",
                    boxShadow: bevel.solidActive,
                    // レッジが消えた分だけ中身が 2px 沈む
                    pb: "0",
                },
                _disabled: {
                    bg: "bg.disabled",
                    borderColor: "border.interactive",
                    color: "fg.disabled",
                },
            },
            secondary: {
                bg: "bg.panel",
                color: "colorPalette.fg",
                // 白い面がページの地色から浮くので、輪郭は控えめな step7 に留める
                borderColor: "colorPalette.border.interactive",
                boxShadow: bevel.light,
                pb: "1",
                [hover]: {
                    bg: "colorPalette.surface.subtle",
                    borderColor: "colorPalette.border.emphasized",
                },
                [active]: {
                    bg: "colorPalette.surface",
                    borderColor: "colorPalette.border.emphasized",
                    boxShadow: bevel.lightActive,
                    pb: "0",
                },
                _disabled: {
                    bg: "bg.panel",
                    borderColor: "border.muted",
                    color: "fg.disabled",
                },
            },
            plain: {
                bg: "transparent",
                // fg.muted(gray.11)だとパレットに追従せずページ地色の上で Lc 71 に留まるため、colorPalette.fg を使う
                color: "colorPalette.fg",
                [hover]: {
                    bg: "colorPalette.surface",
                    boxShadow: bevel.lightFlat,
                },
                [active]: {
                    // 面の色は hover のまま、ベベルの反転だけで押下を表す(step4 だと red の Lc が 65.8 に落ちる)
                    bg: "colorPalette.surface",
                    boxShadow: bevel.lightActive,
                },
                _disabled: {
                    color: "fg.disabled",
                },
            },
        },
        // 高さは現行 Button と同じ sizes.control を使い、他の方向性と並べて比較できるようにする
        size: {
            sm: { height: "control.sm", px: "3.5", fontSize: "xs" },
            md: { height: "control.md", px: "4", fontSize: "sm" },
            lg: { height: "control.lg", px: "5", fontSize: "md" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

export type PixelButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof pixelButton>;

// 現行 Button と同じ intent / size の props を受け取るボタン。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う
export const PixelButton = ({ intent, size, className, ...props }: PixelButtonProps) => (
    <button type="button" className={cx(pixelButton({ intent, size }), className)} {...props} />
);

const meta: Meta<typeof PixelButton> = {
    title: "LAB/Button Designs/Pixel",
    component: PixelButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Pixel** — Minecraft の UI ボタンを下敷きにした方向性。角丸なし・ぼかしのない 2px 単位のベベルと、右下 4px の段(レッジ)でブロックのような立体感を出す。輪郭は黒ではなく同系色の暗いトーン。hover で面とハイライトが明るくなり、押下でレッジが消えて中身が 2px 沈む。",
                    "",
                    "- **強み**: もりのパーティ(Minecraft コミュニティ)らしさが一目で伝わる。影のぼかしに頼らないため小さいサイズでもくっきり見え、押下の手応えが分かりやすい。",
                    "- **トレードオフ**: 角丸の Select / Input などと並べると形の言語がぶつかる(採用するなら radius を全体で none に寄せる必要がある)。ベベルの光と影は rgba の任意値で、トークン化されていない。red の primary は休止時 Lc 74.5、hover 中は 70.5 で本文の目安 75 にわずかに届かない。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: ["primary", "secondary", "plain"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ワールドに参加",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof PixelButton>;

// ショーケースのレイアウト
const styles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
    // パレット追従を見せるための枠。colorPalette を切り替え、地色もそのパレットの bg にする
    umi: css({
        colorPalette: "umi",
        bg: "colorPalette.bg",
        p: "4",
        display: "flex",
        flexDirection: "column",
        gap: "3",
    }),
    red: css({
        colorPalette: "red",
        bg: "colorPalette.bg",
        p: "4",
        display: "flex",
        flexDirection: "column",
        gap: "3",
    }),
};

const intents = ["primary", "secondary", "plain"] as const;

// 1 つの intent を sm / md / lg とアイコン付きで並べる行
const IntentRow = ({ intent }: { intent: (typeof intents)[number] }) => (
    <div className={styles.section}>
        <span className={styles.label}>{intent}</span>
        <div className={styles.row}>
            <PixelButton intent={intent} size="sm">
                Small
            </PixelButton>
            <PixelButton intent={intent} size="md">
                Medium
            </PixelButton>
            <PixelButton intent={intent} size="lg">
                Large
            </PixelButton>
            <PixelButton intent={intent}>
                <ArrowLeftIcon />
                戻る
            </PixelButton>
            <PixelButton intent={intent}>
                次へ
                <ArrowRightIcon />
            </PixelButton>
        </div>
    </div>
);

// 3 つの intent を 1 行にまとめた行(パレット比較用)
const PaletteRow = () => (
    <div className={styles.row}>
        <PixelButton intent="primary">
            <SwordIcon />
            たたかう
        </PixelButton>
        <PixelButton intent="secondary">
            <PickaxeIcon />
            採掘する
        </PixelButton>
        <PixelButton intent="plain">キャンセル</PixelButton>
    </div>
);

// intent × size、アイコン、disabled、パレット追従を一覧で並べる
export const Showcase: Story = {
    render: () => (
        <div className={styles.grid}>
            {intents.map((intent) => (
                <IntentRow key={intent} intent={intent} />
            ))}

            <div className={styles.section}>
                <span className={styles.label}>disabled</span>
                <div className={styles.row}>
                    {intents.map((intent) => (
                        <PixelButton key={intent} intent={intent} disabled>
                            <SwordIcon />
                            {intent}
                        </PixelButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>palette: umi</span>
                <div className={styles.umi}>
                    <PaletteRow />
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>palette: red</span>
                <div className={styles.red}>
                    <PaletteRow />
                </div>
            </div>
        </div>
    ),
};

// controls で intent / size / disabled を切り替えて試す
export const Playground: Story = {};
