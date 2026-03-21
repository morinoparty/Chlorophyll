import { sva } from "styled-system/css";
import type { ColorToken } from "styled-system/tokens/tokens";
import { ColorDisplay } from "./color-display";

const colorListStyles = sva({
    slots: ["root", "title", "grid"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            gap: "4",
            width: "full",
        },
        title: {
            fontSize: "lg",
            fontWeight: "semibold",
            color: "colorPalette.fg",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: {
                base: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
            },
            gap: "4",
            width: "full",
        },
    },
});

interface ColorListProps {
    title: string;
    tokenKeys: ColorToken[];
}

export function ColorList({ title, tokenKeys }: ColorListProps) {
    const styles = colorListStyles();

    return (
        <div className={styles.root}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.grid}>
                {tokenKeys.map((tokenKey) => (
                    <ColorDisplay key={tokenKey} tokenKey={tokenKey} />
                ))}
            </div>
        </div>
    );
}
