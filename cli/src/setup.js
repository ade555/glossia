import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

const DOCSLINGO_DIR = ".docslingo";
const I18N_DIR = path.join(DOCSLINGO_DIR, "i18n");
const EN_DIR = path.join(I18N_DIR, "en");

export async function setup(apiSpecPath, sourceLanguage) {
  const spinner = ora("Setting up project...").start();

  try {
    // Resolve the spec file path
    const resolvedSpecPath = path.resolve(apiSpecPath);

    // Check if specfication file exists
    if (!fs.existsSync(resolvedSpecPath)) {
      spinner.fail(chalk.red(`Spec file not found: ${apiSpecPath}`));
      process.exit(1);
    }

    const sourceDir = path.join(I18N_DIR, sourceLanguage);

    // Create folder structure if it doesn't exist
    if (!fs.existsSync(DOCSLINGO_DIR)) {
      fs.mkdirSync(sourceDir, { recursive: true });
      spinner.text = "Created .docslingo folder structure";
    }

    // Always update the spec file
    const destinationPath = path.join(sourceDir, "api.yaml");
    fs.copyFileSync(resolvedSpecPath, destinationPath);

    spinner.succeed(chalk.green("Project setup complete"));
  } catch (err) {
    spinner.fail(chalk.red("Setup failed: " + err.message));
    process.exit(1);
  }
}
