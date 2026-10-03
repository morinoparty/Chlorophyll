import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, HeartIcon, LeafIcon, MessageCircleIcon, PlusIcon, SparklesIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * LAB: Island Bubble(島のふきだし)方向のボタン
 *
 * のんびり系の島暮らしゲームの「会話の選択肢」「メニューのふきだし」の手触りを借りた方向性。
 * クリーム色のぽってりした面に、木の色をした太めの側面(edge)と柔らかい接地影を重ね、
 * 丸ゴシック(M PLUS Rounded 1c の 800)で文字を載せる。
 * hover は会話の選択肢にカーソルが乗ったときのように面が黄色く灯り、ぴょこっと跳ねて少しだけ傾き、
 * 左脇に選択肢を指すカーソルがすっと現れる。押下ではむにっと横に潰れる。
 * 動きはばね風の cubic-bezier で付け、「動きを減らす」設定では移動・変形をすべて止める。
 *
 * パレット追従: primary の面・secondary / plain の文字・フォーカスリングは colorPalette 側のトークンを使う。
 * クリーム・黄色の面、木の側面、選択カーソルは対応するトークンが無いので任意値にしている。
 *
 * APCA(apca-w3 calcAPCA)計測値。styled-system/styles.css の oklch 値を sRGB に解決して計算
 *   primary   : contrast(白) on solid(step9)                 mori 79.1 / umi 78.5 / red 70.5
 *               hover solid.emphasized(step10)               mori 84.5 / umi 84.0 / red 74.5
 *               active solid.active                          mori 88.7 / umi 87.7 / red 80.6
 *               edge(step10 + step12 45%) vs colorPalette.bg mori 80.4 / umi 79.5 / red 73.7、vs 白 88.6 / 87.5 / 82.4
 *   secondary : colorPalette.fg on CREAM(#FFF8E6)              mori 78.0 / umi 78.2 / red 77.8
 *               hover colorPalette.12 on HIGHLIGHT(#FFE27A)      mori 81.6 / umi 80.1 / red 79.5
 *               active colorPalette.12 on HIGHLIGHT_ACTIVE(#FFD95C) mori 77.6 / umi 76.0 / red 75.4
 *               (fg のまま黄色い面に載せると 61〜66 に落ちるため、hover / active は step12 に沈める)
 *               CREAM vs colorPalette.bg は Lc 0(明度がほぼ同じ)。静止時の輪郭は WOOD の側面だけで出している
 *               WOOD(#B8925A) vs colorPalette.bg mori 46.7 / umi 46.9 / red 46.2、vs 白 54.9、vs CREAM 50.9
 *               hover / active の側面 WOOD_LIT(#B87A1E) vs colorPalette.bg 55.0 / 55.2 / 54.6、vs 白 63.3、vs HIGHLIGHT 47.0
 *   plain     : colorPalette.fg on 白 mori 82.1 / umi 82.3 / red 81.8、on colorPalette.bg 73.8 / 74.2 / 73.1
 *               hover / active は secondary と同じ面・文字(81.6〜79.5 / 77.6〜75.4)
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9(目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0、vs colorPalette.bg 65.5 / 65.0 / 56.3
 *   選択カーソル: WOOD_LIT(#B87A1E) をボタンの外に置く。vs colorPalette.bg 55.0 / 55.2 / 54.6、vs 白 63.3
 */

// クリームの面。島の看板やふきだしの紙のような、ほんのり黄みを帯びた白
const CREAM = "#FFF8E6";
// 会話の選択肢にカーソルが乗ったときの、ぽっと灯る黄色い面
const HIGHLIGHT = "#FFE27A";
// 押下で一段濃くした黄色。step12 の文字が Lc 75 を割らない明度に留めている
const HIGHLIGHT_ACTIVE = "#FFD95C";
// 木の色の側面。ページの地色に対して Lc 45 を超える明度まで落としてある
const WOOD = "#B8925A";
// 黄色い面に合わせて、日が当たったように橙へ寄せた側面。hover の選択カーソルにも使う
const WOOD_LIT = "#B87A1E";
// 丸ゴシック(preview-head.html で読み込み済み)
const ROUNDED_FONT = "'M PLUS Rounded 1c', sans-serif";
// 行き過ぎてから戻る、ばね風のイージング(squash & stretch 用)
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// hover / active は無効状態では効かせない(既存 Button レシピと同じガード)
// data-preview は Showcase で hover / active の見た目を静止状態のまま並べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// 接地影。edge の色を薄めて、edge のさらに下にふわっと落とす
const groundShadow = (depth: string, blur: string) =>
    `0 calc(${depth} + 3px) ${blur} -2px color-mix(in oklab, var(--bubble-edge) 40%, transparent)`;

// 面の上端に入れる、ぽってりした艶。色(--bubble-gloss)は intent が差し替える
const GLOSS = "inset 0 2px 0 0 var(--bubble-gloss)";

// edge は 0 ぼかしの box-shadow で描く。厚み(--bubble-depth)は size、色(--bubble-edge)は intent が差し替える
const EDGE_REST = `${GLOSS}, 0 var(--bubble-depth) 0 0 var(--bubble-edge), ${groundShadow("var(--bubble-depth)", "10px")}`;
// hover では跳ねた 3px ぶん edge を伸ばし、接地点を動かさない
const EDGE_HOVER = `${GLOSS}, 0 calc(var(--bubble-depth) + 3px) 0 0 var(--bubble-edge), ${groundShadow("calc(var(--bubble-depth) + 3px)", "14px")}`;
// 押下中は edge をほぼ潰し、影も消して地面に押し付けたように見せる
const EDGE_PRESSED = `${GLOSS}, 0 1px 0 0 var(--bubble-edge)`;

// フォーカスリング。recipes/shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

// disabled 共通: 押し込まれたまま平らになったふきだし。edge と影を消し、面を厚みぶん沈めて接地点を揃える
const flatDisabled = {
    bg: "bg.disabled",
    color: "fg.disabled",
    boxShadow: "none",
    transform: "translateY(var(--bubble-depth))",
    "--bubble-tail-shadow": "transparent",
} as const;

export const islandBubbleButton = cva({
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        position: "relative",
        // 疑似要素(しっぽ・印)の重なり順を、ボタンの中だけで完結させる
        isolation: "isolate",
        border: "none",
        // ふきだしらしい、ぽってりした丸み
        borderRadius: "full",
        fontFamily: ROUNDED_FONT,
        fontWeight: "[800]",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // 潰れる・跳ねるときの支点を接地面(下端の中央)に置く
        transformOrigin: "center bottom",
        // edge はレイアウト上の高さを持たないので、下に並ぶ要素と重ならないよう厚みぶん空ける
        marginBlockEnd: "[var(--bubble-depth)]",
        boxShadow: EDGE_REST,
        transitionProperty: "transform, box-shadow, background-color, color",
        transitionDuration: "normal",
        transitionTimingFunction: SPRING,
        _motionReduce: { transitionProperty: "box-shadow, background-color, color" },
        // lucide-react のアイコンを文字サイズに合わせ、丸ゴシックに合わせて線も太めにする
        "& :where(svg)": {
            strokeWidth: "[2.6px]",
            fontSize: "1.3em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },
        // hover で左脇にすっと現れる「選択中」のカーソル。島の会話で選択肢を指す、右向きのしずく形の指し示し
        // 45 度回した正方形の右上の角だけを尖らせ、残りを丸めるとしずくの先が右(ボタン側)を向く
        // ボタンの外(行の gap 16px の中)に置き、ラベルやアイコンには重ねない。静止時は左に引いて透明にしておく
        _after: {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "[-15px]",
            width: "[10px]",
            height: "[10px]",
            borderRadius: "[50% 2px 50% 50%]",
            backgroundColor: WOOD_LIT,
            opacity: "0",
            transform: "translate(-6px, -50%) rotate(45deg) scale(0.4)",
            transitionProperty: "transform, opacity",
            transitionDuration: "normal",
            transitionTimingFunction: SPRING,
            pointerEvents: "none",
            // 動きを減らす設定では、出入りどちらの向きでもアニメーションさせずにその場で切り替える
            _motionReduce: { transition: "none" },
        },
        [HOVER]: {
            boxShadow: EDGE_HOVER,
            // ぴょこっと跳ねて、少しだけ首をかしげる。動きを減らす設定では位置も角度も変えない
            _motionSafe: { transform: "translateY(-3px) rotate(-1deg)" },
            // カーソルは動きを減らす設定でもその場に出す(移動のアニメーションは _after 側で止めている)
            _after: {
                opacity: "1",
                transform: "translate(0, -50%) rotate(45deg) scale(1)",
            },
        },
        [ACTIVE]: {
            boxShadow: EDGE_PRESSED,
            // 押した瞬間は遅れを感じさせないよう速く潰す
            transitionDuration: "fastest",
            // 横に広がりつつ縦に潰れる squash。edge を潰したぶん面も下げる
            _motionSafe: {
                transform: "translateY(calc(var(--bubble-depth) - 1px)) scale(1.03, 0.94)",
            },
            // 押した瞬間、カーソルがボタンをつつくように少し右へ寄る
            _after: { opacity: "1", transform: "translate(3px, -50%) rotate(45deg) scale(0.9)" },
        },
        _focusVisible: focusRing,
        _disabled: {
            cursor: "not-allowed",
            _after: { display: "none" },
        },
    },
    variants: {
        intent: {
            // 最も強い操作。パレットの solid の面に、同じ系統を深く沈めた edge を付ける
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                // solid.active だと面との差が小さく溶けるため、step10 に step12 を 45% 混ぜる
                "--bubble-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                "--bubble-tail-shadow": "var(--bubble-edge)",
                // 濃い面には白を薄く載せた艶にして、ぎらつかせない
                "--bubble-gloss": "color-mix(in oklab, white 22%, transparent)",
                [HOVER]: { bg: "colorPalette.solid.emphasized" },
                [ACTIVE]: { bg: "colorPalette.solid.active" },
                _disabled: flatDisabled,
            },
            // 補助的な操作。クリームのふきだしに木の edge。文字はパレットの fg に追従させる
            secondary: {
                bg: CREAM,
                color: "colorPalette.fg",
                "--bubble-edge": WOOD,
                "--bubble-tail-shadow": "var(--bubble-edge)",
                "--bubble-gloss": "rgba(255, 255, 255, 0.75)",
                // 選択肢が選ばれたときのように面を黄色く灯し、側面も日なたの橙に寄せる
                // 面が明度を落とすぶん、文字は step12 に沈めて Lc 75 以上を保つ
                [HOVER]: { bg: HIGHLIGHT, color: "colorPalette.12", "--bubble-edge": WOOD_LIT },
                [ACTIVE]: { bg: HIGHLIGHT_ACTIVE, color: "colorPalette.12", "--bubble-edge": WOOD_LIT },
                _disabled: flatDisabled,
            },
            // 最も控えめな操作。静止時は文字だけで、hover で初めてクリームのふきだしが現れる
            plain: {
                bg: "transparent",
                color: "colorPalette.fg",
                "--bubble-edge": "transparent",
                "--bubble-tail-shadow": "transparent",
                "--bubble-gloss": "rgba(255, 255, 255, 0.75)",
                boxShadow: "none",
                marginBlockEnd: "0",
                [HOVER]: {
                    bg: HIGHLIGHT,
                    color: "colorPalette.12",
                    // plain は跳ねても厚みを持たせず、艶と薄い接地影だけを足して浮いた感じを出す
                    boxShadow: `${GLOSS}, 0 3px 8px -2px color-mix(in oklab, ${WOOD_LIT} 45%, transparent)`,
                },
                [ACTIVE]: {
                    bg: HIGHLIGHT_ACTIVE,
                    color: "colorPalette.12",
                    boxShadow: "none",
                    _motionSafe: { transform: "scale(1.03, 0.94)" },
                },
                _disabled: {
                    bg: "transparent",
                    color: "fg.disabled",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)に揃え、edge は高さの外側に付ける
        size: {
            sm: { height: "control.sm", px: "{spacing.4}", fontSize: "sm", "--bubble-depth": "3px" },
            md: { height: "control.md", px: "{spacing.5}", fontSize: "sm", "--bubble-depth": "4px" },
            lg: { height: "control.lg", px: "{spacing.6}", fontSize: "md", "--bubble-depth": "5px" },
        },
        // talk は左下に小さな「しっぽ」を付けて、会話のふきだしそのものに見せる
        shape: {
            pill: {},
            talk: {
                _before: {
                    content: '""',
                    position: "absolute",
                    left: "[22px]",
                    bottom: "[-5px]",
                    width: "[12px]",
                    height: "[12px]",
                    // 面と同じ色を継承し、hover / active の色変化にも追従させる
                    bg: "inherit",
                    // しっぽの右下にも edge を落として、本体と同じ厚みに見せる
                    boxShadow: "[3px 3px 0 0 var(--bubble-tail-shadow)]",
                    transform: "rotate(45deg)",
                    borderRadius: "[2px]",
                    // 本体の背景より上・文字より下に置く(isolation で閉じた重なりの中)
                    zIndex: "-1",
                    pointerEvents: "none",
                },
            },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
        shape: "pill",
    },
});

export type IslandBubbleButtonProps = ComponentProps<"button"> & RecipeVariantProps<typeof islandBubbleButton>;

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージは @ark-ui/react を依存に持たず解決できないため、他の LAB と同じくネイティブの button を使う
export const IslandBubbleButton = ({ className, intent, size, shape, ...props }: IslandBubbleButtonProps) => {
    return <button type="button" {...props} className={cx(islandBubbleButton({ intent, size, shape }), className)} />;
};

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
    // 白いパネルの上に置くセクション。クリームの面と木の edge が白の上でどう見えるかを比べる
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
const SHAPES = ["pill", "talk"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <IslandBubbleButton key={size} intent={intent} size={size}>
                        <PlusIcon />
                        {intent} {size}
                        <ArrowRightIcon />
                    </IslandBubbleButton>
                ))}
            </div>
        ))}
    </>
);

// hover / active の見た目を静止状態で並べる
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <IslandBubbleButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </IslandBubbleButton>
                ))}
                <IslandBubbleButton intent={intent} disabled>
                    {intent} disabled
                </IslandBubbleButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <IslandBubbleButton key={intent} intent={intent}>
                <SparklesIcon />
                {intent}
            </IslandBubbleButton>
        ))}
        <IslandBubbleButton intent="secondary" shape="talk">
            <MessageCircleIcon />
            はなしかける
        </IslandBubbleButton>
    </div>
);

const meta: Meta<typeof IslandBubbleButton> = {
    title: "LAB/Button Designs/Island Bubble",
    component: IslandBubbleButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Island Bubble** — のんびり島暮らし系ゲームの「会話の選択肢」や「メニューのふきだし」の手触りを借りた方向性です。クリーム色のぽってりした面に木の色の太い側面と柔らかい接地影を付け、丸ゴシック(M PLUS Rounded 1c の 800)で文字を載せます。",
                    'hover では会話の選択肢にカーソルが乗ったときのように面が黄色く灯り、ぴょこっと 3px 跳ねて少し首をかしげ、左脇に選択肢を指すしずく形のカーソルがすっと現れます。押下では横 103% / 縦 94% にむにっと潰れ、側面が地面に押し付けられます。動きはばね風のイージングで、「動きを減らす」設定では移動・変形を止め、色と影の変化だけを残します。`shape="talk"` を付けると左下にしっぽが付き、会話のふきだしそのものになります。',
                    "",
                    "**強み**: 一目で「押せる」と分かる厚みがあり、親しみやすく楽しい手触りです。primary の面・文字・フォーカスリングは colorPalette に追従するので mori / umi / red でもそのまま使えます。secondary はクリームの面に colorPalette.fg を載せて Lc 78 前後、黄色く灯る hover / active では文字を step12 に沈めて Lc 75 以上を保っています。",
                    "",
                    "**トレードオフ**: クリーム・黄色・木の色はトークンに無い任意値で、ダークモードや他のテーマには追従しません。クリームの面はページの地色(colorPalette.bg)とほぼ同じ明度(Lc 0)なので、輪郭は木の側面(Lc 約 47)だけが担っています。丸ゴシックの 800 と大きな角丸・厚みは存在感が強く、フォームの中やテーブルの行など密度の高い場所ではうるさく見えます。red の primary は白文字が Lc 70.5 で本文の目安 75 に届きません(既存 Button と共通の課題)。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        shape: { control: "select", options: SHAPES },
        disabled: { control: "boolean" },
    },
    args: {
        children: "ボタンだよー",
        intent: "primary",
        size: "lg",
        shape: "pill",
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof IslandBubbleButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* クリームの面は地色と明度が近いので、白いパネルの上での見え方も並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>状態(rest → hover → active → disabled)</span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>アイコン / ふきだし(shape: talk)</span>
                <div className={showcaseStyles.row}>
                    <IslandBubbleButton>
                        <LeafIcon />
                        島へでかける
                    </IslandBubbleButton>
                    <IslandBubbleButton intent="secondary">
                        つぎへ
                        <ArrowRightIcon />
                    </IslandBubbleButton>
                    <IslandBubbleButton intent="plain">
                        <HeartIcon />
                        お気に入り
                    </IslandBubbleButton>
                </div>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <IslandBubbleButton key={intent} intent={intent} shape="talk">
                            <MessageCircleIcon />
                            {intent === "plain" ? "やめておく" : "はなしかける"}
                        </IslandBubbleButton>
                    ))}
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <IslandBubbleButton key={intent} intent={intent} disabled>
                            <PlusIcon />
                            {intent}
                        </IslandBubbleButton>
                    ))}
                    <IslandBubbleButton intent="secondary" shape="talk" disabled>
                        <MessageCircleIcon />
                        talk
                    </IslandBubbleButton>
                </div>
            </section>
            {/* colorPalette を切り替えて、面・文字・フォーカスリングがパレットに追従することを確認する */}
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
