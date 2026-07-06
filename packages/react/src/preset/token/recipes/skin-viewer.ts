import { defineRecipe } from "@pandacss/dev";

export const skinViewer = defineRecipe({
    className: "skin-viewer",
    jsx: ["SkinViewer"],
    description: "The skin viewer component",
    // interactive は実行時に prop で動的指定されるため、両方の CSS を常に生成する
    staticCss: ["*"],
    base: {
        display: "block",
        borderRadius: "lg",
        bg: "bg.subtle",
    },
    variants: {
        // マウス操作(回転・ズーム・パン)を受け付けるかどうか。
        // false の場合は操作を全てロックした表示専用モードになる(振る舞いは component 側で制御)。
        // ここではカーソル形状で操作可否を視覚的に示す
        interactive: {
            true: {
                // ドラッグで動かせることを示す掴めるカーソル
                cursor: "grab",
            },
            false: {
                // 操作できないので通常カーソルのまま
                cursor: "default",
            },
        },
    },
    defaultVariants: {
        interactive: true,
    },
});
