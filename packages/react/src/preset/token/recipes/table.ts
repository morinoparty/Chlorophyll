import { defineSlotRecipe } from "@pandacss/dev";

// 本文の行の hover / 選択状態の地色。
// Panda は base を @layer _base の中に、variant をその外側に出力するため、
// striped variant の縞の地色が詳細度に関係なく base の hover / 選択色に勝ってしまう。
// striped: true の row にも同じ宣言を載せて同じレイヤーで競わせるため、ここで共有する
const rowStateStyles = {
    // hover の地色は本文の行にだけ付ける(見出し行・フッター行は反応させない)。
    // 中立な gray ではなく colorPalette に追従させ、表全体をブランドカラーの側に寄せる。
    // 面の濃さは step2(見出し行・縞) < step3(hover) < step4(選択) < step5(選択+hover) の順で、
    // 縞の上に重なっても一段濃くなるよう surface(step3)を使う。
    // 本文(fg)とのコントラストは APCA で mori Lc 95.9 / gray Lc 94.6(本文の目安 Lc 75 以上)
    "tbody > &:hover": {
        bg: "colorPalette.surface",
    },
    // 選択中の行。利用側が data-state="selected" を付けると hover より一段濃い色で塗る。
    // hover のセレクタ(tbody > &:hover)より詳細度が低いと hover で消えてしまうため、
    // hover 時の色も明示して選択状態を優先させる。
    // 本文とのコントラストは APCA で選択 mori Lc 91.2 / gray Lc 89.9、
    // 選択+hover は mori Lc 85.4 / gray Lc 85.8
    '&[data-state="selected"]': {
        bg: "colorPalette.surface.hover",
    },
    '&[data-state="selected"]:hover': {
        bg: "colorPalette.surface.active",
    },
};

export const table = defineSlotRecipe({
    className: "table",
    jsx: ["Table"],
    description: "The table component. Styled primitives for tabular data with a horizontal scroll container.",
    // root は <table> を包む横スクロールコンテナ。table 以下は HTML の表要素にそのまま対応する。
    // empty は「データがありません」などのプレースホルダー用の colSpan セル
    slots: ["root", "table", "header", "body", "footer", "row", "head", "cell", "caption", "empty"],
    base: {
        root: {
            // 横に長い表はページではなくこのコンテナの中でスクロールさせる
            overflowX: "auto",
            width: "full",
            // 白いパネルに極薄の枠線と角丸を付けてカード状に見せる。
            // 枠線は控えめにするというライブラリの方針に合わせて border.subtle を使う
            bg: "bg.panel",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "border.subtle",
            borderRadius: "xl",
            // Chrome はスクロールできる領域をキーボードでフォーカスできるようにするため、
            // フォーカスリングを描けるようにしておく。
            // outline: none だと outline-style が none のまま残りリングが描かれないので
            // outline 系プロパティを個別に指定する
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "2px",
                outlineColor: "colorPalette.focus.ring",
                outlineOffset: "2px",
            },
        },
        table: {
            width: "full",
            // 行の区切り線を 1 本にまとめるため罫線を結合する
            borderCollapse: "collapse",
            // caption は HTML 上 table の先頭に置くが、見た目は表の下に添える
            captionSide: "bottom",
            textAlign: "start",
            fontSize: "sm",
            color: "fg",
        },
        header: {
            // 見出し行はごく薄い地色と下線で本文と区切る。
            // colorPalette の step2 を使い、中立な gray ではなくブランドカラーの側に寄せる。
            // 名前付きの semantic トークン(bg / bg.subtle / surface)は有彩色パレットだと step1 か step3 に寄り、
            // step1 では白いパネルに埋もれ、step3 では hover の地色とぶつかるため、この面だけ step を直接指す。
            // 見出し文字(fg.muted)とのコントラストは APCA で mori Lc 76.6 / gray Lc 76.2(本文の目安 Lc 75 以上)
            bg: "colorPalette.2",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "border.subtle",
        },
        body: {
            // 最終行の下線はパネルの枠線と二重になるため消す。
            // footer がある場合は footer 側の上線が区切りを担う
            "& > tr:last-child": {
                borderBottomWidth: "0",
            },
        },
        footer: {
            // 合計行などを置く場所。上線と薄い地色で本文と区切り、やや太字で読ませる。
            // 地色は見出し行と揃えて表の上下を同じトーンで挟む
            bg: "colorPalette.2",
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "border.subtle",
            fontWeight: "medium",
            // 最終行の下線はパネルの枠線と二重になるため消す(body と同じ理由)。
            // caption を併用する場合は footer の地色との境界が区切りになるので線は不要
            "& > tr:last-child": {
                borderBottomWidth: "0",
            },
        },
        row: {
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "border.subtle",
            transitionProperty: "background-color",
            transitionDuration: "fast",
            transitionTimingFunction: "easeInOut",
            ...rowStateStyles,
            // 利用側が行に tabIndex を付けてフォーカスできるようにした場合のリング。
            // 行は枠線が結合されているため内側に描く
            _focusVisible: {
                outlineStyle: "solid",
                outlineWidth: "2px",
                outlineColor: "colorPalette.focus.ring",
                outlineOffset: "-2px",
            },
        },
        head: {
            textAlign: "start",
            verticalAlign: "middle",
            fontWeight: "semibold",
            // 見出しは本文より一回り小さく、字間を少し開けて控えめに読ませる
            fontSize: "xs",
            color: "fg.muted",
            letterSpacing: "wide",
            // 列見出しは折り返さず、幅が足りなければ横スクロールに任せる
            whiteSpace: "nowrap",
        },
        cell: {
            verticalAlign: "middle",
        },
        caption: {
            // 表の説明文。表の下に小さく添える
            color: "fg.muted",
            fontSize: "xs",
            textAlign: "start",
        },
        empty: {
            // データが無いことを示すプレースホルダー。行をまたいで中央に大きめの余白で置く
            textAlign: "center",
            color: "fg.muted",
        },
    },
    variants: {
        size: {
            // 標準サイズ。見出しの高さは Button md(40px) と揃える
            md: {
                head: {
                    height: "{sizes.10}",
                    px: "4",
                    py: "2",
                },
                cell: {
                    px: "4",
                    py: "3",
                },
                caption: {
                    px: "4",
                    py: "3",
                },
                empty: {
                    px: "4",
                    py: "10",
                },
            },
            // 情報密度を上げたいコンパクトサイズ。見出しの高さは Button sm(36px) と揃える
            sm: {
                head: {
                    height: "{sizes.9}",
                    px: "3",
                    py: "1.5",
                },
                cell: {
                    px: "3",
                    py: "2",
                },
                caption: {
                    px: "3",
                    py: "2",
                },
                empty: {
                    px: "3",
                    py: "8",
                },
            },
        },
        // 本文の偶数行に薄い地色を敷いて行を追いやすくする
        striped: {
            true: {
                body: {
                    // :where() で詳細度を 0 にし、同じレイヤーにある row の hover / 選択色が必ず勝つようにする
                    "& > tr:where(:nth-of-type(even))": {
                        // 縞も見出し行と同じ step2。hover(step3)が必ず一段濃くなる
                        bg: "colorPalette.2",
                    },
                },
                // 縞の地色と同じレイヤー(variant)に hover / 選択色を再宣言して、縞に負けないようにする
                row: rowStateStyles,
            },
            false: {},
        },
    },
    defaultVariants: {
        size: "md",
        striped: false,
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
