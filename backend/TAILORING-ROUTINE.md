# AI tailoring on your Max plan (no API key)

This is the piece that makes the app *personal*: a scheduled Claude Code routine
runs on **your Max subscription**, looks at how each of you is actually doing, and
writes a fresh set of reading practice built from the exact words you each keep
getting wrong. The app then shows it automatically (the "✨ personalized" set).

There is **no API key** and nothing to pay per use — the AI work happens inside
Claude Code (which your Max plan already covers), not in the website.

## How it works
1. `node backend/tailor-progress.mjs` reads everyone's progress from the cloud
   (Cloudflare KV) and prints each person's 15 weakest words.
2. Claude writes 4 short A2 exam-style readings per person that pack in those weak
   words (each with 3 multiple-choice questions + explanations).
3. `node backend/tailor-write.mjs <profileId> pack.json` saves it back to the cloud.
4. Next time the app opens on any device, the personalized set appears.

## The scheduled prompt (runs e.g. every morning)
> Read backend/TAILORING-ROUTINE.md. Run `node backend/tailor-progress.mjs`.
> For each profile, write 4 Dutch A2 inburgering "Lezen" readings (Announcement /
> Letter / Sign / Form / Article), 45–85 words each, that naturally use that
> person's weakest words. Each reading: a title, then 3 Dutch multiple-choice
> questions (exactly one correct, "a" = 0-based index) and a one-line English
> explanation quoting the proof phrase. Save each as a pack JSON
> ({generatedAt, focusWords, readings:[...]}) and write it with
> `node backend/tailor-write.mjs <profileId> <packfile>`. Keep the Dutch correct
> and genuinely A2.

## Requirements
- The sync backend is deployed (see `SETUP-IN-CLAUDE-CODE.md` / `deploy.bat`), so
  there is progress in the cloud to read and a place to write packs.
- You're signed in to Cloudflare here (`npx wrangler login`), so the scripts can
  reach your KV store.

Set the schedule with the `/schedule` skill once sync is live (this folder is the
working directory). Suggested cadence: once a day, early morning.
