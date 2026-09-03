import { defineSemanticTokens } from "@pandacss/dev";

export const radii = (size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl") => {
    const sizeMap = {
        xs: { l1: "{radii.2xs}", l2: "{radii.xs}", l3: "{radii.sm}" },
        sm: { l1: "{radii.xs}", l2: "{radii.sm}", l3: "{radii.md}" },
        md: { l1: "{radii.sm}", l2: "{radii.md}", l3: "{radii.lg}" },
        lg: { l1: "{radii.md}", l2: "{radii.lg}", l3: "{radii.xl}" },
        xl: { l1: "{radii.lg}", l2: "{radii.xl}", l3: "{radii.2xl}" },
        "2xl": { l1: "{radii.xl}", l2: "{radii.2xl}", l3: "{radii.3xl}" },
        "3xl": { l1: "{radii.2xl}", l2: "{radii.3xl}", l3: "{radii.4xl}" },
    };

    const config = sizeMap[size];

    return defineSemanticTokens.radii({
        default: {
            value: `{radii.${size}}`,
        },
        l1: {
            value: config.l1,
        },
        l2: {
            value: config.l2,
        },
        l3: {
            value: config.l3,
        },
        // 役割別の角丸。l1 < l2 < l3 の 3 段に役割名を付けたもので、preset の radius オプションに連動する。
        // radius: "xl" のとき item 8px / control・popover 12px / panel 16px
        // Menu / Select の項目、小さなアイコンボタン、Editable、Tooltip など面の内側に置く小さな要素
        item: {
            value: config.l1,
        },
        // Button / Pagination / Select の trigger など、単体で押せるコントロール
        control: {
            value: config.l2,
        },
        // Menu / Select の content など、浮かせて表示するポップオーバー
        popover: {
            value: config.l2,
        },
        // List / Accordion / Table / Toast など、白いパネル面のカード
        panel: {
            value: config.l3,
        },
    });
};
