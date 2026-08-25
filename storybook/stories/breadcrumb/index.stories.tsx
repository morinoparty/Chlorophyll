import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Breadcrumb } from "../../../packages/react/src/components/breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
    title: "NAVIGATION/Breadcrumb",
    component: Breadcrumb,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ホーム > 鉄道 > 路線一覧 > 現在ページ の 4 段構成。
// Separator は <li> なので List 直下に置き、Item の中には Link か Page を 1 つだけ置く
export const Default: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#home">ホーム</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#railway">鉄道</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#lines">路線一覧</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>もりのパーティ本線</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

// 区切りを chevron から "/" の文字に差し替えた例。children に任意のノードを渡せる
export const CustomSeparator: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#home">ホーム</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>/</Breadcrumb.Separator>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#railway">鉄道</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>/</Breadcrumb.Separator>
                <Breadcrumb.Item>
                    <Breadcrumb.Page>駅一覧</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

// 深い階層を「先頭 / 省略記号 / 末尾 2 段」に畳んだ例。
// Ellipsis は <span> なので、他の段と同じく Item の中に置いて ol > li の構造を保つ
export const WithEllipsis: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#home">ホーム</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Ellipsis />
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link href="#stations">駅一覧</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>ずんだ駅</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

// asChild で差し込んだ要素に付ける印。実際のアプリではここに TanStack Router や next/link の
// Link が入る。ここでは同じ仕組みが動くことを示すため、素の <a> に data 属性を付けて差し込む
const routerLinkStyle = css({
    // 差し込まれた側であることを視覚的にも分かるよう、点線の下線を足す
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textUnderlineOffset: "0.2em",
});

// Link の asChild でルーターの Link を差し込む例。
// Breadcrumb.Link 自身は <a> を描画せず、子要素にスタイルと props を合成する。
// TanStack Router なら <Link to="/railway" activeOptions={{ exact: true }}>、
// Next.js なら <NextLink href="/railway"> をそのまま子に置けばよい
export const AsChildLink: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link asChild>
                        <a href="#home" data-router-link className={routerLinkStyle}>
                            ホーム
                        </a>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link asChild>
                        <a href="#railway" data-router-link className={routerLinkStyle}>
                            鉄道
                        </a>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>路線一覧</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

// 幅の狭いコンテナ(サイドパネルやモバイル幅を想定)に長いラベルを入れた例。
// 段ごとに折り返し、それでも収まらないラベルは overflowWrap で単語の途中でも折れる
const narrowContainerStyle = css({
    width: "[220px]",
    padding: "component.padding.md",
    borderRadius: "xl",
    bg: "bg.panel",
    boxShadow: "sm",
});

export const Narrow: Story = {
    render: () => (
        <div className={narrowContainerStyle}>
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="#home">ホーム</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="#railway">もりのパーティ鉄道事業部</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link href="#lines">環状線・支線一覧</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>ずんだ高原口駅前大通りターミナル</Breadcrumb.Page>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>
    ),
};
