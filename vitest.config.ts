import { defineConfig, mergeConfig } from "vitest/config";
import { createViteConfig } from "./vite.config.ts";

export default mergeConfig(
    createViteConfig(false),
    defineConfig({
        test: {
            allowOnly: !process.env.CI,
            clearMocks: true,
            coverage: {
                exclude: ["src/main.ts", "src/**/*.d.ts", "src/**/index.ts", "src/**/interfaces/**", "src/**/types/**"],
                include: ["src/**/*.{ts,vue}"],
                provider: "v8",
                reporter: ["text", "json-summary", "html", "lcov"],
                reportsDirectory: "./coverage",
                thresholds: {
                    branches: 1,
                    functions: 1,
                    lines: 1,
                    statements: 1
                }
            },
            environment: "jsdom",
            environmentOptions: {
                jsdom: {
                    url: "http://localhost/"
                }
            },
            include: ["tests/unit/**/*.spec.ts"],
            restoreMocks: true,
            setupFiles: ["./tests/setup.ts"],
            unstubEnvs: true,
            unstubGlobals: true
        }
    })
);
