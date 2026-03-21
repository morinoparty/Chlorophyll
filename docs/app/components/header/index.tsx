import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { css, sva } from "styled-system/css";
import { ColorPaletteToggle } from "../color-palette-toggle";
import { MobileNav } from "../mobile-nav";
import { ThemeToggle } from "../theme-toggle";

const headerStyles = sva({
    slots: ["root", "container", "logo", "logoIcon", "logoText", "rightSection", "nav", "navLink", "icons", "iconLink"],
    base: {
        root: {
            position: "sticky",
            top: "0",
            zIndex: "overlay",
            bg: "bg/80",
            backdropFilter: "[blur(8px)]",
        },
        container: {
            display: "flex",
            maxWidth: "7xl",
            marginX: "auto",
            paddingX: { base: "4" },
            height: "16",
            alignItems: "center",
            justifyContent: "space-between",
        },
        logo: {
            display: "flex",
            alignItems: "center",
            gap: "4",
            textDecoration: "none",
            color: "colorPalette.fg",
        },
        logoIcon: {
            width: "10",
            height: "[37px]",
        },
        logoText: {
            fontWeight: "bold",
            fontSize: "xl",
        },
        rightSection: {
            display: "flex",
            alignItems: "center",
            gap: { base: "4", md: "16" },
        },
        nav: {
            display: { base: "none", md: "flex" },
            alignItems: "center",
            gap: "8",
        },
        navLink: {
            fontSize: "md",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
            textDecoration: "none",
            transition: "colors",
            _hover: { color: "colorPalette.fg" },
        },
        icons: {
            display: "flex",
            alignItems: "center",
            gap: "4",
        },
        iconLink: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { base: "5", lg: "6" },
            height: { base: "5", lg: "6" },
            color: "colorPalette.fg.muted",
            transition: "colors",
            _hover: { color: "colorPalette.fg" },
            "& svg": {
                width: { base: "5", lg: "6" },
                height: { base: "5", lg: "6" },
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
                        <Link to="/docs/$" className={styles.navLink}>
                            Docs
                        </Link>
                        <Link to="/docs/$" params={{ _splat: "token" }} className={styles.navLink}>
                            Components
                        </Link>
                        <Link to="/docs/$" params={{ _splat: "token" }} className={styles.navLink}>
                            Theme
                        </Link>
                    </nav>

                    {/* Icons - hidden on mobile */}
                    <div className={styles.icons}>
                        <a
                            href="https://github.com/morinoparty/chlorophyll"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iconLink}
                            aria-label="GitHub"
                        >
                            <Github
                                className={css({
                                    display: {
                                        base: "none",
                                        lg: "block",
                                    },
                                })}
                            />
                        </a>
                        <ThemeToggle className={styles.iconLink} />
                        <ColorPaletteToggle className={styles.iconLink} />
                    </div>

                    {/* Mobile Navigation - visible only on mobile */}
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
