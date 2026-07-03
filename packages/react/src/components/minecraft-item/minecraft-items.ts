// Minecraft のアイテム/ブロックのレンダリング方式を判定するためのメタデータ。
// 実テクスチャのバイナリは配布物に含めず、ファイル名だけを保持する。
// 実 URL への解決は利用側が resolveTexture で行う(ライセンス・アセット非依存にするため)

// アイテムの見た目の種別。
// flat: 剣や食べ物のような平面のドット絵アイテム
// block: 石やログのような 3 面等角図で描くブロック
type MinecraftItemType = "flat" | "block";

// 平面アイテムの定義。1 枚のテクスチャのみを持つ
interface MinecraftFlatItemDefinition {
    type: "flat";
    /** アイテムアイコンとして表示するテクスチャのファイル名 */
    texture: string;
}

// ブロックアイテムの定義。上面・左面(西)・右面(南)の 3 テクスチャを持つ
interface MinecraftBlockItemDefinition {
    type: "block";
    /** 上面(最も明るく見える面)のテクスチャファイル名 */
    top: string;
    /** 左面(西向き、最も暗く見える面)のテクスチャファイル名 */
    left: string;
    /** 右面(南向き、中間の明るさに見える面)のテクスチャファイル名 */
    right: string;
}

// アイテム 1 件分の定義。種別によって必要なフィールドが変わる
type MinecraftItemDefinition = MinecraftFlatItemDefinition | MinecraftBlockItemDefinition;

// サンプルとして同梱する 9 種類のアイテム/ブロックの定義一覧
const MINECRAFT_ITEMS = {
    diamond_sword: { type: "flat", texture: "diamond_sword.png" },
    apple: { type: "flat", texture: "apple.png" },
    ender_pearl: { type: "flat", texture: "ender_pearl.png" },
    stick: { type: "flat", texture: "stick.png" },
    // 石は全面同じテクスチャなので top/left/right すべてに同じファイルを指定する
    stone: { type: "block", top: "stone.png", left: "stone.png", right: "stone.png" },
    // 丸太は上面(年輪)と側面(樹皮)でテクスチャが異なる。左右は同じ側面テクスチャを使い回す
    oak_log: { type: "block", top: "oak_log_top.png", left: "oak_log.png", right: "oak_log.png" },
    // 作業台は上面・側面・正面の 3 種テクスチャを持つ。
    // 正面(front)を右面(南)、側面(side)を左面(西)に割り当てる
    crafting_table: {
        type: "block",
        top: "crafting_table_top.png",
        left: "crafting_table_side.png",
        right: "crafting_table_front.png",
    },
} as const satisfies Record<string, MinecraftItemDefinition>;

// MINECRAFT_ITEMS のキーから導出される既知アイテム ID の union
type MinecraftItemId = keyof typeof MINECRAFT_ITEMS;

export { MINECRAFT_ITEMS };
export type { MinecraftItemType, MinecraftItemDefinition, MinecraftItemId };
