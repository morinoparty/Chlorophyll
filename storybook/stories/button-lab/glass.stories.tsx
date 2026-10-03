import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, PlusIcon, SendIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { css, cva, cx } from "styled-system/css";

/**
 * LAB: Glass(すりガラス)方向のボタン
 *
 * 半透明の塗りの下を backdrop-filter の blur + saturate でぼかし、背景の色を「にじませて」透かす。
 * 縁には内側に 1px の光のヘアラインを、上半分にうっすらとした光沢(sheen)を重ね、外側にやわらかい影を落とす。
 *
 * 塗りが半透明なので、文字の Lc は「塗り × 背後の色」の合成結果で決まる。
 * そのため文字色はすべて不透明トークンにし、塗りの不透明度は「背後に置く色を colorPalette の step8 まで」
 * という前提で Lc 60 以上を満たすように決めた(背後に solid(step9)以上の濃い色を敷くと下回る)。
 *
 * APCA(apca-w3 の APCAcontrast / sRGBtoY)計測値。storybook の生成トークン(styled-system/tokens)から
 * 色を解決し、Panda の opacity modifier(color-mix in srgb)と同じ sRGB アルファ合成で計算した。
 * 背後の色: 白(bg.panel) / colorPalette.bg / step6 / step8(背景ブロブの最も濃い色)
 *   primary   : contrast(白) on solid.emphasized/88
 *                 mori 77.6 / 78.4 / 79.4 / 81.4、umi 77.1 / 77.6 / 78.8 / 80.5、red 69.3 / 69.9 / 71.2 / 73.0
 *               hover(solid.emphasized/94) mori 81.4〜 / umi 80.5〜 / red 72.2〜
 *               active(solid.active/94)    mori 85.2〜 / umi 84.3〜 / red 77.8〜
 *   secondary : colorPalette.fg on bg.panel/72
 *                 mori 82.0 / 79.8 / 74.4 / 67.3、umi 82.2 / 80.0 / 74.7 / 67.0、red 81.8 / 79.2 / 73.4 / 65.9
 *               hover(bg.panel/82) 最小 red step8 71.2
 *   plain     : colorPalette.fg on bg.panel/64
 *                 mori 82.0 / 79.2 / 72.2 / 63.2、umi 82.2 / 79.2 / 72.5 / 62.8、red 81.8 / 78.6 / 71.1 / 61.5
 *               hover(colorPalette.surface/86)        mori 75.4 / 74.5 / 72.1 / 68.1、red 73.8 / 72.3 / 69.6 / 65.9
 *               active(colorPalette.surface.hover/92) mori 70.6 / 69.9 / 68.5 / 66.4、red 67.1 / 66.5 / 64.7 / 62.7
 *   disabled  : fg.disabled(gray.9) on bg.muted/80   白 53.4 / bg 51.7〜51.9 / step6 47.5〜48.0 / step8 42.0〜43.0
 *   focus ring: colorPalette.focus.ring(step9) を bg.panel の白いハロー(offset ぶん)の外側に描くので、
 *               背後の色によらず常に白と接する。vs 白 mori 73.7 / umi 73.1 / red 65.0(参考: vs colorPalette.bg 65.5 / 65.0 / 56.0)
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)
const HOVER = "&:not(:disabled):not([data-disabled]):hover";
const ACTIVE = "&:not(:disabled):not([data-disabled]):active";

// すりガラスのぼかし。blurs トークンが無いため任意値で指定する。
// saturate で背後の色を少し鮮やかにし、ぼかしで濁らないようにする
const FROST = "[blur(14px) saturate(170%)]";

// 影は「フォーカスのハロー」と「浮き上がりの影」の 2 層を CSS 変数で合成する。
// hover / active のセレクタは :focus-visible より詳細度が高いため、box-shadow を直接上書きすると
// キーボードでフォーカスしたままマウスを乗せたときにハローが消えてしまう。変数に分けて互いに干渉しないようにする
const NO_SHADOW = "0 0 #0000";

// フォーカスリング。既存の focus-ring.ts と同じロングハンド構成に、
// offset ぶんの白いハロー(--glass-ring)を足す。ガラスの背後がどんな色でもリングが白と接するので Lc が安定する
const glassFocusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
    "--glass-ring": "0 0 0 {spacing.focus.ring.offset} {colors.bg.panel}",
} as const;

export const glassButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        borderRadius: "control",
        fontWeight: "semibold",
        letterSpacing: "wide",
        // 光沢(_before)を文字の背面・塗りの前面に置くため、スタッキングコンテキストを閉じる
        isolation: "isolate",
        position: "relative",
        overflow: "hidden",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        backdropFilter: FROST,
        // 既定値は var() のフォールバックで与える。base に変数を宣言すると variant 側の宣言と同じ詳細度になり、
        // どちらが勝つかが atomic クラスの出力順に依存してしまうため
        boxShadow: `var(--glass-ring, ${NO_SHADOW}), var(--glass-elev, ${NO_SHADOW})`,
        transitionDuration: "normal",
        transitionProperty: "background, box-shadow, transform",
        transitionTimingFunction: "easeInOut",
        // 上半分に白い光沢を差し、ガラスの表面に光が当たっている印象を出す。
        // z-index -1 で文字より後ろに置き、文字の Lc を変えない
        _before: {
            content: '""',
            position: "absolute",
            inset: "0",
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: -1,
            backgroundImage: "linear-gradient(to bottom, {colors.white/30}, transparent 55%)",
        },
        // 内側の光のヘアライン。上辺は少し強く、全周は弱く入れて、ガラスの縁の厚みを表現する
        _after: {
            content: '""',
            position: "absolute",
            inset: "0",
            borderRadius: "inherit",
            pointerEvents: "none",
            boxShadow: "[inset 0 1px 0 0 rgb(255 255 255 / 0.7), inset 0 0 0 1px rgb(255 255 255 / 0.32)]",
        },
        // アイコンは既存レシピと同じ比率で文字に合わせる
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
        },
        // hover でわずかに浮かせ、押下で沈める
        [HOVER]: {
            transform: "translateY(-1px)",
        },
        [ACTIVE]: {
            transform: "translateY(0) scale(0.98)",
        },
        // 動きを減らす設定では transform とその遷移を止め、色の変化だけで状態を伝える
        _motionReduce: {
            transitionProperty: "background, box-shadow",
            [HOVER]: { transform: "none" },
            [ACTIVE]: { transform: "none" },
        },
        _focusVisible: glassFocusRing,
        // 無効状態は intent によらず同じ「曇ったガラス」に揃える。
        // 白(bg.panel)の上でも形が残るよう、白ではなく bg.muted(gray.3)を 80% で敷く。
        // 文字は fg.disabled(背後 step8 まで Lc 42.0 以上)
        _disabled: {
            cursor: "not-allowed",
            bg: "bg.muted/80",
            color: "fg.disabled",
            "--glass-elev": NO_SHADOW,
            _before: { display: "none" },
        },
    },
    variants: {
        intent: {
            // 色付きガラス。solid より一段濃い solid.emphasized を 88% で敷き、
            // 白い背景の上に置いても白文字が Lc 69 以上(mori / umi は 77 以上)になるようにする
            primary: {
                bg: "colorPalette.solid.emphasized/88",
                color: "colorPalette.contrast",
                "--glass-elev": "{shadows.lg}",
                [HOVER]: {
                    bg: "colorPalette.solid.emphasized/94",
                    "--glass-elev": "{shadows.xl}",
                },
                [ACTIVE]: {
                    bg: "colorPalette.solid.active/94",
                    "--glass-elev": "{shadows.md}",
                },
            },
            // 白いすりガラス。背後の色が最も透ける見た目で、Glass らしさが一番出る intent
            secondary: {
                bg: "bg.panel/72",
                color: "colorPalette.fg",
                "--glass-elev": "{shadows.md}",
                [HOVER]: {
                    bg: "bg.panel/82",
                    "--glass-elev": "{shadows.lg}",
                },
                [ACTIVE]: {
                    bg: "bg.panel/88",
                    "--glass-elev": "{shadows.sm}",
                },
            },
            // 影と光沢を持たない薄いすりガラス。
            // 完全な透明にすると背後の色で文字が読めなくなるため、最低限の曇り(64%)を残す。
            // hover / active は白を濃くするだけだと白いパネル上で変化が見えないため、パレット色の面に切り替える
            plain: {
                bg: "bg.panel/64",
                color: "colorPalette.fg",
                _before: { display: "none" },
                [HOVER]: {
                    bg: "colorPalette.surface/86",
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface.hover/92",
                },
            },
        },
        // 高さは既存 Button と同じ sizes.control(sm 36 / md 40 / lg 44px)に揃え、他の方向と比較できるようにする
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

export interface GlassButtonProps extends ComponentProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
}

// 既存の Button と同じ props の形にし、一覧ストーリーから差し替えて並べられるようにする。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う
export const GlassButton = ({ className, intent, size, ...props }: GlassButtonProps) => {
    return <button type="button" {...props} className={cx(glassButton({ intent, size }), className)} />;
};

// ---- ストーリー用のレイアウト ----

const styles = {
    columns: css({
        display: "grid",
        gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
        gap: "6",
        w: "full",
    }),
    fullWidth: css({ w: "full" }),
    // ガラスを判定するための色付き背景。ブロブは「背後は step8 まで」という前提に合わせ、
    // 輪郭のはっきりした図形にして、ぼかしが効いていることを見て取れるようにする
    backdrop: css({
        position: "relative",
        overflow: "hidden",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
    // padding は 1 つのクラスに決め打ちし、atomic クラスが 2 つ重なって優先順位が CSS の並び順に依存するのを避ける
    backdropPadLg: css({ p: "8" }),
    backdropPadSm: css({ p: "4" }),
    blob: css({
        position: "absolute",
        borderRadius: "full",
        pointerEvents: "none",
    }),
    stripes: css({
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        // 縞は不透明にして輪郭をはっきりさせ、ガラス越しにぼけて見えることを確認しやすくする
        backgroundImage: "repeating-linear-gradient(135deg, {colors.colorPalette.6} 0 10px, transparent 10px 28px)",
    }),
    // 白いパネルの上。ガラスの効果が消えたときに、ボタンとしての輪郭が残るかを確認する
    panel: css({
        borderRadius: "panel",
        bg: "bg.panel",
        boxShadow: "raised",
        p: "8",
    }),
    content: css({
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "6",
        alignItems: "flex-start",
    }),
    heading: css({ fontSize: "md", fontWeight: "bold", color: "colorPalette.fg" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
    paletteRow: css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "1fr 1fr" }, gap: "4" }),
    umi: css({ colorPalette: "umi" }),
    red: css({ colorPalette: "red" }),
};

// 色付きの背景。colorPalette を参照するので、umi / red のラッパーの中では背景もそのパレットに追従する
const Backdrop = ({ children, padding = "8" }: { children: ReactNode; padding?: "4" | "8" }) => (
    <div className={cx(styles.backdrop, padding === "4" ? styles.backdropPadSm : styles.backdropPadLg)}>
        <div className={styles.stripes} />
        <div className={cx(styles.blob, css({ bg: "colorPalette.8", w: "56", h: "56", top: "-12", left: "-10" }))} />
        <div className={cx(styles.blob, css({ bg: "colorPalette.7", w: "40", h: "40", top: "24", right: "12" }))} />
        {/* secondary / plain の行の背後にも濃い面を通し、白いガラスの透け方を最も厳しい条件(step8)で見られるようにする */}
        <div className={cx(styles.blob, css({ bg: "colorPalette.8", w: "48", h: "48", top: "44%", left: "28%" }))} />
        <div
            className={cx(
                styles.blob,
                css({ bg: "colorPalette.surface.hover", w: "72", h: "72", bottom: "-24", left: "40%" }),
            )}
        />
        <div className={styles.content}>{children}</div>
    </div>
);

const intents = ["primary", "secondary", "plain"] as const;
const sizes = ["sm", "md", "lg"] as const;

// intent × size、アイコン付き、無効状態を並べる共通のマトリクス
const Matrix = () => (
    <>
        {intents.map((intent) => (
            <div key={intent} className={styles.section}>
                <span className={styles.label}>{intent}</span>
                <div className={styles.row}>
                    {sizes.map((size) => (
                        <GlassButton key={size} intent={intent} size={size}>
                            {size.toUpperCase()}
                        </GlassButton>
                    ))}
                    <GlassButton intent={intent}>
                        <ArrowLeftIcon />
                        戻る
                    </GlassButton>
                    <GlassButton intent={intent}>
                        次へ
                        <ArrowRightIcon />
                    </GlassButton>
                </div>
            </div>
        ))}
        <div className={styles.section}>
            <span className={styles.label}>disabled</span>
            <div className={styles.row}>
                {intents.map((intent) => (
                    <GlassButton key={intent} intent={intent} disabled>
                        <PlusIcon />
                        {intent}
                    </GlassButton>
                ))}
            </div>
        </div>
    </>
);

// パレット追従を見るための 1 行。背景ごと colorPalette を切り替える
const PaletteRow = () => (
    <Backdrop padding="4">
        <div className={styles.row}>
            <GlassButton intent="primary">
                <SendIcon />
                送信
            </GlassButton>
            <GlassButton intent="secondary">
                <HeartIcon />
                お気に入り
            </GlassButton>
            <GlassButton intent="plain">キャンセル</GlassButton>
        </div>
    </Backdrop>
);

const meta: Meta<typeof GlassButton> = {
    title: "LAB/Button Designs/Glass",
    component: GlassButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Glass(すりガラス)**: 半透明の塗りの下を `backdrop-filter: blur() saturate()` でぼかし、背景の色をにじませて透かすボタン。縁に 1px の光のヘアライン、上半分に光沢、外側にやわらかい影を重ねる。",
                    "",
                    "- **強み**: 写真やグラデーション、ブランド色の面の上に置いても背景と馴染み、軽やかで現代的な印象になる。primary も色付きガラスなので、面の色と喧嘩しにくい。",
                    "- **トレードオフ**: 文字の読みやすさが背後の色に左右される。Lc 60 以上は「背後は colorPalette の step8 まで」という前提で保証しており、それより濃い面に置くと下がる。白いパネルの上ではガラスらしさがほぼ消え、secondary / plain の区別は影とヘアラインだけになる。backdrop-filter は描画コストが高く、大量に並べる用途や低スペック端末には向かない。plain は完全な透明にできない(最低限の曇りが必要)。",
                    "- **アクセシビリティ**: 文字色はすべて不透明トークン。フォーカスリングは白いハローの外側に描き、背後の色によらず Lc 65 以上を保つ。prefers-reduced-motion では浮き沈みの transform を止める。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: intents },
        size: { control: "select", options: sizes },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ボタン",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof GlassButton>;

// 色付き背景と白いパネルの両方に同じマトリクスを並べ、ガラスの効き方と素の輪郭を比較する
export const Showcase: Story = {
    render: () => (
        <div className={styles.content}>
            <div className={styles.columns}>
                <Backdrop>
                    <span className={styles.heading}>On colorful backdrop</span>
                    <Matrix />
                </Backdrop>
                <div className={styles.panel}>
                    <div className={styles.content}>
                        <span className={styles.heading}>On bg.panel</span>
                        <Matrix />
                    </div>
                </div>
            </div>
            <div className={cx(styles.section, styles.fullWidth)}>
                <span className={styles.label}>palette: umi / red</span>
                <div className={styles.paletteRow}>
                    <div className={styles.umi}>
                        <PaletteRow />
                    </div>
                    <div className={styles.red}>
                        <PaletteRow />
                    </div>
                </div>
            </div>
        </div>
    ),
};

// 1 つのボタンを controls で操作する。ガラスの見え方が分かるよう色付き背景の上に置く
export const Playground: Story = {
    render: (args) => (
        <Backdrop>
            <GlassButton {...args} />
        </Backdrop>
    ),
};
