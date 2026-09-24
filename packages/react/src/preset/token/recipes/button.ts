import { defineRecipe } from "@pandacss/dev";
import { focusRing } from "./shared/focus-ring";

export const button = defineRecipe({
    className: "button",
    jsx: ["Button"],
    description: "The button component",
    // size/intent は実行時に動的指定されるため、全 variant の CSS を常に生成する
    staticCss: ["*"],
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        borderRadius: "control",
        fontWeight: "semibold",
        letterSpacing: "wide",
        isolation: "isolate",
        position: "relative",
        overflow: "hidden",
        transitionDuration: "normal",
        transitionProperty: "background, box-shadow, border-color",
        transitionTimingFunction: "easeInOut",
        whiteSpace: "nowrap",
        userSelect: "none",
        verticalAlign: "middle",
        cursor: "pointer",
        "& :where(svg)": {
            strokeWidth: "[2.4px]",
            fontSize: "1.4em",
            width: "0.9em",
            height: "0.9em",
        },
        _disabled: {
            cursor: "not-allowed",
        },
    },
    variants: {
        intent: {
            primary: {
                bg: "colorPalette.solid",
                color: "colorPalette.contrast",
                // 濃い solid 色の上では小さい影が沈んで浮き上がって見えないため、
                // しっかり浮き上がる柔らかい影に見えるよう lg を使う
                boxShadow: "lg",
                _after: {
                    content: '""',
                    position: "absolute",
                    inset: "0",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    // 上辺に光のハイライト・下辺に内側の影を入れ、
                    // 上から光が当たって隆起しているような立体感を出す
                    boxShadow: "inset.raised",
                    zIndex: 2,
                },
                // disabled 状態では hover を効かせない
                "&:not(:disabled):not([data-disabled]):hover": {
                    bg: "colorPalette.solid.emphasized",
                    boxShadow: "xl",
                    // hover で隆起感を少し強め、押し上がる印象にする
                    _after: {
                        boxShadow: "inset.raised.hover",
                    },
                },
                // 押下中は hover よりさらに一段沈めて、押し込んだ手応えを返す。
                // hover と同じ詳細度なので、後に書いて active を優先させる
                "&:not(:disabled):not([data-disabled]):active": {
                    bg: "colorPalette.solid.active",
                    boxShadow: "lg",
                },
                // フォーカスリングは outline のロングハンドで明示する。outline: "none" のショートハンドは
                // 消費側に borders.none トークンがあると var() に解決されて outline-style が消える(#78)
                _focusVisible: focusRing,
                _disabled: {
                    // 明るいままの背景に控えめな文字色を載せ、無効状態を読ませる
                    bg: "bg.disabled",
                    borderColor: "border.muted",
                    color: "fg.disabled",
                    boxShadow: "sm",
                },
            },
            secondary: {
                bg: "bg.panel",
                color: "colorPalette.fg",
                boxShadow: "sm",
                _after: {
                    content: '""',
                    position: "absolute",
                    inset: "0",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    // 上辺にハイライト・下辺にやわらかい影を入れて控えめな立体感を出す。
                    // 白い面なので濃い影だと汚れて見えるため薄くする
                    boxShadow: "inset.raised.subtle",
                    zIndex: 2,
                },
                // disabled 状態では hover を効かせない
                "&:not(:disabled):not([data-disabled]):hover": {
                    bg: "bg.panel.hover",
                    // hover で下辺の影を少し深め、立体感を強める
                    _after: {
                        boxShadow: "inset.raised.subtle.hover",
                    },
                },
                _focusVisible: focusRing,
                _disabled: {
                    bg: "bg.panel",
                    borderColor: "border.subtle",
                    color: "colorPalette.fg.muted",
                    boxShadow: "xs",
                },
            },
            plain: {
                bg: "transparent",
                color: "colorPalette.fg.muted",
                boxShadow: "none",
                "&:not(:disabled):not([data-disabled]):hover": {
                    bg: "colorPalette.surface",
                    color: "colorPalette.fg",
                },
                _focusVisible: focusRing,
                _disabled: {
                    color: "colorPalette.fg.muted",
                    opacity: "disabled",
                },
            },
        },
        // 高さは sizes.control(sm 36 / md 40 / lg 44px)で Select などと共有し、
        // 横 padding・文字サイズを 1 段ずつ連動させ、どこで並べても揃って見えるようにする
        size: {
            sm: { height: "control.sm", px: "{spacing.3.5}", fontSize: "xs" },
            md: { height: "control.md", px: "{spacing.4}", fontSize: "sm" },
            lg: { height: "control.lg", px: "{spacing.5}", fontSize: "md" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});
