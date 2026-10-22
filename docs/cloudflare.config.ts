import { defineConfig } from "cf/config";

// accountId は書かない。CLOUDFLARE_ACCOUNT_ID (.env / GitHub secrets) で渡す。
export default defineConfig({
    worker: {
        name: "chlorophyll",
        compatibilityDate: "2025-12-17",
        compatibilityFlags: ["nodejs_compat"],
        entrypoint: "@tanstack/react-start/server-entry",
        // 独自ドメインは持たず、https://chlorophyll.morinoparty.workers.dev で配信する。
        // Storybook は同じ Worker の静的アセットとして /storybook/ 配下で配信する (vite.config.ts)
        workersDev: true,
        // PR ごとの preview は `cf previews deploy` で行う
        previewUrls: true,
        observability: {
            enabled: true,
        },
    },
});
