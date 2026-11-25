import {
    Accordion,
    Badge,
    Button,
    Checkbox,
    Field,
    GuideCard,
    List,
    NewsCard,
    PlayerPhraseCard,
    SegmentGroup,
    Separator,
    Stat,
    Switch,
    Tabs,
} from "@morinoparty/chlorophyll-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { sva } from "styled-system/css";

// サンプルに登場させるプレイヤー
const PLAYERS = {
    chocolatt: { playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe", playerName: "Chocolatt" },
    nikomaru: { playerId: "f8b761ec-4a54-48eb-a040-c5604042bcc9", playerName: "_NIKOMARU" },
    rinKai: { playerId: "6371dca0-7136-4c43-a8a5-745c95cf8aa2", playerName: "rin_kai" },
} as const;

// PlayerPhraseCard のフレーズを SSR とクライアントで一致させるための固定基準時刻
const PHRASE_REFERENCE_TIME = new Date("2026-07-15T00:00:00+09:00").getTime();

const wallStyles = sva({
    slots: [
        "viewport",
        "wall",
        "column",
        "card",
        "cardInverted",
        "cardTitle",
        "cardTitleInverted",
        "cardLead",
        "row",
        "stats",
    ],
    base: {
        // 傾けた壁を右側の領域に収め、はみ出た分は切り落とす
        // モバイルでは説明の下に高さ固定の帯として置き、画面の左右端まで広げる
        viewport: {
            position: "relative",
            height: { base: "[30rem]", xl: "full" },
            marginX: { base: "-5", md: "-8", xl: "0" },
            overflow: "hidden",
            // 入場アニメーションは transform を上書きするので、傾ける要素とは別の要素に付ける
            animation: "[chl-enter 600ms ease-out both]",
        },
        // 列を横に並べ、壁ごと傾ける。右端と上下は画面の外へ流す
        wall: {
            position: "absolute",
            top: "[-2rem]",
            left: "[-1rem]",
            display: "flex",
            alignItems: "flex-start",
            gap: "4",
            // モバイルでは一回り縮めて、2 列ほどが見えるようにする
            transform: { base: "[rotate(-8deg) scale(0.72)]", md: "[rotate(-8deg)]" },
            transformOrigin: "top left",
        },
        column: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            width: "[18.75rem]",
            flexShrink: "0",
            "&:nth-child(1)": { width: "[22.5rem]", marginTop: "[6rem]" },
            "&:nth-child(2)": { marginTop: "[1.5rem]" },
            "&:nth-child(3)": { marginTop: "[2.5rem]" },
            "&:nth-child(4)": { marginTop: "[-1rem]" },
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            padding: "5",
            borderRadius: "l3",
            bg: "colorPalette.surface.subtle",
        },
        // 濃いブランド色で塗ったカード。壁の中で目を留める場所にする
        cardInverted: {
            bg: "colorPalette.solid",
        },
        cardTitleInverted: {
            fontSize: "md",
            fontWeight: "bold",
            color: "colorPalette.contrast",
        },
        cardLead: {
            marginTop: "-2",
            fontSize: "sm",
            color: "colorPalette.fg.muted",
        },
        row: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "2",
        },
        cardTitle: {
            fontSize: "md",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        stats: {
            display: "grid",
            gridTemplateColumns: "[repeat(2, minmax(0, 1fr))]",
            gap: "3",
        },
    },
});

type WallStyles = ReturnType<typeof wallStyles>;

function DemoCard({ styles, title, children }: { styles: WallStyles; title?: string; children: ReactNode }) {
    return (
        <div className={styles.card}>
            {title && <span className={styles.cardTitle}>{title}</span>}
            {children}
        </div>
    );
}

// 実際のコンポーネントで組んだ画面例を、傾けた壁として並べる。
// 装飾なので操作の対象からは外し、支援技術にも読ませない
export function ExampleWall() {
    const styles = wallStyles();

    return (
        <div className={styles.viewport} aria-hidden="true" inert>
            <div className={styles.wall}>
                <div className={styles.column}>
                    <NewsCard.Root>
                        <NewsCard.Thumbnail src="/castle-width.png" alt="" />
                        <NewsCard.Content>
                            <NewsCard.Category>お知らせ</NewsCard.Category>
                            <NewsCard.Title>夏の建築コンテスト</NewsCard.Title>
                        </NewsCard.Content>
                        <NewsCard.Footer>
                            <NewsCard.Date dateTime="2026-07-15">2026/07/15</NewsCard.Date>
                            <NewsCard.Author players={[PLAYERS.chocolatt, PLAYERS.nikomaru, PLAYERS.rinKai]} />
                        </NewsCard.Footer>
                    </NewsCard.Root>

                    <DemoCard styles={styles}>
                        <GuideCard.Root asChild>
                            <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }} tabIndex={-1}>
                                <GuideCard.Image src="/castle-width.png" alt="" />
                                <GuideCard.Content>
                                    <GuideCard.Title>はじめに</GuideCard.Title>
                                    <GuideCard.Description>
                                        インストールからセットアップまでの手引き。
                                    </GuideCard.Description>
                                </GuideCard.Content>
                            </Link>
                        </GuideCard.Root>
                        <GuideCard.Root asChild>
                            <Link to="/docs/$" params={{ _splat: "theme" }} tabIndex={-1}>
                                <GuideCard.Image src="/castle-tall.png" alt="" />
                                <GuideCard.Content>
                                    <GuideCard.Title>トークン</GuideCard.Title>
                                    <GuideCard.Description>
                                        色・余白・タイポグラフィの土台となるトークン一覧。
                                    </GuideCard.Description>
                                </GuideCard.Content>
                            </Link>
                        </GuideCard.Root>
                    </DemoCard>

                    <DemoCard styles={styles} title="よくある質問">
                        <Accordion.Root variant="ghost" collapsible defaultValue={["join"]}>
                            <Accordion.Item value="join">
                                <Accordion.ItemTrigger>参加方法は？</Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    サーバーアドレスを追加して、そのまま接続すれば参加できます。
                                </Accordion.ItemContent>
                            </Accordion.Item>
                            <Accordion.Item value="rule">
                                <Accordion.ItemTrigger>ルールはある？</Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    他のプレイヤーの建築は壊さないでください。
                                </Accordion.ItemContent>
                            </Accordion.Item>
                        </Accordion.Root>
                    </DemoCard>
                </div>

                <div className={styles.column}>
                    <DemoCard styles={styles} title="通知">
                        {[
                            { label: "新しいお知らせ", checked: true },
                            { label: "イベントの開始", checked: true },
                            { label: "フレンドのログイン", checked: false },
                        ].map((item) => (
                            <Switch.Root key={item.label} defaultChecked={item.checked}>
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label>{item.label}</Switch.Label>
                                <Switch.HiddenInput />
                            </Switch.Root>
                        ))}
                    </DemoCard>

                    <DemoCard styles={styles} title="ログイン">
                        <Field.Root>
                            <Field.Label>ユーザー名</Field.Label>
                            <Field.Input defaultValue="Yahirrro" />
                        </Field.Root>
                        <Field.Root>
                            <Field.Label>パスワード</Field.Label>
                            <Field.Input type="password" defaultValue="chlorophyll" />
                        </Field.Root>
                        <Checkbox.Root defaultChecked>
                            <Checkbox.Control />
                            <Checkbox.Label>ログイン状態を保持する</Checkbox.Label>
                            <Checkbox.HiddenInput />
                        </Checkbox.Root>
                        <Button intent="primary">ログイン</Button>
                        <Separator />
                        <Button intent="secondary">パスキーでログイン</Button>
                    </DemoCard>

                    <DemoCard styles={styles} title="メンバー">
                        {Object.values(PLAYERS).map((player) => (
                            <PlayerPhraseCard
                                key={player.playerId}
                                playerId={player.playerId}
                                playerName={player.playerName}
                                referenceTime={PHRASE_REFERENCE_TIME}
                            >
                                <PlayerPhraseCard.Avatar />
                                <PlayerPhraseCard.Body>
                                    <PlayerPhraseCard.Phrase />
                                    <PlayerPhraseCard.Name />
                                </PlayerPhraseCard.Body>
                            </PlayerPhraseCard>
                        ))}
                    </DemoCard>
                </div>

                <div className={styles.column}>
                    <DemoCard styles={styles} title="設定">
                        <Tabs.Root size="sm" defaultValue="general">
                            <Tabs.List>
                                <Tabs.Trigger value="general">概要</Tabs.Trigger>
                                <Tabs.Trigger value="notify">通知</Tabs.Trigger>
                                <Tabs.Trigger value="account">アカウント</Tabs.Trigger>
                                <Tabs.Indicator />
                            </Tabs.List>
                        </Tabs.Root>
                        <Field.Root>
                            <Field.Input defaultValue="Chocolatt" aria-label="ニックネーム" />
                        </Field.Root>
                        <Switch.Root defaultChecked>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label>通知を受け取る</Switch.Label>
                            <Switch.HiddenInput />
                        </Switch.Root>
                        <SegmentGroup.Root defaultValue="day">
                            <SegmentGroup.Label>表示期間</SegmentGroup.Label>
                            <SegmentGroup.Control>
                                <SegmentGroup.Indicator />
                                {[
                                    { value: "day", label: "日" },
                                    { value: "week", label: "週" },
                                    { value: "month", label: "月" },
                                ].map((item) => (
                                    <SegmentGroup.Item key={item.value} value={item.value}>
                                        <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
                                        <SegmentGroup.ItemControl />
                                        <SegmentGroup.ItemHiddenInput />
                                    </SegmentGroup.Item>
                                ))}
                            </SegmentGroup.Control>
                        </SegmentGroup.Root>
                    </DemoCard>

                    <DemoCard styles={styles} title="今週のサーバー">
                        <div className={styles.stats}>
                            <Stat.Root>
                                <Stat.Label>ログイン</Stat.Label>
                                <Stat.Value>
                                    128<Stat.Unit>人</Stat.Unit>
                                </Stat.Value>
                            </Stat.Root>
                            <Stat.Root>
                                <Stat.Label>建築ブロック</Stat.Label>
                                <Stat.Value>42,310</Stat.Value>
                            </Stat.Root>
                        </div>
                    </DemoCard>

                    <DemoCard styles={styles} title="表示">
                        <Tabs.Root variant="enclosed" defaultValue="list">
                            <Tabs.List>
                                <Tabs.Trigger value="list">リスト</Tabs.Trigger>
                                <Tabs.Trigger value="map">マップ</Tabs.Trigger>
                                <Tabs.Trigger value="calendar">カレンダー</Tabs.Trigger>
                                <Tabs.Indicator />
                            </Tabs.List>
                        </Tabs.Root>
                    </DemoCard>

                    <DemoCard styles={styles} title="ステータス">
                        <div className={styles.row}>
                            <Badge status="success" dot>
                                オンライン
                            </Badge>
                            <Badge variant="solid">建築中</Badge>
                            <Badge status="info" variant="subtle">
                                新着
                            </Badge>
                            <Badge status="warning" variant="surface">
                                メンテ予定
                            </Badge>
                        </div>
                    </DemoCard>
                </div>

                <div className={styles.column}>
                    <DemoCard styles={styles} title="サーバーに参加する">
                        <span className={styles.cardLead}>今日から建築をはじめよう。</span>
                        <List variant="ghost" size="sm">
                            <List.Item>サーバーに参加する</List.Item>
                            <List.Item>ルールを確認する</List.Item>
                            <List.Item>建築を始める</List.Item>
                        </List>
                        <div className={styles.row}>
                            <Button intent="primary" size="sm">
                                参加する
                            </Button>
                            <Button intent="plain" size="sm">
                                あとで
                            </Button>
                        </div>
                    </DemoCard>

                    <div className={`${styles.card} ${styles.cardInverted}`}>
                        <span className={styles.cardTitleInverted}>イベントを作成</span>
                        <div className={styles.row}>
                            <Button intent="secondary" size="sm">
                                作成する
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
