import { defineConfig } from "vite";

export default defineConfig({
  root: "examples",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
