// Minecraft のアイテム/ブロックモデル JSON (assets/minecraft/models/**) を実際に読み、
// 平面(flat)かブロック(block)か、ブロックならどのテクスチャがどの面に来るかを機械的に導出する。
// 手動でアイテムごとに種別・面テクスチャを決め打ちしない(= 実データに追従する)ためのモジュール

type MinecraftFace = "up" | "down" | "north" | "south" | "east" | "west";

interface MinecraftModel {
    parent?: string;
    textures?: Record<string, string>;
}

type ResolvedMinecraftItem =
    | { type: "flat"; texture: string }
    | { type: "block"; top: string; left: string; right: string };

// 単一の 16x16x16 立方体に帰着する「末端」ブロックモデルの面 -> テクスチャ変数名の対応。
// これらは Mojang のバニラ定義そのものであり、実質的に変化しない安定した対応表なので固定値として持つ
const CUBE_FACE_ALIASES: Record<string, Record<MinecraftFace, string>> = {
    "block/cube": { up: "up", down: "down", north: "north", south: "south", east: "east", west: "west" },
    "block/cube_all": { up: "all", down: "all", north: "all", south: "all", east: "all", west: "all" },
    "block/cube_column": { up: "end", down: "end", north: "side", south: "side", east: "side", west: "side" },
    "block/cube_bottom_top": { up: "top", down: "bottom", north: "side", south: "side", east: "side", west: "side" },
    "block/cube_top": { up: "top", down: "side", north: "side", south: "side", east: "side", west: "side" },
};

// 連鎖をたどる parent の最大ホップ数。階段・柵・植物等の複雑形状は
// この対応表に決して到達しないため、上限に達したら「非対応」として諦める
const MAX_PARENT_HOPS = 6;

// モデル JSON の取得結果をキャッシュする。同じアイテムが複数箇所(sm/md/lg など)で
// 描画されても fetch は 1 回だけで済む
const modelCache = new Map<string, Promise<MinecraftModel | null>>();

const fetchModel = (url: string): Promise<MinecraftModel | null> => {
    let cached = modelCache.get(url);
    if (!cached) {
        cached = fetch(url)
            .then((res) => (res.ok ? (res.json() as Promise<MinecraftModel>) : null))
            .catch(() => null);
        modelCache.set(url, cached);
    }
    return cached;
};

// "minecraft:block/oak_log" のような namespace 付き参照から namespace を取り除く
const stripNamespace = (ref: string): string => ref.replace(/^minecraft:/, "");

// テクスチャ参照("minecraft:block/oak_log_top" 等)から resolveTexture に渡すファイル名を作る
const toTextureFileName = (ref: string): string => {
    const stripped = stripNamespace(ref);
    const name = stripped.split("/").pop() ?? stripped;
    return name.endsWith(".png") ? name : `${name}.png`;
};

// "#side" のような変数参照を、蓄積したテクスチャ変数マップから解決する。
// 変数がさらに別の変数を指すケースにも対応するため、具体値になるまでたどる
const resolveTextureVariable = (value: string, textures: Record<string, string>): string | null => {
    let current = value;
    let guard = 0;
    while (current.startsWith("#") && guard < 5) {
        const next = textures[current.slice(1)];
        if (!next) return null;
        current = next;
        guard += 1;
    }
    return current.startsWith("#") ? null : current;
};

// 末端の面エイリアス表と、蓄積済みテクスチャ変数マップから top/left/right を導出する。
// GUI の等角投影で見える面は north 面(right, 中間の明るさ)と east 面(left, 最も暗い)の組と
// なるように実測(作業台のスクリーンショット)で確認済みの組み合わせを採用している
const resolveFaces = (
    aliases: Record<MinecraftFace, string>,
    textures: Record<string, string>,
): ResolvedMinecraftItem | null => {
    const resolveFace = (face: MinecraftFace): string | null => {
        const varName = aliases[face];
        const raw = textures[varName];
        if (!raw) return null;
        const resolved = resolveTextureVariable(raw, textures);
        return resolved ? toTextureFileName(resolved) : null;
    };

    const top = resolveFace("up");
    const right = resolveFace("north");
    const left = resolveFace("east");
    if (!top || !right || !left) return null;

    return { type: "block", top, left, right };
};

interface ResolveMinecraftItemOptions {
    /** モデル JSON のファイルパス(例: "item/stone.json" / "block/stone.json")から実際の URL を解決する */
    resolveModel: (path: string) => string;
}

// id からモデル JSON を実際にたどり、平面/ブロックの種別と面テクスチャを導出する。
// 単一立方体に帰着しない形状(階段・柵・植物など)は null を返す(= 非対応として描画しない)
const resolveMinecraftItem = async (
    id: string,
    { resolveModel }: ResolveMinecraftItemOptions,
): Promise<ResolvedMinecraftItem | null> => {
    const itemModel = await fetchModel(resolveModel(`item/${id}.json`));
    if (!itemModel) return null;

    // layer0 を自分自身で持つモデルは、handheld/generated 系の平面アイテム
    const layer0 = itemModel.textures?.layer0;
    if (layer0) {
        return { type: "flat", texture: toTextureFileName(layer0) };
    }

    const itemParent = itemModel.parent ? stripNamespace(itemModel.parent) : null;
    if (!itemParent?.startsWith("block/")) return null;

    // ブロックモデルの parent 連鎖をたどりながらテクスチャ変数を蓄積する。
    // 先(葉)に近い階層の値ほど具体的なので、後から見つかった同名キーでは上書きしない
    const textures: Record<string, string> = {};
    let currentPath = itemParent;

    for (let hop = 0; hop < MAX_PARENT_HOPS; hop += 1) {
        const model = await fetchModel(resolveModel(`${currentPath}.json`));
        if (!model) return null;

        for (const [key, value] of Object.entries(model.textures ?? {})) {
            if (!(key in textures)) {
                textures[key] = value;
            }
        }

        const parent = model.parent ? stripNamespace(model.parent) : null;
        if (parent && parent in CUBE_FACE_ALIASES) {
            return resolveFaces(CUBE_FACE_ALIASES[parent], textures);
        }
        if (!parent?.startsWith("block/")) return null;
        currentPath = parent;
    }

    // ホップ上限に達した = 単純な立方体に帰着しない複雑な形状 -> 非対応
    return null;
};

export { resolveMinecraftItem };
export type { ResolvedMinecraftItem, MinecraftFace };
