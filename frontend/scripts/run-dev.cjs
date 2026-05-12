/**
 * Avvio locale `next dev`: carica `.env` poi `local.env` (stesso ordine del backend Docker “localhost”).
 * `local.env` sovrascrive le chiavi duplicate. Argomenti extra vanno a Next (es. `npm run dev -- -p 3001`).
 */
const { existsSync } = require("fs");
const { resolve } = require("path");
const { spawn } = require("child_process");
const dotenv = require("dotenv");

const root = resolve(__dirname, "..");

if (existsSync(resolve(root, ".env"))) {
  dotenv.config({ path: resolve(root, ".env") });
}
if (existsSync(resolve(root, "local.env"))) {
  dotenv.config({ path: resolve(root, "local.env"), override: true });
}

const nextCli = resolve(root, "node_modules", "next", "dist", "bin", "next");
if (!existsSync(nextCli)) {
  console.error("[run-dev] Esegui prima npm install nella cartella frontend.");
  process.exit(1);
}

const extra = process.argv.slice(2);
const child = spawn(process.execPath, [nextCli, "dev", ...extra], {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
