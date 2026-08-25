import type { Meta, StoryObj } from "@storybook/react";
import { css } from "styled-system/css";
import { Badge, type BadgeStatus } from "../../../packages/react/src/components/badge";
import { Table } from "../../../packages/react/src/components/table";

const meta: Meta<typeof Table> = {
    title: "DATA DISPLAY/Table",
    component: Table,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        size: {
            control: "select",
            options: ["sm", "md"],
        },
        striped: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Table は width:full で親が幅を決める設計。PC の横幅を活かせるよう広めに表示する
const PANEL_WIDTH = 720;

// もりのパーティの鉄道(AdvanceRailway)の路線一覧を想定したサンプルデータ
type RailwayStatus = "運行中" | "建設中" | "休止中";

const STATUS_BADGE: Record<RailwayStatus, BadgeStatus> = {
    運行中: "success",
    建設中: "info",
    休止中: "warning",
};

const railways: { name: string; stations: number; group: string; status: RailwayStatus }[] = [
    { name: "もりの本線", stations: 12, group: "もりの鉄道", status: "運行中" },
    { name: "うみの環状線", stations: 8, group: "うみの交通", status: "運行中" },
    { name: "ずんだ高原線", stations: 5, group: "ずんだ開発", status: "建設中" },
    { name: "ネザー連絡線", stations: 3, group: "もりの鉄道", status: "休止中" },
    { name: "エンド観光線", stations: 4, group: "エンド観光", status: "運行中" },
];

// 路線一覧の表本体。各 story で size / striped だけを変えて使い回す
const RailwayRows = () => (
    <>
        {railways.map((railway) => (
            <Table.Row key={railway.name}>
                <Table.Cell>{railway.name}</Table.Cell>
                <Table.Cell>{railway.stations}</Table.Cell>
                <Table.Cell>{railway.group}</Table.Cell>
                <Table.Cell>
                    <Badge variant="subtle" size="sm" status={STATUS_BADGE[railway.status]} dot>
                        {railway.status}
                    </Badge>
                </Table.Cell>
            </Table.Row>
        ))}
    </>
);

const RailwayHeader = () => (
    <Table.Header>
        <Table.Row>
            <Table.Head>路線名</Table.Head>
            <Table.Head>駅数</Table.Head>
            <Table.Head>運営グループ</Table.Head>
            <Table.Head>ステータス</Table.Head>
        </Table.Row>
    </Table.Header>
);

// 既定の見た目(size="md")。ステータス列には Badge を組み合わせる
export const Default: Story = {
    render: (args) => (
        <div style={{ width: PANEL_WIDTH }}>
            <Table.Root {...args}>
                <RailwayHeader />
                <Table.Body>
                    <RailwayRows />
                </Table.Body>
            </Table.Root>
        </div>
    ),
};

// 情報密度を上げたい管理画面向けのコンパクトサイズ
export const Small: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Table.Root size="sm">
                <RailwayHeader />
                <Table.Body>
                    <RailwayRows />
                </Table.Body>
            </Table.Root>
        </div>
    ),
};

// 偶数行に薄い地色を敷いて行を追いやすくする
export const Striped: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Table.Root striped>
                <RailwayHeader />
                <Table.Body>
                    <RailwayRows />
                </Table.Body>
            </Table.Root>
        </div>
    ),
};

// 利用側で選択状態を管理し、選択中の行に data-state="selected" を付けた例
export const SelectedRow: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Table.Root>
                <RailwayHeader />
                <Table.Body>
                    {railways.map((railway, index) => (
                        <Table.Row key={railway.name} data-state={index === 1 ? "selected" : undefined}>
                            <Table.Cell>{railway.name}</Table.Cell>
                            <Table.Cell>{railway.stations}</Table.Cell>
                            <Table.Cell>{railway.group}</Table.Cell>
                            <Table.Cell>
                                <Badge variant="subtle" size="sm" status={STATUS_BADGE[railway.status]} dot>
                                    {railway.status}
                                </Badge>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    ),
};

// データが 1 件も無いときのプレースホルダー。colSpan には列数を渡す
export const Empty: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Table.Root>
                <RailwayHeader />
                <Table.Body>
                    <Table.Empty colSpan={4}>まだ路線が登録されていないのだ</Table.Empty>
                </Table.Body>
            </Table.Root>
        </div>
    ),
};

// 表の説明(caption)と合計行(footer)を付けた例。
// caption は HTML の制約で <table> の先頭に置くが、見た目は表の下に表示される
export const WithCaptionAndFooter: Story = {
    render: () => (
        <div style={{ width: PANEL_WIDTH }}>
            <Table.Root>
                <Table.Caption>2026 年 8 月時点の路線一覧。駅数は開業済みの駅のみを数えている</Table.Caption>
                <RailwayHeader />
                <Table.Body>
                    <RailwayRows />
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.Cell>合計</Table.Cell>
                        <Table.Cell>{railways.reduce((sum, railway) => sum + railway.stations, 0)}</Table.Cell>
                        <Table.Cell>{new Set(railways.map((railway) => railway.group)).size} グループ</Table.Cell>
                        <Table.Cell>{railways.length} 路線</Table.Cell>
                    </Table.Row>
                </Table.Footer>
            </Table.Root>
        </div>
    ),
};

// 横に長い表のサンプル用。セルを折り返さず、表全体が親幅に収まらないようにする
const nowrapStyle = css({ whiteSpace: "nowrap" });

// 駅ごとの詳細を並べた横に長い表
const stations = [
    { name: "もりの中央駅", line: "もりの本線", x: 128, y: 64, z: -256, opened: "2024-03-01", builder: "ずんだもん" },
    {
        name: "うみの見える丘駅",
        line: "うみの環状線",
        x: -512,
        y: 72,
        z: 1024,
        opened: "2024-06-15",
        builder: "めたん",
    },
    { name: "ずんだ高原駅", line: "ずんだ高原線", x: 2048, y: 110, z: 512, opened: "2025-01-20", builder: "つむぎ" },
    { name: "ネザー連絡駅", line: "ネザー連絡線", x: 16, y: 40, z: -32, opened: "2025-04-08", builder: "ずんだもん" },
];

// 列が多く親幅(480px)に収まらない表。ページではなく表の中で横スクロールする
export const Scroll: Story = {
    render: () => (
        <div style={{ width: 480 }}>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head>駅名</Table.Head>
                        <Table.Head>路線</Table.Head>
                        <Table.Head>X 座標</Table.Head>
                        <Table.Head>Y 座標</Table.Head>
                        <Table.Head>Z 座標</Table.Head>
                        <Table.Head>開業日</Table.Head>
                        <Table.Head>建設者</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {stations.map((station) => (
                        <Table.Row key={station.name}>
                            <Table.Cell className={nowrapStyle}>{station.name}</Table.Cell>
                            <Table.Cell className={nowrapStyle}>{station.line}</Table.Cell>
                            <Table.Cell className={nowrapStyle}>{station.x}</Table.Cell>
                            <Table.Cell className={nowrapStyle}>{station.y}</Table.Cell>
                            <Table.Cell className={nowrapStyle}>{station.z}</Table.Cell>
                            <Table.Cell className={nowrapStyle}>{station.opened}</Table.Cell>
                            <Table.Cell className={nowrapStyle}>{station.builder}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    ),
};
