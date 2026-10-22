import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Button } from "../../../packages/react/src/components/button";
import { Card } from "../../../packages/react/src/components/card";

const meta: Meta<typeof Card> = {
    title: "DATA DISPLAY/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["elevated", "outline", "subtle"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
        },
        interactive: { control: "boolean" },
    },
    args: {
        variant: "elevated",
        size: "md",
        interactive: false,
    },
};

export default meta;
type Story = StoryObj<typeof Card>;

// カードは親の幅に従う設計。狭い画面ではページがはみ出さないよう画面幅(余白ぶんを引く)に抑える
const cardWidth = css({ width: "min(360px, calc(100vw - 2rem))" });

// variant を横に並べて見比べるための行
const row = css({ display: "flex", flexWrap: "wrap", gap: "4", alignItems: "stretch" });

// 白い面の上に置いたときの見え方を確かめるための台紙
const whitePanel = css({ bg: "bg.panel", p: "6", borderRadius: "panel" });

// morino.party で実際に使われている画像を利用する
const IMAGE = "https://morino.party/assets/image/guide/guide-use-train.webp";

// Controls パネルで variant / size / interactive を切り替えられるよう、args をそのまま Root に渡す
export const Default: Story = {
    render: (args) => (
        <Card.Root {...args} className={cardWidth}>
            <Card.Header>
                <Card.Title>ずんだもち銀行</Card.Title>
                <Card.Description>口座の残高と最近の入出金をまとめて確認できるのだ。</Card.Description>
            </Card.Header>
            <Card.Body>今月はイベントの景品として 3 回入金があったのだ。</Card.Body>
            <Card.Footer>
                <Button size="sm">口座を見る</Button>
                <Button size="sm" intent="secondary">
                    閉じる
                </Button>
            </Card.Footer>
        </Card.Root>
    ),
};

// variant ごとの面の違い。elevated と subtle はページの地色(colorPalette.bg)の上で使うのが基本
const renderVariants = () =>
    (["elevated", "outline", "subtle"] as const).map((variant) => (
        <Card.Root key={variant} variant={variant} className={cardWidth}>
            <Card.Header>
                <Card.Title>{variant}</Card.Title>
                <Card.Description>カードの面の見せ方なのだ。</Card.Description>
            </Card.Header>
            <Card.Body>森の中に新しい駅ができたのだ。</Card.Body>
        </Card.Root>
    ));

export const Variants: Story = {
    parameters: { layout: "padded" },
    render: () => <div className={row}>{renderVariants()}</div>,
};

// 白い面の上では elevated の影や outline の枠線で輪郭を出す。subtle は淡い色の面として浮かぶ
export const OnPanel: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={whitePanel}>
            <div className={row}>{renderVariants()}</div>
        </div>
    ),
};

// size ごとの余白と文字サイズ
export const Sizes: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={row}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Card.Root key={size} size={size} className={cardWidth}>
                    <Card.Header>
                        <Card.Title>size: {size}</Card.Title>
                        <Card.Description>余白と文字サイズが変わるのだ。</Card.Description>
                    </Card.Header>
                    <Card.Body>本文の領域なのだ。</Card.Body>
                    <Card.Footer>
                        <Button size="sm" intent="secondary">
                            詳しく
                        </Button>
                    </Card.Footer>
                </Card.Root>
            ))}
        </div>
    ),
};

// 先頭に全幅の画像を置いた例。角はカードの角丸で切り取られる
export const WithImage: Story = {
    render: () => (
        <Card.Root className={cardWidth}>
            <Card.Image
                src={IMAGE}
                alt="もりもと駅のホームに電車が停まっている様子"
                style={{ aspectRatio: "16 / 9" }}
            />
            <Card.Header>
                <Card.Title>電車の使いかた</Card.Title>
                <Card.Description>駅の場所と切符の買いかたをまとめたガイドなのだ。</Card.Description>
            </Card.Header>
        </Card.Root>
    ),
};

// Header だけのカード
export const HeaderOnly: Story = {
    render: () => (
        <Card.Root variant="outline" className={cardWidth}>
            <Card.Header>
                <Card.Title>お知らせはありません</Card.Title>
                <Card.Description>新しいお知らせが届くとここに表示されるのだ。</Card.Description>
            </Card.Header>
        </Card.Root>
    ),
};

// Body を置かず、Header の直後に Footer を続けたカード(見出し + 操作)。Header と Footer の間にも余白 1 つ分が入る
export const HeaderAndFooter: Story = {
    render: () => (
        <Card.Root variant="outline" className={cardWidth}>
            <Card.Header>
                <Card.Title>ずんだもち銀行</Card.Title>
                <Card.Description>口座を開くとアイテムを預けられるのだ。</Card.Description>
            </Card.Header>
            <Card.Footer>
                <Button size="sm">口座を開く</Button>
            </Card.Footer>
        </Card.Root>
    ),
};

// asChild でカード全体をリンクにした例。interactive で hover / active / フォーカスリングが付く
export const LinkCard: Story = {
    parameters: { layout: "padded" },
    render: () => (
        <div className={row}>
            {(["elevated", "outline", "subtle"] as const).map((variant) => (
                <Card.Root key={variant} variant={variant} interactive asChild className={cardWidth}>
                    <a href="#guide">
                        <Card.Header>
                            <Card.Title>{variant} のリンクカード</Card.Title>
                            <Card.Description>カード全体を押すとガイドへ移動するのだ。</Card.Description>
                        </Card.Header>
                    </a>
                </Card.Root>
            ))}
        </div>
    ),
};
