import { createRootRoute, HeadContent, Outlet, Scripts, useLocation } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { css } from "styled-system/css";
import pandacss from "styled-system/styles.css?url";
import appCss from "../app.css?url";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { name: "description", content: "Chlorophyll - A design system for Morinoparty projects" },
        ],
        links: [
            process.env.NODE_ENV !== "development" ? { rel: "stylesheet", href: pandacss } : undefined,
            { rel: "icon", type: "image/svg+xml", href: "/chlorophyll.svg" },
            { rel: "stylesheet", href: appCss },
            { rel: "stylesheet", href: "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap" },
            {
                rel: "stylesheet",
                type: "text/css",
                href: "https://shogo82148.github.io/genjyuugothic-subsets/GenJyuuGothicL-P-Medium/GenJyuuGothicL-P-Medium.css",
            },
            {
                rel: "stylesheet",
                type: "text/css",
                href: "https://shogo82148.github.io/genjyuugothic-subsets/GenJyuuGothicL-P-Bold/GenJyuuGothicL-P-Bold.css",
            },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
    const location = useLocation();
    const isDocsPage = location.pathname.startsWith("/docs");

    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body
                className={css({
                    margin: "0",
                    minHeight: "dvh",
                    display: "flex",
                    textStyle: "body",
                    flexDirection: "column",
                    bg: "colorPalette.bg",
                    color: "colorPalette.fg",
                })}
            >
                <RootProvider>
                    <ThemeScript />
                    {!isDocsPage && <Header />}
                    <main
                        className={css({
                            flex: "1",
                            width: "full",
                        })}
                    >
                        <Outlet />
                    </main>
                    {!isDocsPage && <Footer />}
                    <Scripts />
                </RootProvider>
            </body>
        </html>
    );
}

function ThemeScript() {
    return (
        <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SSR theme initialization script
            dangerouslySetInnerHTML={{
                __html: `
          (function() {
            // Mode (light/dark)
            const mode = localStorage.getItem('mode') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.setAttribute('data-mode', mode);
            document.documentElement.classList.toggle('dark', mode === 'dark');

            // Color Theme (mori/umi)
            const colorTheme = localStorage.getItem('color-theme') || 'mori';
            document.documentElement.setAttribute('data-color-theme', colorTheme);
          })();
        `,
            }}
        />
    );
}
