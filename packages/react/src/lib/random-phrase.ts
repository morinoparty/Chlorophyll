import { firstPhrase, lastPhrase } from "./phrases";

// 5分ごとにフレーズが切り替わる
const SEPARATE_MINUTES = 5;
// JST = UTC+9
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export const randomPhrase = (target: "first" | "last", hash: string): string => {
    const seed = generateHash(hash + getSeparateTimeJST(SEPARATE_MINUTES));
    const random = new Random(seed);
    const phrases = target === "first" ? firstPhrase : lastPhrase;
    return phrases[random.nextInt(0, phrases.length - 1)];
};

function generateHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash + char) * 31;
        hash = hash & hash; // 32bit整数に丸める
    }
    return Math.abs(hash);
}

// UTC時刻にJSTオフセットを加算してから時間区切りを計算する
function getSeparateTimeJST(separateMinutes: number): string {
    const jst = new Date(Date.now() + JST_OFFSET_MS);
    const year = jst.getUTCFullYear();
    const month = jst.getUTCMonth();
    const day = jst.getUTCDate();
    const hour = jst.getUTCHours();
    const minute = Math.floor(jst.getUTCMinutes() / separateMinutes);
    return `${year}-${month}-${day}-${hour}-${minute}`;
}

class Random {
    private x: number;
    private y: number;
    private z: number;
    private w: number;

    constructor(seed = 88675123) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }

    next(): number {
        const t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8));
        return this.w;
    }

    // min以上max以下の整数を返す
    nextInt(min = 0, max = 1): number {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }
}
