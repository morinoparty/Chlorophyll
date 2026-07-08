"use client";
import { createContext, type ReactNode, useContext, useMemo } from "react";

// Minecraft 系コンポーネント(MinecraftItem / PlayerAvatar / SkinViewer / PlayerMap など)が
// 使う URL の解決関数一式。すべて任意で、指定したものだけが既定値を上書きする
interface MinecraftConfig {
    /** モデル JSON のファイルパス(例: "item/stone.json")から実際の URL を解決する (MinecraftItem) */
    resolveModel?: (path: string) => string;
    /** テクスチャのファイル名から実際に表示する URL を解決する (MinecraftItem) */
    resolveTexture?: (fileName: string) => string;
    /** プレイヤー UUID から顔画像の URL を解決する (PlayerAvatar / PlayerMap / NewsCard.Author) */
    avatarUrl?: (playerId: string, pixelSize: number) => string;
    /** プレイヤー UUID からスキンテクスチャの URL を解決する (SkinViewer) */
    skinUrl?: (playerId: string) => string;
}

// avatarUrl/skinUrl は Provider が無くても動くよう既定値を持つ。
// resolveModel/resolveTexture はアセットの置き場所が利用者環境に依存するため既定値を持たない
interface ResolvedMinecraftConfig extends MinecraftConfig {
    avatarUrl: (playerId: string, pixelSize: number) => string;
    skinUrl: (playerId: string) => string;
}

// 既定では mc-heads.net からプレイヤー画像を取得する
const DEFAULT_MINECRAFT_CONFIG: ResolvedMinecraftConfig = {
    avatarUrl: (playerId, pixelSize) => `https://mc-heads.net/avatar/${playerId}/${pixelSize}`,
    skinUrl: (playerId) => `https://mc-heads.net/skin/${playerId}`,
};

// Provider の外で使われた場合を判別できるよう、初期値は null にする
const MinecraftContext = createContext<ResolvedMinecraftConfig | null>(null);

interface MinecraftProviderProps {
    /**
     * Minecraft のモデル/テクスチャアセット一式が置かれている場所。
     * "http://" / "https://" から始まる場合はリモートの URL とみなし、
     * それ以外はローカルパス(例: "/minecraft-assets")として扱う。
     * 配下は本家リソースパックと同じ "models/" "textures/" 構成を想定する
     */
    assets?: string;
    /**
     * URL 解決関数の上書き設定。`avatarUrl: (uuid, size) => ...` のように関数で渡すことで、
     * mc-heads.net 以外の画像サービスや自前 API にも柔軟に差し替えられる。
     * assets と両方指定した場合は config の関数が優先される
     */
    config?: MinecraftConfig;
    children: ReactNode;
}

// assets がリモート URL かどうかを判定する
const isRemoteAssets = (assets: string): boolean => /^https?:\/\//.test(assets);

// assets のベースと相対パスを結合する。
// リモートの場合は URL として正規化し、ローカルの場合は単純な文字列結合で済ませる
// (相対/ローカルパスは URL コンストラクタのベースにできないため、分岐が必要)
const joinAssetsPath = (assets: string, relativePath: string): string => {
    if (isRemoteAssets(assets)) {
        const base = assets.endsWith("/") ? assets : `${assets}/`;
        return new URL(relativePath, base).toString();
    }
    const normalizedBase = assets.replace(/\/+$/, "");
    return `${normalizedBase}/${relativePath}`;
};

// config のうち、値が指定されているものだけを残す(undefined で既定値を潰さないため)
const pickDefined = (config: MinecraftConfig | undefined): MinecraftConfig => {
    if (!config) {
        return {};
    }
    return Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined));
};

// Minecraft 系コンポーネントの URL 解決を一括設定する Provider。
// 配下の MinecraftItem / PlayerAvatar / SkinViewer / PlayerMap は、個別に関数を渡さなくても
// この Context 経由で自動的に解決できるようになる
const MinecraftProvider = ({ assets, config, children }: MinecraftProviderProps) => {
    // 依存が変わらない限り同じ関数参照を保つ。利用側は解決関数を useEffect の依存配列に
    // 含めるため、参照を安定させないと不要な再解決が走ってしまう。
    // config をインラインで書くと毎レンダー参照が変わるため、個々の関数を分解して依存に取る
    const { resolveModel, resolveTexture, avatarUrl, skinUrl } = config ?? {};
    const value = useMemo<ResolvedMinecraftConfig>(
        () => ({
            ...DEFAULT_MINECRAFT_CONFIG,
            ...(assets
                ? {
                      resolveModel: (path: string) => joinAssetsPath(assets, `models/${path}`),
                      resolveTexture: (fileName: string) => joinAssetsPath(assets, `textures/${fileName}`),
                  }
                : {}),
            ...pickDefined({ resolveModel, resolveTexture, avatarUrl, skinUrl }),
        }),
        [assets, resolveModel, resolveTexture, avatarUrl, skinUrl],
    );

    return <MinecraftContext.Provider value={value}>{children}</MinecraftContext.Provider>;
};

// Provider の外でも使えるよう、未設定時は既定の config を返す
const useMinecraftConfig = (): ResolvedMinecraftConfig => useContext(MinecraftContext) ?? DEFAULT_MINECRAFT_CONFIG;

/** @deprecated MinecraftConfig に置き換えられました */
type MinecraftAssetsResolver = Required<Pick<MinecraftConfig, "resolveModel" | "resolveTexture">>;

export { MinecraftProvider, useMinecraftConfig, DEFAULT_MINECRAFT_CONFIG };
export type { MinecraftAssetsResolver, MinecraftConfig, MinecraftProviderProps, ResolvedMinecraftConfig };
