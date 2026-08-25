"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { cx } from "styled-system/css";
import { separator } from "styled-system/recipes";

type SeparatorOrientation = "horizontal" | "vertical";

interface SeparatorProps extends HTMLArkProps<"div"> {
    /** 線の向き。horizontal(横線) / vertical(縦線)。既定は horizontal */
    orientation?: SeparatorOrientation;
    /**
     * 区切りに意味を持たせて支援技術へ伝えるか。
     * false(既定)は装飾扱いで読み上げ対象から外し、true は role="separator" として公開する
     */
    semantic?: boolean;
}

// コンテンツやツールバー項目の間に引く区切り線。
// 既定では装飾として扱い、意味のある区切りにしたい場合のみ semantic を有効にする
const Separator = ({ className, orientation = "horizontal", semantic = false, ...props }: SeparatorProps) => {
    // 装飾か意味のある区切りかで、支援技術へ公開する属性を切り替える。
    // 装飾: role="presentation" + aria-hidden で読み上げから完全に外す。
    // 意味あり: role="separator" とし、縦線は aria-orientation で向きも伝える
    // (separator の aria-orientation 既定値は horizontal だが、明示して意図を分かりやすくする)
    const a11yProps = semantic
        ? { role: "separator", "aria-orientation": orientation }
        : { role: "presentation", "aria-hidden": true };

    return (
        // a11y 属性を先に置き、その後ろで props を展開する。
        // これにより利用側が role や aria-* を渡した場合はそちらが優先され、
        // 必要に応じて既定の挙動を上書きできる
        <ark.div {...a11yProps} {...props} className={cx(separator({ orientation }), className)} />
    );
};

export { Separator };
export type { SeparatorProps, SeparatorOrientation };
