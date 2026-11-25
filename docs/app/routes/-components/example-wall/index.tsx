import {
    Accordion,
    Badge,
    Button,
    Checkbox,
    Field,
    GuideCard,
    List,
    MinecraftItem,
    MinecraftProvider,
    NewsCard,
    PlayerAvatar,
    PlayerPhraseCard,
    SegmentGroup,
    Separator,
    SkinViewer,
    Stat,
    Switch,
    Tabs,
    Timeline,
} from "@morinoparty/chlorophyll-react";
import { ChevronRight } from "lucide-react";
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

// プレイ中の帯に並べるプレイヤー
const ONLINE_PLAYERS = [
    ...Object.values(PLAYERS),
    { playerId: "75ba1a8c-4e02-4b4b-abe3-92ef4af6147c", playerName: "Yahirrro" },
];

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

// MoriPath の「おみせ」を模した出品
const SHOP_ITEMS = [
    { id: "diamond_sword", name: "Diamond Sword", amount: 1, price: 80, seller: PLAYERS.nikomaru },
    { id: "oak_log", name: "Oak Log", amount: 16, price: 12, seller: PLAYERS.kina },
    { id: "iron_pickaxe", name: "Iron Pickaxe", amount: 1, price: 20, seller: PLAYERS.chocolatt },
];

// PlayerPhraseCard のフレーズを SSR とクライアントで一致させるための固定基準時刻
const PHRASE_REFERENCE_TIME = new Date("2026-07-15T00:00:00+09:00").getTime();

const wallStyles = sva({
    slots: [
        "viewport",
        "wall",
        "column",
        "card",
        "cardTitle",
        "cardLead",
        "row",
        "stack",
        "online",
        "onlineCount",
        "onlineDot",
        "onlineFaces",
        "onlineChevron",
        "profile",
        "profileSkin",
        "profileName",
        "skinCanvas",
        "shopRow",
        "shopIcon",
        "shopBody",
        "shopName",
        "shopSeller",
        "shopPrice",
        "shopUnit",
        "profileStats",
        "statTile",
    ],
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
        // タブの中身など、縦に並べる要素の間隔
        stack: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            paddingTop: "4",
        },
        // 「n人がプレイ中」の帯(MoriPath ホーム 案2-A)。顔は帯の中で横スクロールする
        online: {
            display: "flex",
            alignItems: "center",
            gap: "2.5",
            height: "11",
            paddingX: "3.5",
            borderRadius: "full",
            bg: "colorPalette.surface.subtle",
        },
        onlineCount: {
            display: "flex",
            alignItems: "center",
            gap: "1.5",
            flexShrink: "0",
            fontSize: "sm",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        onlineDot: {
            width: "2",
            height: "2",
            borderRadius: "full",
            bg: "colorPalette.solid",
        },
        // 右端をフェードさせて、続きがあることを示す
        onlineFaces: {
            display: "flex",
            gap: "1.5",
            flex: "1",
            minWidth: "0",
            overflowX: "auto",
            scrollbarWidth: "none",
            maskImage: "[linear-gradient(to right, black 75%, transparent)]",
        },
        onlineChevron: {
            flexShrink: "0",
            width: "4.5",
            height: "4.5",
            color: "colorPalette.fg.muted",
        },
        // スキンと数値を並べるカード(MoriPath ホームのプロフィール部分)
        profile: {
            display: "grid",
            gridTemplateColumns: "[minmax(0, 1fr) minmax(0, 1fr)]",
            gap: "3",
        },
        profileSkin: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "2",
            paddingY: "3",
            borderRadius: "l3",
            bg: "colorPalette.surface.subtle",
            cursor: "grab",
        },
        // カードの面をそのまま見せるため、ビューア自身の背景は消す
        skinCanvas: {
            bg: "transparent",
        },
        profileName: {
            fontSize: "sm",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        profileStats: {
            display: "flex",
            flexDirection: "column",
            gap: "3",
        },
        // おみせの 1 行。アイコン・名前と出品者・値段を並べる
        shopRow: {
            display: "flex",
            alignItems: "center",
            gap: "3",
            padding: "3",
            borderRadius: "l2",
            bg: "bg.panel",
        },
        shopIcon: {
            display: "grid",
            placeItems: "center",
            width: "11",
            height: "11",
            flexShrink: "0",
            borderRadius: "l2",
            bg: "colorPalette.surface.subtle",
        },
        shopBody: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            flex: "1",
            minWidth: "0",
        },
        shopName: {
            fontSize: "sm",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        shopSeller: {
            display: "flex",
            alignItems: "center",
            gap: "1.5",
            fontSize: "xs",
            color: "colorPalette.fg.muted",
            "& > *": { width: "4", height: "4" },
        },
        shopPrice: {
            fontSize: "lg",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        shopUnit: {
            marginLeft: "1",
            fontSize: "xs",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
        },
        statTile: {
            flex: "1",
            paddingX: "4",
            paddingY: "3",
            borderRadius: "l3",
            bg: "colorPalette.surface.subtle",
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
        // MinecraftItem のモデルとテクスチャは、docs に同梱している Storybook のアセットを使う
        <MinecraftProvider assets="/storybook/minecraft-assets">
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
                            <span className={styles.onlineCount}>
                                <span className={styles.onlineDot} />
                                {ONLINE_PLAYERS.length}人がプレイ中
                            </span>
                            <div className={styles.onlineFaces}>
                                {ONLINE_PLAYERS.map((player) => (
                                    <PlayerAvatar key={player.playerId} {...player} size="sm" />
                                ))}
                            </div>
                            <ChevronRight className={styles.onlineChevron} />
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

                        <DemoCard styles={styles} title="おみせ">
                            {SHOP_ITEMS.map((item) => (
                                <div key={item.id} className={styles.shopRow}>
                                    <span className={styles.shopIcon}>
                                        <MinecraftItem id={item.id} size="sm" />
                                    </span>
                                    <span className={styles.shopBody}>
                                        <span className={styles.shopName}>
                                            {item.name} ×{item.amount}
                                        </span>
                                        <span className={styles.shopSeller}>
                                            <PlayerAvatar {...item.seller} size="sm" decorative />
                                            {item.seller.playerName}
                                        </span>
                                    </span>
                                    <span className={styles.shopPrice}>
                                        {item.price}
                                        <span className={styles.shopUnit}>どんぐり</span>
                                    </span>
                                </div>
                            ))}
                        </DemoCard>
                    </div>

                    <div className={styles.column}>
                        <DemoCard styles={styles} title="サーバーに参加する">
                            <span className={styles.cardLead}>今日から建築をはじめよう。</span>
                            <div className={styles.row}>
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
                            <div className={styles.row}>
                                <Button intent="primary" size="sm">
                                    参加する
                                </Button>
                                <Button intent="plain" size="sm">
                                    あとで
                                </Button>
                            </div>
                        </DemoCard>

                        <div className={styles.profile}>
                            <div className={styles.profileSkin}>
                                <SkinViewer
                                    playerId={PLAYERS.nikomaru.playerId}
                                    width={140}
                                    height={200}
                                    yaw={-20}
                                    animation="idle"
                                    className={styles.skinCanvas}
                                />
                                <span className={styles.profileName}>{PLAYERS.nikomaru.playerName}</span>
                            </div>
                            <div className={styles.profileStats}>
                                {[
                                    { label: "どんぐり", value: "12,480" },
                                    { label: "保護ブロック", value: "1,240" },
                                    { label: "連続投票", value: "7", unit: "日" },
                                ].map((item) => (
                                    <div key={item.label} className={styles.statTile}>
                                        <Stat.Root size="sm">
                                            <Stat.Label>{item.label}</Stat.Label>
                                            <Stat.Value>
                                                {item.value}
                                                {item.unit && <Stat.Unit>{item.unit}</Stat.Unit>}
                                            </Stat.Value>
                                        </Stat.Root>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DemoCard styles={styles} title="設定">
                            <Tabs.Root size="sm" defaultValue="general">
                                <Tabs.List>
                                    <Tabs.Trigger value="general">概要</Tabs.Trigger>
                                    <Tabs.Trigger value="notify">通知</Tabs.Trigger>
                                    <Tabs.Indicator />
                                </Tabs.List>
                                <Tabs.Content value="general">
                                    <div className={styles.stack}>
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
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content value="notify">
                                    <div className={styles.stack}>
                                        <SwitchRow label="新しいお知らせ" defaultChecked />
                                        <SwitchRow label="イベントの開始" defaultChecked />
                                        <SwitchRow label="フレンドのログイン" />
                                    </div>
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
        </MinecraftProvider>
    );
}
