// vite.config.mts
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
      provider: "istanbul", // 'v8',
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
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
  ],
});
