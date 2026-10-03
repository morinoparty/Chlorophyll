import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, FishIcon, HomeIcon, PlusIcon, TreesIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Wood Sign(木の看板)方向のボタン
 *
 * 木の板を釘で打ち付けた看板のようなボタン。どうぶつの森系の「のんびりした手作り感」を狙う方向性の 1 つ。
 * - 面: 2 本の repeating-linear-gradient を少し違う角度で重ね、細い木目を描く(木目は面を暗くする方向にしか効かせない)
 * - 下端: 0 ぼかしの box-shadow で一段濃い「切り口」を描き、板の厚みを出す。その下に茶色がかった柔らかい接地影
 * - 釘: ::before / ::after で左上・右上に小さな釘頭を打つ(装飾なので支援技術には出ない)
 * - 動き: hover で ±1.5deg だけ傾いて少し膨らむ(隣り合う看板は逆向きに傾く)。押下で縦に潰れて横に広がる(squash)。
 *   いずれも少しオーバーシュートするバネ風の cubic-bezier で、prefers-reduced-motion では transform を付けない
 *
 * primary は colorPalette の色でペンキを塗った板、secondary は塗っていない明るい白木、plain は彫り込まれた文字だけ。
 *
 * APCA(apca-w3 の APCAcontrast。styled-system のトークンを sRGB に解決して算出)
 *   木目は「面より暗い半透明の線」を 2 本重ねるだけなので、文字の下で最も悪いのは
 *   primary(白文字)では木目の無い素の面、secondary(濃い文字)では 2 本の木目が重なった最も暗い点になる
 *   primary   : colorPalette.contrast(白) on solid(step9)   mori 79.1 / umi 78.5 / red 70.5
 *               木目の重なり(黒 約 17%)の上では            mori 87.3 / umi 87.0 / red 80.8
 *               hover / active(solid.emphasized = step10)   mori 84.5 / umi 84.0 / red 74.5
 *   secondary : colorPalette.12 on 白木 #F4DCB0             mori 78.9 / umi 77.4 / red 76.8(木目無し)
 *               木目が重なった最暗点(焦げ茶 約 13.5%)       mori 69.3 / umi 67.8 / red 67.2
 *               押下(#EFD5A6 + 木目の最暗点)               mori 66.1 / umi 64.5 / red 64.0
 *               ※ 最暗点は 1〜2px の細線だけ。colorPalette.fg だと最暗点で Lc 51 前後まで落ちるため、文字は step12 まで沈めている
 *   plain     : colorPalette.fg on 白 mori 82.1 / umi 82.3 / red 81.8、on colorPalette.bg 73.8 / 74.2 / 73.1
 *               hover(淡い白木 #F7E8CC)                     mori 69.3 / umi 69.5 / red 69.0
 *               押下は白木 #F4DCB0 + colorPalette.12 で secondary の静止(木目無し)と同値
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) Lc 46.9(木目は外す)
 *               plain の fg.disabled on 白 60.4 / on colorPalette.bg 52.2 前後(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0
 *               vs colorPalette.bg mori 65.5 / umi 65.0 / red 56.3(リングは面の外側に出るので地色と比べる)
 *   切り口    : primary(step10 + step12 45%) vs colorPalette.bg mori 80.4 / umi 79.5 / red 73.7
 *               白木の切り口 #A9773F vs colorPalette.bg 57.5〜58.1 / vs 白 66.2
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)
const HOVER = "&:not(:disabled):not([data-disabled]):hover";
const ACTIVE = "&:not(:disabled):not([data-disabled]):active";

// どうぶつの森系の「ぽよん」とした手触りを出すため、終点を少し行き過ぎてから戻るバネ風のイージング
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// 丸ゴシック。preview-head.html で読み込み済みの M PLUS Rounded 1c を使う
const ROUNDED_FONT = "'M PLUS Rounded 1c', sans-serif";

// 木目。少しだけ角度の違う 2 本の縞を重ね、手で挽いた板のような不揃いさを出す。
// 線の色は intent ごとに --wood-grain で差し替える(どちらも面より暗い色にして、文字の下の最悪値を計算しやすくする)
// 右下には小さな「節(ふし)」を 1 つだけ置く。文字・末尾アイコンより下の余白に収まる位置に固定している
const WOOD_GRAIN = [
    "radial-gradient(ellipse 10px 4px at calc(100% - 15px) 80%, transparent 0 40%, var(--wood-grain) 48% 72%, transparent 80%)",
    "repeating-linear-gradient(176deg, transparent 0 5px, var(--wood-grain) 5px 6px, transparent 6px 11px)",
    "repeating-linear-gradient(183deg, transparent 0 9px, var(--wood-grain) 9px 11px, transparent 11px 19px)",
].join(", ");

// 板の立体感を box-shadow 1 本の宣言にまとめる
//   1. 上辺の細いハイライト(板の角が光を受けている)
//   2. 面の下端をわずかに暗くする内側の影(切り口に向かって丸みを帯びて見せる)
//   3. 0 ぼかしの切り口(板の厚み)。厚みは --wood-depth、色は --wood-edge
//   4. 切り口のさらに下に落ちる、茶色がかった柔らかい接地影
const plankShadow = (depth: string, blur: string) =>
    [
        "inset 0 2px 0 rgb(255 255 255 / 0.4)",
        "inset 0 -3px 0 rgb(0 0 0 / 0.1)",
        // 板の縁をごく薄い木の色で囲み、ボーダーを使わずに「切り出した板」の輪郭を出す
        "inset 0 0 0 1.5px var(--wood-rim)",
        `0 ${depth} 0 0 var(--wood-edge)`,
        `0 calc(${depth} + 3px) ${blur} -2px rgb(92 58 24 / 0.32)`,
    ].join(", ");

const SHADOW_REST = plankShadow("var(--wood-depth)", "8px");
// hover では板が少し浮き、切り口が 1px 厚く見える
const SHADOW_LIFTED = plankShadow("calc(var(--wood-depth) + 1px)", "12px");
// 押下中は切り口をほぼ潰し、接地影も縮めて「板が地面に押し付けられた」ように見せる
const SHADOW_PRESSED = plankShadow("1px", "3px");

// 釘頭。中心から少しずらした放射グラデーションで、丸い金属の頭に光が当たっているように見せる
const NAIL_HEAD = "radial-gradient(circle at 35% 30%, #fffaf0 0 20%, #b3a690 48%, #6b5c48 100%)";

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// 釘 1 本ぶんの共通スタイル。左右の位置だけを ::before / ::after で変える
const nail = {
    content: '""',
    position: "absolute",
    top: "[var(--wood-nail-inset)]",
    width: "[var(--wood-nail)]",
    height: "[var(--wood-nail)]",
    borderRadius: "full",
    backgroundImage: NAIL_HEAD,
    // 釘が板に少し沈み込んでいるように、下側にだけ 1px の影を付ける
    boxShadow: "0 1px 0 rgb(255 255 255 / 0.35), inset 0 -1px 0 rgb(0 0 0 / 0.2)",
    pointerEvents: "none",
} as const;

// disabled 共通: 塗りも木目も剥がれた「古い板」。面は平らにして切り口だけ薄く残す
const weatheredPlank = {
    bg: "bg.disabled",
    color: "fg.disabled",
    backgroundImage: "none",
    "--wood-edge": "var(--mpc-colors-gray-6)",
    "--wood-rim": "transparent",
    textShadow: "none",
    // 釘も色を抜いて、面に溶け込ませる
    _before: { opacity: 0.45 },
    _after: { opacity: 0.45 },
} as const;

export const woodSignButtonStyle = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        position: "relative",
        // 角は大きめに丸めて「チャンキーで柔らかい板」にする。sm でも潰れないよう px 固定
        borderRadius: "[14px]",
        fontFamily: `[${ROUNDED_FONT}]`,
        fontWeight: "[800]",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        backgroundImage: WOOD_GRAIN,
        boxShadow: SHADOW_REST,
        // 切り口は box-shadow でレイアウト上の高さを持たないため、下の要素と重ならないよう厚みぶん空ける
        marginBlockEnd: "[var(--wood-depth)]",
        // 隣り合う看板は逆向きに傾けて、手で打ち付けたような不揃いさを出す
        "--wood-tilt": "-1.5deg",
        "&:nth-child(even)": { "--wood-tilt": "1.5deg" },
        // 傾きも潰れも下端を支点にして、杭に立てた看板のように接地点を動かさない
        transformOrigin: "bottom",
        transitionProperty: "transform, box-shadow, background-color, color",
        transitionDuration: "[260ms]",
        transitionTimingFunction: `[${SPRING}]`,
        "& :where(svg)": {
            // 丸ゴシックの太さに合わせ、アイコンの線も太めにする
            strokeWidth: "[2.5px]",
            width: "1.1em",
            height: "1.1em",
            flexShrink: 0,
        },
        _before: { ...nail, left: "[var(--wood-nail-inset)]" },
        _after: { ...nail, right: "[var(--wood-nail-inset)]" },
        // 傾き・持ち上げ・潰れはいずれも「動きを減らす」設定では付けない。色と切り口の変化だけで状態は伝わる
        [HOVER]: {
            boxShadow: SHADOW_LIFTED,
            _motionSafe: { transform: "translateY(-2px) rotate(var(--wood-tilt)) scale(1.02)" },
        },
        [ACTIVE]: {
            boxShadow: SHADOW_PRESSED,
            // 押した瞬間は素早く沈め、離したときだけバネで戻す
            transitionDuration: "[90ms]",
            // 切り口の厚みぶん沈みつつ、縦に潰れて横に広がる(squash)
            _motionSafe: {
                transform: "translateY(calc(var(--wood-depth) - 1px)) scale(1.03, 0.94)",
            },
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // ペンキで塗った板。塗りは colorPalette に追従し、木目は黒の半透明で塗膜越しに透けさせる
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                // 木目は黒 9%(2 本重なって約 17%)。暗くなるほど白文字の Lc は上がるので、塗膜越しでも木目がはっきり見える濃さにする
                "--wood-grain": "rgb(0 0 0 / 0.09)",
                "--wood-rim": "rgb(0 0 0 / 0.06)",
                // 切り口は塗り色を step12 側に沈めた色(面との差を Lc 13〜15 確保。pressable と同じ配合)
                "--wood-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                // 白文字を塗膜に少し沈めて、ペンキで描いた文字らしくする
                textShadow: "0 1px 0 rgb(0 0 0 / 0.18)",
                [HOVER]: {
                    bg: "colorPalette.solid.emphasized",
                },
                [ACTIVE]: {
                    bg: "colorPalette.solid.emphasized",
                },
                _disabled: weatheredPlank,
            },
            // 塗っていない明るい白木。木目は茶色の半透明
            secondary: {
                // 白木の色は該当するトークンが無いため任意値。文字の Lc を確保するため明るめの白木にしている
                bg: "[#F4DCB0]",
                // 白木の上では colorPalette.fg だと木目の最暗点で Lc 60 前後まで落ちるため、step12 に沈める
                color: "colorPalette.12",
                // 木目は焦げ茶 7%(2 本重なって約 13.5%)。文字の下の最暗点でも step12 で Lc 62 以上を残す濃さ
                "--wood-grain": "rgb(138 90 43 / 0.07)",
                "--wood-rim": "rgb(138 90 43 / 0.09)",
                "--wood-edge": "#A9773F",
                // 白いハイライトを文字の下に敷き、板に彫った文字のような凹みを出す
                textShadow: "0 1px 0 rgb(255 255 255 / 0.55)",
                [ACTIVE]: {
                    // 押下は少し濃い白木にして、押した感触を色でも返す
                    bg: "[#EFD5A6]",
                },
                _disabled: weatheredPlank,
            },
            // 彫り込まれた文字だけ。板も釘も持たず、hover で薄い白木の面が浮かび上がる
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                backgroundImage: "none",
                boxShadow: "none",
                marginBlockEnd: "0",
                "--wood-edge": "transparent",
                "--wood-rim": "transparent",
                textShadow: "0 1px 0 rgb(255 255 255 / 0.6)",
                _before: { display: "none" },
                _after: { display: "none" },
                [HOVER]: {
                    bg: "[#F7E8CC]",
                    boxShadow: "none",
                    // 板の無い文字が傾くと不安定に見えるため、plain は傾けずに少し膨らむだけにする
                    _motionSafe: { transform: "scale(1.04)" },
                },
                [ACTIVE]: {
                    bg: "[#F4DCB0]",
                    color: "colorPalette.12",
                    boxShadow: "none",
                    _motionSafe: { transform: "translateY(1px) scale(1.02, 0.96)" },
                },
                _disabled: {
                    color: "fg.disabled",
                    textShadow: "none",
                },
            },
        },
        // 面の高さは既存 Button と同じ control.sm/md/lg。切り口と影はその外側に足す。
        // 左右の余白は釘(左上・右上)とアイコンがぶつからない幅を確保している
        size: {
            sm: {
                height: "control.sm",
                px: "{spacing.4}",
                fontSize: "xs",
                borderRadius: "[11px]",
                "--wood-depth": "4px",
                "--wood-nail": "4px",
                "--wood-nail-inset": "5px",
            },
            md: {
                height: "control.md",
                px: "{spacing.5}",
                fontSize: "sm",
                "--wood-depth": "5px",
                "--wood-nail": "6px",
                "--wood-nail-inset": "6px",
            },
            lg: {
                height: "control.lg",
                px: "{spacing.7}",
                fontSize: "md",
                "--wood-depth": "6px",
                "--wood-nail": "7px",
                "--wood-nail-inset": "7px",
            },
        },
    },
    // plain は板の厚みを持たないので、size より後に厚みを 0 に上書きする
    compoundVariants: [
        {
            intent: "plain",
            size: ["sm", "md", "lg"],
            css: { "--wood-depth": "0px" },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

export type WoodSignButtonProps = ComponentPropsWithoutRef<"button"> & RecipeVariantProps<typeof woodSignButtonStyle>;

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージからは @ark-ui/react を解決できないため、ark.button ではなくネイティブの button を使う
export const WoodSignButton = forwardRef<HTMLButtonElement, WoodSignButtonProps>(
    ({ intent, size, className, ...props }, ref) => (
        <button ref={ref} type="button" className={cx(woodSignButtonStyle({ intent, size }), className)} {...props} />
    ),
);
WoodSignButton.displayName = "WoodSignButton";

const meta: Meta<typeof WoodSignButton> = {
    title: "LAB/Button Designs/Wood Sign",
    component: WoodSignButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Wood Sign** — 木の板を釘で打ち付けた看板のようなボタン。",
                    "細い木目と節・一段濃い切り口(板の厚み)・左上と右上の釘で「手作りの看板」を表現します。",
                    "primary は colorPalette の色でペンキを塗った板、secondary は塗っていない白木、plain は板に彫った文字だけです。",
                    "hover で ±1.5deg だけ傾いてふわっと浮き(隣り合う看板は逆向き)、押すと縦に潰れて横に広がります。",
                    "",
                    "- 借りている雰囲気: どうぶつの森系のスローライフゲームに出てくる、島の案内板や手作り家具の温かみ。",
                    "  クリーム色の面・丸ゴシック(M PLUS Rounded 1c)・ぽよんと戻るバネの動きで、のんびりした手触りに寄せています(ロゴや素材は使っていません)。",
                    "- 強み: 素材感があるので、イベントページやお知らせなど「場の空気」を作りたい画面で主役になれる。",
                    "- 強み: ペンキの色が colorPalette に追従するため、mori / umi / red の看板をそのまま作り分けられる。",
                    "- トレードオフ: 白木の面は明るい色しか選べない。木目の暗い線で文字の Lc が下がるため、secondary の文字は step12 まで沈めている。",
                    "- トレードオフ: 木目・釘・傾きと装飾が多く、フォームや一覧のように数が並ぶ場所ではうるさい。看板 1〜2 枚で使う想定。",
                    "- トレードオフ: 白木の色や釘の色は任意値で、ダークモードには追従しない。",
                    "- 動きは prefers-reduced-motion で止まり、その場合も色と切り口の変化で状態は伝わります。",
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
        children: "島の案内所へ",
        intent: "primary",
        size: "lg",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof WoodSignButton>;

// 一覧表示用のレイアウト
const styles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.subtle" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
    // パレット追従を見せるため、地色ごと colorPalette を切り替える
    umi: css({ colorPalette: "umi", bg: "colorPalette.bg", p: "4", borderRadius: "panel" }),
    red: css({ colorPalette: "red", bg: "colorPalette.bg", p: "4", borderRadius: "panel" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent ごとに sm / md / lg と、前後のアイコン付きを 1 行に並べる
const IntentRow = ({ intent }: { intent: (typeof INTENTS)[number] }) => (
    <div className={styles.row}>
        {SIZES.map((size) => (
            <WoodSignButton key={size} intent={intent} size={size}>
                {size.toUpperCase()}
            </WoodSignButton>
        ))}
        <WoodSignButton intent={intent}>
            <PlusIcon />
            看板を立てる
        </WoodSignButton>
        <WoodSignButton intent={intent}>
            つづける
            <ArrowRightIcon />
        </WoodSignButton>
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
                        <WoodSignButton key={intent} intent={intent} disabled>
                            <HomeIcon />
                            {intent}
                        </WoodSignButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>colorPalette: umi</span>
                <div className={cx(styles.row, styles.umi)}>
                    {INTENTS.map((intent) => (
                        <WoodSignButton key={intent} intent={intent}>
                            <FishIcon />
                            {intent}
                        </WoodSignButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>colorPalette: red</span>
                <div className={cx(styles.row, styles.red)}>
                    {INTENTS.map((intent) => (
                        <WoodSignButton key={intent} intent={intent}>
                            <TreesIcon />
                            {intent}
                        </WoodSignButton>
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const Playground: Story = {};
