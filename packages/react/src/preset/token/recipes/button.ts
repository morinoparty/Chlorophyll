import { defineRecipe } from "@pandacss/dev";

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
        borderRadius: "xl",
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
                    boxShadow: "[inset 0 1.5px 0 0 rgba(255,255,255,0.34), inset 0 -2.5px 5px 0 rgba(0,0,0,0.27)]",
                    zIndex: 2,
                },
                // disabled 状態では hover を効かせない
                "&:not(:disabled):not([data-disabled]):hover": {
                    bg: "colorPalette.solid.emphasized",
                    boxShadow: "xl",
                    // hover で隆起感を少し強め、押し上がる印象にする
                    _after: {
                        boxShadow: "[inset 0 1.5px 0 0 rgba(255,255,255,0.38), inset 0 -3px 6px 0 rgba(0,0,0,0.3)]",
                    },
                },
                _focusVisible: {
                    outline: "none",
                    ringWidth: "2",
                    ringColor: "colorPalette.a4",
                    ringOffset: "0",
                },
                _disabled: {
                    bg: "gray.6",
                    borderColor: "border.muted",
                    color: "gray.contrast",
                    boxShadow: "sm",
                },
            },
            secondary: {
                bg: "bg.panel",
                color: "colorPalette.fg",
                // dark では bg.panel が背景と近く影も沈むため、border で輪郭を出す
                _dark: {
                    borderWidth: "1px",
                    borderColor: "gray.8",
                },
                boxShadow: "sm",
                _after: {
                    content: '""',
                    position: "absolute",
                    inset: "0",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    // 上辺にハイライト・下辺にやわらかい影を入れて控えめな立体感を出す。
                    // light は白い面なので濃い影だと汚れて見えるため薄く、
                    // dark は暗いパネルに合わせてハイライトを抑え影をやや強める
                    boxShadow: {
                        _light: "[inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 -2px 4px 0 rgba(0,0,0,0.08)]",
                        _dark: "[inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -2px 4px 0 rgba(0,0,0,0.25)]",
                    },
                    zIndex: 2,
                },
                // disabled 状態では hover を効かせない
                "&:not(:disabled):not([data-disabled]):hover": {
                    bg: {
                        _light: "gray.1",
                        _dark: "gray.3",
                    },
                    // hover で下辺の影を少し深め、立体感を強める
                    _after: {
                        boxShadow: {
                            _light: "[inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 -3px 5px 0 rgba(0,0,0,0.1)]",
                            _dark: "[inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -3px 5px 0 rgba(0,0,0,0.3)]",
                        },
                    },
                },
                _focusVisible: {
                    outline: "none",
                    ringWidth: "2",
                    ringColor: "colorPalette.a4",
                    ringOffset: "0",
                },
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
                _focusVisible: {
                    outline: "none",
                    ringWidth: "2",
                    ringColor: "colorPalette.a4",
                    ringOffset: "0",
                },
                _disabled: {
                    color: "colorPalette.fg.muted",
                    opacity: "disabled",
                },
            },
        },
        size: {
            sm: { height: "{sizes.10}", px: "{spacing.4}", fontSize: "xs" },
            md: { height: "{sizes.11}", px: "{spacing.5}", fontSize: "sm" },
            lg: { height: "{sizes.12}", px: "{spacing.6}", py: "{spacing.2}", fontSize: "md" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});
