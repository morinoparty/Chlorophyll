// VRT 用スクリーンショット取得。
//
// storycap@5 は内部の puppeteer-core@9 が新しい puppeteer の Chromium 解決と噛み合わず
// 不安定なうえ、簡易モード CLI では deviceScaleFactor を指定できず画像が 1x のままになる。
// そこでインストール済みの puppeteer を直接使い、deviceScaleFactor: 2(高 DPI)で撮影する。
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer");

// 取得対象のビューポート(高 DPI で 2 倍解像度にする)
const VIEWPORTS = [
    { label: "1280x800", width: 1280, height: 800 },
    { label: "375x812", width: 375, height: 812 },
];
const DEVICE_SCALE_FACTOR = 2;
const OUT_DIR = "__screenshots__";
const PORT = 6006;

// アニメーション・トランジションを止めてフレーム差異を無くす
const DISABLE_ANIMATION_CSS = `*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important;}`;

// ファイル名に使えない文字を除去する
const sanitize = (s) => s.replace(/[/\\?%*:|"<>]/g, "-").trim();

// VRT を外部サービスに依存させないため、アバター画像リクエストは決定的な
// ローカル画像で応答する。URL(playerId を含む)から色を決めて見分けられるようにする。
const AVATAR_HOST = "mc-heads.net";
const deterministicAvatar = (url) => {
    let hue = 0;
    for (const ch of url) hue = (hue * 31 + ch.charCodeAt(0)) % 360;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="hsl(${hue} 45% 55%)"/></svg>`;
};

// 既存のサーバーを使う場合は VRT_STORYBOOK_URL を指定(ローカル検証用)。
// 指定が無ければビルド済み Storybook を http-server で配信する。
async function startServer() {
    if (process.env.VRT_STORYBOOK_URL) {
        return { baseUrl: process.env.VRT_STORYBOOK_URL.replace(/\/$/, ""), stop: async () => {} };
    }
    const child = spawn("pnpm", ["serve:storybook"], { stdio: "ignore" });
    const baseUrl = `http://localhost:${PORT}`;
    await waitForServer(`${baseUrl}/index.json`);
    return {
        baseUrl,
        stop: async () => {
            child.kill();
        },
    };
}

async function waitForServer(url, timeoutMs = 60000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const res = await fetch(url);
            if (res.ok) return;
        } catch {
            // not ready yet
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error(`Storybook server did not become ready: ${url}`);
}

// Storybook の story 一覧を取得する
async function fetchStories(baseUrl) {
    const res = await fetch(`${baseUrl}/index.json`);
    const json = await res.json();
    return Object.values(json.entries).filter((e) => e.type === "story");
}

async function captureStory(page, baseUrl, story, viewport) {
    await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: DEVICE_SCALE_FACTOR,
    });
    await page.goto(`${baseUrl}/iframe.html?id=${story.id}&viewMode=story`, {
        waitUntil: "networkidle0",
        timeout: 20000,
    });
    await page.addStyleTag({ content: DISABLE_ANIMATION_CSS });
    // フォントと画像の読み込みを待つ
    await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
            [...document.images]
                .filter((img) => !img.complete)
                .map(
                    (img) =>
                        new Promise((res) => {
                            img.addEventListener("load", res, { once: true });
                            img.addEventListener("error", res, { once: true });
                        }),
                ),
        );
    });

    // title の "/" は階層ディレクトリとして残す(例: COMPONENTS/Button)
    const titleDirs = story.title.split("/").map(sanitize);
    const file = join(OUT_DIR, ...titleDirs, `${sanitize(story.name)}_${viewport.label}.png`);
    await mkdir(dirname(file), { recursive: true });
    const buffer = await page.screenshot({ fullPage: true });
    await writeFile(file, buffer);
    return file;
}

async function main() {
    const server = await startServer();
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    try {
        const stories = await fetchStories(server.baseUrl);
        const page = await browser.newPage();

        // アバター(mc-heads.net)へのアクセスを横取りして決定的な画像を返す
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            if (req.url().includes(AVATAR_HOST)) {
                req.respond({ status: 200, contentType: "image/svg+xml", body: deterministicAvatar(req.url()) });
            } else {
                req.continue();
            }
        });
        let count = 0;
        for (const viewport of VIEWPORTS) {
            for (const story of stories) {
                const file = await captureStory(page, server.baseUrl, story, viewport);
                count += 1;
                console.log(`captured: ${file}`);
            }
        }
        console.log(`Done. ${count} screenshots (deviceScaleFactor=${DEVICE_SCALE_FACTOR}).`);
    } finally {
        await browser.close();
        await server.stop();
    }
}

await main();
