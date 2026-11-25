import {
    Button,
    Checkbox,
    Field,
    GuideCard,
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
    slots: ["viewport", "wall", "column", "card", "cardTitle", "stats"],
    base: {
        // 傾けた壁を右側の領域に収め、はみ出た分は切り落とす
        viewport: {
            position: "relative",
            height: "full",
            minHeight: "[36rem]",
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
            transform: "[rotate(-8deg)]",
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
        },
        card: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            padding: "5",
            borderRadius: "l3",
            bg: "colorPalette.surface.subtle",
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
                </div>
            </div>
        </div>
    );
}
