import type { Meta, StoryObj } from "@storybook/react";
import { GuideCard } from "../../../packages/react/src/components/guide-card";

const meta: Meta<typeof GuideCard> = {
    title: "BRAND/GuideCard",
    component: GuideCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GuideCard>;

// morino.party トップページで実際に使われているガイド画像
const IMAGE_LIVE = "https://morino.party/assets/image/guide/guide-live-morimoto.webp";
const IMAGE_SHOP = "https://morino.party/assets/image/guide/guide-openshop.webp";
const IMAGE_FISH = "https://morino.party/assets/image/guide/guide-catch-fish.webp";

// タイトル先頭に置くドキュメントアイコンのサンプル
const DocumentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
    </svg>
);

export const Default: Story = {
    render: () => (
        <div style={{ width: "420px" }}>
            <GuideCard.Root>
                <GuideCard.Image src={IMAGE_LIVE} alt="生活サーバーの街並み" />
                <GuideCard.Content>
                    <GuideCard.Title>生活サーバーに住む</GuideCard.Title>
                    <GuideCard.Description>
                        公式の街やクラフターが作った町があります。あなたが開拓するのももちろん大歓迎！
                    </GuideCard.Description>
                </GuideCard.Content>
            </GuideCard.Root>
        </div>
    ),
};

// asChild で <a> に差し替えてリンクカードにした例 + タイトル先頭のアイコン
export const AsLink: Story = {
    render: () => (
        <div style={{ width: "420px" }}>
            <GuideCard.Root asChild>
                <a href="https://morino.party/feature/fishing">
                    <GuideCard.Image src={IMAGE_FISH} alt="サカナ釣りの様子" />
                    <GuideCard.Content>
                        <GuideCard.Title>
                            <DocumentIcon />
                            サカナを釣ろう
                        </GuideCard.Title>
                        <GuideCard.Description>
                            「生活サーバー」には、普通のマイクラとは違うサカナが生息しているらしい...その生態系は謎である...。
                        </GuideCard.Description>
                    </GuideCard.Content>
                </a>
            </GuideCard.Root>
        </div>
    ),
};

export const Multiple: Story = {
    render: () => (
        <div style={{ width: "420px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <GuideCard.Root>
                <GuideCard.Image src={IMAGE_LIVE} alt="生活サーバーの街並み" />
                <GuideCard.Content>
                    <GuideCard.Title>生活サーバーに住む</GuideCard.Title>
                    <GuideCard.Description>
                        公式の街やクラフターが作った町があります。あなたが開拓するのももちろん大歓迎！
                    </GuideCard.Description>
                </GuideCard.Content>
            </GuideCard.Root>
            <GuideCard.Root>
                <GuideCard.Image src={IMAGE_SHOP} alt="お店の様子" />
                <GuideCard.Content>
                    <GuideCard.Title>お店を開業する</GuideCard.Title>
                    <GuideCard.Description>
                        生活サーバーでは、ショップを開いてお金を稼ぐことができます！クラフターの役に立ってお金をもらいましょう！
                    </GuideCard.Description>
                </GuideCard.Content>
            </GuideCard.Root>
        </div>
    ),
};
