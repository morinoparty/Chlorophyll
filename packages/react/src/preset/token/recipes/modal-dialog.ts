import { defineSlotRecipe } from "@pandacss/dev";

export const modalDialog = defineSlotRecipe({
    className: "modal-dialog",
    jsx: ["ModalDialog"],
    description: "The modal dialog component",
    // overlay/positioner が Root(演出とクリック領域)、container 以下が枠と中身
    slots: ["overlay", "positioner", "container", "title", "content", "footer"],
    base: {
        overlay: {
            // 画面全体を覆う暗幕。ここを直接クリックしたときだけ閉じる
            position: "fixed",
            top: "0",
            left: "0",
            width: "full",
            height: "full",
            // 移植元の leaf.600/50 は、モーダル背景専用の overlay セマンティックトークンに対応付ける
            bg: "overlay",
            zIndex: "modal",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            // 0.25s 相当のトークンが無いため slow(300ms) に寄せる
            animationName: "modalDialogFadeIn",
            animationDuration: "slow",
            animationTimingFunction: "easeInOut",
            animationFillMode: "both",
            willChange: "opacity",
        },
        positioner: {
            // overlay の中で container を包む演出用ラッパー。
            // 中央寄せは overlay(flex) が担当し、こちらは拡大フェードだけを持つ
            animationName: "modalDialogFadeIn, modalDialogScaleIn",
            animationDuration: "slow",
            animationTimingFunction: "easeInOut",
            animationFillMode: "both",
            transformOrigin: "center",
            willChange: "opacity, transform",
        },
        container: {
            // ダイアログの枠。title / main / footer の 3 スロットを固定余白の grid で並べる。
            // 左右 38px の余白列を挟み、main だけは既定で端まで伸ばす(hasMainPadding で揃えられる)
            bg: "bg.panel",
            display: "grid",
            gridTemplate: `
                ". . ." 36px
                ". title ." auto
                ". . ." 24px
                "main main main" auto
                ". . ." 16px
                ". footer ." auto
                ". . ." 24px
            `,
            gridTemplateColumns: "38px 1fr 38px",
            width: "560px",
            minWidth: "560px",
            maxWidth: "560px",
            // 4xl = 2rem = 32px。移植元の borderRadius: 32px と一致する
            borderRadius: "4xl",
            overflow: "hidden",
            color: "colorPalette.fg",
        },
        title: {
            gridArea: "title",
            // 見出し行。中に heading とサブテキストを積めるよう縦積みにしておく
            display: "flex",
            flexDirection: "column",
            gap: "component.gap.xs",
            textStyle: "2xl",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        content: {
            gridArea: "main",
            // grid セルの中身(長文や overflow するリスト)がセル幅を押し広げないようにする
            minWidth: "0",
            color: "colorPalette.fg.muted",
        },
        footer: {
            gridArea: "footer",
            // 操作ボタンは右寄せが既定
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "component.gap.lg",
        },
    },
    variants: {
        // フルページ表示。オーバーレイではなくページそのものとして描くため、
        // 暗幕・ぼかし・アニメーションを止めてページの地色を敷く
        isPage: {
            true: {
                overlay: {
                    position: "static",
                    width: "auto",
                    height: "100vh",
                    bg: "colorPalette.bg",
                    zIndex: "auto",
                    backdropFilter: "none",
                    animationName: "none",
                },
                positioner: {
                    animationName: "none",
                },
            },
        },
        // 退場アニメーション中。overlay の animationend で実際のクローズ処理が走る
        isExiting: {
            true: {
                overlay: {
                    animationName: "modalDialogFadeOut",
                    animationDuration: "normal",
                    animationTimingFunction: "easeIn",
                    animationFillMode: "forwards",
                },
                positioner: {
                    animationName: "modalDialogFadeOut",
                    animationDuration: "normal",
                    animationTimingFunction: "easeIn",
                    animationFillMode: "forwards",
                },
            },
        },
        // main も title / footer と同じ左右 38px の余白に揃える
        hasMainPadding: {
            true: {
                container: {
                    gridTemplate: `
                        ". . ." 36px
                        ". title ." auto
                        ". . ." 24px
                        ". main ." auto
                        ". . ." 16px
                        ". footer ." auto
                        ". . ." 24px
                    `,
                },
            },
        },
    },
    // 利用者側で動的に使われても CSS が出るよう全 variant を生成する
    staticCss: ["*"],
});
