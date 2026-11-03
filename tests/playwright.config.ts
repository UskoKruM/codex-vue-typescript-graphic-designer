import { defineConfig, devices } from "@playwright/test";

const port = 4173;

export default defineConfig({
    forbidOnly: Boolean(process.env.CI),
    fullyParallel: true,
    outputDir: "../test-results",
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        }
    ],
    reporter: [["list"], ["html", { open: "never", outputFolder: "../playwright-report" }]],
    retries: process.env.CI ? 2 : 0,
    testDir: "./e2e",
    use: {
        baseURL: `http://127.0.0.1:${port}`,
        screenshot: "only-on-failure",
        trace: "on-first-retry"
    },
    webServer: {
        command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: `http://127.0.0.1:${port}`
    }
});
