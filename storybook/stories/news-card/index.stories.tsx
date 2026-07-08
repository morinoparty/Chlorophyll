import type { Meta, StoryObj } from "@storybook/react";
import { NewsCard } from "../../../packages/react/src/components/news-card";

const meta: Meta<typeof NewsCard> = {
    title: "BRAND/NewsCard",
    component: NewsCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NewsCard>;

// morino.party で実際に使われている画像・プレイヤーを利用する
const THUMBNAIL = "https://morino.party/assets/image/guide/guide-use-train.webp";
const PLAYER = { playerId: "75ba1a8c-4e02-4b4b-abe3-92ef4af6147c", playerName: "Yahirrro" };

export const Default: Story = {
    render: () => (
        <div style={{ width: "320px" }}>
            <NewsCard.Root>
                <NewsCard.Thumbnail src={THUMBNAIL} alt="もりもと駅の様子" />
                <NewsCard.Content>
                    <NewsCard.Category>お知らせ</NewsCard.Category>
                    <NewsCard.Title>もりのパーティ7周年のお知らせ</NewsCard.Title>
                </NewsCard.Content>
                <NewsCard.Footer>
                    <NewsCard.Date dateTime="2026-05-18">2026/05/18</NewsCard.Date>
                    <NewsCard.Author {...PLAYER} />
                </NewsCard.Footer>
            </NewsCard.Root>
        </div>
    ),
};

// 画像がない記事はプレースホルダー(ロゴやテキスト)を表示する
export const WithoutImage: Story = {
    render: () => (
        <div style={{ width: "320px" }}>
            <NewsCard.Root>
                <NewsCard.Thumbnail>もりのパーティ</NewsCard.Thumbnail>
                <NewsCard.Content>
                    <NewsCard.Category>イベント情報</NewsCard.Category>
                    <NewsCard.Title>ミニイベント2026</NewsCard.Title>
                </NewsCard.Content>
                <NewsCard.Footer>
                    <NewsCard.Date dateTime="2026-05-18">2026/5/18</NewsCard.Date>
                    <NewsCard.Author {...PLAYER} />
                </NewsCard.Footer>
            </NewsCard.Root>
        </div>
    ),
};

// タイトルが長い場合は 1 行に収めて省略記号で切る
export const LongTitle: Story = {
    render: () => (
        <div style={{ width: "320px" }}>
            <NewsCard.Root>
                <NewsCard.Thumbnail src={THUMBNAIL} alt="もりもと駅の様子" />
                <NewsCard.Content>
                    <NewsCard.Category>イベント情報</NewsCard.Category>
                    <NewsCard.Title>建築大会！～”秘密のお店”を作ってみよう ～</NewsCard.Title>
                </NewsCard.Content>
                <NewsCard.Footer>
                    <NewsCard.Date dateTime="2026-04-02">2026/04/02</NewsCard.Date>
                    <NewsCard.Author {...PLAYER} />
                </NewsCard.Footer>
            </NewsCard.Root>
        </div>
    ),
};

// asChild で <a> に差し替えてリンクカードにした例
export const AsLink: Story = {
    render: () => (
        <div style={{ width: "320px" }}>
            <NewsCard.Root asChild>
                <a href="https://morino.party/news/363807269fe4803aad0dc5431b5e22cf">
                    <NewsCard.Thumbnail src={THUMBNAIL} alt="もりもと駅の様子" />
                    <NewsCard.Content>
                        <NewsCard.Category>イベント情報</NewsCard.Category>
                        <NewsCard.Title>ミニイベント2026</NewsCard.Title>
                    </NewsCard.Content>
                    <NewsCard.Footer>
                        <NewsCard.Date dateTime="2026-05-18">2026/5/18</NewsCard.Date>
                        <NewsCard.Author {...PLAYER} />
                    </NewsCard.Footer>
                </a>
            </NewsCard.Root>
        </div>
    ),
};

// トップページの NEWS セクションのように 3 カラムで並べた例
export const Grid: Story = {
    render: () => (
        <div style={{ width: "1000px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            <NewsCard.Root>
                <NewsCard.Thumbnail>もりのパーティ</NewsCard.Thumbnail>
                <NewsCard.Content>
                    <NewsCard.Category>イベント情報</NewsCard.Category>
                    <NewsCard.Title>ミニイベント2026</NewsCard.Title>
                </NewsCard.Content>
                <NewsCard.Footer>
                    <NewsCard.Date dateTime="2026-05-18">2026/5/18</NewsCard.Date>
                    <NewsCard.Author {...PLAYER} />
                </NewsCard.Footer>
            </NewsCard.Root>
            <NewsCard.Root>
                <NewsCard.Thumbnail src={THUMBNAIL} alt="もりもと駅の様子" />
                <NewsCard.Content>
                    <NewsCard.Category>お知らせ</NewsCard.Category>
                    <NewsCard.Title>もりのパーティ7周年のお知らせ</NewsCard.Title>
                </NewsCard.Content>
                <NewsCard.Footer>
                    <NewsCard.Date dateTime="2026-05-18">2026/05/18</NewsCard.Date>
                    <NewsCard.Author {...PLAYER} />
                </NewsCard.Footer>
            </NewsCard.Root>
            <NewsCard.Root>
                <NewsCard.Thumbnail src={THUMBNAIL} alt="もりもと駅の様子" />
                <NewsCard.Content>
                    <NewsCard.Category>イベント情報</NewsCard.Category>
                    <NewsCard.Title>建築大会！～”秘密のお店”を作ってみよう ～</NewsCard.Title>
                </NewsCard.Content>
                <NewsCard.Footer>
                    <NewsCard.Date dateTime="2026-04-02">2026/04/02</NewsCard.Date>
                    <NewsCard.Author {...PLAYER} />
                </NewsCard.Footer>
            </NewsCard.Root>
        </div>
    ),
};
