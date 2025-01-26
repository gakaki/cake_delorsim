"use strict";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        passWithNoTests: true,
        clearMocks: true,
        root: "./",
        include: ["**/*.{test,spec}.{js,ts}"],
        exclude: ["**/node_modules/**", "**/dist/**"],
        reporters: ["verbose"],
        testTimeout: 128880,
        coverage: {
            enabled: false,
            all: false,
            provider: "istanbul",
            include: ["src/**"],
            reporter: ["text", "json", "html"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    plugins: [
        swc.vite({
            module: { type: "es6" },
        }),
    ],
});
//# sourceMappingURL=vitest.config.mjs.map