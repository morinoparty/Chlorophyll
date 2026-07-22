import { Accordion, Badge, Button, GuideCard, List, NewsCard, PlayerPhraseCard } from "@morinoparty/chlorophyll-react";
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
        "eyebrow",
        "title",
        "tagline",
        "actions",
        "showcase",
        "demoCard",
        "demoHead",
        "demoTitle",
        "demoLead",
        "demoRow",
        "demoStack",
    ],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: { base: "12", md: "16" },
            maxWidth: "6xl",
            marginX: "auto",
            paddingX: { base: "5", md: "8" },
            paddingY: { base: "10", md: "16" },
        },

        // --- Hero -------------------------------------------------------
        // shadcn のトップページに倣い、中央揃えの見出しと CTA だけで構成する
        hero: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "5",
            paddingY: { base: "6", md: "10" },
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
            textWrap: "balance",
            fontSize: { base: "4xl", md: "6xl" },
            fontWeight: "bold",
            lineHeight: "tight",
            color: "colorPalette.fg",
        },
        tagline: {
            textWrap: "[pretty]",
            fontSize: { base: "md", md: "lg" },
            lineHeight: "relaxed",
            color: "colorPalette.fg.muted",
            maxWidth: "xl",
        },
        actions: {
            display: "flex",
            gap: "3",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "2",
        },

        // --- Component showcase ----------------------------------------
        // 実コンポーネントを組み込んだデモカードを masonry 状に敷き詰める。
        // カードの様式は demoCard の 1 種類だけに揃え、hover では動かさない
        showcase: {
            columnCount: { base: 1, sm: 2, lg: 3 },
            columnGap: "5",
            animation: "[chl-enter 500ms ease-out both]",
        },
        demoCard: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            breakInside: "avoid",
            marginBottom: "5",
            padding: "5",
            borderRadius: "2xl",
            bg: "colorPalette.bg",
            border: "[1px solid]",
            borderColor: "border",
            boxShadow: "xs",
        },
        demoHead: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
        },
        demoTitle: {
            fontSize: "md",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        demoLead: {
            fontSize: "sm",
            color: "colorPalette.fg.muted",
        },
        demoRow: {
            display: "flex",
            flexWrap: "wrap",
            gap: "2",
            alignItems: "center",
        },
        demoStack: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
        },
    },
});

// PlayerPhraseCard のフレーズ生成を SSR とクライアントで一致させるための固定基準時刻。
// 未指定だと現在時刻が使われ、hydration mismatch の原因になる
const PHRASE_REFERENCE_TIME = new Date("2026-07-15T00:00:00+09:00").getTime();

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
            <section className={styles.hero} data-chl-enter style={enterStyle(0)}>
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
            </section>

            {/* Showcase: 実際の利用シーンを模したデモカード群 */}
            <section className={styles.showcase} data-chl-enter style={enterStyle(1)}>
                {/* NewsCard: お知らせ記事のデモ */}
                <div className={styles.demoCard}>
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

                {/* PlayerPhraseCard: メンバー紹介のデモ */}
                <div className={styles.demoCard}>
                    <div className={styles.demoHead}>
                        <span className={styles.demoTitle}>メンバー</span>
                    </div>
                    <div className={styles.demoStack}>
                        <PlayerPhraseCard
                            playerId="389b1a68-f647-4dd0-a421-61b6c22fdebe"
                            playerName="Chocolatt"
                            referenceTime={PHRASE_REFERENCE_TIME}
                        >
                            <PlayerPhraseCard.Avatar />
                            <PlayerPhraseCard.Body>
                                <PlayerPhraseCard.Phrase />
                                <PlayerPhraseCard.Name />
                            </PlayerPhraseCard.Body>
                        </PlayerPhraseCard>
                        <PlayerPhraseCard
                            playerId="75ba1a8c-4e02-4b4b-abe3-92ef4af6147c"
                            playerName="Yahirrro"
                            referenceTime={PHRASE_REFERENCE_TIME}
                        >
                            <PlayerPhraseCard.Avatar />
                            <PlayerPhraseCard.Body>
                                <PlayerPhraseCard.Phrase />
                                <PlayerPhraseCard.Name />
                            </PlayerPhraseCard.Body>
                        </PlayerPhraseCard>
                    </div>
                </div>

                {/* Badge + List + Button: サーバー参加フローのデモ */}
                <div className={styles.demoCard}>
                    <div className={styles.demoHead}>
                        <span className={styles.demoTitle}>サーバーに参加する</span>
                        <span className={styles.demoLead}>今日から建築をはじめよう。</span>
                    </div>
                    <div className={styles.demoRow}>
                        <Badge status="success" dot>
                            オンライン
                        </Badge>
                        <Badge status="info" variant="subtle">
                            新着
                        </Badge>
                        <Badge status="warning" variant="surface">
                            メンテ予定
                        </Badge>
                    </div>
                    <List variant="ghost" size="sm">
                        <List.Item>サーバーに参加する</List.Item>
                        <List.Item>ルールを確認する</List.Item>
                        <List.Item>建築を始める</List.Item>
                    </List>
                    <div className={styles.demoRow}>
                        <Button intent="primary" size="sm">
                            参加する
                        </Button>
                        <Button intent="plain" size="sm">
                            あとで
                        </Button>
                    </div>
                </div>

                {/* Accordion: よくある質問のデモ */}
                <div className={styles.demoCard}>
                    <div className={styles.demoHead}>
                        <span className={styles.demoTitle}>よくある質問</span>
                    </div>
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

                {/* GuideCard: ドキュメントへの入り口を兼ねたデモ */}
                <div className={styles.demoCard}>
                    <div className={styles.demoStack}>
                        <GuideCard.Root asChild>
                            <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }}>
                                <GuideCard.Image src="/castle-width.png" alt="はじめに" />
                                <GuideCard.Content>
                                    <GuideCard.Title>はじめに</GuideCard.Title>
                                    <GuideCard.Description>
                                        インストールからセットアップまでの手引き。
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
                                        色・余白・タイポグラフィなどの土台となるトークン一覧。
                                    </GuideCard.Description>
                                </GuideCard.Content>
                            </Link>
                        </GuideCard.Root>
                    </div>
                </div>

                {/* Button: intent バリエーションのデモ */}
                <div className={styles.demoCard}>
                    <div className={styles.demoHead}>
                        <span className={styles.demoTitle}>イベントを作成</span>
                        <span className={styles.demoLead}>建築コンテストやツアーを企画しよう。</span>
                    </div>
                    <div className={styles.demoRow}>
                        <Button intent="primary" size="sm">
                            作成する
                        </Button>
                        <Button intent="secondary" size="sm">
                            下書き
                        </Button>
                        <Button intent="plain" size="sm">
                            キャンセル
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
