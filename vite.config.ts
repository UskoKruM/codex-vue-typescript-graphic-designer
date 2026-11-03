import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import vueDevTools from "vite-plugin-vue-devtools";
import webfontDownload from "vite-plugin-webfont-dl";
import { parseEnvironment } from "./src/config/environment.schema.ts";

export function createViteConfig(enableDevTools: boolean): UserConfig {
    return {
        build: {
            outDir: "dist"
        },
        plugins: [
            tailwindcss(),
            ui({
                colorMode: false
            }),
            vue(),
            enableDevTools && vueDevTools(),
            webfontDownload(["https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"])
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
                "@tests": fileURLToPath(new URL("./tests", import.meta.url))
            }
        },
        server: {
            port: 3000
        }
    };
}

export default defineConfig(({ command, mode }) => {
    parseEnvironment(loadEnv(mode, process.cwd(), "VITE_"));

    return createViteConfig(command === "serve" && mode === "development");
});
