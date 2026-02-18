import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

// Fallback config when running viewer directly (not via CLI)
export default defineConfig({
  plugins: [
    react(),
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"], // Default languages
      models: "lingo.dev",
      dev: {
        usePseudotranslator: true,
      },
    }),
  ],
});
