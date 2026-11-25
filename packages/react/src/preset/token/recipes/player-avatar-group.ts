import { defineSlotRecipe } from "@pandacss/dev";

export const playerAvatarGroup = defineSlotRecipe({
    className: "player-avatar-group",
    jsx: ["PlayerAvatarGroup"],
    description: "The player avatar group component (overlapping row of player head avatars)",
    // root に PlayerAvatar を包んだ item を横一列に重ねて並べ、最後に「+N」の overflow を置く
    slots: ["root", "item", "overflow"],
    base: {
        root: {
            display: "inline-flex",
            alignItems: "center",
            // 重なり順を root の中に閉じ込め、外側の要素と z-index が干渉しないようにする
            isolation: "isolate",
            // 重なった頭どうしを切り分けるリングの色。周囲の地色に合わせるのが前提なので、
            // 既定は白いパネル(bg.panel)にし、ページの地色(colorPalette.bg)の上などでは利用者が上書きする。
            // リングは重なりを見分けるための装飾で、人物の識別は画像・alt・overflow のラベルが担うため Lc は求めない
            "--player-avatar-group-ring-color": "{colors.bg.panel}",
            "--player-avatar-group-ring-width": "2px",
        },
        item: {
            position: "relative",
            display: "inline-flex",
            flexShrink: 0,
            // PlayerAvatar の角丸(lg)と揃え、リングが頭の輪郭に沿うようにする
            borderRadius: "lg",
            // outline ではなく box-shadow でリングを描き、レイアウト上の大きさを変えない。
            // 後ろの item ほど上に描かれるので、リングが手前の頭を切り抜いたように見える
            boxShadow: "0 0 0 var(--player-avatar-group-ring-width) var(--player-avatar-group-ring-color)",
            // 2 つ目以降を左に食い込ませて重ねる。重なり幅は size と spacing から決まる
            "&:not(:first-child)": {
                marginInlineStart: "var(--player-avatar-group-overlap)",
            },
        },
        overflow: {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            // PlayerAvatar と同じ大きさ・角丸の四角にして、頭の列の続きとして読ませる
            width: "var(--player-avatar-group-size)",
            height: "var(--player-avatar-group-size)",
            borderRadius: "lg",
            boxShadow: "0 0 0 var(--player-avatar-group-ring-width) var(--player-avatar-group-ring-color)",
            // パレットの色味を薄く帯びた面に、パレットの文字色で「+N」を載せる。
            // colorPalette.fg on colorPalette.surface(mori.3)の calcAPCA 計測値: Lc 74.6(白地の上では Lc 82.1)。
            // 必要な Lc は文字サイズで決まる(Storybook の APCA silver チェック、weight 600 の表):
            //   md 16px → Lc 70 / lg 18px → Lc 60 で、いずれも満たす。
            //   sm 12px は表に適合値が無く(14px 未満は不可)どの色でも満たせないが、32px の四角に収まる
            //   文字はこの大きさが限度のため、Avatar の xs / sm と同じく既知の未達として受け入れる
            //   (隠れた人数は role="img" の aria-label が伝える)
            bg: "colorPalette.surface",
            color: "colorPalette.fg",
            fontWeight: "semibold",
            lineHeight: "1",
            // 桁が変わっても幅がぶれないよう等幅数字にする
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            userSelect: "none",
            "&:not(:first-child)": {
                marginInlineStart: "var(--player-avatar-group-overlap)",
            },
        },
    },
    variants: {
        // PlayerAvatar の size(32 / 48 / 64px)と一致させる。
        // 重なり幅を spacing と掛け合わせて計算できるよう、大きさを CSS 変数にも入れる
        // (compoundVariants は staticCss で生成されず、size / spacing を動的に渡すと CSS が出ないため使わない)
        size: {
            sm: {
                root: { "--player-avatar-group-size": "32px" },
                overflow: { fontSize: "xs" },
            },
            md: {
                root: { "--player-avatar-group-size": "48px" },
                overflow: { fontSize: "md" },
            },
            lg: {
                root: { "--player-avatar-group-size": "64px" },
                overflow: { fontSize: "lg" },
            },
        },
        // 重なり幅。大きさに比例させ、どの size でも同じ割合だけ重なって見えるようにする
        spacing: {
            // 頭の 1/4 を重ねる。顔が十分に見える既定の重なり
            normal: {
                root: { "--player-avatar-group-overlap": "calc(var(--player-avatar-group-size) * -0.25)" },
            },
            // 頭の 3/8 を重ねる。狭い場所に多くの人を詰めたいとき用
            tight: {
                root: { "--player-avatar-group-overlap": "calc(var(--player-avatar-group-size) * -0.375)" },
            },
        },
    },
    defaultVariants: {
        size: "md",
        spacing: "normal",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
