import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

const TRANSSPEC_DIR = ".trans-spec";
const I18N_DIR = path.join(TRANSSPEC_DIR, "i18n");

export async function setup(specPath, sourceLanguage) {
  const spinner = ora("Setting up project...").start();

  try {
    const resolvedSpecPath = path.resolve(specPath);

    if (!fs.existsSync(resolvedSpecPath)) {
      spinner.fail(chalk.red(`Spec file not found: ${specPath}`));
      process.exit(1);
    }

    // Use source language folder
    const sourceDir = path.join(I18N_DIR, sourceLanguage);

    if (!fs.existsSync(TRANSSPEC_DIR)) {
      fs.mkdirSync(sourceDir, { recursive: true });
      spinner.text = "Created .trans-spec folder structure";
    }

    // Preserve the original filename
    const originalFilename = path.basename(resolvedSpecPath);
    const destPath = path.join(sourceDir, originalFilename);

    fs.copyFileSync(resolvedSpecPath, destPath);

    spinner.succeed(chalk.green("Project setup complete"));
  } catch (err) {
    spinner.fail(chalk.red("Setup failed: " + err.message));
    process.exit(1);
  }
}
