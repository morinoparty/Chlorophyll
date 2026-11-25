import type { MinecraftTintSource } from "./resolve-minecraft-item";

// アイテム定義の色付け(tints)を、インベントリで表示するときの RGB(0xRRGGBB)に変換する。
// ワールドのバイオームは参照せず、Minecraft がアイテムを描くときと同じ既定の色を使う

/** 草の colormap(textures/colormap/grass.png)のテクスチャパス */
const GRASS_COLORMAP_PATH = "colormap/grass.png";

// colormap の 1 辺のピクセル数。Minecraft の GrassColor は 256x256 を前提にしている
const COLORMAP_SIZE = 256;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// ARGB の符号付き整数(例: -12012264)から RGB 部分だけを取り出す
const toRgb = (argb: number): number => argb & 0xffffff;

/**
 * 草の colormap 上の位置を求める(Minecraft の GrassColor.get と同じ計算)。
 * 気温が高いほど左、気温 x 降水量が大きいほど上になる
 */
const grassColormapPosition = (temperature: number, downfall: number): { x: number; y: number } => {
    const t = clamp01(temperature);
    const d = clamp01(downfall) * t;
    return {
        x: Math.trunc((1 - t) * (COLORMAP_SIZE - 1)),
        y: Math.trunc((1 - d) * (COLORMAP_SIZE - 1)),
    };
};

/**
 * 色付けの指定 1 つを RGB に変換する。colormap が必要な草は sampleGrass で色を引く。
 * 既定の色が決まらない type(データが無いと色が無いもの)は null を返し、その面は色付けしない
 */
const tintSourceToRgb = (
    source: MinecraftTintSource,
    sampleGrass: (x: number, y: number) => number | null,
): number | null => {
    const type = source.type.replace(/^minecraft:/, "");
    if (type === "constant" && typeof source.value === "number") {
        return toRgb(source.value);
    }
    if (type === "grass") {
        const { x, y } = grassColormapPosition(source.temperature ?? 0.5, source.downfall ?? 1);
        return sampleGrass(x, y);
    }
    // dye / potion / firework / map_color / custom_model_data / team などは、データが無いときの default を使う
    if (typeof source.default === "number") {
        return toRgb(source.default);
    }
    return null;
};

// colormap 画像を読み込み、ピクセルの色を引けるようにする。読み込めなければ null(= 色付けしない)
const loadColormap = async (url: string): Promise<((x: number, y: number) => number | null) | null> => {
    const image = new Image();
    // ピクセルを読み出すため、別オリジンの画像は CORS 付きで読み込む
    image.crossOrigin = "anonymous";
    image.src = url;
    try {
        await image.decode();
    } catch {
        return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) {
        return null;
    }
    context.drawImage(image, 0, 0);
    const { data, width, height } = context.getImageData(0, 0, image.width, image.height);
    return (x, y) => {
        if (x >= width || y >= height) {
            return null;
        }
        const offset = (y * width + x) * 4;
        return (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
    };
};

// 同じ colormap を何度も読み込まないよう、URL ごとに結果を共有する
const colormapCache = new Map<string, ReturnType<typeof loadColormap>>();

/**
 * アイテム定義の tints を、tintindex で引ける RGB の配列にする。色が決まらないものは null
 */
const resolveTintColors = async (
    sources: MinecraftTintSource[],
    resolveTexture: (path: string) => string,
): Promise<(number | null)[]> => {
    if (sources.length === 0) {
        return [];
    }
    const needsGrass = sources.some((source) => source.type.replace(/^minecraft:/, "") === "grass");
    let sampleGrass: ((x: number, y: number) => number | null) | null = null;
    if (needsGrass) {
        const url = resolveTexture(GRASS_COLORMAP_PATH);
        let cached = colormapCache.get(url);
        if (!cached) {
            cached = loadColormap(url);
            colormapCache.set(url, cached);
        }
        sampleGrass = await cached;
    }
    return sources.map((source) => tintSourceToRgb(source, (x, y) => sampleGrass?.(x, y) ?? null));
};

export { grassColormapPosition, resolveTintColors, tintSourceToRgb };
