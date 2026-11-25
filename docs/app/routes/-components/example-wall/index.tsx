import {
    Accordion,
    Badge,
    Button,
    Checkbox,
    Field,
    GuideCard,
    List,
    NewsCard,
    PlayerAvatar,
    PlayerAvatarGroup,
    PlayerPhraseCard,
    SegmentGroup,
    Separator,
    Stat,
    Switch,
    Tabs,
    Timeline,
} from "@morinoparty/chlorophyll-react";
import type { ReactNode } from "react";
import { sva } from "styled-system/css";

// サンプルに登場させるプレイヤー
const PLAYERS = {
    chocolatt: { playerId: "389b1a68-f647-4dd0-a421-61b6c22fdebe", playerName: "Chocolatt" },
    nikomaru: { playerId: "f8b761ec-4a54-48eb-a040-c5604042bcc9", playerName: "_NIKOMARU" },
    rinKai: { playerId: "6371dca0-7136-4c43-a8a5-745c95cf8aa2", playerName: "rin_kai" },
    kina: { playerId: "e31f4f1a-9c82-4f8b-b2af-8e1152719f73", playerName: "kina1120" },
    tutu: { playerId: "610fa9d7-4607-4d47-83fd-360f76192723", playerName: "tututututu201" },
} as const;

const ONLINE_PLAYERS = Object.values(PLAYERS).map((player) => ({ id: player.playerId, name: player.playerName }));

// MoriPath のホームにある「きょうのもりぱダイアリー」を模した出来事
const DIARY = [
    { dateTime: "2026-07-15T05:00", time: "05:00", title: "穏やかな時間が流れていました", player: PLAYERS.kina },
    { dateTime: "2026-07-15T09:30", time: "09:30", title: "_NIKOMARU さんが畑を広げました", player: PLAYERS.nikomaru },
    {
        dateTime: "2026-07-15T13:15",
        time: "13:15",
        title: "Chocolatt さんが土地を保護しました",
        player: PLAYERS.chocolatt,
    },
];

// PlayerPhraseCard のフレーズを SSR とクライアントで一致させるための固定基準時刻
const PHRASE_REFERENCE_TIME = new Date("2026-07-15T00:00:00+09:00").getTime();

const wallStyles = sva({
    slots: ["viewport", "wall", "column", "card", "cardTitle", "cardLead", "row", "online"],
    base: {
        // 傾けた壁を右側の領域に収め、はみ出た分は切り落とす。
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
            gap: "5",
            // モバイルでは一回り縮めて、2 列ほどが見えるようにする
            transform: { base: "[rotate(-8deg) scale(0.72)]", md: "[rotate(-8deg)]" },
            transformOrigin: "top left",
        },
        // 3 列。2 列目は 1 列目より少し下げて、列の頭がそろわないようにする
        column: {
            display: "flex",
            flexDirection: "column",
            gap: "5",
            width: "[22rem]",
            flexShrink: "0",
            "&:nth-child(1)": { width: "[24rem]", marginTop: "[6rem]" },
            "&:nth-child(2)": { marginTop: "[9rem]" },
            "&:nth-child(3)": { marginTop: "[11rem]" },
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
        // 「n 人がプレイ中」の帯。MoriPath のホームの最上部にあるもの
        online: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "3",
            paddingY: "2.5",
            paddingLeft: "4",
            paddingRight: "2.5",
            borderRadius: "full",
            bg: "colorPalette.surface.subtle",
            fontSize: "sm",
            fontWeight: "bold",
            color: "colorPalette.fg",
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

// スイッチ 1 つ分。設定タブの中で使い回す
function SwitchRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
    return (
        <Switch.Root defaultChecked={defaultChecked}>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>{label}</Switch.Label>
            <Switch.HiddenInput />
        </Switch.Root>
    );
}

// 実際のコンポーネントで組んだ画面例を、傾けた壁として並べる。
// 入力や切り替えはその場で試せるようにし、別のページへは移動させない
export function ExampleWall() {
    const styles = wallStyles();

    return (
        <section className={styles.viewport} aria-label="コンポーネントの例">
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
                        <GuideCard.Root>
                            <GuideCard.Image src="/castle-width.png" alt="" />
                            <GuideCard.Content>
                                <GuideCard.Title>はじめに</GuideCard.Title>
                                <GuideCard.Description>
                                    インストールからセットアップまでの手引き。
                                </GuideCard.Description>
                            </GuideCard.Content>
                        </GuideCard.Root>
                        <GuideCard.Root>
                            <GuideCard.Image src="/castle-tall.png" alt="" />
                            <GuideCard.Content>
                                <GuideCard.Title>トークン</GuideCard.Title>
                                <GuideCard.Description>
                                    色・余白・タイポグラフィの土台となるトークン一覧。
                                </GuideCard.Description>
                            </GuideCard.Content>
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
                    <div className={styles.online}>
                        <Badge status="success" dot variant="subtle">
                            12 人がプレイ中
                        </Badge>
                        <PlayerAvatarGroup
                            players={ONLINE_PLAYERS}
                            max={4}
                            size="sm"
                            spacing="tight"
                            aria-label="プレイ中のプレイヤー"
                        />
                    </div>

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
                        {[PLAYERS.chocolatt, PLAYERS.nikomaru, PLAYERS.rinKai].map((player) => (
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

                    <DemoCard styles={styles}>
                        <Stat.Group size="sm">
                            <Stat.Root>
                                <Stat.Label>どんぐり</Stat.Label>
                                <Stat.Value>12,480</Stat.Value>
                            </Stat.Root>
                            <Stat.Root>
                                <Stat.Label>保護ブロック</Stat.Label>
                                <Stat.Value>1,240</Stat.Value>
                            </Stat.Root>
                            <Stat.Root>
                                <Stat.Label>連続投票</Stat.Label>
                                <Stat.Value>
                                    7<Stat.Unit>日</Stat.Unit>
                                </Stat.Value>
                            </Stat.Root>
                        </Stat.Group>
                    </DemoCard>

                    <DemoCard styles={styles} title="設定">
                        <Tabs.Root size="sm" defaultValue="general">
                            <Tabs.List>
                                <Tabs.Trigger value="general">概要</Tabs.Trigger>
                                <Tabs.Trigger value="notify">通知</Tabs.Trigger>
                                <Tabs.Indicator />
                            </Tabs.List>
                            <Tabs.Content value="general">
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
                            </Tabs.Content>
                            <Tabs.Content value="notify">
                                <SwitchRow label="新しいお知らせ" defaultChecked />
                                <SwitchRow label="フレンドのログイン" />
                            </Tabs.Content>
                        </Tabs.Root>
                    </DemoCard>

                    <DemoCard styles={styles} title="きょうのもりぱダイアリー">
                        <Timeline.Root size="sm">
                            {DIARY.map((entry) => (
                                <Timeline.Item key={entry.dateTime}>
                                    <Timeline.Indicator />
                                    <Timeline.Connector />
                                    <Timeline.Content>
                                        <Timeline.Time dateTime={entry.dateTime}>{entry.time}</Timeline.Time>
                                        <Timeline.Title>{entry.title}</Timeline.Title>
                                        <Timeline.Meta>
                                            <PlayerAvatar {...entry.player} size="sm" decorative />
                                        </Timeline.Meta>
                                    </Timeline.Content>
                                </Timeline.Item>
                            ))}
                        </Timeline.Root>
                    </DemoCard>
                </div>
            </div>
        </section>
    );
}
