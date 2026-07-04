import { defineSlotRecipe } from "@pandacss/dev";

export const serverStatusCard = defineSlotRecipe({
    className: "server-status-card",
    jsx: ["ServerStatusCard"],
    description: "The server status card component",
    // プリセット側でスロットの CSS を生成し、パッケージ利用者がソースを
    // スキャンしなくてもスタイルが当たるようにする
    slots: ["root", "header", "address", "addressTrigger", "stats", "stat", "statLabel", "statValue"],
    base: {
        // Card(#40) が未実装のため、暫定として自前でカード風の見た目を持たせている。
        // Card が実装され次第、root はそちらに委譲するリファクタを検討する
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            padding: "5",
            borderRadius: "xl",
            borderWidth: "1px",
            borderColor: "border.subtle",
            bg: "bg.panel",
            boxShadow: "sm",
        },
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "3",
        },
        address: {
            display: "flex",
            alignItems: "center",
            gap: "1.5",
            fontSize: "sm",
            fontWeight: "medium",
            color: "fg.default",
        },
        addressTrigger: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1",
            borderRadius: "md",
            color: "fg.muted",
            cursor: "pointer",
            "& svg": {
                width: "4",
                height: "4",
            },
            "&:hover": {
                bg: "bg.muted",
                color: "fg.default",
            },
        },
        stats: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4",
        },
        stat: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
        },
        statLabel: {
            fontSize: "xs",
            color: "fg.muted",
        },
        statValue: {
            fontSize: "lg",
            fontWeight: "semibold",
            color: "fg.default",
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
