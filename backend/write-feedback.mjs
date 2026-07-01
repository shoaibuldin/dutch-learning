// Writes Claude's feedback for a profile's answers back to Cloudflare KV, so the
// app shows it (under each Speaking/Writing task). Usage:
//   node backend/write-feedback.mjs <profileId> <feedbackJsonFile>
// feedbackJsonFile shape: { "<answerKey>": { "feedback": "…", "gradedAt": "2026-07-01" }, ... }
import { execSync } from "node:child_process";
import fs from "node:fs";

const [, , id, file] = process.argv;
if (!id || !file) { console.error("usage: node backend/write-feedback.mjs <profileId> <feedbackJsonFile>"); process.exit(1); }

const add = JSON.parse(fs.readFileSync(file, "utf8"));
const kvGet = (k) => { try { return execSync(`npx wrangler kv key get "${k}" --binding DB --remote`, { encoding: "utf8", shell: true }); } catch { return ""; } };
let cur = {};
try { cur = JSON.parse(kvGet("state:fb:" + id)) || {}; } catch {}
Object.assign(cur, add);

const tmp = "backend/.fb.tmp.json";
fs.writeFileSync(tmp, JSON.stringify(cur));
execSync(`npx wrangler kv key put "state:fb:${id}" --path "${tmp}" --binding DB --remote`, { stdio: "inherit", shell: true });
fs.unlinkSync(tmp);
console.log("✓ wrote feedback for " + id + " (" + Object.keys(add).length + " item(s))");
