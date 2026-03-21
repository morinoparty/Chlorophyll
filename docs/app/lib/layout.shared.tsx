import type { BaseLayoutProps } from "../../components/layout/shared";

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: (
                <div className="flex items-center gap-2">
                    <img src="/chlorophyll.svg" alt="Chlorophyll" className="size-6" />
                    <span className="text-lg font-bold">Chlorophyll</span>
                </div>
            ),
            transparentMode: "top",
        },
        themeSwitch: {
            enabled: true,
            mode: "light-dark",
        },
        paletteSwitch: {
            enabled: true,
            mode: "toggle",
        },
        githubUrl: "https://github.com/morinoparty/chlorophyll",
        storybookUrl: "https://chlorophyll-storybook.nikomaru.workers.dev/",
    };
}
