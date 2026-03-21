import { css } from "styled-system/css";
import { stack } from "styled-system/patterns";

interface NavItem {
    title: string;
    href: string;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navigation: NavSection[] = [
    {
        title: "Getting Started",
        items: [
            { title: "Introduction", href: "/docs" },
            { title: "Concept", href: "/docs/concept" },
            { title: "Theme", href: "/docs/concept/introduction" },
        ],
    },
    {
        title: "Theming",
        items: [
            { title: "Colors", href: "/docs/theme/reference-tokens/colors" },
            { title: "Typography", href: "/docs/theme/system-tokens/typography" },
            { title: "Spacing", href: "/docs/theme/spacing" },
        ],
    },
    {
        title: "Components",
        items: [{ title: "Button", href: "/docs/components/" }],
    },
];

interface SidebarProps {
    currentPath?: string;
}

export function Sidebar({ currentPath = "" }: SidebarProps) {
    return (
        <aside
            className={css({
                display: { base: "none", lg: "block" },
                width: "64",
                flexShrink: 0,
                position: "sticky",
                top: "16",
                height: "[calc(100vh - 4rem)]",
                overflowY: "auto",
                paddingY: "6",
                paddingRight: "4",
            })}
        >
            <nav className={stack({ gap: "6" })}>
                {navigation.map((section) => (
                    <div key={section.title}>
                        <h4
                            className={css({
                                paddingX: "3",
                                paddingY: "1",
                                fontSize: "sm",
                                fontWeight: "semibold",
                                color: "colorPalette.fg.muted",
                            })}
                        >
                            {section.title}
                        </h4>
                        <ul className={stack({ gap: "0.5", marginTop: "2" })}>
                            {section.items.map((item) => {
                                const isActive = currentPath === item.href;
                                return (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            className={css({
                                                display: "block",
                                                paddingX: "3",
                                                paddingY: "1.5",
                                                borderRadius: "md",
                                                fontSize: "sm",
                                                color: isActive ? "colorPalette.solid" : "colorPalette.fg.muted",
                                                fontWeight: isActive ? "medium" : "normal",
                                                textDecoration: "none",
                                                bg: isActive ? "colorPalette.bg.subtle" : "[transparent]",
                                                transition: "colors",
                                                _hover: {
                                                    color: isActive ? "colorPalette.solid" : "colorPalette.fg",
                                                    bg: isActive ? "colorPalette.bg.subtle" : "bg.subtle",
                                                },
                                            })}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
