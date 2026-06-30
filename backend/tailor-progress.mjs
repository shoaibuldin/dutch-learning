// Reads every profile's progress from Cloudflare KV and prints each person's
// weakest words as JSON. No AI here — pure, deterministic. The scheduled Claude
// routine runs this, then writes a personalized reading pack with tailor-write.mjs.
//
// Run from the project root:  node backend/tailor-progress.mjs
import { execSync } from "node:child_process";
const kvGet = (key) => {
  try { return execSync(`npx wrangler kv key get "${key}" --binding DB --remote`, { encoding: "utf8", shell: true }); }
  catch { return ""; }
};
const START_EF = 2.5, MASTER_IVL = 21;
const isMastered = (e) => e.status === "retired" || (e.status === "review" && (e.ivl || 0) >= MASTER_IVL);

let idx = { profiles: {} };
try { idx = JSON.parse(kvGet("state:__index__")); } catch {}

const result = {};
for (const [id, info] of Object.entries(idx.profiles || {})) {
  let data;
  try { data = JSON.parse(kvGet("state:" + id)); } catch { continue; }
  const srs = data.srs || {};
  const weak = Object.keys(srs)
    .filter((w) => !isMastered(srs[w]))
    .sort((a, b) =>
      ((srs[b].lapses || 0) - (srs[a].lapses || 0)) ||
      ((srs[a].ef || START_EF) - (srs[b].ef || START_EF)) ||
      ((srs[a].ivl || 0) - (srs[b].ivl || 0)))
    .slice(0, 15);
  result[id] = { name: info.name, seen: Object.keys(srs).length, weakWords: weak };
}
console.log(JSON.stringify(result, null, 2));
