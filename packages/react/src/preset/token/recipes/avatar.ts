import { defineSlotRecipe } from "@pandacss/dev";

export const avatar = defineSlotRecipe({
    className: "avatar",
    jsx: ["Avatar"],
    description: "The avatar component (image with initials fallback)",
    // Ark UI Avatar の anatomy に合わせたスロット名
    slots: ["root", "image", "fallback"],
    base: {
        root: {
            position: "relative",
            // Image / Fallback を中央に重ねる。Fallback 自身に display を付けると
            // Ark が付ける hidden 属性(UA の display: none)を打ち消してしまうため、中央寄せは Root が担う
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            verticalAlign: "middle",
            // 画像が無い(読み込み中・失敗)ときの面。パレットの色味をごく薄く帯びた surface にして、
            // 頭文字が「この人を表すラベル」であることを伝える。
            // 面と周囲の境界は装飾なので Lc は求めない(人物の識別は頭文字・画像・alt が担う)
            bg: "colorPalette.surface",
            // 長い名前でも頭文字以外がはみ出さないよう 1 行に固定する
            whiteSpace: "nowrap",
            userSelect: "none",
        },
        image: {
            // display は指定しない。読み込み前・失敗時に Ark が付ける hidden 属性を活かすため
            width: "full",
            height: "full",
            // 縦横比の違う写真でも枠いっぱいに収め、歪ませずに中央を切り抜く
            objectFit: "cover",
        },
        fallback: {
            // 頭文字は短いラベルなので太めにして小さいサイズでも読めるようにする。
            // colorPalette.fg on colorPalette.surface(mori.3) の計測値: Lc 74.6
            // (補助テキストの目安 Lc 60 を満たし、本文の目安 Lc 75 にもほぼ届く。白地の上では Lc 82.1)
            color: "colorPalette.fg",
            fontWeight: "semibold",
            lineHeight: "1",
            textTransform: "uppercase",
        },
    },
    variants: {
        // 寸法は semantic token の sizes.avatar(24 / 32 / 40 / 48 / 64px)を使う。
        // 頭文字は円の中に余白を残して収まるよう、直径のおよそ 4 割の文字サイズにする。
        // shape="rounded" の角丸は大きさに比例させないと、小さいアバターでは円に近づき大きいアバターでは
        // 角張って見える。preset の radius オプションに連動する役割別の角丸(item < control < panel)を
        // 大きさごとに CSS 変数へ入れておき、rounded がそれを参照する。
        // (compoundVariants は staticCss で生成されず、shape / size を動的に渡すと CSS が出ないため使わない)
        size: {
            xs: {
                root: { width: "avatar.xs", height: "avatar.xs", "--avatar-rounded-radius": "{radii.item}" },
                fallback: { fontSize: "2xs" },
            },
            sm: {
                root: { width: "avatar.sm", height: "avatar.sm", "--avatar-rounded-radius": "{radii.item}" },
                fallback: { fontSize: "xs" },
            },
            md: {
                root: { width: "avatar.md", height: "avatar.md", "--avatar-rounded-radius": "{radii.control}" },
                fallback: { fontSize: "sm" },
            },
            lg: {
                root: { width: "avatar.lg", height: "avatar.lg", "--avatar-rounded-radius": "{radii.control}" },
                fallback: { fontSize: "md" },
            },
            xl: {
                root: { width: "avatar.xl", height: "avatar.xl", "--avatar-rounded-radius": "{radii.panel}" },
                fallback: { fontSize: "xl" },
            },
        },
        shape: {
            // 人物のアイコンとしての既定の形
            circle: {
                root: { borderRadius: "full" },
            },
            // サーバーやチームなど、人以外を表すときの角丸。半径は size 側で決めた --avatar-rounded-radius を使う
            rounded: {
                root: { borderRadius: "var(--avatar-rounded-radius)" },
            },
        },
    },
    defaultVariants: {
        size: "md",
        shape: "circle",
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
