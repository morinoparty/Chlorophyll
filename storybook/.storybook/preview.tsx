import "../src/index.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { themes } from "storybook/theming";
import { css } from "styled-system/css";
import { registerAPCACheck } from "./a11y";

const apca = registerAPCACheck("silver");

const withTheme: Decorator = (Story, context) => {
    const palette = context.globals.palette || "mori";
    useEffect(() => {
        const root = document.documentElement;

        // ライトモード固定なので data-theme は常に light を設定する
        root.setAttribute("data-theme", "light");

        // Set palette
        root.setAttribute("data-color-palette", palette);

        // プレビュー全体の背景をテーマの colorPalette.bg トークンで塗る。
        // colorPalette のクラスを body に付与して --mpc-colors-color-palette-* を解決させる。
        const paletteClass = css({ colorPalette: palette }).split(" ").filter(Boolean);
        document.body.classList.add(...paletteClass);
        document.body.style.backgroundColor = "var(--mpc-colors-color-palette-bg)";
        return () => {
            document.body.classList.remove(...paletteClass);
        };
    }, [palette]);

    return <Story />;
};

const preview: Preview = {
    globalTypes: {
        palette: {
            description: "Color palette",
            defaultValue: "mori",
            toolbar: {
                title: "Palette",
                icon: "paintbrush",
                items: [
                    { value: "mori", title: "Mori" },
                    { value: "umi", title: "Umi" },
                ],
            },
        },
    },
    parameters: {
        docs: {
            theme: themes.light,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        screenshot: {
            fullPage: true,
            delay: 0,
            viewports: {
                desktop: {
                    width: 1920,
                    height: 1080,
                },
                mobile: {
                    width: 375,
                    height: 667,
                    isMobile: true,
                    hasTouch: true,
                },
            },
        },

        a11y: {
            // Optional selector to inspect
            test: "todo",
            context: "body",
            config: {
                checks: [...apca.checks],
                rules: [
                    {
                        // The autocomplete rule will not run based on the CSS selector provided
                        id: "autocomplete-valid",
                        selector: '*:not([autocomplete="nope"])',
                    },
                    {
                        // Setting the enabled option to false will disable checks for this particular rule on all stories.
                        id: "image-alt",
                        enabled: false,
                    },
                    {
                        id: "color-contrast",
                        enabled: false,
                    },
                    {
                        id: "color-contrast-enhanced",
                        enabled: false,
                    },
                    ...apca.rules,
                ],
            },
            options: {},
        },
    },
    decorators: [
        withTheme,
        (Story, context) => {
            const palette = context.globals.palette || "mori";
            return (
                <div
                    className={css({
                        colorPalette: palette,
                        textStyle: "body",
                    })}
                >
                    <Story />
                </div>
            );
        },
    ],
};

export default preview;
