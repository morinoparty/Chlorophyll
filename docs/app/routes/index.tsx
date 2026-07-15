import { Accordion, Badge, Button, GuideCard, List, NewsCard } from "@morinoparty/chlorophyll-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [{ title: "Chlorophyll - Morinoparty Design System" }],
    }),
    component: Home,
});

const homeStyles = sva({
    slots: [
        "root",
        "hero",
        "heroLeft",
        "eyebrow",
        "title",
        "tagline",
        "actions",
        "heroCollage",
        "collageNews",
        "collageBadges",
        "collageButtons",
        "sections",
        "showcase",
        "showcaseHead",
        "showcaseTitle",
        "showcaseLead",
        "showcaseGrid",
        "tile",
        "tileHead",
        "tileTitle",
        "tileBody",
        "tileRow",
        "tileLink",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            // 各セクションの間隔。上下にたっぷり余白を取り、要素同士を呼吸させる
            gap: { base: "16", md: "24" },
            maxWidth: "6xl",
            marginX: "auto",
            paddingX: { base: "5", md: "8" },
            paddingY: { base: "12", md: "20" },
        },

        // --- Hero -------------------------------------------------------
        hero: {
            display: "grid",
            // モバイルは 1 カラム、md 以上でテキストとコラージュを左右に並べる
            gridTemplateColumns: { base: "1fr", md: "[1.1fr 1fr]" },
            gap: { base: "10", md: "16" },
            alignItems: "center",
        },
        heroLeft: {
            display: "flex",
            flexDirection: "column",
            alignItems: { base: "center", md: "start" },
            textAlign: { base: "center", md: "left" },
            gap: "5",
            // 入場アニメーション本体。遅延だけは要素ごとに inline で付与する
            animation: "[chl-enter 500ms ease-out both]",
        },
        eyebrow: {
            display: "inline-flex",
            alignItems: "center",
            fontSize: "sm",
            fontWeight: "medium",
            letterSpacing: "wide",
            color: "colorPalette.fg.muted",
            paddingY: "1",
            paddingX: "3",
            borderRadius: "full",
            bg: "colorPalette.surface",
        },
        title: {
            // 長い見出しでも折り返しが自然になるよう balance を使う
            textWrap: "balance",
            fontSize: { base: "4xl", md: "5xl" },
            fontWeight: "bold",
            lineHeight: "tight",
            color: "colorPalette.fg",
        },
        tagline: {
            // 本文は行末をなだらかにする pretty で読みやすくする
            textWrap: "[pretty]",
            fontSize: { base: "md", md: "lg" },
            lineHeight: "relaxed",
            color: "colorPalette.fg.muted",
            maxWidth: "md",
        },
        actions: {
            display: "flex",
            gap: "3",
            flexWrap: "wrap",
            justifyContent: { base: "center", md: "start" },
            marginTop: "2",
        },

        // --- Hero collage ----------------------------------------------
        heroCollage: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            // 淡い面のパネルに実コンポーネントを並べたショーケース
            padding: { base: "5", md: "6" },
            borderRadius: "4xl",
            bg: "colorPalette.bg.subtle",
            boxShadow: "lg",
            animation: "[chl-enter 500ms ease-out both]",
        },
        collageNews: {
            padding: "4",
            borderRadius: "3xl",
            bg: "colorPalette.bg",
            boxShadow: "sm",
        },
        collageBadges: {
            display: "flex",
            flexWrap: "wrap",
            gap: "2",
        },
        collageButtons: {
            display: "flex",
            flexWrap: "wrap",
            gap: "3",
        },

        // --- GuideCard sections ----------------------------------------
        sections: {
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "[repeat(2, 1fr)]" },
            gap: "5",
            animation: "[chl-enter 500ms ease-out both]",
        },

        // --- Component showcase ----------------------------------------
        showcase: {
            display: "flex",
            flexDirection: "column",
            gap: "8",
            animation: "[chl-enter 500ms ease-out both]",
        },
        showcaseHead: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            alignItems: { base: "center", md: "start" },
            textAlign: { base: "center", md: "left" },
        },
        showcaseTitle: {
            textWrap: "balance",
            fontSize: { base: "3xl", md: "4xl" },
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        showcaseLead: {
            textWrap: "[pretty]",
            fontSize: "md",
            color: "colorPalette.fg.muted",
            maxWidth: "xl",
        },
        showcaseGrid: {
            display: "grid",
            gridTemplateColumns: { base: "1fr", sm: "[repeat(2, 1fr)]" },
            gap: "5",
        },
        // 個々のタイル。外側 radius = 内側 radius(xl) + padding(3) の同心円になるよう 3xl を選ぶ
        tile: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            padding: "6",
            borderRadius: "3xl",
            bg: "colorPalette.bg",
            border: "[1px solid]",
            borderColor: "border",
            // jakub.kr 流の重ねシャドウ。hover で少し浮き上がらせる
            boxShadow: "sm",
            transitionProperty: "[box-shadow, transform]",
            transitionDuration: "normal",
            transitionTimingFunction: "easeInOut",
            _hover: {
                boxShadow: "lg",
                transform: "translateY(-2px)",
            },
        },
        tileHead: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
        },
        tileTitle: {
            fontSize: "lg",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        tileBody: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
            flex: "1",
        },
        tileRow: {
            display: "flex",
            flexWrap: "wrap",
            gap: "2",
            alignItems: "center",
        },
        tileLink: {
            alignSelf: "start",
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
            textDecoration: "none",
            transition: "colors",
            _hover: { color: "colorPalette.fg" },
        },
    },
});

// 各セクションの入場アニメーションを 80ms 刻みでずらすためのヘルパー。
// アニメーション本体は sva 側で定義し、ここでは遅延だけを要素ごとに与える。
// prefers-reduced-motion 時は app.css 側でアニメーションを無効化する
function enterStyle(index: number) {
    return {
        animationDelay: `${index * 80}ms`,
    } as const;
}

function Home() {
    const styles = homeStyles();

    return (
        <div className={styles.root}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroLeft} data-chl-enter style={enterStyle(0)}>
                    <span className={styles.eyebrow}>Morinoparty Design System</span>
                    <h1 className={styles.title}>Chlorophyll</h1>
                    <p className={styles.tagline}>
                        Panda CSS と Ark UI で組んだ、モリノパーティのためのコンポーネントライブラリ。トークンから
                        コンポーネントまで、一貫したデザインをすばやく組み立てられる。
                    </p>
                    <div className={styles.actions}>
                        <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }}>
                            <Button intent="primary">ドキュメントへ</Button>
                        </Link>
                        <Link to="/docs/$" params={{ _splat: "theme" }}>
                            <Button intent="secondary">トークン一覧</Button>
                        </Link>
                    </div>
                </div>

                {/* コラージュ: colorPalette トークンで塗り、ヘッダーのパレット切り替えで再テーマされる */}
                <div className={styles.heroCollage} data-chl-enter style={enterStyle(1)}>
                    <div className={styles.collageNews}>
                        <NewsCard.Root>
                            <NewsCard.Thumbnail src="/castle-width.png" alt="モリノパーティの城" />
                            <NewsCard.Content>
                                <NewsCard.Category>お知らせ</NewsCard.Category>
                                <NewsCard.Title>夏の建築コンテストを開催します</NewsCard.Title>
                            </NewsCard.Content>
                            <NewsCard.Footer>
                                <NewsCard.Date dateTime="2026-07-15">2026年7月15日</NewsCard.Date>
                                <NewsCard.Author
                                    players={[
                                        { playerId: "069a79f4-44e9-4726-a5be-fca90e38aaf5", playerName: "Notch" },
                                        { playerId: "853c80ef-3c37-49fd-aa49-938b674adae6", playerName: "jeb_" },
                                    ]}
                                />
                            </NewsCard.Footer>
                        </NewsCard.Root>
                    </div>

                    <div className={styles.collageBadges}>
                        <Badge status="success" dot>
                            オンライン
                        </Badge>
                        <Badge status="info" variant="subtle">
                            新着
                        </Badge>
                        <Badge status="warning" variant="surface">
                            メンテ予定
                        </Badge>
                        <Badge status="error" variant="outline">
                            満員
                        </Badge>
                    </div>

                    <div className={styles.collageButtons}>
                        <Button intent="primary" size="sm">
                            参加する
                        </Button>
                        <Button intent="secondary" size="sm">
                            詳細
                        </Button>
                        <Button intent="plain" size="sm">
                            あとで
                        </Button>
                    </div>
                </div>
            </section>

            {/* Sections: GuideCard で主要な入り口へ誘導する */}
            <section className={styles.sections} data-chl-enter style={enterStyle(2)}>
                <GuideCard.Root asChild>
                    <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }}>
                        <GuideCard.Image src="/castle-width.png" alt="はじめに" />
                        <GuideCard.Content>
                            <GuideCard.Title>はじめに</GuideCard.Title>
                            <GuideCard.Description>
                                インストールからセットアップまで、Chlorophyll を使い始めるための手引き。
                            </GuideCard.Description>
                        </GuideCard.Content>
                    </Link>
                </GuideCard.Root>

                <GuideCard.Root asChild>
                    <Link to="/docs/$" params={{ _splat: "theme" }}>
                        <GuideCard.Image src="/castle-tall.png" alt="トークン" />
                        <GuideCard.Content>
                            <GuideCard.Title>トークン</GuideCard.Title>
                            <GuideCard.Description>
                                色・余白・タイポグラフィなど、デザインの土台となるトークン一覧。
                            </GuideCard.Description>
                        </GuideCard.Content>
                    </Link>
                </GuideCard.Root>
            </section>

            {/* Component showcase */}
            <section className={styles.showcase} data-chl-enter style={enterStyle(3)}>
                <div className={styles.showcaseHead}>
                    <h2 className={styles.showcaseTitle}>コンポーネント</h2>
                    <p className={styles.showcaseLead}>
                        バッジやボタン、リスト、アコーディオンなど、そのまま使える実コンポーネントを揃えている。
                    </p>
                </div>

                <div className={styles.showcaseGrid}>
                    {/* Badge */}
                    <div className={styles.tile}>
                        <div className={styles.tileHead}>
                            <span className={styles.tileTitle}>Badge</span>
                        </div>
                        <div className={styles.tileBody}>
                            <div className={styles.tileRow}>
                                <Badge status="success">成功</Badge>
                                <Badge status="info" variant="subtle">
                                    情報
                                </Badge>
                                <Badge status="warning" variant="surface">
                                    警告
                                </Badge>
                                <Badge status="error" variant="outline">
                                    エラー
                                </Badge>
                            </div>
                        </div>
                        <Link
                            to="/docs/$"
                            params={{ _splat: "theme/system-tokens/colors" }}
                            className={styles.tileLink}
                        >
                            カラートークンを見る →
                        </Link>
                    </div>

                    {/* Button */}
                    <div className={styles.tile}>
                        <div className={styles.tileHead}>
                            <span className={styles.tileTitle}>Button</span>
                        </div>
                        <div className={styles.tileBody}>
                            <div className={styles.tileRow}>
                                <Button intent="primary" size="sm">
                                    Primary
                                </Button>
                                <Button intent="secondary" size="sm">
                                    Secondary
                                </Button>
                                <Button intent="plain" size="sm">
                                    Plain
                                </Button>
                            </div>
                        </div>
                        <Link
                            to="/docs/$"
                            params={{ _splat: "getting-started/quick-start" }}
                            className={styles.tileLink}
                        >
                            クイックスタート →
                        </Link>
                    </div>

                    {/* List */}
                    <div className={styles.tile}>
                        <div className={styles.tileHead}>
                            <span className={styles.tileTitle}>List</span>
                        </div>
                        <div className={styles.tileBody}>
                            <List variant="ghost" size="sm">
                                <List.Item>サーバーに参加する</List.Item>
                                <List.Item>ルールを確認する</List.Item>
                                <List.Item>建築を始める</List.Item>
                            </List>
                        </div>
                        <Link to="/docs/$" params={{ _splat: "theme" }} className={styles.tileLink}>
                            トークンを見る →
                        </Link>
                    </div>

                    {/* Accordion */}
                    <div className={styles.tile}>
                        <div className={styles.tileHead}>
                            <span className={styles.tileTitle}>Accordion</span>
                        </div>
                        <div className={styles.tileBody}>
                            <Accordion.Root variant="ghost" collapsible defaultValue={["join"]}>
                                <Accordion.Item value="join">
                                    <Accordion.ItemTrigger>参加方法は？</Accordion.ItemTrigger>
                                    <Accordion.ItemContent>
                                        サーバーアドレスを追加して、そのまま接続すれば参加できる。
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                                <Accordion.Item value="rule">
                                    <Accordion.ItemTrigger>ルールはある？</Accordion.ItemTrigger>
                                    <Accordion.ItemContent>
                                        他のプレイヤーの建築を壊さないなど、いくつかの約束がある。
                                    </Accordion.ItemContent>
                                </Accordion.Item>
                            </Accordion.Root>
                        </div>
                        <Link to="/docs/$" params={{ _splat: "concept/architecture" }} className={styles.tileLink}>
                            設計を見る →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
