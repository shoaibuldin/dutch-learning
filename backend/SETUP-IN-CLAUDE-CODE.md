# Add cross-device sync + private login (do this in Claude Code)

This turns the app into a synced, password-protected site on **your own**
Cloudflare — no third-party storage, no API key. Your progress then follows
you and your wife across every device.

You don't need to understand the commands — open Claude Code in this folder
and tell it: **"Set up the Cloudflare sync backend using the files in backend/."**
It will run these steps for you:

## One-time setup
1. Install Node.js (https://nodejs.org) if it's not already installed.
2. In a terminal: `npm install -g wrangler`
3. `wrangler login`  → approve in the browser (connects to YOUR Cloudflare).

## Deploy (Claude Code does this)
4. Create the storage:  `wrangler kv namespace create DB`
   → copy the printed `id` into `wrangler.jsonc`.
5. Set your private login:
   `wrangler secret put AUTH_USER`   (type a username)
   `wrangler secret put AUTH_PASS`   (type a password)
6. Put the app where the Worker serves it:  copy `index.html` into `public/`.
7. Add the small front-end sync client to `index.html` (Claude Code will write
   this — it calls `/api/state/<profile>` to load on open and save on change).
8. `wrangler deploy`

## Result
- Open https://dutch-learning.<your>.workers.dev → it asks for your username +
  password once (private), then loads.
- Both profiles' progress is stored in the cloud and synced across PC + phones.

## Files here
- `worker.js`      — the backend (serving + sync API + Basic Auth). Goes in `src/`.
- `wrangler.jsonc` — Cloudflare config (paste the KV id after step 4).
