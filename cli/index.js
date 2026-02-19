#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import path from "path";
import { checkAuth } from "./src/auth.js";
import { setup } from "./src/setup.js";
import { generateConfig } from "./src/config.js";
import { translate } from "./src/translate.js";
import dotenv from "dotenv";

dotenv.config();

const GLOSSIA_DIR = process.env.GLOSSIA_DIR;

program
  .name("glossia")
  .description("Translate your OpenAPI spec into multiple languages")
  .version("1.0.0");

program
  .command("generate")
  .description("Translate an OpenAPI spec into multiple languages")
  .requiredOption("--spec <path>", "Path to your OpenAPI spec file")
  .option("--languages <languages>", "Target languages e.g. es,fr,de")
  .option("--source <language>", "Source language (default: en)", "en")
  .action(async (options) => {
    console.log(chalk.bold("\n🌍 Glossia\n"));

    // Step 1: Check authentication
    await checkAuth();

    // Step 2: Setup folder structure and copy spec
    await setup(options.spec, options.source);

    // Step 3: Generate i18n.json config
    const targets = await generateConfig(options.languages, options.source);

    // Step 4: Run translations
    await translate(targets);

    // Step 5: Tell user where their files are
    console.log(chalk.bold("\n✔ Done! Your translated specs are in:\n"));
    targets.forEach((lang) => {
      console.log(chalk.cyan(`  ${GLOSSIA_DIR}/i18n/${lang}/api.yaml`));
    });
    console.log(chalk.white("\nTo view your docs, run:"));
    console.log(chalk.cyan("  npx glossia serve\n"));
  });

program
  .command("serve")
  .description("Start the local docs viewer")
  .option("-p, --port <port>", "Port to run server on", "3000")
  .action(async (options) => {
    const { spawn } = await import("child_process");
    const path = await import("path");
    const fs = await import("fs");
    const { fileURLToPath } = await import("url");

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const viewerDir = path.resolve(__dirname, "../viewer");
    const publicDir = path.join(viewerDir, "public");
    const glossiaSource = path.join(process.cwd(), ".glossia");
    const glossiaDest = path.join(publicDir, "glossia");

    // Check if .glossia exists
    if (!fs.existsSync(glossiaSource)) {
      console.log(
        chalk.red("\n✖ No .glossia folder found in current directory"),
      );
      console.log(
        chalk.white(
          "Run: npx glossia generate --spec api.yaml --languages es,fr first\n",
        ),
      );
      process.exit(1);
    }

    // Read API spec languages
    const i18nConfig = JSON.parse(
      fs.readFileSync(path.join(glossiaSource, "i18n.json"), "utf-8"),
    );
    const sourceLocale = i18nConfig.locale.source;
    const targetLocales = i18nConfig.locale.targets;

    console.log(chalk.cyan("\n🚀 Starting Glossia viewer...\n"));

    // Copy .glossia to viewer/public
    if (fs.existsSync(glossiaDest)) {
      fs.rmSync(glossiaDest, { recursive: true });
    }
    fs.cpSync(glossiaSource, glossiaDest, { recursive: true });

    // Create index of available spec files
    const specI18nDir = path.join(glossiaSource, "i18n");
    const languages = fs.readdirSync(specI18nDir);
    const index = {};

    languages.forEach((lang) => {
      const langDir = path.join(specI18nDir, lang);
      const files = fs
        .readdirSync(langDir)
        .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
        .sort();

      index[lang] = files;
    });

    fs.writeFileSync(
      path.join(glossiaDest, "index.json"),
      JSON.stringify(index, null, 2),
    );

    // Create .env with API key if you have it
    const envPath = path.join(viewerDir, ".env");
    const envContent = process.env.LINGODOTDEV_API_KEY
      ? `LINGODOTDEV_API_KEY=${process.env.LINGODOTDEV_API_KEY}\n`
      : "";

    if (envContent) {
      fs.writeFileSync(envPath, envContent);
    }

    // Generate Vite config with Compiler
    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { lingoCompilerPlugin } from '@lingo.dev/compiler/vite'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: 'src',
      sourceLocale: '${sourceLocale}',
      targetLocales: ${JSON.stringify(targetLocales)},
      models: 'lingo.dev',
      dev: {
        usePseudotranslator: false,
      },
    }),
    react(),
    tailwindcss(),
  ],
})
`;

    fs.writeFileSync(
      path.join(viewerDir, "vite.config.generated.js"),
      viteConfigContent,
    );

    console.log(chalk.green("✔ Setup complete"));
    console.log(
      chalk.cyan(`\nStarting server on http://localhost:${options.port}\n`),
    );

    // Start server
    const server = spawn(
      "npm",
      [
        "run",
        "dev",
        "--",
        "--config",
        "vite.config.generated.js",
        "--port",
        options.port,
      ],
      {
        cwd: viewerDir,
        stdio: "inherit",
        shell: true,
      },
    );

    server.on("error", (err) => {
      console.log(chalk.red("Failed to start viewer:", err.message));
      process.exit(1);
    });
  });

program.parse();
