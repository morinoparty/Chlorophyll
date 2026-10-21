import fs from "node:fs";
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import pandacss from "@pandacss/dev/postcss";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import fumadocs from "fumadocs-mdx/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as MdxConfig from "./source.config";

// storybook パッケージのビルド成果物 (storybook-static) を
// client のアセットとして /storybook 配下に同梱する。
// cf build は package.json の scripts を通らないため、Storybook は先にビルドしておく。
// Storybook は相対パス (./) でアセットを参照するので、/storybook/ 配下でもそのまま動く
const storybookDir = path.resolve(__dirname, "../storybook/storybook-static");
const bundleStorybook = (): Plugin => ({
    name: "chlorophyll:bundle-storybook",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "client",
    writeBundle() {
        if (!fs.existsSync(storybookDir)) {
            const message = `${storybookDir} が見つからないため Storybook を同梱できません (pnpm build:storybook を先に実行してください)`;
            // CI では Storybook 抜きでデプロイされないよう失敗させる
            if (process.env.CI) this.error(message);
            this.warn(message);
            return;
        }
        const outDir = path.resolve(this.environment.config.root, this.environment.config.build.outDir, "storybook");
        fs.cpSync(storybookDir, outDir, { recursive: true });
    },
});

export default defineConfig({
    css: {
        postcss: {
            plugins: [pandacss(), autoprefixer],
        },
    },
    plugins: [
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        tailwindcss(),
        fumadocs(MdxConfig, {
            index: {
                target: "vite",
            },
        }),
        tanstackStart({
            srcDirectory: "app",
            prerender: {
                enabled: true,
            },
        }),
        tsconfigPaths(),
        viteReact(),
        bundleStorybook(),
    ],
    resolve: {
        alias: {
            "styled-system": `${__dirname}/styled-system`,
            "@components": `${__dirname}/components`,
            "fumadocs-mdx:collections/*": `${__dirname}/.source/*`,

            // Node.js pathモジュールのブラウザ向けポリフィル
            path: "path-browserify",
        },
    },
    server: {
        port: 3000,
        allowedHosts: ["localhost", "127.0.0.1", "0.0.0.0", "192.168.0.148", ".trycloudflare.com"],
    },
});
