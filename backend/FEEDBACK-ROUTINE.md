# AI feedback on your Speaking & Writing — on your Max plan (no API key)

When you tap **"🤖 Ask Claude to grade (Max)"** on a Speaking task (or a Writing
task), your answer is saved to the cloud. A Claude Code routine running on **your
Max subscription** then reads it, grades it, and writes feedback back into the
app — it appears under that task. No API key, no per-use cost.

## How a grading run works
1. `node backend/list-answers.mjs` — prints every profile's pending answers
   (the Dutch prompt + what you said/wrote).
2. Claude grades each one against A2 criteria: did you cover every required point
   (adequacy), is it understandable, and the main grammar/vocabulary/pronunciation
   points to fix — kept short and encouraging.
3. Save the feedback as JSON `{ "<key>": { "feedback": "…", "gradedAt": "…" } }`
   and run `node backend/write-feedback.mjs <profileId> feedback.json`.
4. Next time the app opens, the feedback shows under that task.

## The scheduled prompt (run e.g. daily)
> Read backend/FEEDBACK-ROUTINE.md. Run `node backend/list-answers.mjs`. For each
> pending answer, write short A2 feedback: (1) did it cover all required points,
> (2) is it clear, (3) the 1-3 most useful corrections (grammar/word order/word
> choice), ending with one encouraging line. Save as feedback JSON and write it
> back with `node backend/write-feedback.mjs <profileId> <file>`.

## Requirements
- Sync backend deployed (KV) and you're signed in to Cloudflare here (`npx wrangler login`).
- You have tapped "Ask Claude to grade" on at least one task (so there's something to grade).

Set the cadence with the `/schedule` skill once you're using it, or just ask
Claude Code to "grade my speaking answers" whenever you've recorded some.
