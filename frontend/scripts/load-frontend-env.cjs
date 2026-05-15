/**
 * Caricamento env frontend:
 * - branch `main` (e sviluppo): `.env` + override `local.env` se esiste
 * - branch `production` / build immagine: solo file standard Next (`.env`, …), mai `local.env`
 *
 * Override esplicito: FRONTEND_USE_LOCAL_ENV=1 | 0
 * Branch forzato (CI): GIT_BRANCH=main|production
 */
const { existsSync } = require("fs");
const { resolve } = require("path");
const { execSync } = require("child_process");
const dotenv = require("dotenv");

const PRODUCTION_BRANCHES = new Set(["production", "prod"]);

function getGitBranch(root) {
  const fromEnv = process.env.GIT_BRANCH?.trim();
  if (fromEnv) return fromEnv;
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * @param {string} root cartella `frontend/`
 */
function shouldUseLocalEnv(root) {
  const flag = process.env.FRONTEND_USE_LOCAL_ENV?.trim().toLowerCase();
  if (flag === "0" || flag === "false" || flag === "no") return false;
  if (flag === "1" || flag === "true" || flag === "yes") return true;

  const branch = getGitBranch(root);
  if (branch && PRODUCTION_BRANCHES.has(branch.toLowerCase())) return false;
  if (branch === "main") return existsSync(resolve(root, "local.env"));

  // Altri branch di feature: usa local.env se presente (sviluppo locale)
  return existsSync(resolve(root, "local.env"));
}

/**
 * @param {string} [root]
 * @returns {{ useLocal: boolean, branch: string | null }}
 */
function loadFrontendEnv(root = resolve(__dirname, "..")) {
  const localEnvFile = resolve(root, "local.env");
  const useLocal = shouldUseLocalEnv(root);
  const branch = getGitBranch(root);

  try {
    const { loadEnvConfig } = require("@next/env");
    loadEnvConfig(root);
  } catch {
    const envFile = resolve(root, ".env");
    if (existsSync(envFile)) {
      dotenv.config({ path: envFile });
    }
  }

  if (useLocal && existsSync(localEnvFile)) {
    dotenv.config({ path: localEnvFile, override: true });
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[env] local.env applicato (branch: ${branch ?? "?"})`
      );
    }
  } else if (existsSync(localEnvFile) && !useLocal) {
    console.log(
      `[env] local.env ignorato — uso solo .env (branch: ${branch ?? "?"}, FRONTEND_USE_LOCAL_ENV=${process.env.FRONTEND_USE_LOCAL_ENV ?? "auto"})`
    );
  }

  return { useLocal, branch };
}

module.exports = { loadFrontendEnv, shouldUseLocalEnv, getGitBranch };
