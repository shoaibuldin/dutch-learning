// Lists every profile's pending Speaking/Writing answers awaiting Claude feedback.
// The scheduled/manual Claude routine runs this, grades each answer, then writes
// feedback back with write-feedback.mjs. Run from the project root:
//   node backend/list-answers.mjs
import { execSync } from "node:child_process";
const kvGet = (k) => {
  try { return execSync(`npx wrangler kv key get "${k}" --binding DB --remote`, { encoding: "utf8", shell: true }); }
  catch { return ""; }
};
let idx = { profiles: {} };
try { idx = JSON.parse(kvGet("state:__index__")); } catch {}
const out = [];
for (const [id, info] of Object.entries(idx.profiles || {})) {
  let data;
  try { data = JSON.parse(kvGet("state:" + id)); } catch { continue; }
  const fb = data.feedback || {};
  const graded = (() => { try { return JSON.parse(kvGet("state:fb:" + id)) || {}; } catch { return {}; } })();
  const pending = Object.entries(fb)
    .filter(([k, v]) => v && v.status === "pending" && !graded[k])   // not already graded
    .map(([k, v]) => ({ key: k, mode: v.mode, type: v.type, promptEn: v.promptEn, promptNl: v.promptNl, answer: v.answer }));
  if (pending.length) out.push({ id, name: info.name, pending });
}
console.log(JSON.stringify(out, null, 2));
if (!out.length) console.error("(no pending answers)");
