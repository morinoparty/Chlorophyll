// Minecraft のアイテム/ブロックモデル JSON (assets/minecraft/models/**) を実際に読み、
// 平面(flat)かブロック(block)か、ブロックならどんな形状(1つ以上の直方体の集まり)で
// どのテクスチャをどう貼るか、GUI でどの角度に回すかを機械的に導出する。
// 手動でアイテムごとに種別・形状・回転角を決め打ちしない(= 実データに追従する)ためのモジュール

type MinecraftFace = "up" | "down" | "north" | "south" | "east" | "west";

const FACES: MinecraftFace[] = ["up", "down", "north", "south", "east", "west"];

interface MinecraftModelFace {
    texture: string;
    /** テクスチャ上の切り出し範囲(px, 0-16)。省略時は要素の座標から機械的に決まる */
    uv?: [number, number, number, number];
}

interface MinecraftModelElement {
    /** 直方体の始点(0-16 のブロックローカル座標) */
    from: [number, number, number];
    /** 直方体の終点(0-16 のブロックローカル座標) */
    to: [number, number, number];
    faces?: Partial<Record<MinecraftFace, MinecraftModelFace>>;
}

// display の各コンテキスト(gui / thirdperson_righthand など)ごとの変換。単位は rotation が度、translation が px
interface MinecraftModelTransform {
    rotation?: number[];
    translation?: number[];
    scale?: number[];
}

// テクスチャ変数の値。1.21.x 以降は色付きガラスなどで { sprite, force_translucent } の形も使われる
type MinecraftTextureRef = string | { sprite: string; force_translucent?: boolean };

interface MinecraftModel {
    parent?: string;
    textures?: Record<string, MinecraftTextureRef>;
    elements?: MinecraftModelElement[];
    display?: {
        gui?: MinecraftModelTransform;
        thirdperson_righthand?: MinecraftModelTransform;
    };
}

// 1 面分の、解決済みテクスチャパス(例: "block/oak_log.png")と切り出し範囲(px, 0-16)
interface ResolvedFace {
    texture: string;
    uv: [number, number, number, number];
}

// モデルを構成する直方体 1 つ分。from/to は 0-16 のブロックローカル座標のまま保持する
interface ResolvedElement {
    from: [number, number, number];
    to: [number, number, number];
    faces: Partial<Record<MinecraftFace, ResolvedFace>>;
}

type ResolvedMinecraftItem =
    | { type: "flat"; texture: string }
    | {
          type: "block";
          /** 立方体 1 個とは限らない(階段・フェンス等は複数の直方体からなる) */
          elements: ResolvedElement[];
          /** GUI 表示時にブロックを回す角度(度)。定義しているモデルがなければ block/block.json の既定値 */
          rotation: [number, number, number];
      };

// GUI 表示時の回転(display.gui.rotation)がどのモデルにも見つからない場合のフォールバック値。
// block/block.json(全ブロックの根)で定義されている既定値そのもの
const DEFAULT_GUI_ROTATION: [number, number, number] = [30, 225, 0];

// 連鎖をたどる parent の最大ホップ数。無限ループの安全弁
const MAX_PARENT_HOPS = 8;

// items/<id>.json(アイテム定義)の item model ツリーのノード。1.21.4 以降はアイテムの見た目を
// models/item/<id>.json ではなくこのツリーで選ぶ(ブロックのアイテムは models/item/ を持たない)。
// 代表のモデルを 1 つ選ぶのに必要なフィールドだけを持つ
interface MinecraftItemModelNode {
    type: string;
    /** minecraft:model のモデル参照(例: "minecraft:block/stone") */
    model?: string;
    /** minecraft:condition の分岐 */
    on_true?: MinecraftItemModelNode;
    on_false?: MinecraftItemModelNode;
    /** minecraft:select / minecraft:range_dispatch の分岐 */
    cases?: { model: MinecraftItemModelNode }[];
    entries?: { model: MinecraftItemModelNode }[];
    fallback?: MinecraftItemModelNode;
    /** minecraft:composite の重ね合わせ */
    models?: MinecraftItemModelNode[];
    /** minecraft:special の、パーティクルなどに使う通常モデル */
    base?: string;
}

interface MinecraftItemDefinition {
    model?: MinecraftItemModelNode;
}

// モデル JSON の取得結果をキャッシュする。同じアイテムが複数箇所(sm/md/lg など)で
// 描画されても、また共通の親モデルも fetch は 1 回だけで済む
// アイテム定義(items/<id>.json)も同じキャッシュに載せる
const jsonCache = new Map<string, Promise<unknown>>();

const fetchJson = <T>(url: string): Promise<T | null> => {
    let cached = jsonCache.get(url);
    if (!cached) {
        cached = fetch(url)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null);
        jsonCache.set(url, cached);
    }
    return cached as Promise<T | null>;
};

const fetchModel = (url: string): Promise<MinecraftModel | null> => fetchJson<MinecraftModel>(url);

// "minecraft:block/oak_log" のような namespace 付き参照から namespace を取り除く
const stripNamespace = (ref: string): string => ref.replace(/^minecraft:/, "");

// テクスチャ変数の値を参照文字列にそろえる({ sprite } 形式なら sprite を使う)
const toTextureRef = (value: MinecraftTextureRef | undefined): string | undefined =>
    typeof value === "string" ? value : value?.sprite;

// テクスチャ参照("minecraft:block/oak_log_top" 等)から resolveTexture に渡すパスを作る。
// textures/ 配下のディレクトリ(block/ item/ など)は残す。block/ と item/ には
// 同名のテクスチャ(acacia_sign.png など)があるため、ファイル名だけでは一意に決まらない
const toTexturePath = (ref: string): string => {
    const path = stripNamespace(ref);
    return path.endsWith(".png") ? path : `${path}.png`;
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

// uv が省略された面のデフォルト切り出し範囲を、要素の座標から機械的に求める
// (Minecraft の仕様: 面に対応する 2 軸をそのまま uv に使う)
const defaultUv = (
    face: MinecraftFace,
    from: [number, number, number],
    to: [number, number, number],
): [number, number, number, number] => {
    const [x1, y1, z1] = from;
    const [x2, y2, z2] = to;
    switch (face) {
        case "up":
        case "down":
            return [x1, z1, x2, z2];
        case "north":
        case "south":
            return [x1, y1, x2, y2];
        default:
            return [z1, y1, z2, y2];
    }
};

// モデルの elements をテクスチャ変数まで解決した ResolvedElement[] に変換する。
// いずれかの面のテクスチャ参照が解決できない場合は非対応として null を返す
const resolveElements = (
    elements: MinecraftModelElement[],
    textures: Record<string, string>,
): ResolvedElement[] | null => {
    const resolved: ResolvedElement[] = [];

    for (const element of elements) {
        const faces: Partial<Record<MinecraftFace, ResolvedFace>> = {};

        for (const face of FACES) {
            const faceDef = element.faces?.[face];
            if (!faceDef) continue;

            const rawTexture = resolveTextureVariable(faceDef.texture, textures);
            if (!rawTexture) return null;

            faces[face] = {
                texture: toTexturePath(rawTexture),
                uv: faceDef.uv ?? defaultUv(face, element.from, element.to),
            };
        }

        resolved.push({ from: element.from, to: element.to, faces });
    }

    return resolved;
};

// item/<id>.json が参照するブロックモデルの parent 連鎖をたどり、
// 直方体の集まり(elements)と GUI 回転角を導出する。
// elements を持つ最初の(= 葉に最も近い)モデルがそのブロックの実体の形状。
// display.gui.rotation も同様に、連鎖の中で最初に見つかったものを優先する
// (block/block.json の既定値のまま使えるブロックもあれば、階段やフェンスのように
// 独自の角度を定義するブロックもあるため)
const resolveBlockModel = async (
    itemParent: string,
    resolveModel: (path: string) => string,
): Promise<{ elements: ResolvedElement[]; rotation: [number, number, number] } | null> => {
    const textures: Record<string, string> = {};
    let guiRotation: [number, number, number] | null = null;
    let currentPath = itemParent;

    for (let hop = 0; hop < MAX_PARENT_HOPS; hop += 1) {
        const model = await fetchModel(resolveModel(`${currentPath}.json`));
        if (!model) return null;

        // 先(葉)に近い階層の値ほど具体的なので、後から見つかった同名キーでは上書きしない
        for (const [key, value] of Object.entries(model.textures ?? {})) {
            const ref = toTextureRef(value);
            if (ref && !(key in textures)) {
                textures[key] = ref;
            }
        }

        if (guiRotation === null) {
            const rotation = model.display?.gui?.rotation;
            if (rotation?.length === 3 && rotation.every((value) => typeof value === "number")) {
                guiRotation = [rotation[0], rotation[1], rotation[2]];
            }
        }

        if (model.elements?.length) {
            const elements = resolveElements(model.elements, textures);
            if (!elements) return null;
            return { elements, rotation: guiRotation ?? DEFAULT_GUI_ROTATION };
        }

        const parent = model.parent ? stripNamespace(model.parent) : null;
        if (!parent?.startsWith("block/")) return null;
        currentPath = parent;
    }

    // ホップ上限に達した = 通常のブロックモデルとして解決できない -> 非対応
    return null;
};

// item model ツリーをたどる深さの上限。無限ループの安全弁
const MAX_ITEM_MODEL_DEPTH = 8;

// item model ツリーから、アイテム欄に表示する代表のモデル参照("block/stone" など)を 1 つ選ぶ。
// 条件分岐は、何も持っていない・使っていない既定の状態にあたる側を選ぶ
// (condition は on_false、select / range_dispatch は fallback、なければ先頭)。
// composite は先頭のモデルを、special(チェストやベッドなど独自描画のもの)は base を使う
const pickItemModelPath = (node: MinecraftItemModelNode | undefined, depth = 0): string | null => {
    if (!node || depth > MAX_ITEM_MODEL_DEPTH) return null;

    switch (stripNamespace(node.type)) {
        case "model":
            return node.model ? stripNamespace(node.model) : null;
        case "condition":
            return pickItemModelPath(node.on_false ?? node.on_true, depth + 1);
        case "select":
            return pickItemModelPath(node.fallback ?? node.cases?.[0]?.model, depth + 1);
        case "range_dispatch":
            return pickItemModelPath(node.fallback ?? node.entries?.[0]?.model, depth + 1);
        case "composite":
            return pickItemModelPath(node.models?.[0], depth + 1);
        case "special":
            return node.base ? stripNamespace(node.base) : null;
        default:
            // minecraft:empty や minecraft:bundle/selected_item など、モデルを持たないもの
            return null;
    }
};

// アイテム ID から、たどり始めるモデル参照("block/stone" / "item/diamond_sword" など)を決める。
// アイテム定義(items/<id>.json)があればそこから選び、無ければ 1.21.4 より前の構成とみなして
// models/item/<id>.json を直接使う
const resolveItemModelPath = async (
    id: string,
    resolveItemDefinition: ((id: string) => string) | undefined,
): Promise<string> => {
    if (resolveItemDefinition) {
        const definition = await fetchJson<MinecraftItemDefinition>(resolveItemDefinition(id));
        const path = pickItemModelPath(definition?.model);
        if (path) return path;
    }
    return `item/${id}`;
};

interface ResolveMinecraftItemOptions {
    /** モデル JSON のファイルパス(例: "item/stone.json" / "block/stone.json")から実際の URL を解決する */
    resolveModel: (path: string) => string;
    /** アイテム ID からアイテム定義(items/<id>.json)の URL を解決する。省略時は models/item/<id>.json を直接読む */
    resolveItemDefinition?: (id: string) => string;
}

// id からアイテム定義とモデル JSON を実際にたどり、平面/ブロックの種別・形状・GUI 回転角を導出する。
// モデルが見つからない、あるいは parent 連鎖のどこにも elements が現れない場合は
// null を返す(= 非対応として描画しない)
const resolveMinecraftItem = async (
    id: string,
    { resolveModel, resolveItemDefinition }: ResolveMinecraftItemOptions,
): Promise<ResolvedMinecraftItem | null> => {
    const modelPath = await resolveItemModelPath(id, resolveItemDefinition);

    // アイテム定義がブロックモデルを直接指している(ブロックのアイテム)
    if (modelPath.startsWith("block/")) {
        const block = await resolveBlockModel(modelPath, resolveModel);
        return block ? { type: "block", ...block } : null;
    }

    const itemModel = await fetchModel(resolveModel(`${modelPath}.json`));
    if (!itemModel) return null;

    // layer0 を自分自身で持つモデルは、handheld/generated 系の平面アイテム
    const layer0 = toTextureRef(itemModel.textures?.layer0);
    if (layer0) {
        return { type: "flat", texture: toTexturePath(layer0) };
    }

    const itemParent = itemModel.parent ? stripNamespace(itemModel.parent) : null;
    if (!itemParent?.startsWith("block/")) return null;

    const block = await resolveBlockModel(itemParent, resolveModel);
    if (!block) return null;

    return { type: "block", ...block };
};

export type {
    MinecraftFace,
    MinecraftItemDefinition,
    MinecraftItemModelNode,
    MinecraftModel,
    MinecraftModelTransform,
    ResolvedElement,
    ResolvedFace,
    ResolvedMinecraftItem,
};
export {
    fetchModel,
    MAX_PARENT_HOPS,
    pickItemModelPath,
    resolveItemModelPath,
    resolveMinecraftItem,
    stripNamespace,
    toTexturePath,
    toTextureRef,
};
