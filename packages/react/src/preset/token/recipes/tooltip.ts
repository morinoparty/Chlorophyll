import { defineSlotRecipe } from "@pandacss/dev";

export const tooltip = defineSlotRecipe({
    className: "tooltip",
    jsx: ["Tooltip"],
    description: "The tooltip component",
    // Root/Trigger は見た目を持たない構造要素なのでスロットに含めない
    slots: ["positioner", "content", "arrow"],
    base: {
        positioner: {
            // 実際の位置決めは zag のインラインスタイルが担う。重なり順だけここで持つ
            zIndex: "tooltip",
        },
        content: {
            // 吹き出し本体: 背景を反転させ、どのページ地の上でも読める濃色パネルにする
            display: "inline-flex",
            alignItems: "center",
            maxWidth: "64",
            borderRadius: "md",
            bg: "bg.inverted",
            color: "white",
            fontSize: "xs",
            fontWeight: "medium",
            lineHeight: "normal",
            px: "component.padding.md",
            py: "component.padding.sm",
            boxShadow: "lg",
            outline: "none",
            wordBreak: "break-word",
            // トリガーの hover 判定を邪魔しないよう、吹き出し自体はクリックを透過する
            pointerEvents: "none",
            // Ark が付与する data-state=open で開閉アニメーションを再生する
            _open: {
                animationName: "slideDownIn",
                animationDuration: "fast",
                animationTimingFunction: "easeOut",
            },
        },
        arrow: {
            // 三角形の描画自体は zag のインラインスタイルが担う。
            // ここでは大きさと色を CSS 変数として渡すだけでよい
            "--arrow-size": "token(sizes.2)",
            "--arrow-background": "token(colors.bg.inverted)",
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
