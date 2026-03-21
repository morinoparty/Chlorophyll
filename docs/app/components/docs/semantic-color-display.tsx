import { sva } from "styled-system/css";

const semanticColorDisplayStyles = sva({
    slots: ["root", "swatchContainer", "swatch", "info", "name", "description", "reference"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "2",
            width: "full",
        },
        swatchContainer: {
            display: "flex",
            height: "20",
            width: "full",
            borderRadius: "lg",
            overflow: "hidden",
            border: "sm",
            borderColor: "border",
        },
        swatch: {
            flex: "1",
            height: "full",
        },
        info: {
            display: "flex",
            flexDirection: "column",
            gap: "1",
            width: "full",
        },
        name: {
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg",
        },
        description: {
            fontSize: "xs",
            color: "colorPalette.fg.muted",
        },
        reference: {
            fontSize: "xs",
            color: "colorPalette.fg.subtle",
            fontFamily: "mono",
        },
    },
});

interface SemanticColorDisplayProps {
    tokenKey: string;
    reference: string;
    description: string;
}

function tokenToCssVar(tokenKey: string): string {
    const cssVarName = tokenKey.replace(/\./g, "-");
    return `var(--mpc-colors-${cssVarName})`;
}

export function SemanticColorDisplay({ tokenKey, reference, description }: SemanticColorDisplayProps) {
    const styles = semanticColorDisplayStyles();
    const cssVar = tokenToCssVar(tokenKey);

    return (
        <div className={styles.root}>
            <div className={styles.swatchContainer}>
                <div className={styles.swatch} style={{ backgroundColor: cssVar }} />
            </div>
            <div className={styles.info}>
                <p className={styles.name}>{tokenKey}</p>
                <p className={styles.description}>{description}</p>
                <code className={styles.reference}>{reference}</code>
            </div>
        </div>
    );
}
