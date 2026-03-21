import { Button } from "@chlorophyll/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { sva } from "styled-system/css";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [{ title: "Chlorophyll - Morinoparty Design System" }],
    }),
    component: Home,
});

const homeStyles = sva({
    slots: ["root", "title", "description", "actions"],
    base: {
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "[60vh]",
            textAlign: "center",
            gap: "6",
        },
        title: {
            fontSize: "4xl",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        description: {
            fontSize: "lg",
            color: "colorPalette.fg.muted",
            maxWidth: "lg",
        },
        actions: {
            display: "flex",
            gap: "4",
            flexWrap: "wrap",
            justifyContent: "center",
        },
    },
});

function Home() {
    const styles = homeStyles();

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>Chlorophyll</h1>
            <p className={styles.description}>
                A design system for Morinoparty projects built with Panda CSS and Ark UI
            </p>
            <div className={styles.actions}>
                <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }}>
                    <Button intent="primary">ドキュメントへ</Button>
                </Link>
                <Link to="/docs/$" params={{ _splat: "theme" }}>
                    <Button intent="secondary">トークン一覧</Button>
                </Link>
            </div>
        </div>
    );
}
