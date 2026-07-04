import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-themes", "@storybook/addon-designs"],
    core: {
        builder: "@storybook/builder-vite",
    },
    refs: {
        "@chakra-ui/react": {
            disable: true,
        },
    },
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    staticDirs: [
        { from: "../../docs/public/", to: "/" },
        // MinecraftProvider の "assets" にローカルパスを渡すデモ用。models/ textures/ の
        // 構成のまま /minecraft-assets 配下に公開する
        { from: "../stories/minecraft-item/assets", to: "/minecraft-assets" },
    ],
};
export default config;
