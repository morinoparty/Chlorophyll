// VRT 用スクリーンショット取得。
//
// storycap@5 は内部の puppeteer-core@9 が新しい puppeteer の Chromium 解決と噛み合わず
// 不安定なうえ、簡易モード CLI では deviceScaleFactor を指定できず画像が 1x のままになる。
// そこでインストール済みの puppeteer を直接使い、deviceScaleFactor: 2(高 DPI)で撮影する。
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { deflateSync } from "node:zlib";

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
// PlayerAvatar は <img> でアバターを表示するだけなので、軽い SVG で代替できる
const deterministicAvatar = (url) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="hsl(${hueFromUrl(url)} 45% 55%)"/></svg>`;
};

// URL(playerId を含む)から決定的に色相を導出し、プレイヤーごとに見分けられるようにする
const hueFromUrl = (url) => {
    let hue = 0;
    for (const ch of url) hue = (hue * 31 + ch.charCodeAt(0)) % 360;
    return hue;
};

// SkinViewer(skinview3d)は SVG ではなく 64x64 の PNG スキンテクスチャを要求し、
// three.js の TextureLoader は crossOrigin 付きで読み込むため、後述の応答には CORS
// ヘッダも必須になる。ここでは全面を単色で塗った最小の正当な PNG を生成する
// (playerId ごとに色相を変えて見分けられるようにする)。
const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c >>> 0;
    }
    return table;
})();
const crc32 = (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
};
// PNG チャンク(length + type + data + CRC32)を組み立てる
const pngChunk = (type, data) => {
    const typeBuf = Buffer.from(type, "ascii");
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crc]);
};
const hslToRgb = (h, s, l) => {
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)].map((v) => Math.round(v * 255));
};
const deterministicSkin = (url) => {
    const size = 64;
    const [r, g, b] = hslToRgb(hueFromUrl(url) / 360, 0.5, 0.55);
    // 各行の先頭にフィルタバイト 0(なし)を付けた生 RGBA スキャンライン
    const raw = Buffer.alloc((size * 4 + 1) * size);
    let p = 0;
    for (let y = 0; y < size; y++) {
        raw[p++] = 0;
        for (let x = 0; x < size; x++) {
            raw[p++] = r;
            raw[p++] = g;
            raw[p++] = b;
            raw[p++] = 255;
        }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0); // width
    ihdr.writeUInt32BE(size, 4); // height
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type: RGBA
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        pngChunk("IHDR", ihdr),
        pngChunk("IDAT", deflateSync(raw)),
        pngChunk("IEND", Buffer.alloc(0)),
    ]);
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

// WebGL を使うストーリー(react-three-fiber や skinview3d)は、多数のストーリーを
// 連続撮影した後だと初期化が大きく遅れることがある(ソフトウェアレンダリング環境での
// リソース競合と見られる)。通常は 1〜2 秒で終わるが、余裕を持って長めに待つ
const NAVIGATION_TIMEOUT_MS = 45000;

async function captureStory(page, baseUrl, story, viewport) {
    await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: DEVICE_SCALE_FACTOR,
    });
    await page.goto(`${baseUrl}/iframe.html?id=${story.id}&viewMode=story`, {
        waitUntil: "networkidle0",
        timeout: NAVIGATION_TIMEOUT_MS,
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

// ページを使い回すより状態を持ち越さない方が安全なため、ストーリーごとに使い捨てのページで撮影する
async function capturePage(browser, baseUrl, story, viewport) {
    const page = await browser.newPage();
    try {
        // skinview3d は performance.now() を時間源(THREE.Clock)として autoRotate や
        // アニメーションを進める。撮影タイミングでポーズが変わり VRT が毎回差分になるのを防ぐため、
        // 時間源を定数に固定して delta を常に 0 にする(描画自体は行われ、ポーズだけ凍結される)。
        await page.evaluateOnNewDocument(() => {
            const FIXED = 1000;
            performance.now = () => FIXED;
        });
        await page.setRequestInterception(true);
        // mc-heads.net へのアクセスを横取りして決定的な画像を返す。three.js の TextureLoader は
        // crossOrigin 付きで読むため、いずれの応答にも CORS ヘッダを付ける。
        page.on("request", (req) => {
            const url = req.url();
            if (!url.includes(AVATAR_HOST)) {
                req.continue();
                return;
            }
            const headers = { "Access-Control-Allow-Origin": "*" };
            // /skin/ は SkinViewer 用のスキンテクスチャ。PNG を返す。それ以外(/avatar/)は
            // PlayerAvatar 用の <img> なので軽い SVG で足りる。
            if (url.includes("/skin/")) {
                req.respond({ status: 200, contentType: "image/png", headers, body: deterministicSkin(url) });
            } else {
                req.respond({ status: 200, contentType: "image/svg+xml", headers, body: deterministicAvatar(url) });
            }
        });
        return await captureStory(page, baseUrl, story, viewport);
    } finally {
        await page.close();
    }
}

// 長時間の連続撮影ではまれにナビゲーションが遅延/失敗することがあるため、
// 1 回失敗しても新しいページでもう一度だけ試す
async function capturePageWithRetry(browser, baseUrl, story, viewport) {
    try {
        return await capturePage(browser, baseUrl, story, viewport);
    } catch (error) {
        console.log(`retrying ${story.id} (${viewport.label}) after error: ${error.message}`);
        return await capturePage(browser, baseUrl, story, viewport);
    }
}

async function main() {
    const server = await startServer();
    const browser = await puppeteer.launch({
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            // WebGL(react-three-fiber / skinview3d)を使うストーリーが多いと、
            // 既定の GPU 解決だと不安定になりやすい。SwiftShader に固定して安定させる。
            // Chrome 150+ ではソフトウェア WebGL の自動フォールバックが無効化されたため、
            // --enable-unsafe-swiftshader で明示的に許可する必要がある(信頼済みコンテンツのみ)
            "--use-gl=angle",
            "--use-angle=swiftshader",
            "--enable-unsafe-swiftshader",
            "--disable-gpu-sandbox",
        ],
    });
    try {
        const stories = await fetchStories(server.baseUrl);
        let count = 0;
        for (const viewport of VIEWPORTS) {
            for (const story of stories) {
                const file = await capturePageWithRetry(browser, server.baseUrl, story, viewport);
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
