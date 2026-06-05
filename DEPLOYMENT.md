# Deploying the Kyul Group Portal — free on Cloudflare

This app runs **free** on Cloudflare's edge — the only thing you pay for is the **domain** (annually).
It uses **Cloudflare Pages** for hosting and **Workers KV** for the data store *and* file uploads. KV keeps
you on Cloudflare's **no-credit-card** free tier (unlike R2, which needs a card on file).

> The code already adapts itself: when Cloudflare sets `CF_PAGES=1` during the build, it switches to the
> `cloudflare-pages` preset and the KV bindings automatically. Locally it keeps using the file store, so
> `npm run dev` is unchanged.

---

## Free-tier limits (plenty for a corporate portal)

| Resource | Free allowance |
| --- | --- |
| Pages requests | Unlimited static; 100,000 Functions invocations/day |
| Workers KV reads | 100,000 / day |
| Workers KV writes | 1,000 / day (admin edits only — very low volume) |
| KV storage | 1 GB (uploads ≤ 25 MB each) |
| TLS, CDN, DDoS | Included, free |

---

## What you need

1. A **Cloudflare account** (free, no card).
2. A **domain** — register one through **Cloudflare Registrar** at wholesale price (this is the only cost),
   or use a domain you already own and add it to Cloudflare.
3. The project in a **Git repo** (GitHub/GitLab) for the easiest "push to deploy" flow.

---

## Step 1 — Create the two KV namespaces

In the Cloudflare dashboard → **Storage & Databases → KV → Create namespace**:

- Create one called **`kyul-db`** (the data store).
- Create one called **`kyul-uploads`** (uploaded photos & documents).

(You'll bind these to the names `KYUL_DB` and `KYUL_UPLOADS` in Step 3.)

## Step 2 — Create the Pages project

Dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick the repo, then set:

- **Framework preset:** None (or Nuxt)
- **Build command:** `npm run build`
- **Build output directory:** `dist`

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
  free TLS are configured automatically.

## Step 5 — Secure it

Sign in to `/dashboard` and:

- Change the seed passwords for `admin@kyulgroup.com` and `it@savlicon.co.ke`.
- Delete the demo data-room code (`KYUL-IR-2026`) and issue your own.

That's it — **$0/month hosting**, you only renew the domain each year.

---

## Alternative: deploy from your machine (no Git)

```bash
npm i -g wrangler
wrangler login

# create the namespaces (note the printed ids)
wrangler kv namespace create KYUL_DB
wrangler kv namespace create KYUL_UPLOADS
# paste the two ids into wrangler.toml

# build for Cloudflare and deploy
CF_PAGES=1 npm run build          # Windows PowerShell: $env:CF_PAGES='1'; npm run build
wrangler pages deploy dist --project-name kyul-group-portal
```

`wrangler.toml` in the project already declares the bindings and `pages_build_output_dir = "dist"`; just fill
in the namespace ids. Set the secret once with `wrangler pages secret put NUXT_SESSION_SECRET`.

---

## Notes & limits

- **Uploads** are capped at 25 MB (KV value limit). The seeded company PDFs are served as static Pages
  assets (no limit concern). If you later need large/many files, switch `KYUL_UPLOADS` to an **R2 bucket**
  (10 GB free, but R2 requires a card on file) and change `server/utils/uploads.js` to the R2 API.
- **Backups:** export the KV namespaces periodically (`wrangler kv key list` / `get`) — that's your data.
- **No KV?** The same build also runs on any **Node host** (`node .output/server/index.mjs`) using the file
  store — see *Node / VPS* below if you ever move off the edge.

---

## Appendix — Node / VPS hosting (if you ever leave the edge)

A normal `npm run build` (without `CF_PAGES`) produces a Node server in `.output/`, using the on-disk store
(`.data/`). Run it with `node .output/server/index.mjs` behind Nginx/PM2 on any small VPS, and set
`NUXT_SESSION_SECRET`. Keep `.data/` on a persistent disk and back it up. (This was the previous default; the
Cloudflare path above is the free option.)

---

© Kyul Group Inc. · Built by Savlicon · savlicon.co.ke
