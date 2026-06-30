// Dutch A2 — Reading Sprint :: sync + private-login Worker
// Serves the app, stores each profile's progress in Cloudflare KV (cross-device
// sync), and protects everything with HTTP Basic Auth (your private login).
//
// Bindings (see wrangler.jsonc + secrets):
//   ASSETS    -> static assets (index.html in ./public)
//   DB        -> KV namespace for saved progress + AI packs
//   AUTH_USER -> secret: login username
//   AUTH_PASS -> secret: login password
//
// Sync API (all behind Basic Auth):
//   GET/PUT /api/state/__index__    profile list  {profiles:{id:{name}}}
//   GET/PUT /api/state/<profileId>  that profile's data blob
//   GET/PUT /api/state/pack:<id>    AI-tailored pack for a profile
//                                   (written by the scheduled Claude routine)

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Dutch A2", charset="UTF-8"' },
  });
}

function checkAuth(request, env) {
  const h = request.headers.get("Authorization") || "";
  if (!h.startsWith("Basic ")) return false;
  let decoded;
  try { decoded = atob(h.slice(6)); } catch { return false; }
  const i = decoded.indexOf(":");
  const user = decoded.slice(0, i);
  const pass = decoded.slice(i + 1);
  return user === env.AUTH_USER && pass === env.AUTH_PASS;
}

export default {
  async fetch(request, env) {
    // Private login gate for the whole site.
    if (!checkAuth(request, env)) return unauthorized();

    const url = new URL(request.url);

    // Sync API: /api/state/<key>  (key may contain a "pack:" prefix)
    if (url.pathname.startsWith("/api/state/")) {
      const key = "state:" + decodeURIComponent(url.pathname.slice("/api/state/".length));
      if (request.method === "GET") {
        const v = await env.DB.get(key);
        return new Response(v || "null", {
          headers: { "content-type": "application/json", "cache-control": "no-store" },
        });
      }
      if (request.method === "PUT") {
        const body = await request.text();
        await env.DB.put(key, body);
        return new Response('{"ok":true}', { headers: { "content-type": "application/json" } });
      }
      return new Response("Method not allowed", { status: 405 });
    }

    // Everything else: serve the static app.
    return env.ASSETS.fetch(request);
  },
};
