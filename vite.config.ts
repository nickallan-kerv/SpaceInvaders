import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/SpaceInvaders/",
  server: {
    port: 5173,
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: ["src/**/*.ts"],
      exclude: ["src/main.ts"],
    },
  },
});
