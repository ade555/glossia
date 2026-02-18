import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingoCompilerPlugin } from '@lingo.dev/compiler/vite'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: 'src',
      sourceLocale: 'en',
      targetLocales: ["pt","de","fr","es"],
      models: 'lingo.dev',
      dev: {
        usePseudotranslator: false,
      },
    }),
    react(),
    tailwindcss(),
  ],
})
