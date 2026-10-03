import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, LeafIcon, PlusIcon, SproutIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx } from "styled-system/css";

/**
 * Leaf: 葉っぱの形をした非対称な角丸 + 左上から光が当たる柔らかな陰影 + hover で葉脈のような光が走るボタン。
 *
 * APCA(apca-w3 の APCAcontrast / sRGBtoY)計測値。トークンは storybook/styled-system/tokens の light ランプから
 * 解決し、color-mix は CSS と同じ補間空間(fg: oklch / bg・solid.active: oklab)で合成している。
 * 計測パイプラインは既存コメントの値(mori.9 on 白 73.7 / gray.9 on gray.4 46.9 / gray.11 on 白 79.8)で一致を確認済み。
 *
 * primary(colorPalette.contrast = 白 / solid → solid.emphasized の斜めグラデーション。明るい solid 側が最悪値。
 *   文字が乗る中央付近(solid と emphasized の中間)は mori 81.8 / umi 81.3 / red 72.3)
 *   mori: solid 79.1 / emphasized 84.5 / active 88.7
 *   umi : solid 78.5 / emphasized 84.0 / active 87.7
 *   red : solid 70.5 / emphasized 74.5 / active 80.6(目安 75 に届かないが下限 60 は満たす)
 * secondary(colorPalette.fg / bg.panel → colorPalette.surface.subtle。hover は surface.subtle → surface)
 *   mori: 白 82.1 / surface.subtle 78.8 / surface 74.4
 *   umi : 白 82.3 / surface.subtle 78.7 / surface 74.6
 *   red : 白 81.8 / surface.subtle 78.0 / surface 72.4
 * plain(colorPalette.fg.muted = gray.11。hover は colorPalette.fg on surface)
 *   白 79.8 / mori.bg 71.6 / umi.bg 71.8 / red.bg 71.2、hover は上の surface の値と同じ
 * secondary は枠線を持たず、輪郭は影(sm / hover md)だけで出す
 * disabled(fg.disabled = gray.9): bg.disabled(gray.4) 46.9 / 白 60.4 / mori.bg 52.2(目安 30 以上)
 * focus ring(colorPalette.focus.ring = step9): mori 白 73.7 / bg 65.5、umi 73.1 / 65.0、red 65.0 / 56.3(目安 45 以上)
 */
export const leafButtonStyle = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        fontWeight: "semibold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // ::before の光を背景より上・文字より下(z-index: -1)に描くため、ボタン自身でスタッキングコンテキストを作る
        position: "relative",
        isolation: "isolate",
        // 光の帯を葉の輪郭で切り抜く
        overflow: "hidden",
        // 角丸は size ごとに「左上・右下を大きく、右上・左下を小さく」して葉の形にする
        transitionProperty: "background-color, box-shadow, color, transform",
        transitionDuration: "normal",
        transitionTimingFunction: "easeInOut",
        // アイコンのサイズは既存の Button レシピと揃え、方向ごとの比較で差が出ないようにする
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
        },
        // hover で斜めに走る光の帯(葉の表面のツヤ)。初期位置は左外に置いて見せない
        _before: {
            content: '""',
            position: "absolute",
            inset: "0",
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: -1,
            transform: "translateX(-110%)",
            transitionProperty: "transform",
            // 離れたときは遷移させずに左外へ戻し、光が逆走して見えないようにする
            transitionDuration: "0s",
            transitionTimingFunction: "easeOut",
        },
        // hover で葉が少し持ち上がり、光の帯が右へ抜ける
        "&:not(:disabled):not([data-disabled]):hover": {
            transform: "translateY(-1px)",
            _before: {
                transform: "translateX(110%)",
                transitionDuration: "slower",
            },
        },
        // 押下中は持ち上がりを戻して、押し込んだ手応えを返す
        "&:not(:disabled):not([data-disabled]):active": {
            transform: "translateY(0)",
        },
        // フォーカスリングはロングハンドで明示する(shared/focus-ring.ts と同じ理由: #78)
        _focusVisible: {
            outlineStyle: "solid",
            outlineWidth: "focus.ring",
            outlineColor: "colorPalette.focus.ring",
            outlineOffset: "focus.ring.offset",
        },
        _disabled: {
            cursor: "not-allowed",
            // 無効状態ではグラデーションと光の帯を消し、平坦な面で「触れない」ことを伝える
            backgroundImage: "none",
            _before: {
                display: "none",
            },
        },
        // 動きを減らす設定では移動を止め、光の帯は走らせずに hover 中だけ静止して見せる
        _motionReduce: {
            transitionProperty: "background-color, box-shadow, color",
            "&:not(:disabled):not([data-disabled]):hover": {
                transform: "none",
                _before: {
                    transform: "none",
                    opacity: 1,
                    transitionDuration: "fast",
                },
            },
            "&:not(:disabled):not([data-disabled]):active": {
                transform: "none",
            },
            _before: {
                transform: "none",
                opacity: 0,
                transitionProperty: "opacity",
                transitionDuration: "fast",
            },
        },
    },
    variants: {
        intent: {
            primary: {
                color: "colorPalette.contrast",
                // 左上(光が当たる側)を solid、右下を一段濃い solid.emphasized にして、葉の丸みを陰影で出す
                bgGradient: "to-br",
                gradientFrom: "colorPalette.solid",
                gradientTo: "colorPalette.solid.emphasized",
                // 上辺ハイライト + 下辺の内側の影で、葉肉の厚みを感じさせる
                boxShadow: "md",
                _before: {
                    // 白の半透明の帯。z-index: -1 で文字の下に描くため、文字のコントラストは塗りの値のまま
                    backgroundImage:
                        "[linear-gradient(105deg, transparent 30%, rgb(255 255 255 / 0.24) 50%, transparent 70%)]",
                },
                _after: {
                    content: '""',
                    position: "absolute",
                    inset: "0",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    boxShadow: "inset.raised",
                },
                "&:not(:disabled):not([data-disabled]):hover": {
                    // hover は全体を一段濃くし、影を伸ばして浮き上がりを強める
                    gradientFrom: "colorPalette.solid.emphasized",
                    gradientTo: "colorPalette.solid.active",
                    boxShadow: "lg",
                    _after: {
                        boxShadow: "inset.raised.hover",
                    },
                },
                "&:not(:disabled):not([data-disabled]):active": {
                    gradientFrom: "colorPalette.solid.active",
                    gradientTo: "colorPalette.solid.active",
                    boxShadow: "sm",
                },
                _disabled: {
                    bg: "bg.disabled",
                    color: "fg.disabled",
                    boxShadow: "none",
                    _after: {
                        display: "none",
                    },
                },
            },
            secondary: {
                color: "colorPalette.fg",
                // 白い面の右下にだけパレット色をごく薄く差し、葉の裏側のような柔らかい陰影にする
                bgGradient: "to-br",
                gradientFrom: "bg.panel",
                gradientTo: "colorPalette.surface.subtle",
                // 枠線は使わず、輪郭は柔らかい影だけで出す
                boxShadow: "sm",
                _before: {
                    // 白地では白い光が見えないため、パレット色の半透明で光の帯を描く
                    backgroundImage:
                        "[linear-gradient(105deg, transparent 30%, var(--mpc-colors-color-palette-a3) 50%, transparent 70%)]",
                },
                "&:not(:disabled):not([data-disabled]):hover": {
                    gradientFrom: "colorPalette.surface.subtle",
                    gradientTo: "colorPalette.surface",
                    boxShadow: "md",
                },
                "&:not(:disabled):not([data-disabled]):active": {
                    gradientFrom: "colorPalette.surface",
                    gradientTo: "colorPalette.surface",
                    boxShadow: "xs",
                },
                _disabled: {
                    bg: "bg.panel",
                    color: "fg.disabled",
                    boxShadow: "none",
                },
            },
            plain: {
                bg: "transparent",
                color: "colorPalette.fg.muted",
                _before: {
                    backgroundImage:
                        "[linear-gradient(105deg, transparent 30%, var(--mpc-colors-color-palette-a3) 50%, transparent 70%)]",
                },
                "&:not(:disabled):not([data-disabled]):hover": {
                    // plain は持ち上げず、葉の形の面がふわっと現れるだけにとどめる
                    transform: "none",
                    bg: "colorPalette.surface",
                    color: "colorPalette.fg",
                },
                "&:not(:disabled):not([data-disabled]):active": {
                    bg: "colorPalette.surface.hover",
                },
                _disabled: {
                    color: "fg.disabled",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)で既存 Button と揃える。
        // 大きい角は隣の小さい角と足して辺の長さを超えないようにする(超えると全角が比例縮小して楕円になる)
        // sm / md: 24 + 2 = 26px、lg: 32 + 4 = 36px で、どれも高さに収まる
        size: {
            sm: {
                height: "control.sm",
                px: "{spacing.3.5}",
                fontSize: "xs",
                borderTopLeftRadius: "3xl",
                borderBottomRightRadius: "3xl",
                borderTopRightRadius: "xs",
                borderBottomLeftRadius: "xs",
            },
            md: {
                height: "control.md",
                px: "{spacing.4}",
                fontSize: "sm",
                borderTopLeftRadius: "3xl",
                borderBottomRightRadius: "3xl",
                borderTopRightRadius: "xs",
                borderBottomLeftRadius: "xs",
            },
            lg: {
                height: "control.lg",
                px: "{spacing.5}",
                fontSize: "md",
                borderTopLeftRadius: "4xl",
                borderBottomRightRadius: "4xl",
                borderTopRightRadius: "sm",
                borderBottomLeftRadius: "sm",
            },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

// 既存 Button と同じ props の形(intent / size)。
// storybook パッケージからは @ark-ui/react が解決できない(packages/react の node_modules にしか無い)ため、
// ark.button ではなくネイティブの <button> で組む。asChild 以外の振る舞いは同じ
export interface LeafButtonProps extends ComponentPropsWithoutRef<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
}

export const LeafButton = forwardRef<HTMLButtonElement, LeafButtonProps>(
    ({ className, intent, size, type = "button", ...props }, ref) => (
        <button ref={ref} type={type} className={cx(leafButtonStyle({ intent, size }), className)} {...props} />
    ),
);
LeafButton.displayName = "LeafButton";

const meta: Meta<typeof LeafButton> = {
    title: "LAB/Button Designs/Leaf",
    component: LeafButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Leaf** — 「Chlorophyll」と mori(森)パレットにちなんだ、葉っぱの形のボタン。",
                    "",
                    "- **コンセプト**: 左上・右下の角を大きく、右上・左下を小さくした非対称な角丸で葉の輪郭を作る。左上から光が当たる斜めグラデーションと内側のベベルで葉肉の厚みを出し、hover では葉脈のような光の帯が斜めに走る。",
                    "- **強み**: ライブラリ名とブランドに直結する個性があり、一目でこのデザインシステムだと分かる。形の非対称さが視線の流れ(左上→右下)を作り、CTA に向く。動きは控えめで、prefers-reduced-motion では静止したハイライトに切り替わる。",
                    "- **トレードオフ**: 非対称な角丸は Input / Select など他のコントロールと並べたときに浮きやすく、ButtonGroup のような連結表示とも相性が悪い。グラデーション + 光の帯は CSS が重く、red パレットの primary は Lc 70.5 で本文の目安 75 に届かない。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: {
            control: "select",
            options: ["primary", "secondary", "plain"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        disabled: { control: "boolean" },
    },
    args: {
        children: "葉を育てる",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof LeafButton>;

// ショーケースのレイアウト
const showcaseStyles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
    // パレット追従の確認用。colorPalette は静的な値で書き、Panda に抽出させる
    umi: css({ colorPalette: "umi", display: "flex", flexDirection: "column", gap: "3" }),
    red: css({ colorPalette: "red", display: "flex", flexDirection: "column", gap: "3" }),
};

const intents = ["primary", "secondary", "plain"] as const;
const sizes = ["sm", "md", "lg"] as const;

// intent ごとに sm / md / lg とアイコン付きを 1 行に並べる
const IntentRow = ({ intent }: { intent: (typeof intents)[number] }) => (
    <div className={showcaseStyles.row}>
        {sizes.map((size) => (
            <LeafButton key={size} intent={intent} size={size}>
                {size.toUpperCase()}
            </LeafButton>
        ))}
        <LeafButton intent={intent}>
            <SproutIcon />
            種をまく
        </LeafButton>
        <LeafButton intent={intent}>
            次へ
            <ArrowRightIcon />
        </LeafButton>
    </div>
);

// パレットを切り替えたときに塗り・文字・リングが追従するかを見る行
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        <LeafButton intent="primary">
            <PlusIcon />
            追加する
        </LeafButton>
        <LeafButton intent="secondary">
            <LeafIcon />
            詳細
        </LeafButton>
        <LeafButton intent="plain">キャンセル</LeafButton>
    </div>
);

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.grid}>
            {intents.map((intent) => (
                <div key={intent} className={showcaseStyles.section}>
                    <span className={showcaseStyles.label}>{intent}</span>
                    <IntentRow intent={intent} />
                </div>
            ))}

            <div className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {intents.map((intent) => (
                        <LeafButton key={intent} intent={intent} disabled>
                            <SproutIcon />
                            {intent}
                        </LeafButton>
                    ))}
                </div>
            </div>

            <div className={showcaseStyles.umi}>
                <span className={showcaseStyles.label}>colorPalette: umi</span>
                <PaletteRow />
            </div>

            <div className={showcaseStyles.red}>
                <span className={showcaseStyles.label}>colorPalette: red</span>
                <PaletteRow />
            </div>
        </div>
    ),
};

export const Playground: Story = {};
