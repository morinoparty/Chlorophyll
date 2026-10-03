import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, PlusIcon, SparklesIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { css, cva, cx } from "styled-system/css";

/**
 * Pill Gloss: 完全な角丸(pill)+ 縦グラデーション + 上側のツヤ + パレット色のグロー影。
 *
 * APCA(apca-w3 の calcAPCA)計測値。トークンは storybook/styled-system/tokens の light ランプ(oklch)から解決。
 * ツヤ(::before)は白の半透明を sRGB で合成した色で計測している。ツヤは高さ 40% で消えるため、
 * ラベル上端(lg で高さ約 32%)に掛かるのは最大でも白 5% 程度。
 *
 * primary(colorPalette.contrast = 白 / solid.emphasized → solid.active のグラデーション)
 *   mori: 上端 Lc 85.2 / 下端 89.0 / ラベル上端(ツヤ合成)83.5 / ラベル中心 87.3 / hover 84.9〜88.3 / active 89.0
 *   umi : 上端 Lc 84.4 / 下端 88.1 / ラベル上端 82.5 / ラベル中心 86.2 / hover 84.0〜87.4 / active 88.1
 *   red : 上端 Lc 74.5 / 下端 80.6 / ラベル上端 74.4 / ラベル中心 77.5 / hover 76.8〜79.3 / active 80.6
 *   → solid(9)始まりだと red は 66〜70 だったため、1 段濃い solid.emphasized から始めて本文目安 75 前後まで引き上げた
 * secondary(colorPalette.fg / bg.panel → colorPalette.surface.subtle)
 *   mori: 上端 Lc 82.1 / 下端 78.8 / hover・active(surface.subtle〜surface)74.6〜78.8
 *   umi : 上端 Lc 82.3 / 下端 78.7 / hover・active 74.6〜78.7
 *   red : 上端 Lc 81.8 / 下端 78.0 / hover・active 72.4〜78.0
 * plain(colorPalette.fg.muted = gray.11 / 透明)
 *   白の上 Lc 79.8 / colorPalette.bg の上 71.1〜71.8 / hover(colorPalette.fg on bg.panel)81.8〜82.3
 *   active(colorPalette.fg on surface.hover)66.2〜69.8
 * disabled(fg.disabled on bg.disabled)Lc 46.9 / plain の disabled(fg.disabled on 白)60.4・mori.bg 52.2
 * focus ring(colorPalette.focus.ring = solid)白 Lc 65.0〜73.7 / colorPalette.bg 56.2〜65.6
 */

// グレーの影ではなく solid 色を color-mix で透過させて落とし、colorPalette を切り替えると影の色味まで追従させる
// (該当する shadow トークンが無いため任意値)。
// hover / active の面の変化は、補間できない background-image ではなく inset の box-shadow で上塗りする。
// inset 影は背景の上・::before のツヤの下に描かれ、box-shadow なので transition で滑らかに変化する。
// Panda の静的抽出が効くよう文字列はリテラルで書き、補間できるよう各 intent で層の数と inset の有無を揃えている
const shadow = {
    // primary の通常時: 上塗りなし + 足元の締まった影 + ふんわり広がる色付きの影
    primary:
        "[inset 0 0 0 999px transparent, 0 1px 2px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 30%, transparent), 0 6px 16px -6px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 60%, transparent)]",
    // primary の hover: 面を solid.active 側へ寄せ、グローを一段広く・濃くして浮き上がらせる
    primaryHover:
        "[inset 0 0 0 999px color-mix(in oklab, var(--mpc-colors-color-palette-solid-active) 60%, transparent), 0 2px 4px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 30%, transparent), 0 12px 24px -6px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 75%, transparent)]",
    // primary の押下: 面を solid.active で塗りつぶし、影を縮めて沈み込ませる
    primaryActive:
        "[inset 0 0 0 999px color-mix(in oklab, var(--mpc-colors-color-palette-solid-active) 100%, transparent), 0 1px 1px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 35%, transparent), 0 2px 6px -3px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 50%, transparent)]",
    // secondary: 枠線は引かず、パレット色の淡い影だけで白い面の輪郭を出す
    secondary:
        "[inset 0 0 0 999px transparent, 0 1px 3px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 18%, transparent), 0 6px 14px -6px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 28%, transparent)]",
    // secondary の hover: 面を surface.subtle で塗り、グローを広げる
    secondaryHover:
        "[inset 0 0 0 999px color-mix(in oklab, var(--mpc-colors-color-palette-surface-subtle) 100%, transparent), 0 2px 4px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 18%, transparent), 0 12px 22px -6px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 36%, transparent)]",
    // secondary の押下: 面を surface まで沈め、影を縮める
    secondaryActive:
        "[inset 0 0 0 999px color-mix(in oklab, var(--mpc-colors-color-palette-surface) 100%, transparent), 0 1px 1px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 20%, transparent), 0 2px 6px -3px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 24%, transparent)]",
    // plain: 通常時は面も影も持たない(層の数は hover と揃えるため透明な影を置く)
    plain: "[inset 0 0 0 999px transparent, 0 0 0 0 transparent, 0 0 0 0 transparent]",
    // plain の hover: surface 系はページ地色(colorPalette.bg)とほぼ同じ明度で面が見えないため、
    // 白い面(bg.panel)をパレット色の淡い影で浮かせて「pill が浮き上がる」見せ方に揃える
    plainHover:
        "[inset 0 0 0 999px var(--mpc-colors-bg-panel), 0 1px 3px 0 color-mix(in oklab, var(--mpc-colors-color-palette-solid) 14%, transparent), 0 6px 14px -6px color-mix(in oklab, var(--mpc-colors-color-palette-solid) 24%, transparent)]",
    // plain の押下: 影を消して surface.hover の面へ沈める
    plainActive:
        "[inset 0 0 0 999px var(--mpc-colors-color-palette-surface-hover), 0 0 0 0 transparent, 0 0 0 0 transparent]",
} as const;

// hover / active は disabled のときに効かせない
const hover = "&:not(:disabled):not([data-disabled]):hover";
const active = "&:not(:disabled):not([data-disabled]):active";

// フォーカスリングは outline のロングハンドで明示する(recipes/shared/focus-ring.ts と同じ理由: #78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

export const pillGloss = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        // 高さに関係なく常に完全な半円になる pill 形状
        borderRadius: "full",
        fontWeight: "semibold",
        letterSpacing: "wide",
        // ::before のツヤを z-index: -1 で背景と文字の間に挟むため、ボタン自身を重なりの基準にする
        isolation: "isolate",
        position: "relative",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 2 段のパレット色を上→下に流す縦グラデーション。色は各 intent の gradientFrom / gradientTo で決める
        bgGradient: "to-b",
        // 面の変化は inset の box-shadow で行うため、補間できるプロパティだけを遷移させる
        transitionDuration: "normal",
        transitionProperty: "box-shadow, transform, color",
        transitionTimingFunction: "easeInOut",
        // 上側のツヤ。ボタン全面に重ねて角丸も継承し、左右に縁が出ないようにする。
        // 白 26% から高さ 40% で透明になるため、ラベル(上端は高さ約 32%)に掛かるのは白 5% 程度に留まる
        _before: {
            content: '""',
            position: "absolute",
            inset: "0",
            borderRadius: "inherit",
            bgImage: "[linear-gradient(to bottom, rgb(255 255 255 / 0.26), rgb(255 255 255 / 0) 40%)]",
            pointerEvents: "none",
            zIndex: -1,
            transitionProperty: "opacity",
            transitionDuration: "normal",
            transitionTimingFunction: "easeInOut",
        },
        // lucide のアイコンは現行 Button と同じく文字サイズに比例させ、線を少し太らせる
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: 0,
        },
        _focusVisible: focusRing,
        // 動きを減らす設定では浮き上がり(transform)を止め、影・色の変化だけを残す
        _motionReduce: {
            transitionProperty: "box-shadow, color",
            transform: "none !important",
        },
        _disabled: {
            cursor: "not-allowed",
            // 無効状態では立体感を消して「押せない平面」に見せる
            _before: { display: "none" },
        },
    },
    variants: {
        intent: {
            primary: {
                // solid(9)始まりだと red の白文字が Lc 66〜70 に落ちるため、1 段濃い solid.emphasized から始める。
                // 上端の明るさはツヤが補うので、見た目のトーンは solid とほぼ変わらない
                gradientFrom: "colorPalette.solid.emphasized",
                gradientTo: "colorPalette.solid.active",
                color: "colorPalette.contrast",
                boxShadow: shadow.primary,
                [hover]: {
                    boxShadow: shadow.primaryHover,
                    transform: "translateY(-1px)",
                },
                [active]: {
                    boxShadow: shadow.primaryActive,
                    transform: "translateY(0)",
                },
                _disabled: {
                    gradientFrom: "bg.disabled",
                    gradientTo: "bg.disabled",
                    color: "fg.disabled",
                    boxShadow: "none",
                },
            },
            secondary: {
                // 白からごく薄いパレット色へ流し、白い面でもパレットの気配を残す
                gradientFrom: "bg.panel",
                gradientTo: "colorPalette.surface.subtle",
                color: "colorPalette.fg",
                boxShadow: shadow.secondary,
                [hover]: {
                    boxShadow: shadow.secondaryHover,
                    transform: "translateY(-1px)",
                },
                [active]: {
                    boxShadow: shadow.secondaryActive,
                    transform: "translateY(0)",
                },
                _disabled: {
                    gradientFrom: "bg.disabled",
                    gradientTo: "bg.disabled",
                    color: "fg.disabled",
                    boxShadow: "none",
                },
            },
            plain: {
                // 面を持たないので透明。ツヤも hover で面が出たときだけ見せる
                gradientFrom: "transparent",
                gradientTo: "transparent",
                color: "colorPalette.fg.muted",
                boxShadow: shadow.plain,
                _before: { opacity: 0 },
                [hover]: {
                    color: "colorPalette.fg",
                    boxShadow: shadow.plainHover,
                    _before: { opacity: 1 },
                },
                [active]: {
                    color: "colorPalette.fg",
                    boxShadow: shadow.plainActive,
                },
                _disabled: {
                    color: "fg.disabled",
                },
            },
        },
        // 高さは sizes.control で現行 Button と揃え、デザイン案同士を同じ寸法で比べられるようにする。
        // pill は両端が丸く削れて文字が詰まって見えるため、横 padding は現行より半段広げる
        size: {
            sm: { height: "control.sm", px: "4", fontSize: "xs" },
            md: { height: "control.md", px: "5", fontSize: "sm" },
            lg: { height: "control.lg", px: "6", fontSize: "md" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

export interface PillGlossButtonProps extends ComponentProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
}

// 既存 Button と同じ props 形状(intent / size + button の属性)にして、比較用の一覧ストーリーから差し替えて使えるようにする。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う
export const PillGlossButton = ({ className, intent, size, type = "button", ...props }: PillGlossButtonProps) => {
    return <button type={type} {...props} className={cx(pillGloss({ intent, size }), className)} />;
};

const meta: Meta<typeof PillGlossButton> = {
    title: "LAB/Button Designs/Pill Gloss",
    component: PillGlossButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Pill Gloss** — 完全な角丸(pill)に、パレットの 2 段階(solid.emphasized → solid.active)の縦グラデーションと上側のツヤを重ね、",
                    "グレーではなくパレット色で染めたグロー影を落とす案です。hover で面が一段沈み、グローが広がって 1px 浮き上がります。押下では影が縮んで沈み込みます。枠線は使わず、影だけで輪郭を出します。",
                    "",
                    "- **強み**: 柔らかく親しみやすい印象と、ツヤによる上質感。影までパレットに追従するため mori / umi / red で色味が統一される。",
                    "- **トレードオフ**: 装飾が多く、密度の高い画面やテーブル内では主張が強すぎる。pill は角丸の Input / Select と形が揃わない。",
                    "  red の primary は 1 段濃い solid.emphasized から始めても白文字が Lc 74.5〜80 で、本文目安 75 ぎりぎり。",
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
        children: "Button",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof PillGlossButton>;

// ショーケースのレイアウト
const styles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    // グロー影が隣と重ならないよう、行の間隔は広めに取る
    row: css({ display: "flex", gap: "5", alignItems: "center", flexWrap: "wrap" }),
    // パレット追従を見せるための面。ページ地色(colorPalette.bg)を敷いて、実際の置き場所に近づける
    palette: css({
        display: "flex",
        flexDirection: "column",
        gap: "3",
        p: "6",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
};

const intents = ["primary", "secondary", "plain"] as const;
const sizes = ["sm", "md", "lg"] as const;

// intent × size × アイコン × disabled × パレットを一覧で並べたショーケース
export const Showcase: Story = {
    render: () => (
        <div className={styles.grid}>
            {intents.map((intent) => (
                <div key={intent} className={styles.section}>
                    <span className={styles.label}>{intent}</span>
                    <div className={styles.row}>
                        {sizes.map((size) => (
                            <PillGlossButton key={size} intent={intent} size={size}>
                                {size.toUpperCase()}
                            </PillGlossButton>
                        ))}
                        <PillGlossButton intent={intent}>
                            <PlusIcon />
                            新規作成
                        </PillGlossButton>
                        <PillGlossButton intent={intent}>
                            次へ
                            <ArrowRightIcon />
                        </PillGlossButton>
                    </div>
                </div>
            ))}

            <div className={styles.section}>
                <span className={styles.label}>disabled</span>
                <div className={styles.row}>
                    {intents.map((intent) => (
                        <PillGlossButton key={intent} intent={intent} disabled>
                            <HeartIcon />
                            {intent}
                        </PillGlossButton>
                    ))}
                </div>
            </div>

            {(["umi", "red"] as const).map((palette) => (
                <div key={palette} className={cx(css({ colorPalette: palette }), styles.palette)}>
                    <span className={styles.label}>colorPalette: {palette}</span>
                    <div className={styles.row}>
                        {intents.map((intent) => (
                            <PillGlossButton key={intent} intent={intent}>
                                <SparklesIcon />
                                {intent}
                            </PillGlossButton>
                        ))}
                        <PillGlossButton intent="primary" disabled>
                            disabled
                        </PillGlossButton>
                    </div>
                </div>
            ))}
        </div>
    ),
};

// コントロールから intent / size / disabled / ラベルを切り替えて単体で確認する
export const Playground: Story = {};
