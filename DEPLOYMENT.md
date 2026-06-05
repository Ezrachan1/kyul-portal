# Deploying the Kyul Group Portal on Cloudflare

This app runs on Cloudflare's edge. It uses **Cloudflare Pages** for hosting and **Workers KV** for the data
store *and* file uploads.

> The code adapts itself: when Cloudflare sets `CF_PAGES=1` during the build, it switches to the
> `cloudflare-pages` preset and the KV bindings automatically. Locally it keeps using the file store, so
> `npm run dev` is unchanged.

---

## Service limits

| Resource | Allowance |
| --- | --- |
| Pages requests | Unlimited static; 100,000 Functions invocations/day |
| Workers KV reads | 100,000 / day |
| Workers KV writes | 1,000 / day (admin edits only — very low volume) |
| KV storage | 1 GB (uploads ≤ 25 MB each) |
| TLS, CDN, DDoS | Included |

---

## What you need

1. A **Cloudflare account**.
2. A **domain** — register one through **Cloudflare Registrar**, or use a domain you already own and add it
   to Cloudflare.
3. The project in a **Git repo** (GitHub/GitLab) for the easiest "push to deploy" flow.

---

## Step 1 — Create the two KV namespaces

In the Cloudflare dashboard → **Storage & Databases → KV → Create namespace**:

- Create one called **`kyul-db`** (the data store).
- Create one called **`kyul-uploads`** (uploaded photos & documents).

(You'll bind these to the names `KYUL_DB` and `KYUL_UPLOADS` in Step 3.)

## Step 2 — Create the Pages project

> ⚠️ **Use the Pages flow, not Workers.** Dashboard → **Workers & Pages → Create**, then pick the
> **Pages** tab → **Connect to Git**. Do **not** use the Workers "Import a repository" flow — that builds a
> Worker with a reserved `ASSETS` binding and fails with *"The name 'ASSETS' is reserved in Pages projects."*
> A Pages project auto-publishes a folder and has **no deploy command**.

Pick the repo, then set:

- **Framework preset:** None (or Nuxt)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Deploy command:** leave **empty** (Pages publishes `dist` automatically — never `npx wrangler deploy`)

A Pages build sets `CF_PAGES=1`, which makes the app build the Pages bundle (`dist/_worker.js`) and use KV.
If you ever build somewhere that doesn't set it, add a build variable `NITRO_PRESET=cloudflare-pages`.

## Step 3 — Bind KV + set environment variables

In the new Pages project → **Settings**:

**Functions → KV namespace bindings** — add two:

| Variable name | KV namespace |
| --- | --- |
| `KYUL_DB` | `kyul-db` |
| `KYUL_UPLOADS` | `kyul-uploads` |

**Functions → Compatibility** — set **Compatibility date** `2024-11-01` (or later) and add the
**Compatibility flag** `nodejs_compat`.

**Environment variables** (Production):

| Name | Value |
| --- | --- |
| `NUXT_SESSION_SECRET` | a long random string (mark **Encrypt**) — e.g. run `openssl rand -hex 32` |
| `NUXT_PUBLIC_SITE_URL` | `https://www.kyulgroup.com` (your domain) |

## Step 4 — Deploy & add the domain

- Trigger a deploy (push to the repo, or **Retry deployment**). The first request seeds the data store.
- **Custom domains → Set up a custom domain** → enter your domain. If the domain is on Cloudflare, DNS and
  TLS are configured automatically.

## Step 5 — Secure it

Sign in to `/dashboard` and:

- Change the seed passwords for `admin@kyulgroup.com` and `it@savlicon.co.ke`.
- Delete the demo data-room code (`KYUL-IR-2026`) and issue your own.

---

## Alternative: deploy from your machine (no Git)

```bash
npm i -g wrangler
wrangler login

# create the namespaces (once), then bind them in the dashboard (Step 3)
wrangler kv namespace create KYUL_DB
wrangler kv namespace create KYUL_UPLOADS

# build for Cloudflare and deploy
CF_PAGES=1 npm run build          # Windows PowerShell: $env:CF_PAGES='1'; npm run build
wrangler pages deploy dist --project-name kyul-group-portal
```

KV bindings, the compatibility flag, and the build output directory all come from the Pages dashboard
(Steps 2–3). This repo intentionally ships **no `wrangler.toml`**: when one is present, Cloudflare uses it as
the sole source of truth and ignores the dashboard bindings (and it would require real namespace IDs committed
to git). Set the session secret once with `wrangler pages secret put NUXT_SESSION_SECRET`.

---

## Notes & limits

- **Uploads** are capped at 25 MB (KV value limit). The seeded company PDFs are served as static Pages
  assets (no limit concern). If you later need large/many files, switch `KYUL_UPLOADS` to an **R2 bucket**
  (10 GB storage; R2 requires a card on file) and change `server/utils/uploads.js` to the R2 API.
- **Backups:** export the KV namespaces periodically (`wrangler kv key list` / `get`) — that's your data.
- **No KV?** The same build also runs on any **Node host** (`node .output/server/index.mjs`) using the file
  store — see *Node / VPS* below if you ever move off the edge.

---

## Troubleshooting

- **`The name 'ASSETS' is reserved in Pages projects` (deploy fails after a successful build).**
  The project was created as a **Workers** build (it runs `npx wrangler deploy` and emits `.output/.../wrangler.json`
  with an `ASSETS` binding) instead of a **Pages** project. Recreate it via the **Pages** tab (Step 2): build
  output directory `dist`, no deploy command. Pages publishes `dist/` directly and never uses an `ASSETS` binding.
- **`npm ci` fails with `EUSAGE ... lock file ... does not satisfy`.** `package.json` and `package-lock.json`
  drifted. Run `npm install` locally and commit the updated `package-lock.json`.
- **Build can't find the output / publishes the wrong files.** Confirm **Build output directory = `dist`**.
- **App deploys but 500s at runtime / data doesn't persist.** The KV bindings (`KYUL_DB`, `KYUL_UPLOADS`) or the
  `nodejs_compat` flag are missing — re-check Step 3. Without them the store can't initialise.

---

## Appendix — Node / VPS hosting

A normal `npm run build` (without `CF_PAGES`) produces a Node server in `.output/`, using the on-disk store
(`.data/`). Run it with `node .output/server/index.mjs` behind Nginx/PM2 on any VPS, and set
`NUXT_SESSION_SECRET`. Keep `.data/` on a persistent disk and back it up.

---

© Kyul Group Inc. · Built by Savlicon · savlicon.co.ke
