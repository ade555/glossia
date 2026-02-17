import { spawn } from "child_process";
import chalk from "chalk";
import ora from "ora";
import path from "path";

const DOCSLINGO_DIR = ".docslingo";
const MAX_RETRIES = 2;

async function runTranslation() {
  return new Promise((resolve, reject) => {
    const process = spawn("npx", ["lingo.dev@latest", "run"], {
      cwd: path.resolve(DOCSLINGO_DIR),
      shell: true,
      stdio: "inherit",
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Translation process exited with code ${code}`));
      }
    });

    process.on("error", (err) => {
      reject(err);
    });
  });
}

export async function translate(targets) {
  const spinner = ora("Translating...").start();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await runTranslation();
      spinner.succeed(chalk.green("Translation complete"));
      return;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        spinner.warn(
          chalk.yellow(
            `Translation failed. Retrying (${attempt}/${MAX_RETRIES})...`,
          ),
        );
      }
    }
  }

  spinner.fail(chalk.red("Translation failed after 2 attempts."));
  console.log(
    chalk.white("Please try running manually: npx lingo.dev@latest run"),
  );
  process.exit(1);
}
