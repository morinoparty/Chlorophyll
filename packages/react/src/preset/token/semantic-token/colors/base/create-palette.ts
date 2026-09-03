import { defineSemanticTokens } from "@pandacss/dev";

/**
 * パレット(gray / mori / umi / red / yellow / blue)ごとのセマンティックカラートークンを生成する。
 *
 * 全パレットが同じ形(同じロール名)を持つことを保証するのが目的。
 * 各パレットのファイルで個別に書くと、一部のパレットにだけロールが足りない状態
 * (例: 以前は bg.secondary が mori / umi にしか無く、colorPalette を red に切り替えると
 * var() が未解決になった)が起こりやすいため、ここで一括生成し、
 * パレット固有の事情だけを overrides で差し替える。
 *
 * 12 段階スケール(Radix Colors 流)の役割:
 *   1: ページ地色 / 2: ごく薄い面 / 3: コンポーネントの面 / 4: hover / 5: active
 *   6: 非インタラクティブな枠線 / 7: インタラクティブな枠線 / 8: 強調枠線・hover 枠線
 *   9: solid の塗り / 10: solid の hover / 11: 低コントラストの文字 / 12: 高コントラストの文字
 */

export type PaletteName = "gray" | "mori" | "umi" | "red" | "yellow" | "blue";

export interface PaletteOverrides {
    /** ページの地色(bg)。既定は step3 に gray.3 を半分混ぜた色 */
    bg?: string;
    /** solid の上に載せる文字色。既定は白。solid が明るいパレット(yellow)は暗いインクに差し替える */
    contrast?: string;
    /** フォーカスリング。既定は step9。solid が明るいパレット(yellow)は濃いステップに差し替える */
    focusRing?: string;
}

// 12 段階スケールのステップ番号
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

// リファレンストークン(light ランプ)への参照を組み立てる
const buildScale = (name: PaletteName) =>
    Object.fromEntries(
        STEPS.flatMap((step) => [
            [step, { value: `{colors.${name}.light.${step}}` }],
            [`a${step}`, { value: `{colors.${name}.light.a${step}}` }],
        ]),
    );

export const createPalette = (name: PaletteName, overrides: PaletteOverrides = {}) => {
    // 同じパレット内のセマンティックスケール(mori.3 など)への参照
    const ref = (step: (typeof STEPS)[number]) => `{colors.${name}.${step}}`;

    return defineSemanticTokens.colors({
        [name]: {
            // 12 段階スケール(1〜12、a1〜a12)。ダークモード非対応のため light ランプに固定する
            ...buildScale(name),

            // Background: ページ・セクションの地色
            bg: {
                // ページの地色。白いパネル(bg.panel)が浮いて見えるよう step3 の明度まで沈めつつ、
                // gray.3 を半分混ぜて彩度を落とす。step3 と明度は同じでも彩度差が残るため、
                // 同じ step3 を使う surface とは分離したまま沈められる。
                // 補間空間は oklab 固定: oklch だと色相が gray の 277.7 に向かって回り青く濁る
                DEFAULT: {
                    value: overrides.bg ?? `color-mix(in oklab, ${ref(3)}, {colors.gray.3} 50%)`,
                },
                // bg より明るい最も淡い地色(step1)。
                // グローバルの bg.subtle(gray.2 = bg より暗い)とは向きが逆なので注意:
                // パレット側は「bg を薄めたもの」、グローバル側は「白に薄く色を差したもの」という意味で使っている
                subtle: {
                    value: ref(1),
                },
            },

            // Surface: カードやリストなどコンポーネントの面。subtle → DEFAULT → hover → active の順に一段ずつ濃くなる
            surface: {
                // 白いパネルの上にごく薄く色を差す面(表の見出し行、縞、カードの hover など)。
                // step1 では白に埋もれ、step3(surface)では hover の地色とぶつかるため、その間の step2 を当てる
                subtle: {
                    value: ref(2),
                },
                DEFAULT: {
                    value: ref(3),
                },
                hover: {
                    value: ref(4),
                },
                active: {
                    value: ref(5),
                },
            },

            // Border: パレットの色味を帯びた枠線。グローバルの border.* と同じ段構成(step4〜8)にして、
            // コンポーネントが border.* と colorPalette.border.* を差し替えても値が飛ばないようにする
            border: {
                // step4: 最も淡い枠線。Badge の outline など、輪郭を出す程度の装飾向け
                subtle: {
                    value: ref(4),
                },
                // step5: 控えめな枠線
                muted: {
                    value: ref(5),
                },
                // step6: 非インタラクティブなコンポーネント(カード、セパレータなど)の枠線
                DEFAULT: {
                    value: ref(6),
                },
                // step7: インタラクティブなコンポーネント(入力欄など)の枠線
                interactive: {
                    value: ref(7),
                },
                // step8: 強調枠線・hover 時の枠線
                emphasized: {
                    value: ref(8),
                },
            },

            // Foreground: bg / surface の上に載せる文字・アイコンの色
            fg: {
                // step12 にパレットの色味(step11)を 7 割混ぜ、真っ黒ではなくブランドの色を帯びた本文色にする。
                // 白の上で Lc 80 以上、colorPalette.bg の上で Lc 71 以上(本文の目安 Lc 75 は白のみ満たす)
                DEFAULT: {
                    value: `color-mix(in oklch, ${ref(12)}, ${ref(11)} 70%)`,
                },
                // 補足テキスト。パレットの step11 は彩度が高く文字色として主張しすぎるため、中立な gray.11 を使う
                // (白の上で Lc 79.8)
                muted: {
                    value: "{colors.gray.11}",
                },
                // 見出しラベルなど装飾的に一段引かせる文字色。透過率はグローバルの fg.subtle と揃える。
                // 半透明なので合成先で Lc が変わる。本文には使わない
                subtle: {
                    value: `color-mix(in oklch, ${ref(11)}, transparent 25%)`,
                },
            },

            // Solid: ボタンなどの塗りつぶし
            solid: {
                DEFAULT: {
                    value: ref(9),
                },
                // hover 時の塗り
                emphasized: {
                    value: ref(10),
                },
                // 押下(active)時の塗り。スケールに step10 より濃い塗り色が無い(step11 は文字色で、
                // mori / umi では step10 より明るい)ため、step10 に step12 を 2 割混ぜて一段沈める
                active: {
                    value: `color-mix(in oklab, ${ref(10)}, ${ref(12)} 20%)`,
                },
            },

            // solid / solid.emphasized の上に載せる文字色
            contrast: {
                value: overrides.contrast ?? "{colors.white}",
            },

            // フォーカスリング。colorPalette.focus.ring として各レシピから参照する。
            // コントラストはこのプロジェクトの基準である APCA(Lc)で評価し、非テキスト要素の目安 Lc 45 以上を
            // 白(bg.panel)と colorPalette.bg の両方で満たす最も明るいステップを採用する(計測値は各パレットのファイル参照)。
            // 半透明の a ステップは合成先によって値が変わるので、不透明ステップで固定する
            focus: {
                ring: {
                    value: overrides.focusRing ?? ref(9),
                },
            },
        },
    });
};
