import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon, MailIcon, TicketIcon } from "lucide-react";
import type { ComponentProps, ComponentType } from "react";
import { css, cx } from "styled-system/css";
import { Button } from "../../../packages/react";
import { BrutalButton } from "./brutal.stories";
import { ClayButton } from "./clay.stories";
import { CozyPatternButton } from "./cozy-pattern.stories";
import { GlassButton } from "./glass.stories";
import { IslandBubbleButton } from "./island-bubble.stories";
import { JellyButton } from "./jelly.stories";
import { LeafButton } from "./leaf.stories";
import { LeafTagButton } from "./leaf-tag.stories";
import { PhoneAppButton } from "./phone-app.stories";
import { PillGlossButton } from "./pill-gloss.stories";
import { PixelButton } from "./pixel.stories";
import { PressableButton } from "./pressable.stories";
import { SketchButton } from "./sketch.stories";
import { SoftNeumorphButton } from "./soft-neumorph.stories";
import { StickerButton } from "./sticker.stories";
import { StitchedButton } from "./stitched.stories";
import { TicketButton } from "./ticket.stories";
import { TonalButton } from "./tonal.stories";
import { WoodSignButton } from "./wood-sign.stories";

// 各デザイン案のボタンが共通で受け取る props。既存 Button と同じ intent / size の形に揃えている
type DesignButtonProps = ComponentProps<"button"> & {
    intent?: "primary" | "secondary" | "plain";
    size?: "sm" | "md" | "lg";
};

// 1 行 = 1 つのデザイン案
interface Design {
    name: string;
    // 一言で伝えるコンセプト
    pitch: string;
    Component: ComponentType<DesignButtonProps>;
    // ガラスのように、背後に色や模様がないと評価できない案のためのセル背景
    cellClassName?: string;
    // どうぶつの森っぽい(cozy)方向の案。Cozy ストーリーでクリームの地色の上にまとめて並べる
    cozy?: boolean;
}

const styles = {
    stack: css({ display: "flex", flexDirection: "column", gap: "2", w: "full" }),
    // ラベル列 + 比較列。PC の横幅を使って 1 行に全バリエーションを並べる
    compareGrid: css({
        display: "grid",
        gridTemplateColumns: "minmax(220px, 280px) repeat(5, minmax(0, 1fr))",
        columnGap: "4",
        rowGap: "2",
        alignItems: "center",
        w: "full",
    }),
    paletteGrid: css({
        display: "grid",
        gridTemplateColumns: "minmax(220px, 280px) repeat(3, minmax(0, 1fr))",
        columnGap: "4",
        rowGap: "2",
        alignItems: "center",
        w: "full",
    }),
    // 列見出しは本文より一段引いて読ませる
    columnHeading: css({
        fontSize: "xs",
        fontWeight: "medium",
        color: "colorPalette.fg.subtle",
        textTransform: "uppercase",
        letterSpacing: "wider",
        pb: "1",
    }),
    labelCell: css({ display: "flex", flexDirection: "column", gap: "1", py: "4" }),
    name: css({ fontSize: "md", fontWeight: "bold", color: "colorPalette.fg" }),
    pitch: css({ fontSize: "sm", color: "colorPalette.fg.muted", lineHeight: "relaxed" }),
    cell: css({
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "3",
        flexWrap: "wrap",
        minH: "24",
        px: "4",
        py: "4",
        borderRadius: "panel",
    }),
    // 行の区切りは枠線ではなく、セル間の余白とうっすらした面で見せる
    currentCell: css({ bg: "bg.panel" }),
    // ガラス案は色付きの模様の上でないと透け感が見えないため、セルの背後に縞とグラデーションを敷く
    glassCell: css({
        backgroundImage:
            "repeating-linear-gradient(135deg, {colors.colorPalette.6} 0 10px, transparent 10px 28px), linear-gradient(120deg, {colors.colorPalette.8}, {colors.colorPalette.surface.hover})",
    }),
    // Cozy ストーリーのページ地色。島のメニューのような温かいクリーム(Cozy Pattern 案の CREAM_PAGE と同じ値)
    cozyPage: css({
        bg: "[#f6ecd4]",
        borderRadius: "panel",
        p: "6",
        // cozy 案は装飾(半券・芽・カーソル)のぶん横幅が広いので、狭い画面ではパネル内で横スクロールさせる
        overflowX: "auto",
    }),
    // cozy 案はボタン自体が横に広いため、ラベル列を少し詰めてボタン列に幅を回す
    cozyGrid: css({
        gridTemplateColumns: "minmax(180px, 220px) repeat(5, minmax(max-content, 1fr))",
    }),
    mori: css({ colorPalette: "mori" }),
    umi: css({ colorPalette: "umi" }),
    red: css({ colorPalette: "red" }),
};

// Phone App はアイコンバッジが案の主役なので、比較表でもアイコン付きで見せる。
// 描画のたびに別コンポーネントにならないよう、モジュールのトップレベルで包んでおく
const PhoneAppWithBadge = (props: DesignButtonProps) => <PhoneAppButton icon={<MailIcon />} {...props} />;

// Ticket も半券(stub)があって初めて「チケット」に見えるため、半券付きで並べる
const TicketWithStub = (props: DesignButtonProps) => <TicketButton stub={<TicketIcon />} {...props} />;

const designs: Design[] = [
    {
        name: "Current",
        pitch: "現在の本番 Button。比較の基準として並べている。",
        Component: Button as ComponentType<DesignButtonProps>,
        cellClassName: styles.currentCell,
    },
    {
        name: "Tonal",
        pitch: "影も枠線も使わず、森の色の濃さ一段ずつだけで語る、静かで上品なフラットボタン。",
        Component: TonalButton,
    },
    {
        name: "Pressable",
        pitch: "枠線のかわりに側面と柔らかい影で厚みを出し、押すとカチッと沈むキーボードのような立体ボタン。",
        Component: PressableButton,
    },
    {
        name: "Pixel",
        pitch: "もりのパーティらしい「押せるブロック」。ドットの段差で押した手応えまでピクセルで出す。",
        Component: PixelButton,
    },
    {
        name: "Pill Gloss",
        pitch: "パレット色に染まるグローとほのかなツヤで、押したくなる手触りを出した上質でやさしい pill ボタン。",
        Component: PillGlossButton,
    },
    {
        name: "Glass",
        pitch: "写真やブランド色の面にそっと溶け込む、光をまとったすりガラスのボタン。",
        Component: GlassButton,
        cellClassName: styles.glassCell,
    },
    {
        name: "Neo Brutal",
        pitch: "太いインクの縁取りと固い影で、押すと影に沈み込む、いちばん主張が強く遊び心のあるボタン。",
        Component: BrutalButton,
    },
    {
        name: "Leaf",
        pitch: "左上から光を受ける葉っぱの形で、Chlorophyll らしさが一目で伝わる、穏やかで有機的なボタン。",
        Component: LeafButton,
    },
    {
        name: "Clay",
        pitch: "こねたての粘土のようにぷにっと膨らみ、左上のつや玉が光る、触りたくなるボタン。",
        Component: ClayButton,
    },
    {
        name: "Sticker",
        pitch: "ぷっくりつやつやのシールが、触るとペロッとめくれて浮く、シール帳のようなボタン。",
        Component: StickerButton,
    },
    {
        name: "Sketch",
        pitch: "ノートの端に描いたようなよれよれの枠に、蛍光ペンの帯がさっと乗る手描きのボタン。",
        Component: SketchButton,
    },
    {
        name: "Soft Neumorph",
        pitch: "光を受けた縁につやのある色キャップが乗り、押すと面にふにっと沈む小石のようなボタン。",
        Component: SoftNeumorphButton,
    },
    // ここから下は、どうぶつの森っぽい(cozy)方向の案
    {
        name: "Island Bubble",
        pitch: "クリームのふきだしが hover で黄色く灯って跳ね、左脇のカーソルが寄ってくる、会話の選択肢のようなボタン。",
        Component: IslandBubbleButton,
        cozy: true,
    },
    {
        name: "Wood Sign",
        pitch: "木目と節のある白木に釘を打った看板が、触ると傾いて浮き、押すとぽよんと潰れる案内板のようなボタン。",
        Component: WoodSignButton,
        cozy: true,
    },
    {
        name: "Stitched",
        pitch: "太い糸のステッチが入ったふかふかのフェルトワッペンで、押すと「ぽふっ」と沈むボタン。",
        Component: StitchedButton,
        cozy: true,
    },
    {
        name: "Phone App",
        pitch: "ぷっくりつやつやのアプリが水玉のスマホに並び、触るとぽよんと弾むボタン。",
        Component: PhoneAppWithBadge,
        cozy: true,
    },
    {
        name: "Leaf Tag",
        pitch: "麻ひもで吊られ、縁からふた葉の芽が生えたお店の値札。押すとむにっと潰れて葉っぱが揺れる。",
        Component: LeafTagButton,
        cozy: true,
    },
    {
        name: "Cozy Pattern",
        pitch: "水玉とギンガムのクッションがクリームのメニューの上でぽよんと弾む、島のメニューから取り出してきたようなボタン。",
        Component: CozyPatternButton,
        cozy: true,
    },
    {
        name: "Jelly",
        pitch: "ぷっくり分厚いグミが、触るとプルンと揺れ、押すとむにっと潰れて跳ね返るボタン。",
        Component: JellyButton,
        cozy: true,
    },
    {
        name: "Ticket",
        pitch: "ころんと丸い券に水玉の半券。押すとぷにっと沈んでアイコンが跳ねる、交換窓口のチケットボタン。",
        Component: TicketWithStub,
        cozy: true,
    },
];

// Compare には cozy 以外の案を、Cozy には Current + cozy 案だけを並べる
const generalDesigns = designs.filter((design) => !design.cozy);
const cozyDesigns = designs.filter((design) => design.name === "Current" || design.cozy);

// デザイン名と一言紹介を表示するラベル列
const DesignLabel = ({ design }: { design: Design }) => (
    <div className={styles.labelCell}>
        <span className={styles.name}>{design.name}</span>
        <span className={styles.pitch}>{design.pitch}</span>
    </div>
);

const compareColumns = ["Primary", "Secondary", "Plain", "With icon", "Disabled"] as const;

// 1 つのデザイン案を、intent / アイコン付き / 無効状態の 5 セルに並べる
const CompareRow = ({ design }: { design: Design }) => {
    const { Component, cellClassName } = design;
    const cell = cx(styles.cell, cellClassName);
    return (
        <>
            <DesignLabel design={design} />
            <div className={cell}>
                <Component intent="primary" size="lg">
                    ログイン
                </Component>
            </div>
            <div className={cell}>
                <Component intent="secondary" size="lg">
                    キャンセル
                </Component>
            </div>
            <div className={cell}>
                <Component intent="plain" size="lg">
                    詳細を見る
                </Component>
            </div>
            <div className={cell}>
                <Component intent="primary" size="lg">
                    次へ
                    <ArrowRightIcon />
                </Component>
            </div>
            <div className={cell}>
                <Component intent="primary" size="lg" disabled>
                    送信できません
                </Component>
            </div>
        </>
    );
};

// パレット比較の列。クラス名は Panda の静的抽出のため styles 側でリテラルに定義したものを使う
const paletteColumns = [
    { name: "mori", className: styles.mori },
    { name: "umi", className: styles.umi },
    { name: "red", className: styles.red },
] as const;

// 1 つのデザイン案を、mori / umi / red の 3 パレットで primary + secondary だけ並べる
const PaletteRow = ({ design }: { design: Design }) => {
    const { Component, cellClassName } = design;
    return (
        <>
            <DesignLabel design={design} />
            {paletteColumns.map((palette) => (
                // ラッパーごと colorPalette を切り替え、セル背景もそのパレットに追従させる
                <div key={palette.name} className={cx(palette.className, styles.cell, cellClassName)}>
                    <Component intent="primary" size="lg">
                        保存する
                    </Component>
                    <Component intent="secondary" size="lg">
                        戻る
                    </Component>
                </div>
            ))}
        </>
    );
};

const meta: Meta = {
    title: "LAB/Button Designs/Overview",
    parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

// 全デザイン案を同じ条件で横並びにして見比べる
export const Compare: Story = {
    render: () => (
        <div className={styles.stack}>
            <div className={styles.compareGrid}>
                <span className={styles.columnHeading}>Design</span>
                {compareColumns.map((column) => (
                    <span key={column} className={styles.columnHeading}>
                        {column}
                    </span>
                ))}
                {generalDesigns.map((design) => (
                    <CompareRow key={design.name} design={design} />
                ))}
            </div>
        </div>
    ),
};

// どうぶつの森っぽい(cozy)案だけを、想定している温かいクリームの地色の上で見比べる。
// 列は Compare と同じにして、白背景の Compare と行き来しても比べやすくしている
export const Cozy: Story = {
    render: () => (
        <div className={cx(styles.stack, styles.cozyPage)}>
            <div className={cx(styles.compareGrid, styles.cozyGrid)}>
                <span className={styles.columnHeading}>Design</span>
                {compareColumns.map((column) => (
                    <span key={column} className={styles.columnHeading}>
                        {column}
                    </span>
                ))}
                {cozyDesigns.map((design) => (
                    <CompareRow key={design.name} design={design} />
                ))}
            </div>
        </div>
    ),
};

// 各デザイン案がパレット(mori / umi / red)に追従するかを見比べる
export const Palettes: Story = {
    render: () => (
        <div className={styles.stack}>
            <div className={styles.paletteGrid}>
                <span className={styles.columnHeading}>Design</span>
                {paletteColumns.map((palette) => (
                    <span key={palette.name} className={styles.columnHeading}>
                        {palette.name}
                    </span>
                ))}
                {designs.map((design) => (
                    <PaletteRow key={design.name} design={design} />
                ))}
            </div>
        </div>
    ),
};
