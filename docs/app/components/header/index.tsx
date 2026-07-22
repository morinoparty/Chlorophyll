import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { sva } from "styled-system/css";
import { ColorPaletteToggle } from "../color-palette-toggle";
import { MobileNav } from "../mobile-nav";

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
