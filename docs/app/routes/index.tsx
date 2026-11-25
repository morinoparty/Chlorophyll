import { Button } from "@morinoparty/chlorophyll-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { cx, sva } from "styled-system/css";
import { ExampleWall } from "./-components/example-wall";
import { InstallCommand } from "./-components/install-command";
import { paletteClass, type PaletteName, type RadiusName, radiusStyle, ThemePicker } from "./-components/theme-picker";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [{ title: "Chlorophyll - Morinoparty Design System" }],
    }),
    component: Home,
});

const homeStyles = sva({
    slots: ["root", "hero", "title", "tagline", "actions"],
    base: {
        // xl 以上ではヘッダーを除いた 1 画面に収め、左に説明・右に傾けたサンプルの壁を置く
        root: {
            display: "grid",
            gridTemplateColumns: { base: "[minmax(0, 1fr)]", xl: "[minmax(0, 29rem) 1fr]" },
            columnGap: "16",
            // ヘッダー(4rem + 下線 1px)を除いた高さ
            height: { xl: "[calc(100dvh - 4rem - 1px)]" },
            minHeight: { xl: "[40rem]" },
            overflow: "hidden",
            paddingLeft: { base: "5", md: "8", xl: "20" },
            paddingRight: { base: "5", md: "8", xl: "0" },
            bg: "colorPalette.bg",
        },
        hero: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: { base: "6", md: "8" },
            minWidth: "0",
            paddingY: { base: "12", xl: "8" },
            animation: "[chl-enter 500ms ease-out both]",
        },
        title: {
            fontSize: { base: "4xl", md: "[4.5rem]" },
            fontWeight: "bold",
            lineHeight: "[1]",
            letterSpacing: "tight",
            color: "colorPalette.fg",
        },
        tagline: {
            marginTop: "5",
            fontSize: "md",
            lineHeight: "relaxed",
            color: "colorPalette.fg.muted",
            // 文節の途中で折り返さない
            wordBreak: "auto-phrase",
        },
        actions: {
            display: "flex",
            gap: "3",
            flexWrap: "wrap",
        },
    },
});

function Home() {
    const styles = homeStyles();
    // テーマピッカーで選んだパレットと角丸は、このページの中だけに適用する。
    // パレットは未選択(null)の間、ヘッダーで切り替えたサイト全体のパレットに従う
    const [palette, setPalette] = useState<PaletteName | null>(null);
    const [radius, setRadius] = useState<RadiusName>("md");

    return (
        <div className={cx(palette && paletteClass[palette], styles.root)} style={radiusStyle(radius)}>
            <section className={styles.hero}>
                <div>
                    <h1 className={styles.title}>Chlorophyll</h1>
                    <p className={styles.tagline} lang="ja">
                        もりのパーティが育てる、AI ネイティブなデザインシステム。
                        <br />
                        人も AI も、同じトークンとコンポーネントで組み立てる。
                    </p>
                </div>
                <div className={styles.actions}>
                    <Button intent="primary" asChild>
                        <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }}>
                            ドキュメントを読む
                        </Link>
                    </Button>
                    <Button intent="secondary" asChild>
                        <a href="/storybook/">コンポーネントを見る</a>
                    </Button>
                </div>
                <InstallCommand />
                <ThemePicker
                    palette={palette}
                    radius={radius}
                    onPaletteChange={setPalette}
                    onRadiusChange={setRadius}
                />
            </section>

            <ExampleWall />
        </div>
    );
}
