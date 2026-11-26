import {
    Button,
    Checkbox,
    Field,
    GuideCard,
    IconButton,
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
import { Check, ChevronRight, Minus, Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
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
        "summary",
        "summaryRow",
        "summaryLabel",
        "summaryValue",
        "amount",
        "amountValue",
        "amountUnit",
        "stepper",
        "recipients",
        "recipient",
        "recipientName",
        "selected",
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
        // 金額や数量の確認表。ラベルを左、値を右に寄せた行を並べる
        summary: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            padding: "4",
            borderRadius: "l2",
            bg: "bg.panel",
        },
        summaryRow: {
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "3",
            fontSize: "sm",
        },
        summaryLabel: {
            color: "colorPalette.fg.muted",
        },
        summaryValue: {
            fontWeight: "bold",
            color: "colorPalette.fg",
            fontVariantNumeric: "tabular-nums",
        },
        // 大きく見せる数量・金額
        amount: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5",
        },
        amountValue: {
            fontSize: "4xl",
            fontWeight: "bold",
            lineHeight: "[1]",
            color: "colorPalette.fg",
            fontVariantNumeric: "tabular-nums",
        },
        amountUnit: {
            fontSize: "xs",
            color: "colorPalette.fg.muted",
        },
        // −・数量・＋ を横に並べる
        stepper: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "3",
        },
        // 送り先のプレイヤー。押すと選択中になり、顔に輪がつく
        recipients: {
            display: "flex",
            justifyContent: "space-between",
            gap: "2",
        },
        recipient: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5",
            flex: "1",
            minWidth: "0",
            padding: "1",
            borderRadius: "l2",
            cursor: "pointer",
            "& > :first-child": {
                borderRadius: "l2",
                outlineWidth: "2",
                outlineStyle: "solid",
                outlineColor: "transparent",
                outlineOffset: "0.5",
            },
            _pressed: {
                "& > :first-child": { outlineColor: "colorPalette.solid" },
            },
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "focus.ring",
                outlineColor: "colorPalette.focus.ring",
            },
        },
        recipientName: {
            maxWidth: "full",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "xs",
            color: "colorPalette.fg.muted",
            "[aria-pressed=true] > &": { fontWeight: "bold", color: "colorPalette.fg" },
        },
        // 選択中の送り先を示す行
        selected: {
            display: "flex",
            alignItems: "center",
            gap: "2",
            paddingY: "2",
            paddingX: "3",
            borderRadius: "full",
            bg: "bg.panel",
            fontSize: "sm",
            fontWeight: "bold",
            color: "colorPalette.fg",
            "& > svg": { marginLeft: "auto", width: "4", height: "4", color: "colorPalette.solid" },
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

const ACORNS = 12_480;
const PROTECTED_BLOCKS = 1_240;
const BLOCK_PRICE = 10;

// MoriPath の /balance-claim を模したカード。+/− とチップで買う数を変えると、合計と買ったあとの値が追従する
function BuyBlocksCard({ styles }: { styles: WallStyles }) {
    const [count, setCount] = useState(500);
    // どんぐりで買える上限を超えないようにする
    const max = Math.floor(ACORNS / BLOCK_PRICE);
    const update = (next: number) => setCount(Math.min(max, Math.max(0, next)));
    const cost = count * BLOCK_PRICE;

    return (
        <DemoCard styles={styles} title="保護ブロックを買う">
            <div className={styles.stepper}>
                <IconButton variant="outline" shape="circle" aria-label="減らす" onClick={() => update(count - 100)}>
                    <Minus />
                </IconButton>
                <div className={styles.amount}>
                    <span className={styles.amountValue}>{count.toLocaleString()}</span>
                    <span className={styles.amountUnit}>ブロック</span>
                </div>
                <IconButton variant="outline" shape="circle" aria-label="増やす" onClick={() => update(count + 100)}>
                    <Plus />
                </IconButton>
            </div>
            <div className={styles.row}>
                {[100, 500, 1000].map((step) => (
                    <Button key={step} intent="secondary" size="xs" onClick={() => update(count + step)}>
                        +{step.toLocaleString()}
                    </Button>
                ))}
                <Button intent="secondary" size="xs" onClick={() => update(max)}>
                    最大
                </Button>
            </div>
            <div className={styles.summary}>
                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>合計の目安</span>
                    <span className={styles.summaryValue}>{cost.toLocaleString()} どんぐり</span>
                </div>
                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>保護ブロック</span>
                    <span className={styles.summaryValue}>
                        {PROTECTED_BLOCKS.toLocaleString()} → {(PROTECTED_BLOCKS + count).toLocaleString()}
                    </span>
                </div>
                <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>どんぐり</span>
                    <span className={styles.summaryValue}>
                        {ACORNS.toLocaleString()} → {(ACORNS - cost).toLocaleString()}
                    </span>
                </div>
            </div>
            <Button intent="primary" disabled={count === 0}>
                {count.toLocaleString()} ブロックを買う
            </Button>
        </DemoCard>
    );
}

const RECIPIENTS = [PLAYERS.chocolatt, PLAYERS.tutu, PLAYERS.kina, PLAYERS.rinKai];
const SEND_AMOUNTS = [100, 500, 1000];

// MoriPath の /wallet/send を模したカード。送り先と金額を選ぶと、ボタンと残高の表示が追従する
function SendAcornsCard({ styles }: { styles: WallStyles }) {
    const [recipientId, setRecipientId] = useState<string>(PLAYERS.chocolatt.playerId);
    const [amount, setAmount] = useState("500");
    const recipient = RECIPIENTS.find((player) => player.playerId === recipientId) ?? RECIPIENTS[0];
    const value = Number(amount);

    return (
        <DemoCard styles={styles} title="どんぐりを送る">
            <div className={styles.recipients}>
                {RECIPIENTS.map((player) => (
                    <button
                        key={player.playerId}
                        type="button"
                        className={styles.recipient}
                        aria-pressed={player.playerId === recipientId}
                        onClick={() => setRecipientId(player.playerId)}
                    >
                        <PlayerAvatar {...player} size="md" decorative />
                        <span className={styles.recipientName}>{player.playerName}</span>
                    </button>
                ))}
            </div>
            <div className={styles.selected}>
                <PlayerAvatar {...recipient} size="sm" decorative />
                {recipient.playerName}
                <Check />
            </div>
            <SegmentGroup.Root value={amount} onValueChange={(details) => details.value && setAmount(details.value)}>
                <SegmentGroup.Label>送る金額</SegmentGroup.Label>
                <SegmentGroup.Control>
                    <SegmentGroup.Indicator />
                    {SEND_AMOUNTS.map((item) => (
                        <SegmentGroup.Item key={item} value={String(item)}>
                            <SegmentGroup.ItemText>{item.toLocaleString()}</SegmentGroup.ItemText>
                            <SegmentGroup.ItemControl />
                            <SegmentGroup.ItemHiddenInput />
                        </SegmentGroup.Item>
                    ))}
                </SegmentGroup.Control>
            </SegmentGroup.Root>
            <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>残高</span>
                <span className={styles.summaryValue}>
                    {ACORNS.toLocaleString()} → {(ACORNS - value).toLocaleString()} どんぐり
                </span>
            </div>
            <Button intent="primary">{value.toLocaleString()} どんぐりを送る</Button>
        </DemoCard>
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

                        <BuyBlocksCard styles={styles} />
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
                        <SendAcornsCard styles={styles} />

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
