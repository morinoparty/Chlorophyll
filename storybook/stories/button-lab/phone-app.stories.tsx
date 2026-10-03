import type { Meta, StoryObj } from "@storybook/react";
import {
    ArrowRightIcon,
    BookOpenIcon,
    CalendarIcon,
    CameraIcon,
    FishIcon,
    HeartIcon,
    LeafIcon,
    MailIcon,
    MapIcon,
    MusicIcon,
    PlusIcon,
    SendIcon,
    ShoppingBagIcon,
    SparklesIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { css, cva, cx } from "styled-system/css";

/**
 * LAB: Phone App(ゲーム内スマホのアプリ)方向のボタン
 *
 * 角の取れたピル型の面の左端に、丸い「アイコンバッジ」を埋め込む。hover でバッジだけがぽよんと拡大し、
 * 押下では面全体が下に潰れる(squash)ことで、スマホゲームの UI のような弾む手触りを出す。
 * shape="tile" ではホーム画面のアプリアイコンのような角丸の正方形タイルになり、色付きの丸に大きなアイコン、
 * その下にラベルを置く。暖かいクリーム色の面と、0 ぼかしの厚い下影(edge)で「ころんとした」立体感を作る。
 *
 * APCA(apca-w3 calcAPCA)計測値。storybook の生成トークン(styled-system/styles.css)から解決した色で計算
 *   primary   : contrast(白) on solid(step9)                     mori 79.1 / umi 78.5 / red 70.5
 *               contrast(白) on solid.emphasized(hover・押下)     mori 84.5 / umi 84.0 / red 74.5
 *               バッジ: fg.icon(step9) on bg.panel(白)            mori 73.7 / umi 73.1 / red 65.0
 *               edge(step10 + step12 45%) vs colorPalette.bg      mori 80.4 / umi 79.5 / red 73.7
 *   secondary : colorPalette.fg on クリーム(#FFF8E6)             mori 78.0 / umi 78.2 / red 77.8
 *               colorPalette.fg on 濃いクリーム(#FCEFD2, hover)  mori 73.1 / umi 73.3 / red 72.8
 *               バッジ: contrast(白) on solid                    primary と同じ 79.1 / 78.5 / 70.5
 *               edge(木目色 #BFA06A) vs colorPalette.bg 40.0〜41.0 / vs 白 48.8 / vs フレーム 39.4(装飾。輪郭はバッジと文字も担う)
 *   plain     : colorPalette.fg on 白 82.1 / 82.3 / 81.8、on colorPalette.bg 73.8 / 74.2 / 73.1
 *               バッジ: fg.icon on surface(step3)               mori 66.2 / umi 65.4 / red 55.6
 *   tile      : ラベル colorPalette.fg on bg.panel(白)          80.1〜82.3(yellow / blue 含む)
 *               plain タイルのラベル colorPalette.fg on フレーム(#F7EFD9)  70.8〜72.9
 *               アイコン contrast on solid: yellow は contrast が yellow.12 なので 77.5、blue は白で 63.6
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9 / バッジ内 fg.disabled on 白 60.4
 *               plain の fg.disabled on 白 60.4 / on フレーム 51.1
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0、
 *               vs colorPalette.bg 65.5 / 65.0 / 56.3、vs フレーム(#F7EFD9) 64.3 / 63.7 / 55.6
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)
const HOVER = "&:not(:disabled):not([data-disabled]):hover";
const ACTIVE = "&:not(:disabled):not([data-disabled]):active";

// バッジ(アイコンの丸)を指すセレクタ。コンポーネント側で data-part="badge" を付ける
const BADGE = "& > [data-part='badge']";

// ゲームの UI のような「行き過ぎてから戻る」ばね感を出すイージング。1 を超える制御点でオーバーシュートさせる
const SPRING = "[cubic-bezier(0.34, 1.56, 0.64, 1)]";

// 丸ゴシック。preview-head で読み込んでいる M PLUS Rounded 1c を使い、文字まで柔らかく見せる
const ROUNDED_FONT = "['M PLUS Rounded 1c', sans-serif]";

// クリーム・木目などの暖色はトークンに無いため、ここで任意値としてまとめて定義する
const CREAM = "#FFF8E6";
const CREAM_HOVER = "#FCEFD2";
// 木目色は一段濃くして、クリームの面がミントの地色に溶けないようにする(vs colorPalette.bg Lc 約 40)
const WOOD_EDGE = "#BFA06A";
const PHONE_FRAME = "#F7EFD9";

// 下影。edge(0 ぼかしの厚み)と、それを薄めた柔らかい接地影の 2 本で「ころんと置かれた」立体感を出す
// 先頭の inset は上端のつや(gloss)。おもちゃのような、ぷっくりした面に見せる
const EDGE_REST =
    "inset 0 2px 0 0 var(--phone-gloss), 0 var(--phone-depth) 0 0 var(--phone-edge), 0 calc(var(--phone-depth) + 4px) 12px -4px color-mix(in oklab, var(--phone-edge) 55%, transparent)";
// 押下中は edge を 1px まで潰し、接地影も消して底まで押し込まれたように見せる
const EDGE_PRESSED = "inset 0 2px 0 0 var(--phone-gloss), 0 1px 0 0 var(--phone-edge)";

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// disabled 共通: 厚みと影を消して平らな面にする。沈めると plain や隣のボタンと面の中心がずれるので位置は動かさない
const flatDisabled = {
    bg: "bg.disabled",
    color: "fg.disabled",
    boxShadow: "none",
    textShadow: "none",
    [BADGE]: {
        bg: "bg.panel",
        color: "fg.disabled",
        boxShadow: "none",
    },
} as const;

export const phoneAppButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        position: "relative",
        borderRadius: "full",
        fontFamily: ROUNDED_FONT,
        // 丸ゴシックは細身に見えるので、一段太い 700 を基本にする
        fontWeight: "bold",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // edge は box-shadow なのでレイアウト上の高さを持たない。下に並ぶ要素と重ならないよう余白を確保する
        // 余白は --phone-space(厚みを持たない plain でも同じ値)にして、並べたときに面の中心が揃うようにする
        marginBlockEnd: "[var(--phone-space)]",
        boxShadow: EDGE_REST,
        "--phone-gloss": "transparent",
        // squash は下端を支点にして、地面に押し付けられたように潰す
        transformOrigin: "center bottom",
        transitionProperty: "transform, box-shadow, background, color",
        transitionDuration: "normal",
        transitionTimingFunction: SPRING,
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            width: "[1.1em]",
            height: "[1.1em]",
            flexShrink: "0",
        },
        // バッジ: 左端に埋め込む丸。大きさは size 側の --phone-badge で決める
        [BADGE]: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            width: "[var(--phone-badge)]",
            height: "[var(--phone-badge)]",
            borderRadius: "full",
            // バッジにも小さな下影を付け、面に貼ったシールのような段差を出す
            boxShadow: "0 2px 0 0 color-mix(in oklab, var(--phone-edge) 70%, transparent)",
            transitionProperty: "transform, background, color",
            transitionDuration: "normal",
            transitionTimingFunction: SPRING,
            "& :where(svg)": {
                width: "[55%]",
                height: "[55%]",
            },
        },
        // バッジがあるときは、左の余白をバッジの周りに 4px だけ残してピルの丸みに沿わせる
        "&:has(> [data-part='badge'])": {
            paddingInlineStart: "1",
        },
        // 移動・拡大は「動きを減らす」設定のときは付けない。色と影の変化だけは残すので状態は伝わる
        [HOVER]: {
            _motionSafe: {
                transform: "translateY(-2px)",
                // バッジだけが少し傾きながらぽよんと膨らむ
                [BADGE]: { transform: "scale(1.22) rotate(-10deg)" },
            },
        },
        [ACTIVE]: {
            boxShadow: EDGE_PRESSED,
            // 押した瞬間は遅延を感じさせないよう速く潰す(戻りは base のばねで弾む)
            transitionDuration: "fastest",
            transitionTimingFunction: "easeOut",
            _motionSafe: {
                // 横に少し広がりつつ縦に潰れる squash。edge の厚みぶん沈めて接地点は動かさない
                transform: "translateY(calc(var(--phone-depth) - 1px)) scale(1.04, 0.92)",
                [BADGE]: { transform: "scale(0.92)" },
            },
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
                // 白文字の下に濃い影を 1px 落として、ゲームのメニューのようなぽってりした文字にする
                textShadow: "0 1px 0 color-mix(in oklab, var(--mpc-colors-color-palette-12) 35%, transparent)",
                "--phone-gloss": "color-mix(in oklab, white 28%, transparent)",
                // solid.active では面と溶けるため、step10 に step12 を 45% 混ぜた一段深い色で厚みを描く
                "--phone-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                // 濃い面の上に白い丸を抜いて、アイコンをパレットの色で見せる(スマホのアプリ風の配色)
                [BADGE]: {
                    bg: "bg.panel",
                    color: "colorPalette.fg.icon",
                },
                [HOVER]: {
                    bg: "colorPalette.solid.emphasized",
                },
                [ACTIVE]: {
                    bg: "colorPalette.solid.emphasized",
                },
                _disabled: flatDisabled,
            },
            secondary: {
                bg: `[${CREAM}]`,
                color: "colorPalette.fg",
                // クリームの面は地色と近いので、木目色の厚みで輪郭を出す
                "--phone-edge": WOOD_EDGE,
                "--phone-gloss": "white",
                // クリームの面にはパレット色の丸を置き、どのパレットのボタンかをバッジで伝える
                [BADGE]: {
                    bg: "colorPalette.solid",
                    color: "colorPalette.contrast",
                },
                [HOVER]: {
                    bg: `[${CREAM_HOVER}]`,
                },
                [ACTIVE]: {
                    bg: `[${CREAM_HOVER}]`,
                },
                _disabled: flatDisabled,
            },
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                // plain は厚みを持たない(厚み 0 は size より後に効かせるため compoundVariants 側で指定)
                "--phone-edge": "transparent",
                boxShadow: "none",
                marginBlockEnd: "0",
                [BADGE]: {
                    bg: "colorPalette.surface",
                    color: "colorPalette.fg.icon",
                    boxShadow: "none",
                },
                [HOVER]: {
                    // hover ではクリームの面をふわっと出す。厚みが無いので持ち上げはしない
                    bg: `[${CREAM}]`,
                    _motionSafe: { transform: "none" },
                },
                [ACTIVE]: {
                    bg: `[${CREAM_HOVER}]`,
                    boxShadow: "none",
                    _motionSafe: { transform: "scale(0.96)" },
                },
                _disabled: {
                    color: "fg.disabled",
                    [BADGE]: {
                        bg: "bg.disabled",
                        color: "fg.disabled",
                    },
                },
            },
        },
        // 面の高さは既存 Button と同じ control.sm/md/lg に揃え、edge の厚みはその外側に足す
        size: {
            sm: {
                height: "control.sm",
                px: "{spacing.3.5}",
                fontSize: "xs",
                "--phone-depth": "3px",
                "--phone-space": "3px",
                "--phone-badge": "28px",
            },
            md: {
                height: "control.md",
                px: "{spacing.4}",
                fontSize: "sm",
                "--phone-depth": "4px",
                "--phone-space": "4px",
                "--phone-badge": "32px",
            },
            lg: {
                height: "control.lg",
                px: "{spacing.5}",
                fontSize: "md",
                "--phone-depth": "4px",
                "--phone-space": "4px",
                "--phone-badge": "36px",
            },
        },
        // pill はピル型のボタン、tile はホーム画面のアプリアイコン風の角丸タイル
        shape: {
            pill: {},
            tile: {
                flexDirection: "column",
                gap: "1.5",
                height: "auto",
                aspectRatio: "square",
                width: "[var(--phone-tile)]",
                px: "1",
                // 角丸の正方形。完全な円ではなく、スマホのアプリアイコンのような丸い四角にする
                borderRadius: "[28%]",
                bg: "bg.panel",
                color: "colorPalette.fg",
                fontSize: "xs",
                lineHeight: "tight",
                // 幅の狭いタイルでは字間を広げると欧文が途切れて見えるので標準に戻す
                letterSpacing: "normal",
                textShadow: "none",
                "--phone-edge": WOOD_EDGE,
                "--phone-gloss": "transparent",
                "&:has(> [data-part='badge'])": {
                    paddingInlineStart: "1",
                },
                [BADGE]: {
                    // タイルではバッジがアイコン本体になるので、タイル幅の半分ほどまで大きくする
                    width: "[calc(var(--phone-tile) * 0.5)]",
                    height: "[calc(var(--phone-tile) * 0.5)]",
                },
                [HOVER]: {
                    bg: "bg.panel",
                    _motionSafe: {
                        transform: "translateY(-3px) rotate(-2deg)",
                        [BADGE]: { transform: "scale(1.12) rotate(-8deg)" },
                    },
                },
                [ACTIVE]: {
                    bg: "colorPalette.surface.subtle",
                },
            },
        },
    },
    compoundVariants: [
        // plain は size より後に厚みを 0 にしたいので、compoundVariants で size の指定を上書きする
        {
            intent: "plain",
            size: ["sm", "md", "lg"],
            css: { "--phone-depth": "0px", "--phone-gloss": "transparent" },
        },
        // タイルの一辺。ホーム画面で 4 列に並べたとき窮屈にならない大きさにする
        { shape: "tile", size: "sm", css: { "--phone-tile": "64px" } },
        { shape: "tile", size: "md", css: { "--phone-tile": "76px" } },
        { shape: "tile", size: "lg", css: { "--phone-tile": "88px" } },
        // タイルでは面が白なので、primary の丸はパレットの塗り色にしてアイコンを抜く
        {
            shape: "tile",
            intent: "primary",
            css: {
                [BADGE]: { bg: "colorPalette.solid", color: "colorPalette.contrast" },
            },
        },
        // secondary のタイルは淡い丸にして、primary より一段控えめなアプリに見せる
        {
            shape: "tile",
            intent: "secondary",
            css: {
                [BADGE]: { bg: "colorPalette.surface", color: "colorPalette.fg.icon" },
            },
        },
        // plain のタイルは面を持たず、ホーム画面に直接アイコンが置かれたように見せる
        {
            shape: "tile",
            intent: "plain",
            css: {
                bg: "transparent",
                [BADGE]: { bg: "colorPalette.solid", color: "colorPalette.contrast" },
                [HOVER]: { bg: "transparent" },
                [ACTIVE]: { bg: "transparent" },
            },
        },
        // 無効なタイルは白い面のまま平らにし、丸だけを灰色にする
        {
            shape: "tile",
            intent: ["primary", "secondary"],
            css: {
                _disabled: {
                    bg: "bg.panel",
                    [BADGE]: { bg: "bg.disabled", color: "fg.disabled" },
                },
            },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "pill",
    },
});

export interface PhoneAppButtonProps extends ComponentProps<"button"> {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
    shape?: "pill" | "tile";
    /** 左端(tile では上)の丸いバッジに入れるアイコン */
    icon?: ReactNode;
}

// 既存 Button と同じ props の形にして、比較用の一覧ストーリーから差し替えて並べられるようにする。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、ark.button ではなくネイティブの button を使う
export const PhoneAppButton = ({ className, intent, size, shape, icon, children, ...props }: PhoneAppButtonProps) => {
    return (
        <button type="button" {...props} className={cx(phoneAppButton({ intent, size, shape }), className)}>
            {/* アイコンは装飾なので読み上げからは外し、ラベルは children に任せる */}
            {icon && (
                <span data-part="badge" aria-hidden="true">
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
};

const meta: Meta<typeof PhoneAppButton> = {
    title: "LAB/Button Designs/Phone App",
    component: PhoneAppButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Phone App** — ゲーム内のスマホアプリのような、まるくてかわいいボタン。",
                    "ピル型の面の左端に丸いアイコンバッジを埋め込み、hover でバッジだけがぽよんと膨らみます。",
                    "押すと面全体が下端を支点に潰れ(squash)、離すとばねのイージングで少し行き過ぎてから戻ります。",
                    '`shape="tile"` ではホーム画面のアプリアイコンのような角丸タイルになり、色付きの丸とラベルを縦に並べます。',
                    "",
                    "- 借りている空気感: 島暮らしのゲームに出てくるスマホの、クリーム色の画面・パステルの丸いアプリ・ころんとした厚み・丸ゴシックの文字。ロゴや実際の素材は使っていません。",
                    "- 強み: バッジの色でパレット(mori / umi / red)が一目で分かり、アイコンが主役のメニューやランチャーにそのまま使える。",
                    "- 強み: タイルとピルが同じレシピから出るので、ホーム画面風のナビゲーションとアクションボタンの見た目が揃う。",
                    "- トレードオフ: バッジのぶんピルの横幅が広がり、文字だけのボタンと並べると左の余白がそろわない。",
                    "- トレードオフ: クリーム・木目色はトークンに無い任意値で、ダークモードや他の地色にはまだ追従しない。",
                    "- トレードオフ: ばねの動きと厚い下影は遊び心が強く、業務画面や密度の高い UI には向かない。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: ["primary", "secondary", "plain"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        shape: { control: "select", options: ["pill", "tile"] },
        disabled: { control: "boolean" },
    },
    args: {
        children: "てがみを送る",
        intent: "primary",
        size: "lg",
        shape: "pill",
        disabled: false,
        icon: <MailIcon />,
    },
};

export default meta;
type Story = StoryObj<typeof PhoneAppButton>;

// 一覧表示用のレイアウト
const styles = {
    grid: css({ display: "flex", flexDirection: "column", gap: "8", alignItems: "flex-start" }),
    section: css({ display: "flex", flexDirection: "column", gap: "3" }),
    label: css({ fontSize: "sm", fontWeight: "medium", color: "colorPalette.fg.muted" }),
    row: css({ display: "flex", gap: "4", alignItems: "center", flexWrap: "wrap" }),
    // パレット追従を見せるため、地色ごと colorPalette を切り替える
    umi: css({ colorPalette: "umi", bg: "colorPalette.bg", p: "4", borderRadius: "panel" }),
    red: css({ colorPalette: "red", bg: "colorPalette.bg", p: "4", borderRadius: "panel" }),
    // ゲーム内スマホの本体。クリーム色の角丸フレームに、木目色の厚みを付けて手に持てる道具っぽくする
    phone: css({
        display: "flex",
        flexDirection: "column",
        gap: "5",
        width: "[400px]",
        maxWidth: "full",
        p: "6",
        pt: "4",
        borderRadius: "[44px]",
        // 画面には木目色の小さな水玉を敷き、島のスマホの壁紙のようなやわらかい柄にする
        bg: `[radial-gradient(circle, color-mix(in oklab, ${WOOD_EDGE} 22%, transparent) 2px, transparent 2.5px) 0 0 / 22px 22px, ${PHONE_FRAME}]`,
        boxShadow: `[inset 0 3px 0 0 white, 0 8px 0 0 ${WOOD_EDGE}, 0 18px 28px -12px color-mix(in oklab, ${WOOD_EDGE} 70%, transparent)]`,
        fontFamily: ROUNDED_FONT,
        color: "colorPalette.fg",
    }),
    // 画面上部のステータスバー(時刻と小さなタイトル)
    statusBar: css({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "sm",
        fontWeight: "[800]",
        px: "1",
    }),
    // 時刻やタイトルを白い吹き出しの中に入れて、ゲームの HUD らしく見せる
    statusChip: css({
        display: "inline-flex",
        alignItems: "center",
        gap: "1",
        px: "3",
        py: "1",
        borderRadius: "full",
        bg: "bg.panel",
        boxShadow: `[0 2px 0 0 color-mix(in oklab, ${WOOD_EDGE} 60%, transparent)]`,
        "& svg": { width: "[1em]", height: "[1em]", color: "colorPalette.fg.icon" },
    }),
    // 端末上部のスピーカー穴。小さな飾りでスマホの「道具っぽさ」を出す
    notch: css({
        alignSelf: "center",
        width: "[56px]",
        height: "[6px]",
        borderRadius: "full",
        bg: `[color-mix(in oklab, ${WOOD_EDGE} 45%, transparent)]`,
        mb: "-2",
    }),
    // ホーム画面のアイコン並び。4 列で、タイルを各セルの中央に置く
    homeGrid: css({
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "4",
        justifyItems: "center",
    }),
    // 下部の操作ボタンを置く台
    dock: css({ display: "flex", justifyContent: "center", gap: "3", flexWrap: "wrap" }),
    // ホーム画面のアプリ。並べたときにパステルの彩りが出るよう、アプリごとにパレットを変える
    mori: css({ colorPalette: "mori" }),
    umiApp: css({ colorPalette: "umi" }),
    redApp: css({ colorPalette: "red" }),
    yellowApp: css({ colorPalette: "yellow" }),
    blueApp: css({ colorPalette: "blue" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent ごとに sm / md / lg、バッジ付き、末尾アイコン付きを 1 行に並べる
const IntentRow = ({ intent }: { intent: (typeof INTENTS)[number] }) => (
    <div className={styles.row}>
        {SIZES.map((size) => (
            <PhoneAppButton key={size} intent={intent} size={size} icon={<LeafIcon />}>
                {size.toUpperCase()}
            </PhoneAppButton>
        ))}
        <PhoneAppButton intent={intent} icon={<PlusIcon />}>
            追加する
        </PhoneAppButton>
        <PhoneAppButton intent={intent}>
            つづける
            <ArrowRightIcon />
        </PhoneAppButton>
    </div>
);

// ホーム画面に並べるアプリ。パレットと intent を散らして、実際のランチャーらしい彩りにする
const APPS = [
    { label: "カメラ", icon: <CameraIcon />, className: styles.umiApp, intent: "primary" },
    { label: "ちず", icon: <MapIcon />, className: styles.mori, intent: "primary" },
    { label: "おみせ", icon: <ShoppingBagIcon />, className: styles.redApp, intent: "primary" },
    { label: "ずかん", icon: <FishIcon />, className: styles.blueApp, intent: "primary" },
    { label: "てがみ", icon: <MailIcon />, className: styles.yellowApp, intent: "primary" },
    { label: "よてい", icon: <CalendarIcon />, className: styles.mori, intent: "secondary" },
    { label: "おんがく", icon: <MusicIcon />, className: styles.redApp, intent: "secondary" },
    { label: "レシピ", icon: <BookOpenIcon />, className: styles.umiApp, intent: "secondary" },
] as const;

// ホーム画面風のフレーム。タイルを 4 列に並べ、下部に操作用のピルを置く
const PhoneFrame = () => (
    <div className={styles.phone}>
        <span className={styles.notch} aria-hidden="true" />
        <div className={styles.statusBar}>
            <span className={styles.statusChip}>9:41</span>
            <span className={styles.statusChip}>
                <LeafIcon aria-hidden="true" />
                しまフォン
            </span>
        </div>
        <div className={styles.homeGrid}>
            {APPS.map((app) => (
                <PhoneAppButton
                    key={app.label}
                    shape="tile"
                    size="md"
                    intent={app.intent}
                    icon={app.icon}
                    className={app.className}
                >
                    {app.label}
                </PhoneAppButton>
            ))}
            <PhoneAppButton shape="tile" size="md" intent="plain" icon={<SparklesIcon />} className={styles.yellowApp}>
                あたらしい
            </PhoneAppButton>
            <PhoneAppButton shape="tile" size="md" intent="primary" icon={<HeartIcon />} disabled>
                じゅんび中
            </PhoneAppButton>
        </div>
        <div className={styles.dock}>
            <PhoneAppButton intent="secondary" size="md" icon={<SendIcon />}>
                送る
            </PhoneAppButton>
            <PhoneAppButton intent="primary" size="md" icon={<PlusIcon />}>
                アプリを追加
            </PhoneAppButton>
        </div>
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
                        <PhoneAppButton key={intent} intent={intent} icon={<SendIcon />} disabled>
                            {intent}
                        </PhoneAppButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>colorPalette: umi</span>
                <div className={cx(styles.row, styles.umi)}>
                    {INTENTS.map((intent) => (
                        <PhoneAppButton key={intent} intent={intent} icon={<HeartIcon />}>
                            {intent}
                        </PhoneAppButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>colorPalette: red</span>
                <div className={cx(styles.row, styles.red)}>
                    {INTENTS.map((intent) => (
                        <PhoneAppButton key={intent} intent={intent} icon={<HeartIcon />}>
                            {intent}
                        </PhoneAppButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>shape: tile(sm / md / lg × intent)</span>
                <div className={styles.row}>
                    {SIZES.map((size) => (
                        <PhoneAppButton key={size} shape="tile" size={size} icon={<CameraIcon />}>
                            {size.toUpperCase()}
                        </PhoneAppButton>
                    ))}
                    {INTENTS.map((intent) => (
                        <PhoneAppButton key={intent} shape="tile" intent={intent} icon={<MapIcon />}>
                            {intent}
                        </PhoneAppButton>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <span className={styles.label}>home screen</span>
                <PhoneFrame />
            </div>
        </div>
    ),
};

// ホーム画面だけを大きく確認するためのストーリー
export const HomeScreen: Story = {
    render: () => <PhoneFrame />,
};

export const Playground: Story = {};
