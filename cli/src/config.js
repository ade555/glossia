import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

const DOCSLINGO_DIR = ".docslingo";

export async function generateConfig(languages) {
  const spinner = ora("Generating config...").start();

  try {
    // Parse languages string into array
    // Handles both comma and space separated: "es,fr,de" or "es fr de"
    const targets = languages
      .split(/[\s,]+/)
      .map((lang) => lang.trim())
      .filter(Boolean);

    if (targets.length === 0) {
      spinner.fail(chalk.red("No target languages provided"));
      process.exit(1);
    }

    const config = {
      $schema: "https://lingo.dev/schema/i18n.json",
      version: "1.12",
      locale: {
        source: "en",
        targets,
      },
      buckets: {
        yaml: {
          include: ["i18n/[locale]/*.yaml"],
        },
      },
    };

    const configPath = path.join(DOCSLINGO_DIR, "i18n.json");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    spinner.succeed(chalk.green(`Config generated for: ${targets.join(", ")}`));
    return targets;
  } catch (err) {
    spinner.fail(chalk.red("Config generation failed: " + err.message));
    process.exit(1);
  }
}
