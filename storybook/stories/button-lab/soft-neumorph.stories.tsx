import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, PlusIcon, SparklesIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { css, cva, cx } from "styled-system/css";

/**
 * LAB: Soft Neumorph(アクセシブルなニューモーフィズム)方向のボタン
 *
 * ボタンの面をページの地色(colorPalette.bg)と同じ色にし、左上に白いハイライト・右下にパレットの影を
 * 落とす「二重の影」で、地面から押し出されたように見せる。枠線は使わない。
 * primary は地色の縁(rim)を残したまま中央だけを solid で塗り、「押し出した台座に色のキャップを載せた」形にする。
 * 押下中は外側の影が内側(inset)に反転し、面が地面へ沈み込む。disabled は影を消して平らにする。
 *
 * ニューモーフィズムは「形の輪郭が低コントラスト」になるのが弱点なので、次の 3 点で補う:
 *   - 文字は地色に溶けない colorPalette.fg / colorPalette.12 を使い、形が見えなくてもラベルで押せる場所が分かるようにする
 *   - 押下中は文字を step12 に沈め、内側の影が文字の下に入り込んでも Lc 70 を割らないようにする
 *   - フォーカスリングは影とは別に outline で描き、地色の上でも Lc 45 以上を保つ
 *
 * APCA(apca-w3 calcAPCA)計測値。styled-system/styles.css のトークン値(oklch)を sRGB に解決して計算
 *   primary   : contrast(白) on solid(step9)                 mori 79.1 / umi 78.5 / red 70.5
 *               hover  : 白 on solid.emphasized(step10)       mori 84.5 / umi 84.0 / red 74.5
 *               active : 白 on solid.active                    mori 88.7 / umi 87.7 / red 80.6
 *                        内側の影(step12 25%)が重なる最悪値   mori 92.3 / umi 91.2 / red 86.1(暗くなる方向なので上がる)
 *               キャップ上部のつや(白 18% → 38% で消える)は文字の帯に掛からない。掛かった場合の上限(白 3%)でも
 *               mori 77.4 / umi 76.8 / red 69.0
 *   secondary : LABEL(fg + step12 35%) on 地色(凸面の最も暗い端) mori 79.8 / umi 79.4 / red 78.4
 *               on 白(bg.panel)                                mori 88.1 / umi 87.5 / red 87.1
 *               (colorPalette.fg のままだと地色の上で 73.8 / 74.2 / 73.1 と目安 75 に届かなかった)
 *   active    : colorPalette.12 on 地色                         mori 89.6 / umi 88.2 / red 87.1
 *               内側の影(step12 12%)が文字の下に入った最悪値 mori 75.3 / umi 74.1 / red 73.2
 *               (fg のままだと同条件で 55 前後まで落ちるため、押下中だけ step12 に沈める)
 *   plain     : secondary と同じ LABEL を使うので同値(地色 78.4〜79.8 / 白 87.1〜88.1)
 *   disabled  : fg.disabled(gray.9) on 地色 mori 52.2 / umi 52.4 / red 51.7、on 白 60.4
 *               primary の中央 bg.disabled(gray.4)の上 46.9(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs 地色 mori 65.5 / umi 65.0 / red 56.3、vs 白 73.7 / 73.1 / 65.0
 *   形の輪郭  : 面と地色は同色(Lc 0)。輪郭は影だけで伝わるので、意味を担わせない(トレードオフ参照)
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)。
// data-preview は Showcase で hover / active の段を静止状態のまま並べて見比べるためのフック
// hover は押下中(:active)を除外し、hover の浮き上がり(-1px)が押下の沈み込み(+1px)を打ち消さないようにする
const HOVER = "&:not(:disabled):not([data-disabled]):not(:active):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// 押し出しの面の色(=ページの地色)。面と地色を同じにするのがニューモーフィズムの前提
const SURFACE = "var(--mpc-colors-color-palette-bg)";

// 影の距離(--neu-d)とぼかし(--neu-blur)は size から差し替える。
// 左上は白いハイライト、右下はパレットの最も深い色(step12)を薄めた影にして、パレットに色味を追従させる
const LIGHT = "color-mix(in oklab, white 88%, transparent)";
const DARK = "color-mix(in oklab, var(--mpc-colors-color-palette-12) 24%, transparent)";
const NEG_D = "calc(var(--neu-d) * -1)";

// 静止時: 面が地面から押し出されて見える外側の二重の影
const RAISED = `${NEG_D} ${NEG_D} var(--neu-blur) ${LIGHT}, var(--neu-d) var(--neu-d) var(--neu-blur) ${DARK}`;
// hover: 影の距離とぼかしを 1.5 倍にして、面がもう一段せり上がったように見せる
const RAISED_HOVER = `calc(var(--neu-d) * -1.5) calc(var(--neu-d) * -1.5) calc(var(--neu-blur) * 1.5) ${LIGHT}, calc(var(--neu-d) * 1.5) calc(var(--neu-d) * 1.5) calc(var(--neu-blur) * 1.5) ${DARK}`;
// 押下: 影を内側に反転し、面が地面へ沈み込んだ凹みにする(影の向きも逆になる)
const INSET = `inset var(--neu-d) var(--neu-d) var(--neu-blur) ${DARK}, inset ${NEG_D} ${NEG_D} var(--neu-blur) ${LIGHT}`;

// primary の色キャップの上辺に入れる細いハイライトと、下辺の薄い陰(リップ)。塗りの面にも光源(左上)を揃え、
// キャップ自体がふっくら盛り上がった小石のように見せる
const CAP_HIGHLIGHT =
    "inset 0 1px 0 0 color-mix(in oklab, white 28%, transparent), inset 0 -2px 0 0 color-mix(in oklab, var(--mpc-colors-color-palette-12) 16%, transparent)";
// キャップ上部のつや。文字の帯(高さの 36〜64% 付近)に掛からないよう 38% で消し、白文字の Lc を落とさない
const CAP_GLOSS = "linear-gradient(180deg, color-mix(in oklab, white 18%, transparent), transparent 38%)";
// primary の縁(rim)。地色より明るい色にして、台座の縁が光を受けているように見せ「台座 + キャップ」の構造を読ませる
const RIM = "color-mix(in oklab, var(--mpc-colors-color-palette-bg), white 60%)";
// primary の押下時、色キャップだけが台座の中に沈んだように見せる内側の影
const CAP_PRESSED = "inset 2px 2px 5px 0 color-mix(in oklab, var(--mpc-colors-color-palette-12) 45%, transparent)";

// 凸面(ふくらんだ面)のグラデーション。光源側をわずかに明るくし、反対側は地色そのものに戻す。
// 文字の下で最も暗いのは地色なので、Lc は地色で計測した値が最悪値になる
const CONVEX = `linear-gradient(145deg, color-mix(in oklab, ${SURFACE}, white 30%), ${SURFACE})`;
// hover の凸面。光源側をさらに明るくして、影の深まりと合わせて「ふくらんだ」差をはっきりさせる
const CONVEX_HOVER = `linear-gradient(145deg, color-mix(in oklab, ${SURFACE}, white 55%), ${SURFACE})`;

// secondary / plain の静止時の文字色。colorPalette.fg のままだと地色の上で Lc 73〜74 と本文目安 75 に届かないため、
// step12 を 35% 混ぜて沈める(地色の上で Lc 78〜80)。パレットの色味は残る
const LABEL = "color-mix(in oklab, var(--mpc-colors-color-palette-fg), var(--mpc-colors-color-palette-12) 35%)";

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)。
// 影は低コントラストで輪郭を担えないため、フォーカスは必ず outline で別に描く
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// hover で 1px 浮かせる。影の深まりだけだと静止時との差が小さいため、位置でも「せり上がり」を伝える
const lift = {
    transform: "translateY(-1px)",
    _motionReduce: { transform: "none" },
} as const;

// 押下時にわずかに 1px 沈める。動きを減らす設定のユーザーには移動を無効化し、影の反転だけで伝える
const sink = {
    transform: "translateY(1px)",
    _motionReduce: { transform: "none" },
} as const;

// disabled 共通: 影を消して平らにし、地面と一体化した「押し出されていない」面にする
const flattened = {
    boxShadow: "none",
    backgroundImage: "none",
    color: "fg.disabled",
} as const;

export const softNeumorphButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        borderRadius: "control",
        // 枠線は使わず、影だけで形を出す(primary だけ地色の縁を border で描く)
        borderWidth: "0",
        borderStyle: "solid",
        borderColor: "transparent",
        fontWeight: "semibold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 影の色・ぼかしをなめらかに切り替える。動きを減らす設定では transform を対象から外す
        transitionProperty: "box-shadow, background-color, color, transform",
        transitionDuration: "normal",
        transitionTimingFunction: "easeInOut",
        _motionReduce: { transitionProperty: "box-shadow, background-color, color" },
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
            // 最も強い操作。地色の縁(rim)を残した台座の上に、solid の色キャップを載せる。
            // 縁は border で描くので、塗りは自動的に縁の内側だけに収まる
            primary: {
                borderWidth: "[var(--neu-rim)]",
                borderColor: RIM,
                bgColor: "colorPalette.solid",
                backgroundImage: CAP_GLOSS,
                color: "colorPalette.contrast",
                boxShadow: `${RAISED}, ${CAP_HIGHLIGHT}`,
                [HOVER]: {
                    bgColor: "colorPalette.solid.emphasized",
                    boxShadow: `${RAISED_HOVER}, ${CAP_HIGHLIGHT}`,
                    ...lift,
                },
                // 台座は押し出したまま、色キャップだけが沈む。外側の影も静止時へ戻して「押し込んだ」差を出す
                [ACTIVE]: {
                    bgColor: "colorPalette.solid.active",
                    backgroundImage: "none",
                    boxShadow: `${RAISED}, ${CAP_PRESSED}`,
                    ...sink,
                },
                // 縁は残して形を保ち、キャップをグレーの面に落としてパレットの色味を抜く
                _disabled: {
                    ...flattened,
                    borderColor: "colorPalette.bg",
                    bgColor: "bg.disabled",
                },
            },
            // 補助的な操作。地色と同じ色の凸面を押し出す、ニューモーフィズムの基本形
            secondary: {
                // bg(background ショートハンド)だとグラデーションを上書きし得るため、色はロングハンドで指定する
                bgColor: "colorPalette.bg",
                backgroundImage: CONVEX,
                color: LABEL,
                boxShadow: RAISED,
                [HOVER]: { backgroundImage: CONVEX_HOVER, boxShadow: RAISED_HOVER, ...lift },
                // 凹みでは内側の影が文字の下まで回り込むため、文字を step12 に沈めて Lc を確保する
                [ACTIVE]: {
                    backgroundImage: "none",
                    color: "colorPalette.12",
                    boxShadow: INSET,
                    ...sink,
                },
                _disabled: {
                    ...flattened,
                    bgColor: "colorPalette.bg",
                },
            },
            // 最も控えめな操作。静止時は地面と一体(影なし)で、hover で初めて押し出され、押下で凹む
            plain: {
                bgColor: "transparent",
                color: LABEL,
                boxShadow: "none",
                [HOVER]: {
                    bgColor: "colorPalette.bg",
                    backgroundImage: CONVEX,
                    boxShadow: RAISED,
                    ...lift,
                },
                [ACTIVE]: {
                    bgColor: "colorPalette.bg",
                    backgroundImage: "none",
                    color: "colorPalette.12",
                    boxShadow: INSET,
                    ...sink,
                },
                _disabled: {
                    ...flattened,
                    bgColor: "transparent",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)で他の方向性・既存 Button と揃える。
        // 影は高さの外側にはみ出すだけでレイアウトには影響しない。距離とぼかしは大きいボタンほど深くする
        size: {
            sm: {
                height: "control.sm",
                px: "{spacing.3.5}",
                fontSize: "xs",
                "--neu-d": "3px",
                "--neu-blur": "7px",
                "--neu-rim": "2px",
            },
            md: {
                height: "control.md",
                px: "{spacing.4}",
                fontSize: "sm",
                "--neu-d": "4px",
                "--neu-blur": "9px",
                "--neu-rim": "3px",
            },
            lg: {
                height: "control.lg",
                px: "{spacing.5}",
                fontSize: "md",
                "--neu-d": "5px",
                "--neu-blur": "11px",
                "--neu-rim": "3px",
            },
        },
        // 角の形。ニューモーフィズムらしい丸い小石の形(pill)も選べるようにする
        shape: {
            rounded: { borderRadius: "control" },
            pill: { borderRadius: "full" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "rounded",
    },
});

export interface SoftNeumorphButtonProps extends ComponentProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
    shape?: "rounded" | "pill";
}

// 既存 Button と同じ intent / size の props の形にして、比較用の一覧ストーリーから差し替えて並べられるようにする。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う
export const SoftNeumorphButton = ({ className, intent, size, shape, ...props }: SoftNeumorphButtonProps) => {
    return <button type="button" {...props} className={cx(softNeumorphButton({ intent, size, shape }), className)} />;
};

// 一覧表示用のレイアウト
const showcaseStyles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "6" }),
    // ニューモーフィズムの「地面」になるページの地色(colorPalette.bg)のセクション。
    // 影がはみ出す余白を確保するため、行間を広めに取る
    section: css({
        display: "flex",
        flexDirection: "column",
        gap: "5",
        p: "6",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
    // 白いパネル(bg.panel)のセクション。面と地色が一致しない場合の見え方(トレードオフ)を比べるために使う
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

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <SoftNeumorphButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </SoftNeumorphButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active の段を静止状態で並べる。凸 → 高い凸 → 凹 の切り替わりが見分けられるかを確認するため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <SoftNeumorphButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </SoftNeumorphButton>
                ))}
                <SoftNeumorphButton intent={intent} disabled>
                    {intent} disabled
                </SoftNeumorphButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <SoftNeumorphButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </SoftNeumorphButton>
        ))}
    </div>
);

const meta: Meta<typeof SoftNeumorphButton> = {
    title: "LAB/Button Designs/Soft Neumorph",
    component: SoftNeumorphButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Soft Neumorph** — ボタンの面をページの地色と同じ色にし、左上の白いハイライトと右下のパレット色の影の「二重の影」で、地面から押し出されたように見せるニューモーフィズムの方向性です。",
                    "primary は明るい縁(光を受けた台座)の中央に、上部につやのある solid の色キャップを載せます。hover で影が深くなり 1px 浮き上がり、押すと影が内側に反転して凹みます(動きを減らす設定では 1px の沈み込みを止め、影の反転だけで伝えます)。disabled は影を消して地面と一体の平らな面になります。",
                    "",
                    "- 強み: 柔らかく触りたくなる質感で、枠線を使わずに面の存在を出せます。「枠線は控えめ・柔らかい面」という方針と相性が良く、影の色に step12 を使うのでパレット(mori / umi / red)にも馴染みます。",
                    "- 強み: 凸 → 凹 の反転で「押した」状態が色に頼らず分かります。primary は色キャップのおかげで、ニューモーフィズムの弱点である「主操作が埋もれる」問題を避けています。",
                    "- 対策: 文字は colorPalette.fg に step12 を 35% 混ぜた色(地色の上で Lc 78〜80)、押下中は step12 に沈めて内側の影が文字の下に入っても Lc 73 以上を保ちます。フォーカスは影ではなく outline で描きます(地色の上で Lc 56〜66)。",
                    "- トレードオフ: 面と地色が同色(Lc 0)なので、形の輪郭は影だけが頼りです。白いパネルのように地色が違う場所では白いハイライトが消え、押し出しが半分しか見えません(Showcase の白いパネル参照)。地色の上に置く前提のデザインです。",
                    "- トレードオフ: 影がボタンの外側に 5〜8px はみ出すので、密に並べると影同士がぶつかります。ボタン同士の間隔を広め(gap 5 前後)に取る必要があります。red の primary は solid 自体の明るさで白文字が Lc 70.5 と、本文の目安 75 に届きません(既存 Button と共通の課題)。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        shape: { control: "select", options: ["rounded", "pill"] },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ボタンだよー",
        intent: "primary",
        size: "lg",
        shape: "rounded",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof SoftNeumorphButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
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
                    <SoftNeumorphButton>
                        <SparklesIcon />
                        はじめる
                    </SoftNeumorphButton>
                    <SoftNeumorphButton intent="secondary">
                        次へ
                        <ArrowRightIcon />
                    </SoftNeumorphButton>
                    <SoftNeumorphButton intent="plain">
                        <PlusIcon />
                        追加
                    </SoftNeumorphButton>
                    <SoftNeumorphButton shape="pill">
                        <HeartIcon />
                        いいね
                    </SoftNeumorphButton>
                    <SoftNeumorphButton intent="secondary" shape="pill">
                        <PlusIcon />
                        ふくらみ
                    </SoftNeumorphButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <SoftNeumorphButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </SoftNeumorphButton>
                    ))}
                </div>
            </section>
            {/* 面(地色)とパネルの色が一致しない場所での見え方。白いハイライトが消えることを確認する */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>
                    白いパネル(bg.panel)の上 — 面と地色が一致しないため押し出しが弱くなる
                </span>
                <PaletteRow />
            </section>
            {/* colorPalette を切り替えて、色キャップ・影・文字・フォーカスリングがパレットに追従することを確認する */}
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

// ニューモーフィズムは地色の上に置く前提なので、Playground はページの地色のセクションの中で描く
export const Playground: Story = {
    decorators: [
        (Story) => (
            <div className={showcaseStyles.section}>
                <div className={showcaseStyles.row}>
                    <Story />
                </div>
            </div>
        ),
    ],
};
