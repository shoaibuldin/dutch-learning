// Writes a personalized pack to Cloudflare KV for one profile, so the app shows it.
// Usage:  node backend/tailor-write.mjs <profileId> <packJsonFile>
//
// The pack JSON shape (what the app reads from /api/state/pack:<id>):
//   { "generatedAt": "2026-06-30", "focusWords": ["de huur", ...],
//     "readings": [ { "type":"Letter", "ttl":"...", "text":"...",
//                     "q":[ {"q":"...","o":["..","..",".."],"a":0,"e":"..."} ] } ] }
import { execSync } from "node:child_process";
import fs from "node:fs";

const [, , id, file] = process.argv;
if (!id || !file) { console.error("usage: node backend/tailor-write.mjs <profileId> <packJsonFile>"); process.exit(1); }

const json = fs.readFileSync(file, "utf8");
const pack = JSON.parse(json); // validate
if (!Array.isArray(pack.readings) || !pack.readings.length) { console.error("pack has no readings"); process.exit(1); }

const tmp = "backend/.pack.tmp.json";
fs.writeFileSync(tmp, JSON.stringify(pack));
execSync(`npx wrangler kv key put "state:pack:${id}" --path "${tmp}" --binding DB --remote`, { stdio: "inherit", shell: true });
fs.unlinkSync(tmp);
console.log("✓ wrote personalized pack for " + id + " (" + pack.readings.length + " readings)");
