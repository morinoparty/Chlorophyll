import type { I18nConfig } from "fumadocs-core/i18n";
import Link from "fumadocs-core/link";
import type { ComponentProps, ReactNode } from "react";
import type { LinkItemType } from "./link-item";

export interface NavOptions {
    enabled: boolean;
    component: ReactNode;

    title?: ReactNode | ((props: ComponentProps<"a">) => ReactNode);

    /**
     * Redirect url of title
     * @defaultValue '/'
     */
    url?: string;

    /**
     * Use transparent background
     *
     * @defaultValue none
     */
    transparentMode?: "always" | "top" | "none";

    children?: ReactNode;
}

export interface BaseLayoutProps {
    themeSwitch?: {
        enabled?: boolean;
        component?: ReactNode;
        mode?: "light-dark" | "light-dark-system";
    };

    paletteSwitch?: {
        enabled?: boolean;
        component?: ReactNode;
        mode?: "toggle" | "select";
    };

    searchToggle?: Partial<{
        enabled: boolean;
        components: Partial<{
            sm: ReactNode;
            lg: ReactNode;
        }>;
    }>;

    /**
     * I18n options
     *
     * @defaultValue false
     */
    i18n?: boolean | I18nConfig;

    /**
     * GitHub url
     */
    githubUrl?: string;

    /**
     * Storybook url
     */
    storybookUrl?: string;

    links?: LinkItemType[];
    /**
     * Replace or disable navbar
     */
    nav?: Partial<NavOptions>;

    children?: ReactNode;
}

/**
 * Get link items with shortcuts
 */
export function resolveLinkItems({
    links = [],
    githubUrl,
    storybookUrl,
}: Pick<BaseLayoutProps, "links" | "githubUrl" | "storybookUrl">): LinkItemType[] {
    const result = [...links];

    if (githubUrl)
        result.push({
            type: "icon",
            url: githubUrl,
            text: "Github",
            label: "GitHub",
            icon: (
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
            ),
            external: true,
        });

    if (storybookUrl)
        result.push({
            type: "icon",
            url: storybookUrl,
            text: "Storybook",
            label: "Storybook",
            icon: (
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-label="Storybook">
                    <path d="M16.71.243l-.12 2.71a.18.18 0 00.29.15l1.06-.8.9.7a.18.18 0 00.28-.14l-.1-2.76 1.33-.1a1.2 1.2 0 011.28 1.2v21.6a1.2 1.2 0 01-1.13 1.2l-16.7.83a1.2 1.2 0 01-1.28-1.19V2.08a1.2 1.2 0 011.12-1.2zM13.64 9.3c0 .47 3.16.24 3.59-.08 0-3.2-1.72-4.89-4.86-4.89-3.15 0-4.9 1.72-4.9 4.29 0 4.45 6 4.53 6 6.96 0 .7-.32 1.1-1.05 1.1-.96 0-1.35-.49-1.3-2.16 0-.36-3.65-.48-3.76 0-.27 4.03 2.23 5.2 5.1 5.2 2.79 0 4.97-1.49 4.97-4.18 0-4.77-6.1-4.64-6.1-7.04 0-.97.72-1.1 1.13-1.1.45 0 1.25.07 1.18 1.9z" />
                </svg>
            ),
            external: true,
        });

    return result;
}

export function renderTitleNav({ title, url = "/" }: Partial<NavOptions>, props: ComponentProps<"a">) {
    if (typeof title === "function") return title({ href: url, ...props });
    return (
        <Link href={url} {...props}>
            {title}
        </Link>
    );
}

export type * from "./link-item";
