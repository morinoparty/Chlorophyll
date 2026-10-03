import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, GiftIcon, PlaneIcon, PlusIcon, SparklesIcon, TicketIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Ticket(マイルチケット / クーポン券)方向のボタン
 *
 * 左右の辺の中央に半円の切り欠き(パンチ穴)を radial-gradient の mask で抜き、
 * 券面の左端に「半券(stub)」を設けて点線のミシン目で本体と区切る、引換券のようなボタン。
 * どうぶつの森系の「やさしいゲーム UI」から、クリーム色の紙・ころんとした丸ゴシック・
 * 厚みのある柔らかい下影・ぷにっと弾む動き、半券の水玉・上辺の照り・ころんとした角丸を借りる(ロゴや素材は使わない)。
 *
 * 構造:
 *   - button 本体: 背景を持たない。フォーカスリング(outline)・動き(transform)・下影(filter: drop-shadow)を担う
 *   - ::before  : 紙の塗り・半券の色・切り欠きの mask を担う。
 *                 mask は同じ要素の outline / box-shadow / filter まで切り抜いてしまうため、疑似要素に分離している。
 *                 親の drop-shadow は子(疑似要素)の切り欠いた形に沿って落ちるので、影もチケットの形になる
 *   - stub      : 半券部分。幅は size ごとに固定し(--ticket-stub)、::before の塗り分けと上下の切り欠き位置を揃える
 *
 * APCA(apca-w3 calcAPCA)計測値。storybook の styled-system/styles.css の oklch 値から sRGB に解決して算出
 * (検算: 白 on mori.9 = Lc 79.0、colorPalette.fg on 白 = 82.2 で既存の計測値と一致)
 *   primary   : contrast(白) on solid(step9)            mori 79.1 / umi 78.5 / red 70.5(red は既存 Button と共通の課題)
 *               半券のアイコン 白 on step10             mori 84.6 / umi 84.0 / red 74.6
 *               水玉(白 12%)の粒の上に掛かった半券アイコン(最悪値) mori 77.8 / umi 77.0 / red 67.6
               押下時の面 solid.emphasized(step10) 上の文字も同値
 *               下影(step10 + step12 45%)vs colorPalette.bg mori 80.3 / umi 79.1 / red 73.2
 *   secondary : colorPalette.fg on クリーム紙(#fff7e2)   mori 77.4 / umi 77.3 / red 77.0
 *               押下時の紙(#faebce)                       mori 71.2 / umi 71.2 / red 70.9
 *               半券のアイコン colorPalette.fg on 半券(クリーム + step5 55%) mori 69.9 / umi 69.8 / red 67.5
 *               下影(tan oklch(0.72 0.07 70))vs colorPalette.bg mori 41.0 / umi 41.0 / red 40.1、vs 白 49.2
 *               水玉(step7 30%)の粒の上に掛かった半券アイコン(最悪値) mori 62.3 / umi 62.6 / red 59.5
               ※クリーム紙そのものは地色との差がほぼ無い(Lc 0)。輪郭は下影と切り欠きの形で読ませる
 *   plain     : colorPalette.fg on 白 mori 82.2 / umi 82.1 / red 81.8、on colorPalette.bg 74.0 / 73.9 / 72.7
 *               hover で現れるクリーム紙の上は secondary と同値(77 前後)
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.7、plain の fg.disabled on 白 60.3 / on colorPalette.bg 52.2
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.6 / umi 73.1 / red 65.0
 *               vs colorPalette.bg mori 65.5 / umi 64.9 / red 55.9(目安 Lc 45 以上)
 */

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)。
// data-preview は Showcase で hover / active の見た目を静止状態のまま並べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// クリーム色の紙。セマンティックトークンに暖色の面が無いため任意値で持つ
const CREAM = "oklch(0.976 0.028 88)";
// 押下時の紙。指で押して少し影が落ちたように一段だけ暖かく沈める(文字は Lc 71 前後を保つ)
const CREAM_PRESSED = "oklch(0.945 0.042 84)";
// secondary / plain の下影。木の机のような tan。地色に対して Lc 40 前後で、形の輪郭を担う
const TAN = "oklch(0.72 0.07 70)";

// ぽよんと行き過ぎてから戻るばね風のイージング(どうぶつの森系 UI の弾む手触り)
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// 切り欠きの mask。4 つの円形の穴をそれぞれ全面のレイヤーで描き、mask-composite: intersect で重ねる。
//   - 左右の辺の中央: --ticket-notch の半径
//   - 半券の境目の上下: --ticket-perf の半径(半券が無いときは 0 にして穴を消す)
const hole = (at: string, radius: string) =>
    `radial-gradient(circle at ${at}, transparent ${radius}, #000 calc(${radius} + 0.5px))`;
const TICKET_MASK = [
    hole("0 50%", "var(--ticket-notch)"),
    hole("100% 50%", "var(--ticket-notch)"),
    hole("var(--ticket-stub) 0", "var(--ticket-perf)"),
    hole("var(--ticket-stub) 100%", "var(--ticket-perf)"),
].join(", ");

// 紙の塗り。半券の幅(--ticket-stub)までを半券の色、そこから先を券面の色で塗り分ける。
// 一番上のレイヤーは上辺の照り(--ticket-lip)。ぷっくりした紙の厚みを出す。文字の位置には掛からない
const PAPER_FILL = [
    "linear-gradient(to bottom, var(--ticket-lip) 0 1.5px, transparent 6px)",
    "linear-gradient(to right, var(--ticket-stub-bg) 0 var(--ticket-stub), var(--ticket-paper) var(--ticket-stub))",
].join(", ");

// 半券の水玉模様。半券の要素の座標で切り欠き(左辺中央と右上・右下)を同じ形で抜き、穴に水玉が漏れないようにする
const STUB_DOTS = "radial-gradient(circle, var(--ticket-dot) 1.25px, transparent 1.75px) 0 0 / 7px 7px";
const STUB_MASK = [
    hole("0 50%", "var(--ticket-notch)"),
    hole("100% 0", "var(--ticket-perf)"),
    hole("100% 100%", "var(--ticket-perf)"),
].join(", ");

// 下影。ぼかし 0 の drop-shadow で、紙の下に厚みのある柔らかい「段」を作る
const dropEdge = (depth: string) => `drop-shadow(0 ${depth} 0 var(--ticket-shadow))`;

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// 補足: --ticket-* のカスタムプロパティには、トークンを生成済みの CSS 変数(var(--mpc-…))で渡す。
// カスタムプロパティの値ではトークンパスが解決されない場合があるため、確実に効く書き方に揃えている

// disabled 共通: 紙をグレーに落とし、影と半券の色を抜いて「使用済みの券」にする
const usedTicket = {
    color: "fg.disabled",
    filter: "none",
    "--ticket-stub-fg": "var(--mpc-colors-fg-disabled)",
    "--ticket-paper": "var(--mpc-colors-bg-disabled)",
    "--ticket-stub-bg": "var(--mpc-colors-bg-disabled)",
    "--ticket-tear": "var(--mpc-colors-gray-7)",
    "--ticket-dot": "transparent",
    "--ticket-lip": "transparent",
} as const;

export const ticketButton = cva({
    base: {
        position: "relative",
        // 疑似要素の紙(z-index: -1)をボタンの内側に閉じ込める
        isolation: "isolate",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        bg: "transparent",
        border: "none",
        // ころんとした丸い角。切り欠きの半円が収まる直線部(高さ - 2 × 角丸 ≥ 切り欠きの直径)を残す半径を size ごとに持つ
        borderRadius: "[var(--ticket-radius)]",
        // 丸ゴシックで「やさしいゲーム UI」の文字に寄せる(preview-head.html で読み込み済み)
        fontFamily: "['M PLUS Rounded 1c', sans-serif]",
        fontWeight: "[800]",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 左右の切り欠きに文字やアイコンが掛からないよう、半径ぶん内側の余白を足す
        paddingInlineEnd: "calc(var(--ticket-pad) + var(--ticket-notch))",
        paddingInlineStart: "calc(var(--ticket-pad) + var(--ticket-notch))",
        // 半券があるときは、半券そのものが左端から始まる(切り欠きは半券の中に入る)
        "&[data-stub]": {
            paddingInlineStart: "0",
            "--ticket-perf": "var(--ticket-notch)",
        },
        // 既定値。intent / size が個別に差し替える
        "--ticket-perf": "0px",
        "--ticket-stub": "0px",
        "--ticket-depth": "4px",
        "--ticket-dot": "transparent",
        "--ticket-lip": "transparent",
        filter: dropEdge("var(--ticket-depth)"),
        // 下影は filter なのでレイアウト上の高さを持たない。下の要素と重ならないよう厚みぶん空ける
        marginBlockEnd: "[4px]",
        transitionProperty: "transform, filter, color",
        transitionDuration: "normal",
        transitionTimingFunction: SPRING,
        "&::before": {
            content: '""',
            position: "absolute",
            inset: "0",
            zIndex: "-1",
            borderRadius: "inherit",
            background: PAPER_FILL,
            maskImage: TICKET_MASK,
            maskComposite: "intersect",
            // -webkit-mask-image は Panda が自動で付ける。合成指定だけ古い WebKit 向けに明示する(intersect 相当)
            WebkitMaskComposite: "source-in",
            transitionProperty: "background",
            transitionDuration: "fast",
        },
        // lucide-react のアイコンを文字サイズに合わせる(既存 Button のレシピと同じ比率)
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        // 半券。幅は --ticket-stub で固定し、右端に点線のミシン目を引く
        "& [data-part=stub]": {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            width: "[var(--ticket-stub)]",
            flexShrink: "0",
            // 本体のラベルとの間隔(gap に加えてミシン目の向こう側の余白)
            marginInlineEnd: "[calc(var(--ticket-pad) - 0.5rem)]",
            color: "var(--ticket-stub-fg)",
            // 水玉。z-index: -1 で紙(ボタンの ::before)の上・アイコンの下に敷く
            "&::before": {
                content: '""',
                position: "absolute",
                inset: "0",
                zIndex: "-1",
                background: STUB_DOTS,
                maskImage: STUB_MASK,
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
            },
            "& svg": {
                transitionProperty: "transform",
                transitionDuration: "normal",
                transitionTimingFunction: SPRING,
            },
            // ミシン目。上下の切り欠きに掛からないよう、半径ぶん縦に内側へ寄せて描く
            "&::after": {
                content: '""',
                position: "absolute",
                insetBlock: "[calc(var(--ticket-perf) + 2px)]",
                insetInlineEnd: "[-1px]",
                borderInlineEndWidth: "[2px]",
                borderInlineEndStyle: "dashed",
                borderInlineEndColor: "var(--ticket-tear)",
            },
        },
        // 持ち上げ: 少し浮いて左に傾く。浮いたぶん影を伸ばし、影の下端(接地点)は動かさない
        [HOVER]: {
            "--ticket-depth": "6px",
            _motionSafe: {
                transform: "translateY(-2px) rotate(-1.5deg)",
                // 半券のアイコンがぴょこっと首をかしげる。券全体の傾きと逆向きにして弾みを足す
                "& [data-part=stub] svg": { transform: "rotate(14deg) scale(1.15)" },
            },
        },
        // 押下: 横に広がり縦につぶれる(squash)。影はほぼ潰して、机に押し付けたように見せる
        [ACTIVE]: {
            "--ticket-depth": "1px",
            // 押した瞬間は遅延を感じさせないよう速く沈め、離したときだけばねで戻す
            transitionDuration: "fastest",
            transitionTimingFunction: "easeOut",
            _motionSafe: { transform: "translateY(2px) scale(1.04, 0.94)" },
        },
        _motionReduce: { transitionProperty: "filter, color" },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            // 最も強い操作。パレットの solid で刷った券に、半券は一段濃い step10 を当てる
            primary: {
                color: "colorPalette.contrast",
                "--ticket-paper": "var(--mpc-colors-color-palette-solid)",
                "--ticket-stub-bg": "var(--mpc-colors-color-palette-solid-emphasized)",
                "--ticket-stub-fg": "var(--mpc-colors-color-palette-contrast)",
                // ミシン目は白を半分透かして紙の上の切り取り線らしく(装飾なので Lc の対象外)
                "--ticket-tear": "color-mix(in oklab, white 55%, transparent)",
                // 半券の水玉と上辺の照り。白を薄く透かす装飾(Lc の対象外)
                "--ticket-dot": "color-mix(in oklab, white 12%, transparent)",
                "--ticket-lip": "color-mix(in oklab, white 30%, transparent)",
                // solid.active では面と影が溶けるため、step10 に step12 を 45% 混ぜてもう一段沈める(pressable と同じ)
                "--ticket-shadow":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                [ACTIVE]: {
                    "--ticket-paper": "var(--mpc-colors-color-palette-solid-emphasized)",
                },
                _disabled: usedTicket,
            },
            // 補助的な操作。クリーム色の紙にパレットのインクで刷り、半券はパレットを帯びた紙にする
            secondary: {
                color: "colorPalette.fg",
                "--ticket-paper": CREAM,
                "--ticket-stub-bg": `color-mix(in oklab, ${CREAM}, var(--mpc-colors-color-palette-5) 55%)`,
                "--ticket-stub-fg": "var(--mpc-colors-color-palette-fg)",
                "--ticket-tear": "var(--mpc-colors-color-palette-border-emphasized)",
                "--ticket-shadow": TAN,
                "--ticket-dot": "color-mix(in oklab, var(--mpc-colors-color-palette-7), transparent 70%)",
                "--ticket-lip": "white",
                [ACTIVE]: {
                    "--ticket-paper": CREAM_PRESSED,
                },
                _disabled: usedTicket,
            },
            // 最も控えめな操作。静止時は紙も影も無く文字だけ。hover で初めてクリームの券が現れる
            plain: {
                color: "colorPalette.fg",
                "--ticket-paper": "transparent",
                "--ticket-stub-bg": "transparent",
                "--ticket-stub-fg": "var(--mpc-colors-color-palette-fg)",
                // 静止時は紙が無いので、ミシン目だけが浮いて区切り線に見えないよう消しておく
                "--ticket-tear": "transparent",
                "--ticket-shadow": "transparent",
                [HOVER]: {
                    "--ticket-tear": "var(--mpc-colors-color-palette-border-emphasized)",
                    "--ticket-dot": "color-mix(in oklab, var(--mpc-colors-color-palette-7), transparent 70%)",
                    "--ticket-lip": "white",
                    "--ticket-paper": CREAM,
                    "--ticket-stub-bg": `color-mix(in oklab, ${CREAM}, var(--mpc-colors-color-palette-5) 55%)`,
                    "--ticket-shadow": TAN,
                },
                [ACTIVE]: {
                    "--ticket-tear": "var(--mpc-colors-color-palette-border-emphasized)",
                    "--ticket-dot": "color-mix(in oklab, var(--mpc-colors-color-palette-7), transparent 70%)",
                    "--ticket-paper": CREAM_PRESSED,
                    "--ticket-stub-bg": `color-mix(in oklab, ${CREAM_PRESSED}, var(--mpc-colors-color-palette-5) 55%)`,
                    "--ticket-shadow": TAN,
                },
                _disabled: {
                    ...usedTicket,
                    "--ticket-paper": "transparent",
                    "--ticket-stub-bg": "transparent",
                    "--ticket-tear": "transparent",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)。下影の 1〜6px はその外にはみ出す装飾として扱う
        size: {
            sm: {
                height: "control.sm",
                fontSize: "xs",
                "--ticket-pad": "var(--mpc-spacing-2\\.5)",
                "--ticket-notch": "5px",
                "--ticket-radius": "10px",
                "&[data-stub]": { "--ticket-stub": "34px" },
            },
            md: {
                height: "control.md",
                fontSize: "sm",
                "--ticket-pad": "var(--mpc-spacing-3)",
                "--ticket-notch": "6px",
                "--ticket-radius": "11px",
                "&[data-stub]": { "--ticket-stub": "38px" },
            },
            lg: {
                height: "control.lg",
                fontSize: "md",
                "--ticket-pad": "var(--mpc-spacing-3\\.5)",
                "--ticket-notch": "7px",
                "--ticket-radius": "12px",
                "&[data-stub]": { "--ticket-stub": "42px" },
            },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});

export type TicketButtonProps = ComponentPropsWithoutRef<"button"> &
    RecipeVariantProps<typeof ticketButton> & {
        /** 半券に置くアイコン。指定すると左端に半券とミシン目が付く */
        stub?: ReactNode;
    };

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージからは @ark-ui/react が解決できない(packages/react の node_modules にしか無い)ため、
// ark.button ではなくネイティブの <button> で組む。asChild 以外の振る舞いは同じ
export const TicketButton = forwardRef<HTMLButtonElement, TicketButtonProps>(
    ({ intent, size, stub, className, children, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            // 半券の有無で余白と上下の切り欠きを切り替える
            data-stub={stub ? "" : undefined}
            className={cx(ticketButton({ intent, size }), className)}
            {...props}
        >
            {stub ? (
                <span data-part="stub" aria-hidden="true">
                    {stub}
                </span>
            ) : null}
            {children}
        </button>
    ),
);
TicketButton.displayName = "TicketButton";

// 一覧表示用のレイアウト
const showcaseStyles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "6" }),
    // ページの地色(colorPalette.bg)の上に置くセクション
    section: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "colorPalette.bg",
    }),
    // 白いパネル(bg.panel)の上に置くセクション。クリーム紙の見え方を地色と比べるために使う
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// intent × size の行をまとめて描く(半券あり)
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <TicketButton key={size} intent={intent} size={size} stub={<TicketIcon />}>
                        {intent} {size}
                    </TicketButton>
                ))}
                {/* 半券なしの形(左右の切り欠きだけ)も並べて比べる */}
                <TicketButton intent={intent}>{intent} 半券なし</TicketButton>
            </div>
        ))}
    </>
);

// hover / active の見た目を静止状態で並べる。傾き・つぶれ・影の伸縮を見比べるため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <TicketButton key={preview ?? "rest"} intent={intent} data-preview={preview} stub={<GiftIcon />}>
                        {intent} {preview ?? "rest"}
                    </TicketButton>
                ))}
                <TicketButton intent={intent} stub={<GiftIcon />} disabled>
                    {intent} disabled
                </TicketButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <TicketButton key={intent} intent={intent} stub={<PlaneIcon />}>
                {intent}
                <ArrowRightIcon />
            </TicketButton>
        ))}
    </div>
);

const meta: Meta<typeof TicketButton> = {
    title: "LAB/Button Designs/Ticket",
    component: TicketButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Ticket** — マイルチケットやクーポン券をモチーフにしたボタンです。左右の辺の中央に半円の切り欠き(パンチ穴)を radial-gradient の mask で抜き、`stub` を渡すと左端に半券ができて、点線のミシン目と上下の小さな切り欠きで本体と区切られます。",
                    "primary はパレットの solid で刷った券、secondary はクリーム色の紙にパレットのインク、plain は静止時は文字だけで hover すると券が現れます。角はころんと大きく丸め、半券には水玉、紙の上辺には照りを入れています。hover で少し浮いて左に傾き、半券のアイコンがぴょこっと首をかしげ、押すと横に広がって縦につぶれ(squash)、ばね風のイージングで戻ります。動きを減らす設定では傾き・つぶれは無効になり、影の伸縮だけが残ります。",
                    "",
                    "**借りている「やさしいゲーム UI」の感触**: どうぶつの森系のゲームで、マイルやチケットを受け取ったり交換したりする場面の、クリーム色の紙・ころんとした丸ゴシック(M PLUS Rounded 1c)・机の上に置いたような厚みのある柔らかい下影・ぷにっと弾む反応。ゲームのロゴや素材そのものは使っていません。",
                    "",
                    "**強み**: 「引き換える」「受け取る」「予約する」「応募する」のような、何かと交換する操作の意味がモチーフから直感的に伝わります。半券にアイコンを置く構成なので、アイコンの位置と大きさが常に揃い、並べたときにリズムが出ます。色はトークン経由で mori / umi / red に追従します(クリーム紙と木の影だけは任意値)。",
                    "",
                    "**トレードオフ**: 装飾が強く、フォームの送信ボタンのような日常的な操作に多用すると画面がにぎやかになりすぎます。キャンペーンやご褒美の受け取りなど、ここぞという場面向きです。クリーム紙は地色(colorPalette.bg)や白との差がほぼ無く、輪郭は tan の下影(Lc 40 前後)と切り欠きの形で読ませているため、白いパネル上では平板に見えがちです。mask-composite: intersect に依存するので古いブラウザでは切り欠きが出ない可能性があります。red の primary は solid 自体の明るさにより白文字が Lc 70.5 と、本文の目安 75 に届きません(既存 Button と共通の課題)。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        disabled: { control: "boolean" },
        stub: { control: false },
    },
    args: {
        children: "チケットと交換",
        intent: "primary",
        size: "lg",
        disabled: false,
        stub: <TicketIcon />,
    },
};

export default meta;
type Story = StoryObj<typeof TicketButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* クリーム紙は白との差が小さいので、白いパネルの上での見え方も並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>状態(rest → hover → active → disabled)</span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン(leading / trailing)</span>
                <div className={showcaseStyles.row}>
                    <TicketButton stub={<SparklesIcon />}>
                        ご褒美を受け取る
                        <ArrowRightIcon />
                    </TicketButton>
                    <TicketButton intent="secondary">
                        <PlusIcon />
                        クーポンを追加
                    </TicketButton>
                    <TicketButton intent="secondary" stub={<PlaneIcon />}>
                        予約する
                        <ArrowRightIcon />
                    </TicketButton>
                    <TicketButton intent="plain" stub={<TicketIcon />}>
                        くわしく
                    </TicketButton>
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled(使用済みの券)</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <TicketButton key={intent} intent={intent} stub={<TicketIcon />} disabled>
                            {intent}
                        </TicketButton>
                    ))}
                    {INTENTS.map((intent) => (
                        <TicketButton key={`${intent}-plain`} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </TicketButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、券面・インク・影・フォーカスリングがパレットに追従することを確認する */}
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
