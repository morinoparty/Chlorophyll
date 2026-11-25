import { Link } from "@tanstack/react-router";
import { createLucideIcon } from "lucide-react";
import { sva } from "styled-system/css";
import reactPackage from "../../../../packages/react/package.json";
import { ColorPaletteToggle } from "../color-palette-toggle";
import { MobileNav } from "../mobile-nav";

// lucide-react 1.x でブランド系アイコン（Github）が削除されたため、0.x と同じパスで再定義する（ISC License）
const Github = createLucideIcon("github", [
    [
        "path",
        {
            d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
            key: "tonef",
        },
    ],
    ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
]);

const headerStyles = sva({
    slots: ["root", "container", "logo", "logoIcon", "logoText", "version", "nav", "navLink", "actions", "iconButton"],
    base: {
        root: {
            position: "sticky",
            top: "0",
            zIndex: "overlay",
            bg: "colorPalette.bg/80",
            backdropFilter: "[blur(12px)]",
            borderBottomWidth: "1",
            borderColor: "border",
        },
        // ロゴ・ナビ・操作の 3 つを並べ、ナビは画面の中央に置く
        container: {
            display: "grid",
            gridTemplateColumns: { base: "[1fr auto]", md: "[1fr auto 1fr]" },
            alignItems: "center",
            gap: "4",
            height: "16",
            paddingX: { base: "5", md: "8" },
        },
        logo: {
            display: "flex",
            alignItems: "center",
            gap: "2.5",
            justifySelf: "start",
            textDecoration: "none",
            color: "colorPalette.fg",
        },
        logoIcon: {
            width: "8",
            height: "8",
        },
        logoText: {
            fontWeight: "bold",
            fontSize: "lg",
        },
        // ライブラリのバージョン。ロゴの横に小さく添える
        version: {
            paddingX: "2",
            paddingY: "0.5",
            borderRadius: "full",
            bg: "colorPalette.surface",
            fontSize: "xs",
            fontWeight: "bold",
            color: "colorPalette.fg",
        },
        // ナビは淡い面のピルにまとめ、現在のページだけ白い面で浮かせる
        nav: {
            display: { base: "none", md: "flex" },
            alignItems: "center",
            gap: "1",
            padding: "1",
            borderRadius: "full",
            bg: "colorPalette.surface.subtle",
        },
        navLink: {
            paddingX: "4",
            paddingY: "1.5",
            borderRadius: "full",
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
            textDecoration: "none",
            transition: "colors",
            _hover: { color: "colorPalette.fg" },
            "&[data-status=active]": {
                bg: "bg.panel",
                color: "colorPalette.fg",
                fontWeight: "bold",
                boxShadow: "xs",
            },
        },
        actions: {
            display: "flex",
            alignItems: "center",
            justifySelf: "end",
            gap: "2",
        },
        iconButton: {
            display: { base: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width: "9",
            height: "9",
            borderRadius: "full",
            bg: "colorPalette.surface.subtle",
            color: "colorPalette.fg",
            transition: "colors",
            _hover: { bg: "colorPalette.surface" },
            "& svg": { width: "5", height: "5" },
        },
    },
});

export function Header() {
    const styles = headerStyles();

    return (
        <header className={styles.root}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src="/chlorophyll.svg" alt="" className={styles.logoIcon} />
                    <span className={styles.logoText}>Chlorophyll</span>
                    <span className={styles.version}>v{reactPackage.version}</span>
                </Link>

                {/* md 以上のナビ。モバイルでは MobileNav に任せる */}
                <nav className={styles.nav}>
                    <Link to="/docs/$" params={{ _splat: "getting-started/introduction" }} className={styles.navLink}>
                        ドキュメント
                    </Link>
                    <Link to="/docs/$" params={{ _splat: "theme" }} className={styles.navLink}>
                        トークン
                    </Link>
                    <a href="/storybook/" className={styles.navLink}>
                        Storybook
                    </a>
                </nav>

                <div className={styles.actions}>
                    <a
                        href="https://github.com/morinoparty/chlorophyll"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconButton}
                        aria-label="GitHub"
                    >
                        <Github />
                    </a>
                    <ColorPaletteToggle />
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
