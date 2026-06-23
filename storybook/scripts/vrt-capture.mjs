// storycap によるスクリーンショット取得ラッパー。
//
// storycap@5 は内部で古い puppeteer-core@9 を使っており、Chromium の実体パス解決を
// インストール済み puppeteer に委譲する。しかし puppeteer@25 の executablePath() は
// Promise を返すため、storycap がそのまま子プロセスへ渡そうとして失敗する。
// そこでここで明示的に実体パスを解決し、--chromiumPath として渡す。
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// puppeteer の API はバージョンによって同期/非同期が異なるため両対応する
const puppeteer = require("puppeteer");
const chromiumPath = await Promise.resolve(puppeteer.executablePath());

// storycap の CLI 引数。ビルド済み Storybook を http-server で配信して簡易モードで巡回する。
const storycapArgs = [
    "exec",
    "storycap",
    "--serverCmd",
    "pnpm serve:storybook",
    "http://localhost:6006",
    "--chromiumPath",
    chromiumPath,
    "--outDir",
    "__screenshots__",
    // デスクトップとモバイルの 2 ビューポートを取得する
    "-V",
    "1280x800",
    "-V",
    "375x812",
];

execFileSync("pnpm", storycapArgs, { stdio: "inherit" });
