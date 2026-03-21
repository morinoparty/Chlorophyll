import { defineRecipe } from "@pandacss/dev";

export const button = defineRecipe({
    className: "button",
    jsx: ["Button"],
    description: "The button component",
    base: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "l2",
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
            marginLeft: "[0.3em]",
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
                boxShadow: "raised",
                _after: {
                    content: '""',
                    position: "absolute",
                    inset: "0",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    boxShadow: "inner",
                    zIndex: 2,
                },
                _hover: {
                    bg: "colorPalette.solid.emphasized",
                    boxShadow: "md",
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
                boxShadow: "sm",
                _after: {
                    content: '""',
                    position: "absolute",
                    inset: "0",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    boxShadow: "inner",
                    zIndex: 2,
                },
                _hover: {
                    bg: {
                        _light: "gray.1",
                        _dark: "gray.3",
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
        },
        size: {
            sm: { height: "{sizes.8}", px: "{spacing.4}", fontSize: "xs" },
            md: { height: "{sizes.20}", px: "{spacing.5}", fontSize: "xs" },
            lg: { height: "{sizes.12}", px: "{spacing.6}", fontSize: "md" },
        },
    },
    defaultVariants: {
        intent: "primary",
        size: "lg",
    },
});
