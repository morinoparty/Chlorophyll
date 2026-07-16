import { createRouter } from "@tanstack/react-router";
import { sva } from "styled-system/css";
import { routeTree } from "./routeTree.gen";

// ページ遷移中に表示する中央寄せスピナーのスタイル。
const pendingStyles = sva({
    slots: ["root", "spinner"],
    base: {
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "full",
            minHeight: "[50vh]",
        },
        spinner: {
            width: "8",
            height: "8",
            borderWidth: "4",
            borderStyle: "solid",
            borderColor: "border",
            // 上辺だけアクセントカラーにして回転を視認できるようにする。
            borderTopColor: "colorPalette.solid",
            borderRadius: "full",
            // spin キーフレームは下部の <style> で定義している。
            animation: "[spin 0.6s linear infinite]",
        },
    },
});

// 遷移中に表示する最小限のスピナーコンポーネント。
function PendingSpinner() {
    const styles = pendingStyles();

    return (
        <div className={styles.root}>
            {/* panda に spin キーフレームが登録されていないため、この場でキーフレームを定義する。 */}
            <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
            <div className={styles.spinner} />
        </div>
    );
}

export function getRouter() {
    const router = createRouter({
        routeTree,
        defaultPreload: "intent",
        // 遷移が一瞬固まって見えないよう、保留中はスピナーを表示する。
        defaultPendingComponent: PendingSpinner,
        // 通常の遷移（キャッシュ済みツリー + MDX チャンク取得）ではスピナーを出さず、
        // 本当に時間のかかる遷移だけに限定してちらつきを防ぐ。
        defaultPendingMs: 600,
        // 一度表示したら最低 300ms は維持して、点滅を防ぐ。
        defaultPendingMinMs: 300,
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
