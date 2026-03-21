import Color from "colorjs.io";
import { sva } from "styled-system/css";
import { token } from "styled-system/tokens";
import type { ColorToken } from "styled-system/tokens/tokens";

const toHex = (colorValue: string): string => {
    try {
        const color = new Color(colorValue);
        return color.to("srgb").toString({ format: "hex" });
    } catch {
        return colorValue;
    }
};

const colorDisplayStyles = sva({
    slots: ["root", "swatch", "info", "name", "value"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            alignItems: "center",
            width: "full",
        },
        swatch: {
            height: "20",
            width: "full",
            borderRadius: "lg",
            border: "sm",
            borderColor: "border",
        },
        info: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            alignItems: "start",
            width: "full",
        },
        name: {
            fontSize: { base: "xs", md: "sm" },
            color: "colorPalette.fg",
            width: "full",
            textAlign: "center",
            margin: "0",
        },
        value: {
            display: { base: "none", md: "block" },
            fontSize: "xs",
            color: "colorPalette.fg.muted",
            width: "full",
            textAlign: "center",
            margin: "0",
        },
    },
});

interface ColorDisplayProps {
    tokenKey: ColorToken;
}

export function ColorDisplay({ tokenKey }: ColorDisplayProps) {
    const styles = colorDisplayStyles();
    const tokenPath = `colors.${tokenKey}` as const;
    const colorValue = token(tokenPath);
    const cssVar = token.var(tokenPath);
    const hexValue = toHex(colorValue);

    return (
        <div className={styles.root}>
            <div className={styles.swatch} style={{ backgroundColor: cssVar }} />
            <div className={styles.info}>
                <div className={styles.name}>{tokenKey}</div>
                <div className={styles.value}>{hexValue}</div>
            </div>
        </div>
    );
}
