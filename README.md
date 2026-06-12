# Kyul Group Inc. - Public Corporate Portal

**Layer 1 of the Kyul Group Unified Digital Ecosystem.**
Delivered by **Savlicon Technology & Digital Solutions** · [savlicon.co.ke](https://savlicon.co.ke)
Reference: `SAV-KGI-2025-001`

A professional, SEO-optimised, multi-entity web presence that establishes Kyul Group Inc. as the
definitive parent brand, with dedicated sub-portals for each of the six operating companies — plus a
secure, **role-based Group Portal** (admin console) backed by a lightweight Nitro API, so the team can
manage invoices, news, leadership, documents, the data room, submissions and user accounts.

---

## What's included

**Public corporate portal**
- **Group hub** — homepage, narrative, vision/mission, values, sectors, the "Concept to Cashflow" model.
- **About** — governance & ownership structure, leadership, history, why-Kyul.
- **Six subsidiary sub-portals** (`/subsidiaries/[slug]`) — Engineering, Ventures, Enterprises, Projects,
  Investment, Holdings — each with its own brand accent, logo, services, portfolio, team and RFP form.
- **Investor Relations** — financial highlights, performance charts, document library (real PDFs), and a
  **secure data room** behind an access gate.
- **News & Insights** hub (with category filters) and article pages.
- **Careers** portal with role listings, filters and an application form.
- **Sustainability / ESG**, **Contact** (with map + company directory), and **Privacy & Cookies**.

**Group Portal** (`/dashboard`) — secure, role-based admin console
- **Overview** — KPIs, Group turnover chart, invoice-status donut, revenue-vs-target by company, compliance RAG (finance figures shown only to finance roles).
- **Invoices** — list, filter, search, create (live VAT totals), view, change status, print / save-as-PDF, delete.
- **Inbox** — every contact enquiry, RFP and job application received from the website, with triage status and reply.
- **News & Insights** — full CMS (create/edit/publish) that drives the public `/news`.
- **Team & Leadership** — add real names, photos and bios per company; drives the public team sections.
- **Documents** — manage the public library and the secure data room (with file upload).
- **Data Room** — generate/disable access codes and handle investor access requests.
- **Users & Roles** — create accounts and assign roles.
- **System & Modules** *(super-admin only)* — toggle future modules on/off.

**Roles:** `super-admin` (Savlicon/IT — hidden from the company admin), `admin`, `editor`, `finance`, `viewer`.

> **Built-in accounts** (passwords are **not** stored in the repo):
> · Admin — `admin@kyulgroup.com`
> · Super-admin (Savlicon/IT) — `it@savlicon.co.ke`
> · Investor data-room demo code — `KYUL-IR-2026` (admins can generate their own).
>
> Passwords are read on first run from `NUXT_SEED_ADMIN_PASSWORD` / `NUXT_SEED_SUPERADMIN_PASSWORD`
> (see `.env.example`). If unset, a random one is generated and printed to the server log once.
> **Change them after first sign-in.**

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | **Nuxt 3** (Vue 3, SSR for SEO) |
| Styling | **Tailwind CSS** + a custom Kyul design system |
| Backend | **Nitro** server routes (`server/api/**`) + file storage via `useStorage` (unstorage `fs`, persisted to `.data/db`) |
| Auth | scrypt-hashed passwords + signed httpOnly cookie sessions; role guards |
| Icons | `@nuxt/icon` (Lucide) |
| State | Nuxt `useState` composables |
| Charts | Bespoke SVG components (area, bars, donut, sparkline) |
| Fonts | Fraunces (display) + Inter (UI) |

> The proposal's Pinia was replaced with Nuxt's native `useState` for SSR robustness. The file-based store
> is ideal for a single-node deployment; for Cloudflare/serverless, swap the `nitro.storage` driver for a
> KV/D1 binding. The heavier ERP stack (NestJS, PostgreSQL, Odoo, AWS) belongs to **Layer 2**.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build    # server build  → .output
npm run preview  # preview the production build
# or
npm run generate # static build (Cloudflare Pages, per the SOW)
```

Requires Node.js 18+ (developed on Node 22). **Deploying it?** See [DEPLOYMENT.md](DEPLOYMENT.md) for
recommended platforms and step-by-step guides.

---

## Project structure

```
kyul-portal/
├─ assets/css/main.css      # design-system base, utilities, print styles
├─ components/              # KyulMark/Wordmark, header/footer, cards, charts, forms…
├─ composables/             # useAuth, useInvoices (+ invoiceTotals)
├─ data/                    # seed content: group, subsidiaries, news, careers, investors, invoices…
├─ layouts/                 # default (public) + dashboard (admin)
├─ middleware/              # auth.global.js (session + role guards for /dashboard)
├─ pages/                   # public pages + /dashboard/** (admin console)
├─ public/                  # logos, favicons, og-image, /docs (seeded PDFs)
├─ server/
│  ├─ api/                  # auth, submissions, news, team, portfolio, documents, data-room, users, invoices, settings, features, upload
│  ├─ routes/               # sitemap.xml, /uploads/** (serves admin uploads)
│  └─ utils/                # db.js (storage + CRUD + hashing), auth.js (sessions + guards)
├─ .data/                   # git-ignored, persistent: db/ (store, auto-seeded) + uploads/ (admin uploads)
├─ nuxt.config.ts
└─ tailwind.config.ts
```

## Brand & logos

Brand: deep forest-teal green + brushed gold + warm ivory. Subsidiary logos live in `public/logos/`
(`*-t.png` are background-removed for light surfaces; the premium renders are framed on their native
backgrounds). Favicons and the social card were generated into `public/`.

## SEO

SSR on all public pages, per-page meta via `useSeoMeta`, Open Graph image, `Corporation` JSON-LD,
`robots.txt` and a dynamic `/sitemap.xml`.

---

## Roadmap — Layer 2 (Group Command Centre)

The internal ERP and executive intelligence platform — IAM/RBAC, Finance, HR & Payroll, Procurement,
Project Lifecycle Management, Legal & Compliance, and the Executive KPI Command Centre — will be built
when the client is ready, on the architecture defined in the Technical Proposal.

---

© 2026 Kyul Group Inc. · Built by **Savlicon** · [savlicon.co.ke](https://savlicon.co.ke)
