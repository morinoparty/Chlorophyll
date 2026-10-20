import { Link } from "@tanstack/react-router";
import { createLucideIcon } from "lucide-react";
import { sva } from "styled-system/css";
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
    slots: ["root", "container", "logo", "logoIcon", "logoText", "rightSection", "nav", "navLink", "iconButton"],
    base: {
        root: {
            position: "sticky",
            top: "0",
            zIndex: "overlay",
            bg: "bg/70",
            backdropFilter: "[blur(12px)]",
        },
        // park-ui のトップに倣い、コンテナ幅で縛らず画面端までを使う
        container: {
            display: "flex",
            paddingX: { base: "5", md: "8" },
            height: "16",
            alignItems: "center",
            justifyContent: "space-between",
        },
        logo: {
            display: "flex",
            alignItems: "center",
            gap: "3",
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
        rightSection: {
            display: "flex",
            alignItems: "center",
            gap: "2",
        },
        nav: {
            display: { base: "none", md: "flex" },
            alignItems: "center",
            gap: "1",
            marginRight: "2",
        },
        // 枠線を使わず、hover で淡い面を敷くゴーストボタン型のリンク
        navLink: {
            display: "inline-flex",
            alignItems: "center",
            paddingX: "3",
            paddingY: "2",
            borderRadius: "lg",
            fontSize: "sm",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
            textDecoration: "none",
            transition: "colors",
            _hover: {
                color: "colorPalette.fg",
                bg: "colorPalette.surface",
            },
        },
        // アイコン類も同じゴーストボタン型に揃える
        iconButton: {
            display: { base: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width: "9",
            height: "9",
            borderRadius: "lg",
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            transition: "colors",
            _hover: {
                color: "colorPalette.fg",
                bg: "colorPalette.surface",
            },
            "& svg": {
                width: "5",
                height: "5",
            },
        },
    },
});

export function Header() {
    const styles = headerStyles();

    return (
        <header className={styles.root}>
            <div className={styles.container}>
                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    <img src="/chlorophyll.svg" alt="Chlorophyll" className={styles.logoIcon} />
                    <span className={styles.logoText}>Chlorophyll</span>
                </Link>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {/* Navigation - hidden on mobile */}
                    <nav className={styles.nav}>
                        <Link
                            to="/docs/$"
                            params={{ _splat: "getting-started/introduction" }}
                            className={styles.navLink}
                        >
                            Docs
                        </Link>
                        <Link to="/docs/$" params={{ _splat: "theme" }} className={styles.navLink}>
                            Theme
                        </Link>
                    </nav>

                    <a
                        href="https://github.com/morinoparty/chlorophyll"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconButton}
                        aria-label="GitHub"
                    >
                        <Github />
                    </a>
                    <ColorPaletteToggle className={styles.iconButton} />

                    {/* Mobile Navigation - visible only on mobile */}
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
