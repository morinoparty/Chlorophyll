import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, PlusIcon, SendIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { css, cva, cx } from "styled-system/css";

/**
 * LAB: Pressable(押せるキー)方向のボタン
 *
 * 面(face)の下に一段濃い「側面(edge)」を box-shadow の 0 ぼかしで描き、物理キーのような厚みを出す。
 * edge の下には柔らかい接地影を重ね、枠線を使わずに面と地色を分離する。
 * hover で 2px 持ち上がり、押下で面が edge の厚みぶん沈み込む。disabled は「押し込まれたまま」の平らなキーにする。
 *
 * APCA(apca-w3 calcAPCA)計測値。storybook の生成トークン(styled-system/styles.css)から解決した色で計算
 *   primary   : contrast(白) on solid(step9)               mori 79.1 / umi 78.5 / red 70.5
 *               contrast(白) on solid.emphasized(押下中)    mori 84.5 / umi 84.0 / red 74.5
 *               edge(step10 + step12 45%) vs 面(step9)      mori 13.0 / umi 12.5 / red 15.5(旧 solid.active は約 8)
 *               edge vs colorPalette.bg mori 80.4 / umi 79.5 / red 73.7、vs 白 88.6 / 87.5 / 82.4
 *   secondary : colorPalette.fg on bg.panel(白)             mori 82.1 / umi 82.3 / red 81.8
 *               colorPalette.fg on surface.subtle(hover)   mori 78.8 / umi 78.7 / red 78.0
 *               colorPalette.fg on surface(押下)            mori 74.6 / umi 74.6 / red 72.4
 *               edge(step8 + step9 50%) vs colorPalette.bg mori 52.9 / umi 52.5 / red 49.2、vs 白 61.1 / 60.6 / 57.9
 *   plain     : fg.muted(gray.11) on 白 79.8 / on colorPalette.bg 71.2〜71.8
 *               colorPalette.fg on surface.subtle(hover) 78.0〜78.8 / on surface(押下) 72.4〜74.6
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9 / plain の fg.disabled on 白 60.4、on colorPalette.bg 51.7〜52.4
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0、vs colorPalette.bg 65.5 / 65.0 / 56.3
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)
const HOVER = "&:not(:disabled):not([data-disabled]):hover";
const ACTIVE = "&:not(:disabled):not([data-disabled]):active";

// 接地影。edge の色を薄めた柔らかい影を edge のさらに下に落とし、地色の上で面が浮いて見えるようにする。
// 影の y オフセットは edge の厚み(引数)に追従させ、持ち上げ・押下で影も一緒に伸び縮みさせる
const groundShadow = (depth: string, blur: string) =>
    `0 calc(${depth} + 2px) ${blur} -2px color-mix(in oklab, var(--pressable-edge) 45%, transparent)`;

// edge は 0 ぼかしの box-shadow 1 本で描く。厚み(--pressable-depth)と色(--pressable-edge)を変数に逃がし、
// size と intent がそれぞれ片方だけを差し替えれば済むようにする
const EDGE_REST = `0 var(--pressable-depth) 0 0 var(--pressable-edge), ${groundShadow("var(--pressable-depth)", "6px")}`;
// hover では持ち上がった 2px ぶん edge を伸ばし、edge の下端(=接地点)を動かさない
const EDGE_HOVER = `0 calc(var(--pressable-depth) + 2px) 0 0 var(--pressable-edge), ${groundShadow("calc(var(--pressable-depth) + 2px)", "10px")}`;
// 押下中は edge をほぼ潰し、接地影も消して底まで押し込まれたように見せる
const EDGE_PRESSED = "0 1px 0 0 var(--pressable-edge)";

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// disabled 共通: 押し込まれたまま戻らないキーとして、edge と影を消し、面を edge の厚みぶん沈めた位置に置く。
// 沈めた位置は押下時と同じ接地点なので、並んだ有効なボタンと下端が揃う(静的な位置なので motion 設定に関係なく適用)
const pressedFlat = {
    boxShadow: "none",
    transform: "translateY(var(--pressable-depth))",
} as const;

export const pressableButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        borderRadius: "control",
        // キーらしい手触りを出すため、既存 Button(semibold)より一段太くする
        fontWeight: "bold",
        letterSpacing: "wide",
        position: "relative",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // edge は box-shadow なのでレイアウト上の高さを持たない。
        // 下に並ぶ要素と edge が重ならないよう、厚みぶんの余白を確保する
        marginBlockEnd: "[var(--pressable-depth)]",
        boxShadow: EDGE_REST,
        transitionProperty: "transform, box-shadow, background, color",
        transitionDuration: "fast",
        transitionTimingFunction: "easeOut",
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
        },
        // 移動(transform)は「動きを減らす」設定のときは付けない。
        // その場合も edge の伸縮と色の変化は残るので、押した手応えは伝わる
        [HOVER]: {
            boxShadow: EDGE_HOVER,
            _motionSafe: { transform: "translateY(-2px)" },
        },
        [ACTIVE]: {
            boxShadow: EDGE_PRESSED,
            // 押した瞬間は遅延を感じさせないよう、戻りより速く沈める
            transitionDuration: "fastest",
            _motionSafe: { transform: "translateY(calc(var(--pressable-depth) - 1px))" },
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                // solid.active(約 Lc 8)では面と側面が溶けるため、step10 に step12 を 45% 混ぜてもう一段沈める(面との差 Lc 13〜15)
                "--pressable-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                [ACTIVE]: {
                    bg: "colorPalette.solid.emphasized",
                },
                _disabled: {
                    bg: "bg.disabled",
                    color: "fg.disabled",
                    ...pressedFlat,
                },
            },
            secondary: {
                bg: "bg.panel",
                color: "colorPalette.fg",
                // 枠線は使わず、白い面の輪郭は edge と接地影で出す。
                // step8 単体では colorPalette.bg に対して Lc 38 と弱いので、step9 を半分混ぜて Lc 49〜53 まで上げる
                "--pressable-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-8), var(--mpc-colors-color-palette-9) 50%)",
                [HOVER]: {
                    bg: "colorPalette.surface.subtle",
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface",
                },
                _disabled: {
                    bg: "bg.disabled",
                    color: "fg.disabled",
                    ...pressedFlat,
                },
            },
            plain: {
                bg: "transparent",
                color: "colorPalette.fg.muted",
                // plain は厚みを持たない(厚みの 0 指定は size より後に効かせるため compoundVariants 側)。
                // 押下時の 1px 沈み込みだけで同じ系統の手触りを揃える
                "--pressable-edge": "transparent",
                boxShadow: "none",
                marginBlockEnd: "0",
                [HOVER]: {
                    // 押下の surface より一段明るい面にして、hover と押下を色でも区別する
                    bg: "colorPalette.surface.subtle",
                    color: "colorPalette.fg",
                    boxShadow: "none",
                    // 厚みの無い面が浮くと不自然なので、hover では持ち上げない
                    _motionSafe: { transform: "none" },
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface",
                    color: "colorPalette.fg",
                    boxShadow: "none",
                    _motionSafe: { transform: "translateY(1px)" },
                },
                _disabled: {
                    color: "fg.disabled",
                },
            },
        },
        // 面の高さは既存 Button と同じ control.sm/md/lg に揃え、edge の厚みはその外側に足す
        size: {
            sm: { height: "control.sm", px: "{spacing.3.5}", fontSize: "xs", "--pressable-depth": "3px" },
            md: { height: "control.md", px: "{spacing.4}", fontSize: "sm", "--pressable-depth": "4px" },
            lg: { height: "control.lg", px: "{spacing.5}", fontSize: "md", "--pressable-depth": "4px" },
        },
    },
    // plain は size より後に厚みを 0 にしたいので、compoundVariants で size の指定を上書きする
    compoundVariants: [
        {
            intent: "plain",
            size: ["sm", "md", "lg"],
            css: { "--pressable-depth": "0px" },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

export interface PressableButtonProps extends ComponentProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
}

// 既存 Button と同じ props の形にして、比較用の一覧ストーリーから差し替えて並べられるようにする。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う
export const PressableButton = ({ className, intent, size, ...props }: PressableButtonProps) => {
    return <button type="button" {...props} className={cx(pressableButton({ intent, size }), className)} />;
};

const meta: Meta<typeof PressableButton> = {
    title: "LAB/Button Designs/Pressable",
    component: PressableButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Pressable** — 面の下に一段濃い「側面」を持たせた、物理キーのようなボタン。",
                    "枠線は使わず、側面と柔らかい接地影で面を浮かせます。hover で 2px 持ち上がり、押すと側面の厚みぶん沈み込みます。",
                    "disabled は「押し込まれたまま」の平らなキーになります。",
                    "",
                    "- 強み: 押せることが一目で分かり、押した手応えが気持ちいい。遊び心のあるトーンを出しやすい。",
                    "- 強み: 影のぼかしに頼らないので、濃い面でも白い面でも立体感がはっきりする。",
                    "- トレードオフ: 側面ぶん(3〜4px)見た目の高さが増え、Select などと並べると下端が揃わない。",
                    "- トレードオフ: 主張が強く、画面に多く並べるとうるさくなる。業務画面のような密度の高い UI には不向き。",
                    "- トレードオフ: フォーカスリングは面の外周に沿うため、下辺では側面と重なる。",
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
        children: "つづける",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof PressableButton>;

// 一覧表示用のレイアウト
const styles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
    // パレット追従を見せるため、地色ごと colorPalette を切り替える
    umi: css({ colorPalette: "umi", bg: "colorPalette.bg", p: "4", borderRadius: "panel" }),
    red: css({ colorPalette: "red", bg: "colorPalette.bg", p: "4", borderRadius: "panel" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent ごとに sm / md / lg を 1 行に並べる
const IntentRow = ({ intent }: { intent: (typeof INTENTS)[number] }) => (
    <div className={styles.row}>
        {SIZES.map((size) => (
            <PressableButton key={size} intent={intent} size={size}>
                {size.toUpperCase()}
            </PressableButton>
        ))}
        <PressableButton intent={intent}>
            <PlusIcon />
            追加する
        </PressableButton>
        <PressableButton intent={intent}>
            つづける
            <ArrowRightIcon />
        </PressableButton>
    </div>
);

export const Showcase: Story = {
    render: () => (
        <div className={styles.grid}>
            {INTENTS.map((intent) => (
                <div key={intent} className={styles.section}>
                    <span className={styles.label}>{intent}</span>
                    <IntentRow intent={intent} />
                </div>
            ))}

            <div className={styles.section}>
                <span className={styles.label}>disabled</span>
                <div className={styles.row}>
                    {INTENTS.map((intent) => (
                        <PressableButton key={intent} intent={intent} disabled>
                            <SendIcon />
                            {intent}
                        </PressableButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>colorPalette: umi</span>
                <div className={cx(styles.row, styles.umi)}>
                    {INTENTS.map((intent) => (
                        <PressableButton key={intent} intent={intent}>
                            <HeartIcon />
                            {intent}
                        </PressableButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>colorPalette: red</span>
                <div className={cx(styles.row, styles.red)}>
                    {INTENTS.map((intent) => (
                        <PressableButton key={intent} intent={intent}>
                            <HeartIcon />
                            {intent}
                        </PressableButton>
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const Playground: Story = {};
