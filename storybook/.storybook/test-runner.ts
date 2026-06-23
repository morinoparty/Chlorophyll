import type { TestRunnerConfig } from "@storybook/test-runner";
import { checkA11y, configureAxe, injectAxe } from "axe-playwright";

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
    async preVisit(page) {
        await injectAxe(page);
        await configureAxe(page, {
            rules: [
                // preview.tsx と同様に、コントラストは APCA で検証するため標準ルールは無効化
                { id: "color-contrast", enabled: false },
                { id: "color-contrast-enhanced", enabled: false },
                // Storybook は各ストーリーを landmark の無い断片として描画するため region は対象外
                { id: "region", enabled: false },
            ],
        });
    },
    async postVisit(page) {
        await checkA11y(page, "body", {
            detailedReport: true,
            detailedReportOptions: {
                html: true,
            },
        });
    },
};

export default config;
