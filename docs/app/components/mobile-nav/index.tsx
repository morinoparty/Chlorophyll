"use client";

import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { sva } from "styled-system/css";

const navigation = [
    { title: "Docs", href: "/docs/" },
    { title: "Components", href: "/docs/" },
    { title: "Theme", href: "/docs/theme" },
];

const mobileNavStyles = sva({
    slots: ["trigger", "backdrop", "positioner", "content", "header", "closeButton", "body", "navLink", "footer"],
    base: {
        trigger: {
            display: { base: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "center",
            width: "10",
            height: "10",
            borderRadius: "md",
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            bg: "bg",
            border: "[none]",
            transition: "colors",
            _hover: { bg: "bg.subtle", color: "colorPalette.fg" },
        },
        backdrop: {
            position: "fixed",
            inset: "0",
            zIndex: "overlay",
            opacity: "0",
            bg: "bg",

            transition: "[opacity 0.2s ease-out]",
            _open: {
                opacity: "[1]",
            },
            _closed: {
                opacity: "0",
            },
        },
        positioner: {
            position: "fixed",
            inset: "0",
            zIndex: "overlay",
            display: "flex",
        },
        content: {
            position: "relative",
            width: "full",
            height: "dvh",
            bg: "bg",
            display: "flex",
            flexDirection: "column",
            opacity: "0",
            transition: "[opacity 0.2s ease-out]",
            _open: {
                opacity: "[1]",
            },
            _closed: {
                opacity: "0",
            },
        },
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingX: "4",
            paddingY: "3",
        },
        closeButton: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "10",
            height: "10",
            borderRadius: "md",
            color: "colorPalette.fg.muted",
            cursor: "pointer",
            bg: "[transparent]",
            border: "[none]",
            transition: "colors",
            _hover: { bg: "bg.subtle", color: "colorPalette.fg" },
        },
        body: {
            flex: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4",
        },
        navLink: {
            display: "block",
            paddingX: "6",
            paddingY: "2",
            borderRadius: "md",
            fontSize: "2xl",
            fontWeight: "medium",
            color: "colorPalette.fg.muted",
            textDecoration: "none",
            textAlign: "center",
            transition: "colors",
            _hover: {
                color: "colorPalette.fg",
            },
        },
        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4",
            paddingX: "4",
            paddingY: "6",
        },
    },
});

interface MobileNavProps {
    currentPath?: string;
}

export function MobileNav({ currentPath = "" }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const styles = mobileNavStyles();

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
            <Dialog.Trigger className={styles.trigger} aria-label="Open menu">
                <Menu size={24} />
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop className={styles.backdrop} />
                <Dialog.Positioner className={styles.positioner}>
                    <Dialog.Content className={styles.content}>
                        <div className={styles.header}>
                            <Link to="/" onClick={handleLinkClick}>
                                <img src="/chlorophyll.svg" alt="Chlorophyll" style={{ height: "32px" }} />
                            </Link>
                            <Dialog.CloseTrigger className={styles.closeButton}>
                                <X size={24} />
                            </Dialog.CloseTrigger>
                        </div>
                        <nav className={styles.body}>
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={styles.navLink}
                                    onClick={handleLinkClick}
                                    style={
                                        currentPath === item.href
                                            ? {
                                                  color: "var(--mpc-colors-accent-default)",
                                                  backgroundColor: "var(--mpc-colors-accent-a3)",
                                              }
                                            : undefined
                                    }
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
