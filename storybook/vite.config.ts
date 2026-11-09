import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

// Storybook (@storybook/builder-vite) がこのファイルを読み込み、.storybook/main.ts の設定とマージする
export default defineConfig({
    // lint / fmt など設定値だけを読むコマンドではプラグインを初期化しない
    plugins: lazyPlugins(() => [react()]),
    resolve: {
        alias: [
            {
                find: "styled-system/",
                replacement: `${import.meta.dirname}/styled-system/`,
            },
        ],
    },
});
