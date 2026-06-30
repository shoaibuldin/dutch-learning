// One-command deploy for the Dutch A2 app with cross-device sync + private login.
// Prereq (once): a free Cloudflare account, and `npx wrangler login` in this folder.
// Then: double-click deploy.bat  (or run: node deploy.mjs)
//
// It will: create the KV store, write its id into wrangler.jsonc, ask you for a
// username + password (your private login), copy the app into ./public, and deploy.

import { execSync } from "node:child_process";
import fs from "node:fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const run = (cmd, opts = {}) =>
  execSync(cmd, { encoding: "utf8", shell: true, ...opts });
const tryRun = (cmd, opts = {}) => {
  try { return { ok: true, out: run(cmd, opts) }; }
  catch (e) { return { ok: false, out: (e.stdout || "") + (e.stderr || "") + (e.message || "") }; }
};

console.log("\n=== Dutch A2 — sync deploy ===\n");

// 1) Logged in?
const who = tryRun("npx wrangler whoami");
if (!who.ok || /not authenticated|run `wrangler login`/i.test(who.out)) {
  console.log("You are not logged in to Cloudflare yet.\n");
  console.log("  1. Run:  npx wrangler login");
  console.log("  2. Approve in the browser window that opens.");
  console.log("  3. Then run this again (double-click deploy.bat).\n");
  process.exit(1);
}
console.log("✓ Logged in to Cloudflare.\n");

// 2) Ensure the KV store exists and get its id.
let kvId = null;
const cfg = fs.readFileSync("wrangler.jsonc", "utf8");
const already = cfg.match(/"id":\s*"([0-9a-f]{32})"/);
if (already && already[1] !== "PASTE_KV_NAMESPACE_ID_HERE") {
  kvId = already[1];
  console.log("✓ KV store already configured (" + kvId.slice(0, 8) + "…).\n");
} else {
  console.log("Creating cloud storage (KV namespace)…");
  const create = tryRun('npx wrangler kv namespace create DB');
  let m = create.out.match(/id\s*=\s*"([0-9a-f]{32})"/) || create.out.match(/"id":\s*"([0-9a-f]{32})"/);
  if (!m) {
    // Maybe it already exists — find it in the list.
    const list = tryRun("npx wrangler kv namespace list");
    try {
      const arr = JSON.parse(list.out.slice(list.out.indexOf("[")));
      const found = arr.find((n) => /(-|^)DB$/.test(n.title) || n.title.endsWith("DB"));
      if (found) m = [null, found.id];
    } catch {}
  }
  if (!m) { console.error("Could not create/find the KV store. Output:\n" + create.out); process.exit(1); }
  kvId = m[1];
  fs.writeFileSync("wrangler.jsonc", cfg.replace("PASTE_KV_NAMESPACE_ID_HERE", kvId));
  console.log("✓ Storage ready (" + kvId.slice(0, 8) + "…) and saved to wrangler.jsonc.\n");
}

// 3) Private login (Basic Auth) — ask for username + password.
const rl = readline.createInterface({ input, output });
console.log("Set your private login (used by both of you on every device):");
let user = (await rl.question("  Username: ")).trim();
let pass = (await rl.question("  Password: ")).trim();
await rl.close();
if (!user || !pass) { console.error("Username and password are required."); process.exit(1); }

console.log("\nSaving your login securely to Cloudflare…");
const sU = tryRun('npx wrangler secret put AUTH_USER', { input: user + "\n", stdio: ["pipe", "pipe", "pipe"] });
const sP = tryRun('npx wrangler secret put AUTH_PASS', { input: pass + "\n", stdio: ["pipe", "pipe", "pipe"] });
if (!sU.ok || !sP.ok) {
  console.error("Could not save secrets:\n" + sU.out + "\n" + sP.out);
  process.exit(1);
}
console.log("✓ Login saved.\n");

// 4) Copy the app into ./public so the Worker serves it.
fs.mkdirSync("public", { recursive: true });
fs.copyFileSync("index.html", "public/index.html");
console.log("✓ App copied into ./public.\n");

// 5) Deploy.
console.log("Deploying…\n");
try {
  execSync("npx wrangler deploy", { stdio: "inherit", shell: true });
} catch {
  console.error("\nDeploy failed — see the error above.");
  process.exit(1);
}

console.log("\n=== Done ===");
console.log("Open the https://dutch-learning.<your-subdomain>.workers.dev URL printed above.");
console.log("It asks for the username + password once, then syncs across all your devices.");
console.log("\nTo update later after changing the app: double-click deploy.bat again.\n");
