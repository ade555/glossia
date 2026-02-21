import { execSync, spawn } from "child_process";
import ora from "ora";
import chalk from "chalk";

const MAX_RETRIES = 2;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAuthenticated() {
  try {
    const output = execSync("npx lingo.dev@latest auth 2>&1", {
      encoding: "utf-8",
      stdio: "pipe",
    });
    console.log("Auth output:", output);
    return output.includes("Authenticated as");
  } catch (err) {
    console.log("Auth error:", err.stderr || err.stdout || err.message);
    return false;
  }
}

async function triggerLogin() {
  return new Promise((resolve, reject) => {
    const spinner = ora("Opening browser for authentication...").start();

    const login = spawn("npx", ["lingo.dev@latest", "login"], {
      stdio: "inherit",
      shell: true,
      windowsHide: false,
    });

    login.on("close", (code) => {
      if (code === 0) {
        spinner.succeed("Login complete");
        resolve();
      } else {
        spinner.fail("Login failed");
        reject(new Error("Login process exited with code " + code));
      }
    });

    login.on("error", (err) => {
      spinner.fail("Login failed");
      reject(err);
    });
  });
}

export async function checkAuth() {
  const spinner = ora(
    "Checking authentication (downloading dependencies on first run, this may take a minute)...",
  ).start();

  // Already authenticated, no need to login
  if (isAuthenticated()) {
    spinner.succeed(chalk.green("Authenticated"));
    return;
  }

  spinner.stop();

  // Not authenticated, trigger login once
  try {
    await triggerLogin();
  } catch (err) {
    console.log(chalk.red("✖ Login failed: " + err.message));
    process.exit(1);
  }

  // After login, wait and retry auth check up to MAX_RETRIES times
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await wait(2000); // wait 2 seconds before checking

    if (isAuthenticated()) {
      console.log(chalk.green("✔ Successfully authenticated"));
      return;
    }

    if (attempt < MAX_RETRIES) {
      console.log(
        chalk.yellow(
          `Auth check failed. Retrying (${attempt}/${MAX_RETRIES})...`,
        ),
      );
    }
  }

  console.log(chalk.red("✖ Authentication failed after login."));
  console.log(
    chalk.white(
      "Please run: npx lingo.dev@latest login manually and try again.",
    ),
  );
  process.exit(1);
}
