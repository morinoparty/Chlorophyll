import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, GiftIcon, PlusIcon, ShoppingBasketIcon } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { css, cva, cx, type RecipeVariantProps } from "styled-system/css";

/**
 * Leaf Tag ボタン(デザイン検証用のプロトタイプ)
 *
 * 村のお店の値札(プライスタグ)をモチーフにした、どうぶつの森っぽい「ほっこり系」の方向性。
 * 片側がとがった(または丸い)札の形で、とがった側に小さなハトメ穴が空いている。
 * 静止時は -2deg だけ傾いて吊り下がり、hover でまっすぐになりながら持ち上がり、押すとむにっと潰れる。
 * 札の右上の縁からはふた葉の芽(装飾。aria-hidden)が生えていて、hover でぴょこっと揺れる。
 * ハトメ穴からは麻ひもが上へ抜けていて、傾いた札が「吊るされている」ように見える。
 *
 * 構造:
 *   <button>                       … 透明。フォーカスリング・傾き・持ち上げ(transform)を受け持つ
 *     <span data-part="tag">       … 札の本体(塗り)。::before が札の先端、::after がハトメ穴。
 *                                     厚みのある下影は filter: drop-shadow で描くので、先端の形にも影が沿う
 *     {children}                   … ラベルとアイコン
 *     <span data-part="string">    … ハトメ穴から上へ抜ける麻ひも
 *     <span data-part="leaf">      … ふた葉の芽の飾り
 * clip-path をボタン自身に掛けるとフォーカスリング(outline)まで切り抜かれるため、
 * 形の切り抜きは札本体の疑似要素(::before)だけに閉じ込めている。
 *
 * APCA 計測値(apca-w3 の APCAcontrast / sRGBtoY。トークンは styled-system/styles.css の light ランプから解決し、
 * color-mix は CSS と同じ補間空間で合成。既存コメントの mori.9 on 白 73.7 / gray.9 on gray.4 46.9 と一致を確認済み):
 *   primary   : colorPalette.contrast(白) on solid(step9)
 *               mori 79.1 / umi 78.5 / red 70.5(red の solid 自体の値。既存 Button と同じ課題)
 *               hover(solid.emphasized) mori 84.5 / umi 84.0 / red 74.5
 *               active(solid.active)    mori 88.7 / umi 87.7 / red 80.6
 *               つや(上 40%)が最も掛かる字面の上端(高さ 30% / 白 5%)でも mori 76.6 / umi 76.0 / red 68.6
 *               札の下影(step10 + step12 45%) vs colorPalette.bg mori 80.4 / umi 79.5 / red 73.7、
 *               vs 白 88.6 / 87.5 / 82.4、vs 札の面(step9) 13.0 / 12.5 / 15.5
 *   secondary : 札の面はクリーム色(#FFF7E3)。クリームは白とも colorPalette.bg とも Lc 0(輪郭にならない)なので、
 *               札の形は木の色の下影(#AD8A5C)で描く: vs 白 59.1 / vs colorPalette.bg mori 50.9 / umi 51.1 / red 50.4
 *               静止: colorPalette.fg on クリーム mori 77.5 / umi 77.7 / red 77.2
 *               hover(#FCEFD2)は文字を step12 に沈める: mori 88.9 / umi 87.4 / red 86.8
 *               (colorPalette.fg のままだと 73.1 / 73.3 / 72.8)
 *               active(#F8E6C0)も step12: mori 84.0 / umi 82.5 / red 81.9(colorPalette.fg だと 68 前後)
 *   plain     : colorPalette.fg on 白 mori 82.1 / umi 82.3 / red 81.8、on colorPalette.bg 73.8 / 74.2 / 73.1
 *               hover / active は secondary と同じクリームの札が現れ、文字は step12(上の hover / active と同値)
 *   disabled  : fg.disabled(gray.9) on bg.disabled(gray.4) 46.9 / plain は on 白 60.4、on colorPalette.bg 51.7〜52.4
 *               (目安 Lc 30 以上)
 *   focus ring: colorPalette.focus.ring(step9) vs 白 mori 73.7 / umi 73.1 / red 65.0、
 *               vs colorPalette.bg mori 65.5 / umi 65.0 / red 56.3(目安 Lc 45 以上)
 *   葉っぱ・ハトメ穴・麻ひもは情報を持たない装飾なので、コントラストの対象外とした
 */

// disabled 以外にだけ hover / active を効かせるためのセレクタ。
// data-preview は Showcase で hover / active の姿を静止状態のまま並べて見比べるためのフック
const HOVER = "&:not(:disabled):not([data-disabled]):is(:hover, [data-preview=hover])";
const ACTIVE = "&:not(:disabled):not([data-disabled]):is(:active, [data-preview=active])";

// 子パーツへのセレクタ。ボタン側の状態から札本体・葉っぱの見た目を切り替えるために使う
const TAG = "& > [data-part=tag]";
const LEAF = "& > [data-part=leaf]";
const STRING = "& > [data-part=string]";

// クリーム色の札と木の色。トークンに相当する暖色が無いため、ここだけ任意値で持つ
const CREAM = "#FFF7E3";
const CREAM_HOVER = "#FCEFD2";
const CREAM_ACTIVE = "#F8E6C0";
// 木の色。クリームの札は地色と見分けが付かないので、この色の下影が札の輪郭そのものになる(白 Lc 59.1 / bg Lc 50 台)
const WOOD = "#AD8A5C";

// 札を吊るす麻ひもの色。札の上の地色・primary の塗りのどちらの上でも線として見える中間の茶色
const TWINE = "#BF9560";

// とがった先端を二次ベジェで丸めたポリゴン。百分率で書くので、どのサイズの札でも同じ比率で効く
const roundedPointNotch = (() => {
    // 先端から斜辺に沿って 32% のところから丸め始める
    const f = 0.32;
    const steps = 6;
    const points: string[] = ["100% 0"];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = f * ((1 - t) ** 2 + t ** 2);
        const y = (1 - t) ** 2 * (0.5 - 0.5 * f) + 2 * t * (1 - t) * 0.5 + t ** 2 * (0.5 + 0.5 * f);
        points.push(`${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`);
    }
    points.push("100% 100%");
    return `polygon(${points.join(", ")})`;
})();

// 札の上 40% だけに乗せる薄い白のつや
const GLOSS = "linear-gradient(180deg, rgb(255 255 255 / 0.2), rgb(255 255 255 / 0) 40%)";

// ぴょんと行き過ぎてから戻る、バネのようなイージング(どうぶつの森の UI の弾む手触り)
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// 札の厚み。0 ぼかしの drop-shadow を 1 本(木の側面)+ 柔らかい接地影を 1 本重ねる。
// filter はボタンではなく札本体に掛けるので、フォーカスリングには影が落ちない
const tagShadow = (depth: string, blur: string) =>
    `drop-shadow(0 ${depth} 0 var(--leaf-tag-edge)) drop-shadow(0 calc(${depth} + 2px) ${blur} color-mix(in oklab, var(--leaf-tag-edge) 40%, transparent))`;
const SHADOW_REST = tagShadow("var(--leaf-tag-depth)", "4px");
// hover では持ち上がった 2px ぶん側面を伸ばし、接地点を動かさない
const SHADOW_HOVER = tagShadow("calc(var(--leaf-tag-depth) + 2px)", "8px");
// 押下中は側面をほぼ潰す。関数の並びを揃えておくと filter がなめらかに補間される
const SHADOW_PRESSED = tagShadow("1px", "2px");

// フォーカスリング。shared/focus-ring.ts と同じくロングハンドで明示する(#78)
const focusRing = {
    outlineStyle: "solid",
    outlineWidth: "focus.ring",
    outlineColor: "colorPalette.focus.ring",
    outlineOffset: "focus.ring.offset",
} as const;

export const leafTagButtonStyle = cva({
    base: {
        // 札本体(z-index: -1)をラベルの下に敷くため、ボタン自身でスタッキングコンテキストを作る
        position: "relative",
        isolation: "isolate",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        // ボタン自身は透明。塗りは札本体が持つ
        bg: "transparent",
        border: "none",
        // フォーカスリングを札の丸みに沿わせる
        borderRadius: "[18px]",
        // 丸ゴシック(preview-head で読み込み済み)で、値札の手書きっぽい親しみを出す
        fontFamily: "['M PLUS Rounded 1c', sans-serif]",
        fontWeight: "[800]",
        letterSpacing: "wide",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        // ハトメ穴の中心(--leaf-tag-hole-x)から穴の半径とすき間のぶんだけ空けてラベルを始める
        paddingInlineStart: "[calc(var(--leaf-tag-hole-x) + var(--leaf-tag-hole) / 2 + var(--leaf-tag-gap))]",
        // 下影はレイアウト上の高さを持たないので、下に並ぶ要素と重ならないよう厚みぶんの余白を確保する
        marginBlockEnd: "[var(--leaf-tag-depth)]",
        // 静止時は値札が吊り下がっているように少しだけ傾ける。
        // 傾きは静的な姿勢なので「動きを減らす」設定でも残し、状態変化に伴う動きだけを止める
        transform: "[rotate(var(--leaf-tag-tilt))]",
        transformOrigin: "50% 100%",
        "--leaf-tag-tilt": "-2deg",
        // 札のつや。札が見えていない状態(plain の静止時・disabled)では none にする
        "--leaf-tag-gloss": GLOSS,
        // 戻りはバネで少し行き過ぎてから止まる
        transitionProperty: "transform, color",
        transitionDuration: "[320ms]",
        transitionTimingFunction: `[${SPRING}]`,
        _motionReduce: { transitionProperty: "color" },
        // lucide-react のアイコン(直下の svg のみ。葉っぱの飾りの svg は対象外)を文字サイズに合わせる
        "& > :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
            flexShrink: "0",
        },

        // 札本体。ボタン全体から先端のぶんだけ左を空けた矩形で、右側だけ大きく丸める
        [TAG]: {
            position: "absolute",
            insetBlock: "0",
            insetInlineEnd: "0",
            insetInlineStart: "[var(--leaf-tag-point)]",
            zIndex: "-1",
            borderRadius: "[0 18px 18px 0]",
            bg: "[var(--leaf-tag-face)]",
            // 上 40% だけに薄い白のつやを乗せ、ぽってりした厚みを出す。ラベルの中央(50%)には掛からない。
            // ::before は background: inherit でこのグラデーションごと受け継ぐので、先端との継ぎ目が出ない
            backgroundImage: "[var(--leaf-tag-gloss)]",
            filter: SHADOW_REST,
            transitionProperty: "background-color, filter",
            transitionDuration: "fast",
            transitionTimingFunction: "easeOut",
            // 札の先端。本体の色を受け継ぎ(background: inherit)、切り抜きはこの疑似要素だけに閉じ込める
            _before: {
                content: '""',
                position: "absolute",
                insetBlock: "0",
                insetInlineEnd: "[calc(100% - 0.5px)]",
                width: "[var(--leaf-tag-point)]",
                background: "inherit",
                clipPath: "[var(--leaf-tag-notch)]",
            },
            // ハトメ穴。先端寄りの中央に小さな丸を置き、内側の影で凹みを出す
            _after: {
                content: '""',
                position: "absolute",
                top: "50%",
                insetInlineStart: "[calc(var(--leaf-tag-hole-x) - var(--leaf-tag-point) - var(--leaf-tag-hole) / 2)]",
                width: "[var(--leaf-tag-hole)]",
                height: "[var(--leaf-tag-hole)]",
                transform: "translateY(-50%)",
                borderRadius: "full",
                bg: "[var(--leaf-tag-hole-bg)]",
                boxShadow: "[inset 0 1.5px 0 0 color-mix(in oklab, var(--leaf-tag-edge) 70%, transparent)]",
            },
        },

        // 葉っぱ(ふた葉の芽)の飾り。札の右上の縁から生えているように、茎の根元を縁に少し埋める
        [LEAF]: {
            position: "absolute",
            top: "[calc(var(--leaf-tag-leaf) * -0.8)]",
            insetInlineEnd: "[12px]",
            width: "[var(--leaf-tag-leaf)]",
            height: "[var(--leaf-tag-leaf)]",
            zIndex: "1",
            color: "[var(--leaf-tag-leaf-color)]",
            transform: "rotate(-8deg)",
            // 茎の根元を軸に揺らす
            transformOrigin: "50% 92%",
            pointerEvents: "none",
            transitionProperty: "transform, color",
            transitionDuration: "[420ms]",
            transitionTimingFunction: `[${SPRING}]`,
            _motionReduce: { transitionProperty: "color" },
            "& svg": { display: "block", width: "100%", height: "100%", overflow: "visible" },
        },

        // 札を吊るす麻ひも。ハトメ穴の上端から札の上へ抜けていき、傾いた札が「吊られている」ように見せる。
        // 札本体の子にすると drop-shadow の影が二重に付くので、ボタン直下に置く
        [STRING]: {
            position: "absolute",
            insetInlineStart: "[calc(var(--leaf-tag-hole-x) - 10px)]",
            bottom: "[calc(50% + var(--leaf-tag-hole) / 2 - 1px)]",
            width: "[10px]",
            height: "[calc(50% - var(--leaf-tag-hole) / 2 + 12px)]",
            color: "[var(--leaf-tag-string)]",
            pointerEvents: "none",
            transitionProperty: "opacity",
            transitionDuration: "fast",
            "& svg": { display: "block", width: "100%", height: "100%", overflow: "visible" },
        },

        // hover: 傾きがまっすぐに戻りながら持ち上がり、葉っぱがぴょこっと揺れる
        [HOVER]: {
            _motionSafe: { transform: "translateY(-2px) rotate(0deg) scale(1.03)" },
            [TAG]: { filter: SHADOW_HOVER },
            [LEAF]: { _motionSafe: { transform: "rotate(14deg) scale(1.12)" } },
        },
        // 押下: 横に広がって縦に潰れる(squash)。離すとバネで弾んで戻る
        [ACTIVE]: {
            // 押した瞬間は遅延を感じさせないよう速く潰す
            transitionDuration: "[90ms]",
            transitionTimingFunction: "easeOut",
            _motionSafe: { transform: "translateY(calc(var(--leaf-tag-depth) - 1px)) rotate(0deg) scale(1.04, 0.92)" },
            [TAG]: { filter: SHADOW_PRESSED },
        },

        _focusVisible: focusRing,
        // 無効状態は「棚にしまわれた札」: 傾きも厚みも無くし、まっすぐ平らに置く
        _disabled: {
            cursor: "not-allowed",
            "--leaf-tag-tilt": "0deg",
            "--leaf-tag-leaf-color": "var(--mpc-colors-gray-8)",
            "--leaf-tag-hole-bg": "var(--mpc-colors-gray-6)",
            "--leaf-tag-string": "var(--mpc-colors-gray-7)",
            "--leaf-tag-gloss": "none",
            transform: "[translateY(var(--leaf-tag-depth))]",
            [TAG]: { filter: "none" },
        },
    },
    variants: {
        intent: {
            // 最も強い操作。パレットの solid で塗った札に、クリームのハトメ穴
            primary: {
                color: "colorPalette.contrast",
                "--leaf-tag-face": "var(--mpc-colors-color-palette-solid)",
                // solid.active(面との差 Lc 8 前後)では側面が溶けるため、step10 に step12 を 45% 混ぜてもう一段沈める
                "--leaf-tag-edge":
                    "color-mix(in oklab, var(--mpc-colors-color-palette-10), var(--mpc-colors-color-palette-12) 45%)",
                "--leaf-tag-hole-bg": CREAM,
                "--leaf-tag-string": TWINE,
                // 葉っぱはパレットの solid。クリームの縁取りで札の塗りと切り分ける
                "--leaf-tag-leaf-color": "var(--mpc-colors-color-palette-solid)",
                [HOVER]: { "--leaf-tag-face": "var(--mpc-colors-color-palette-solid-emphasized)" },
                [ACTIVE]: { "--leaf-tag-face": "var(--mpc-colors-color-palette-solid-active)" },
                _disabled: {
                    color: "fg.disabled",
                    "--leaf-tag-face": "var(--mpc-colors-bg-disabled)",
                },
            },
            // 補助的な操作。クリーム色の紙の札に木の色の厚み。文字と葉っぱはパレットに追従させる
            secondary: {
                color: "colorPalette.fg",
                "--leaf-tag-face": CREAM,
                "--leaf-tag-edge": WOOD,
                "--leaf-tag-hole-bg": WOOD,
                "--leaf-tag-string": TWINE,
                "--leaf-tag-leaf-color": "var(--mpc-colors-color-palette-solid)",
                // クリームが濃くなるぶん文字を step12 に沈め、Lc 80 台を保つ
                [HOVER]: { "--leaf-tag-face": CREAM_HOVER, color: "colorPalette.12" },
                [ACTIVE]: { "--leaf-tag-face": CREAM_ACTIVE, color: "colorPalette.12" },
                _disabled: {
                    color: "fg.disabled",
                    "--leaf-tag-face": "var(--mpc-colors-bg-disabled)",
                },
            },
            // 最も控えめな操作。静止時は文字だけで傾かず、hover で初めてクリームの札が現れる
            plain: {
                color: "colorPalette.fg",
                "--leaf-tag-tilt": "0deg",
                "--leaf-tag-face": "transparent",
                "--leaf-tag-edge": "transparent",
                "--leaf-tag-hole-bg": "transparent",
                "--leaf-tag-gloss": "none",
                "--leaf-tag-leaf-color": "var(--mpc-colors-color-palette-solid)",
                // 静止時は厚みも持たない
                [TAG]: { filter: "none" },
                "--leaf-tag-string": TWINE,
                // 葉っぱと麻ひもは札が現れたときだけ出す
                [LEAF]: { opacity: "0", transitionProperty: "transform, opacity" },
                [STRING]: { opacity: "0" },
                // hover / active はそれぞれ単独でも札が出るようにする(Showcase の data-preview=active は :hover を伴わないため)
                [HOVER]: {
                    color: "colorPalette.12",
                    "--leaf-tag-face": CREAM_HOVER,
                    "--leaf-tag-gloss": GLOSS,
                    "--leaf-tag-edge": WOOD,
                    "--leaf-tag-hole-bg": WOOD,
                    [TAG]: { filter: SHADOW_REST },
                    [LEAF]: { opacity: "1" },
                    [STRING]: { opacity: "1" },
                },
                [ACTIVE]: {
                    color: "colorPalette.12",
                    "--leaf-tag-face": CREAM_ACTIVE,
                    "--leaf-tag-gloss": GLOSS,
                    "--leaf-tag-edge": WOOD,
                    "--leaf-tag-hole-bg": WOOD,
                    [TAG]: { filter: SHADOW_PRESSED },
                    [LEAF]: { opacity: "1" },
                    [STRING]: { opacity: "1" },
                },
                _disabled: {
                    color: "fg.disabled",
                    transform: "none",
                },
            },
        },
        // 札の先端の形。point はとがった値札、round は丸く切った札
        notch: {
            // 先端を丸めて、とがりすぎない「ぽってり」した先端にする
            point: { "--leaf-tag-notch": roundedPointNotch },
            round: { "--leaf-tag-notch": "ellipse(100% 50% at 100% 50%)" },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)を使い、他の方向性・既存 Button と揃えて比較できるようにする。
        // 札の厚み(--leaf-tag-depth)と葉っぱはその外側にはみ出す
        size: {
            sm: {
                height: "control.sm",
                paddingInlineEnd: "{spacing.3.5}",
                fontSize: "xs",
                "--leaf-tag-point": "13px",
                "--leaf-tag-hole": "6px",
                "--leaf-tag-hole-x": "15px",
                "--leaf-tag-gap": "8px",
                "--leaf-tag-depth": "3px",
                "--leaf-tag-leaf": "17px",
            },
            md: {
                height: "control.md",
                paddingInlineEnd: "{spacing.4}",
                fontSize: "sm",
                "--leaf-tag-point": "15px",
                "--leaf-tag-hole": "7px",
                "--leaf-tag-hole-x": "17px",
                "--leaf-tag-gap": "9px",
                "--leaf-tag-depth": "4px",
                "--leaf-tag-leaf": "19px",
            },
            lg: {
                height: "control.lg",
                paddingInlineEnd: "{spacing.5}",
                fontSize: "md",
                "--leaf-tag-point": "17px",
                "--leaf-tag-hole": "8px",
                "--leaf-tag-hole-x": "19px",
                "--leaf-tag-gap": "10px",
                "--leaf-tag-depth": "4px",
                "--leaf-tag-leaf": "22px",
            },
        },
    },
    // plain は静止時に厚みを持たないので、下影ぶんの余白も持たせない(size より後に効かせるため compoundVariants 側)
    compoundVariants: [
        {
            intent: "plain",
            size: ["sm", "md", "lg"],
            css: { marginBlockEnd: "0" },
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "lg",
        notch: "point",
    },
});

// 葉っぱの飾り。商標や既存アセットではない、汎用的なふた葉の芽を手描きした SVG
const LeafAccent = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {/* クリームの縁取り。札の塗り・地色のどちらの上でもシールのように浮かせる */}
        <g fill={CREAM} stroke={CREAM} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 23V12" />
            <path d="M12 14C6.5 14 3 10.5 3.5 6c4.8-.4 8.5 3 8.5 8Z" />
            <path d="M12 12c.5-5 4-8.6 8.8-8.4.4 5-3.3 8.6-8.8 8.4Z" />
        </g>
        {/* 茎と葉の本体。パレット色で塗る */}
        <path d="M12 23V12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M12 14C6.5 14 3 10.5 3.5 6c4.8-.4 8.5 3 8.5 8Z" fill="currentColor" />
        <path d="M12 12c.5-5 4-8.6 8.8-8.4.4 5-3.3 8.6-8.8 8.4Z" fill="currentColor" />
        {/* 葉脈。クリームで細く描き、塗りだけの塊に見えないようにする */}
        <path
            d="M11 12.6C9 10.6 7.2 8.8 5.6 7.6M13 10.8c1.6-2.3 3.6-4.3 6-5.4"
            fill="none"
            stroke={CREAM}
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.75"
        />
    </svg>
);

// 札を吊るす麻ひも。下端(右下)がハトメ穴の上端に入り、上へゆるく曲がりながら抜けていく
const TwineString = () => (
    <svg viewBox="0 0 10 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
            d="M10 30C10 20 3 14 2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
        />
    </svg>
);

export type LeafTagButtonProps = ComponentPropsWithoutRef<"button"> &
    RecipeVariantProps<typeof leafTagButtonStyle> & {
        /** 札の右上に葉っぱの飾りを付けるか */
        leaf?: boolean;
    };

// 既存 Button と同じ intent / size の props を受け取る。
// storybook パッケージからは @ark-ui/react を解決できない(packages/react の node_modules にしか無い)ため、
// ark.button ではなくネイティブの button を使う。採用時は packages/react 側で ark.button に置き換える
export const LeafTagButton = forwardRef<HTMLButtonElement, LeafTagButtonProps>(
    ({ intent, size, notch, leaf = true, className, children, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cx(leafTagButtonStyle({ intent, size, notch }), className)}
            {...props}
        >
            {/* 札本体(塗り・先端・ハトメ穴・厚み)。ラベルの下に敷く装飾 */}
            <span data-part="tag" aria-hidden="true" />
            {/* 札を吊るす麻ひも(装飾) */}
            <span data-part="string" aria-hidden="true">
                <TwineString />
            </span>
            {children}
            {leaf && (
                <span data-part="leaf" aria-hidden="true">
                    <LeafAccent />
                </span>
            )}
        </button>
    ),
);
LeafTagButton.displayName = "LeafTagButton";

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
    // 白いパネル(bg.panel)の上に置くセクション。クリームの札の見え方を地色と比べるために使う
    panel: css({
        display: "flex",
        flexDirection: "column",
        gap: "4",
        p: "5",
        borderRadius: "panel",
        bg: "bg.panel",
    }),
    label: css({ fontSize: "xs", fontWeight: "semibold", color: "colorPalette.fg.subtle" }),
    // 葉っぱが上にはみ出すので、行の間隔を少し広めに取る
    row: css({ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: "5", rowGap: "8", pt: "3" }),
};

const INTENTS = ["primary", "secondary", "plain"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const NOTCHES = ["point", "round"] as const;

// intent × size の行をまとめて描く
const IntentRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {SIZES.map((size) => (
                    <LeafTagButton key={size} intent={intent} size={size}>
                        {intent} {size}
                    </LeafTagButton>
                ))}
                <LeafTagButton intent={intent}>
                    <ShoppingBasketIcon />
                    かごに入れる
                </LeafTagButton>
                <LeafTagButton intent={intent}>
                    つづける
                    <ArrowRightIcon />
                </LeafTagButton>
            </div>
        ))}
    </>
);

// hover / active の姿を静止状態で並べる。傾きの戻り・潰れ・札の出現を見比べるため
const PREVIEWS = [undefined, "hover", "active"] as const;
const StateRows = () => (
    <>
        {INTENTS.map((intent) => (
            <div key={intent} className={showcaseStyles.row}>
                {PREVIEWS.map((preview) => (
                    <LeafTagButton key={preview ?? "rest"} intent={intent} data-preview={preview}>
                        {intent} {preview ?? "rest"}
                    </LeafTagButton>
                ))}
                <LeafTagButton intent={intent} disabled>
                    {intent} disabled
                </LeafTagButton>
            </div>
        ))}
    </>
);

// パレット追従の確認用に、各 intent を 1 つずつ並べる
const PaletteRow = () => (
    <div className={showcaseStyles.row}>
        {INTENTS.map((intent) => (
            <LeafTagButton key={intent} intent={intent}>
                <GiftIcon />
                {intent}
            </LeafTagButton>
        ))}
    </div>
);

const meta: Meta<typeof LeafTagButton> = {
    title: "LAB/Button Designs/Leaf Tag",
    component: LeafTagButton,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "**Leaf Tag** — 村の小さなお店の値札をモチーフにした、ほっこり系のボタンです。",
                    "片側がとがった(または丸い)札の形で、先端寄りに小さなハトメ穴があり、そこから麻ひもが上へ抜け、右上の縁からはふた葉の芽が生えています。静止時は -2deg だけ傾いて吊り下がり、hover でまっすぐになりながら持ち上がって葉っぱがぴょこっと揺れ、押すと横に広がってむにっと潰れ、離すとバネのように弾んで戻ります(動きを減らす設定では傾きだけを残し、状態変化の動きは止めます)。",
                    "",
                    "**借りている手触り**: どうぶつの森のような箱庭ゲームの UI にある、クリーム色の紙・ぽってりした丸い形・下に厚く落ちる柔らかい影・丸ゴシック(M PLUS Rounded 1c)・弾むマイクロモーション。ロゴやアイコンなどのアセットは使わず、雰囲気だけを取り入れています。",
                    "",
                    "**強み**: 形そのものが「押せる札」として目を引き、ショップ・ガチャ・ごほうび受け取りのような遊び心のある画面と相性が良いです。primary はパレットの solid で塗るので mori / umi / red に追従し、secondary はクリームの紙に木の色の厚みで温かみを出します。厚みのある影は札本体に filter: drop-shadow で掛けているので、とがった先端にも影が沿い、フォーカスリングには影が落ちません。",
                    "",
                    "**トレードオフ**: 先端とハトメ穴のぶん左の余白が広く、同じ文字数でも他の方向性より横幅を取ります。静止時の傾きと葉っぱのはみ出し(上方向)・厚み(下方向 3〜4px)があるので、密に並べる業務画面や Input / Select と高さを揃えたい場面には不向きです。クリームの札は白・地色のどちらとも Lc 0 で、輪郭は木の色の下影(Lc 50〜59)だけが担います。red の primary は solid 自体の明るさで白文字が Lc 70.5 と、本文の目安 75 に届きません(既存 Button と共通の課題)。",
                ].join("\n"),
            },
        },
    },
    argTypes: {
        children: { control: "text" },
        intent: { control: "select", options: INTENTS },
        size: { control: "select", options: SIZES },
        notch: { control: "inline-radio", options: NOTCHES },
        leaf: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    args: {
        children: "おかいもの",
        intent: "primary",
        size: "lg",
        notch: "point",
        leaf: true,
        disabled: false,
    },
};

export default meta;
type Story = StoryObj<typeof LeafTagButton>;

export const Showcase: Story = {
    render: () => (
        <div className={showcaseStyles.stack}>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>mori(既定)— intent × size / ページの地色の上</span>
                <IntentRows />
            </section>
            {/* クリームの札は地色とも白とも溶けるので、白いパネルの上での見え方も並べて比べる */}
            <section className={showcaseStyles.panel}>
                <span className={showcaseStyles.label}>白いパネル(bg.panel)の上</span>
                <IntentRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>状態の段(rest → hover → active → disabled)</span>
                <StateRows />
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>先端の形(point / round)と葉っぱの有無</span>
                <div className={showcaseStyles.row}>
                    {NOTCHES.map((notch) => (
                        <LeafTagButton key={notch} notch={notch}>
                            <PlusIcon />
                            notch {notch}
                        </LeafTagButton>
                    ))}
                    {NOTCHES.map((notch) => (
                        <LeafTagButton key={notch} intent="secondary" notch={notch} leaf={false}>
                            葉っぱなし {notch}
                        </LeafTagButton>
                    ))}
                </div>
            </section>
            <section className={showcaseStyles.section}>
                <span className={showcaseStyles.label}>disabled</span>
                <div className={showcaseStyles.row}>
                    {INTENTS.map((intent) => (
                        <LeafTagButton key={intent} intent={intent} disabled>
                            <ShoppingBasketIcon />
                            {intent}
                        </LeafTagButton>
                    ))}
                </div>
            </section>
            {/* colorPalette を切り替えて、塗り・文字・葉っぱ・フォーカスリングがパレットに追従することを確認する */}
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
