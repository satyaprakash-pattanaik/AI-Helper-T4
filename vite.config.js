import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add Tailwind v4 Vite plugin
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "." },
        { src: "public/*", dest: "." },
      ],
    }),
  ],

  build: {
    outDir: "dist",
    lib: false,
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, "src/content/content.tsx"),
        background: path.resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});