"use client";
import { createContext, type ReactNode, useContext, useMemo } from "react";

// resolveModel/resolveTexture のペア。MinecraftItem が個別に受け取っていたものを
// Provider 側でまとめて生成し、Context 経由で配布する
interface MinecraftAssetsResolver {
    resolveModel: (path: string) => string;
    resolveTexture: (fileName: string) => string;
}

// Provider の外で MinecraftItem が使われた場合を判別できるよう、初期値は null にする
const MinecraftContext = createContext<MinecraftAssetsResolver | null>(null);

interface MinecraftProviderProps {
    /**
     * Minecraft のモデル/テクスチャアセット一式が置かれている場所。
     * "http://" / "https://" から始まる場合はリモートの URL とみなし、
     * それ以外はローカルパス(例: "/minecraft-assets")として扱う。
     * 配下は本家リソースパックと同じ "models/" "textures/" 構成を想定する
     */
    assets: string;
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

// MinecraftItem に渡す resolveModel/resolveTexture を、指定した assets の場所ひとつから
// まとめて用意するための Provider。配下の MinecraftItem は resolveModel/resolveTexture を
// 個別に渡さなくても、この Context 経由で自動的に解決できるようになる
const MinecraftProvider = ({ assets, children }: MinecraftProviderProps) => {
    // assets が変わらない限り同じ関数参照を保つ。MinecraftItem 側は resolveModel/resolveTexture を
    // useEffect の依存配列に含めるため、参照を安定させないと不要な再解決が走ってしまう
    const value = useMemo<MinecraftAssetsResolver>(
        () => ({
            resolveModel: (path) => joinAssetsPath(assets, `models/${path}`),
            resolveTexture: (fileName) => joinAssetsPath(assets, `textures/${fileName}`),
        }),
        [assets],
    );

    return <MinecraftContext.Provider value={value}>{children}</MinecraftContext.Provider>;
};

// MinecraftItem 内部から Context を読み出すためのフック。Provider の外では null を返す
const useMinecraftAssets = (): MinecraftAssetsResolver | null => useContext(MinecraftContext);

export { MinecraftProvider, useMinecraftAssets };
export type { MinecraftProviderProps, MinecraftAssetsResolver };
