import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/home/sam/Downloads/HarvestConnect/HarvestConnect-1/client/src",
      "@shared": "/home/sam/Downloads/HarvestConnect/HarvestConnect-1/shared",
      "@assets": "/home/sam/Downloads/HarvestConnect/HarvestConnect-1/attached_assets"
    },
  },
  root: "/home/sam/Downloads/HarvestConnect/HarvestConnect-1/client",
  build: {
    outDir: "/home/sam/Downloads/HarvestConnect/HarvestConnect-1/dist/public",
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  esbuild: {
    jsx: "preserve",
    jsxImportSource: "react",
  },
});