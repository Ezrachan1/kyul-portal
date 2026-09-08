// Data store for the Kyul Group Portal via Nitro `useStorage` (fs locally,
// Cloudflare KV in production). Edge-safe — no node:crypto.
import { subsidiaries } from '~/data/subsidiaries'
import { group } from '~/data/group'
import { articles } from '~/data/news'
import { investors } from '~/data/investors'
import { seedInvoices } from '~/data/invoices'
import { site } from '~/data/site'

const store = () => useStorage('db')

export const uid = () => crypto.randomUUID()
export const slugify = (s) =>
  String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function hashPassword(password) {
  return await pbkdf2Derive(password)
}
export async function verifyPassword(password, salt, hash) {
  if (!salt || !hash) return false
  const r = await pbkdf2Derive(password, salt)
  return safeEqual(r.hash, hash)
}

const nowIso = () => new Date().toISOString()

// Seed passwords come from env (NUXT_SEED_ADMIN_PASSWORD / NUXT_SEED_SUPERADMIN_PASSWORD).
// If none is configured, a strong random one is generated and printed to the server log
// once — so there are NO plaintext default credentials living in the repo.
function randomPassword() {
  const b = crypto.getRandomValues(new Uint8Array(10))
  return 'Kyul-' + Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
}
function seedPassword(value, email) {
  const v = value && String(value).trim()
  if (v) return v
  const pw = randomPassword()
  console.warn(
    `[kyul:seed] No seed password set for ${email} — generated a temporary one: ${pw}\n` +
      `            Set NUXT_SEED_ADMIN_PASSWORD / NUXT_SEED_SUPERADMIN_PASSWORD, then change it after first sign-in.`,
  )
  return pw
}

// ── Seeds ──────────────────────────────────────────────────────────────────
const SEEDS = {
  users: async () => {
    const now = nowIso()
    const cfg = useRuntimeConfig()
    return [
      { id: uid(), name: 'Savlicon IT Support', email: 'it@savlicon.co.ke', role: 'super-admin', ...(await hashPassword(seedPassword(cfg.seedSuperadminPassword, 'it@savlicon.co.ke'))), active: true, system: true, createdAt: now },
      { id: uid(), name: 'Group Administrator', email: '', role: 'admin', ...(await hashPassword(seedPassword(cfg.seedAdminPassword, 'admin@kyulgroup.com'))), active: true, createdAt: now },
    ]
  },

  team: () => {
    const list = []
    group.leadership.forEach((m, i) =>
      list.push({ id: uid(), entity: 'group', name: '', title: m.name, initials: m.initials, bio: m.bio, photo: '', order: i }),
    )
    subsidiaries.forEach((s) =>
      s.team.forEach((m, i) =>
        list.push({ id: uid(), entity: s.slug, name: '', title: m.role, initials: m.initials, bio: m.bio, photo: '', order: i }),
      ),
    )
    return list
  },

  news: () => articles.map((a, i) => ({ id: a.slug, order: i, published: true, createdAt: nowIso(), ...a })),

  documents: () => {
    const now = nowIso()
    const docs = []
    investors.documents.forEach((d) =>
      docs.push({ id: uid(), title: d.title, type: d.type, size: d.size, category: d.category, restricted: false, date: d.date, fileUrl: `/docs/${slugify(d.title)}.pdf`, createdAt: now }),
    )
    investors.dataRoom.forEach((d) =>
      docs.push({ id: uid(), title: d.title, type: d.type, size: d.size, category: d.category, restricted: true, date: '2026-04', fileUrl: '', createdAt: now }),
    )
    const REAL = [
      { title: 'Kyul Company Profile (2016)', type: 'PDF', size: '18 MB', category: 'Corporate', restricted: false, fileUrl: '/docs/kyul-company-profile-2016.pdf' },
      { title: 'Kyul Engineering Company Profile', type: 'PDF', size: '12 MB', category: 'Corporate', restricted: false, fileUrl: '/docs/kyul-engineering-company-profile.pdf' },
      { title: 'Certificate of Incorporation (Kyul Engineering)', type: 'PDF', size: '365 KB', category: 'Governance', restricted: true, fileUrl: '/docs/incorporation-certificate-kyul-engineering.pdf' },
      { title: 'KRA PIN Certificate (Kyul Engineering)', type: 'PDF', size: '220 KB', category: 'Compliance', restricted: true, fileUrl: '/docs/kyul-engineering-pin.pdf' },
      { title: 'NCA Registration (Builders Works)', type: 'PDF', size: '428 KB', category: 'Compliance', restricted: true, fileUrl: '/docs/nca-builders.pdf' },
      { title: 'NCA Registration (Road Works)', type: 'PDF', size: '559 KB', category: 'Compliance', restricted: true, fileUrl: '/docs/nca-road-works.pdf' },
      { title: 'NCA Registration (Water Works)', type: 'PDF', size: '388 KB', category: 'Compliance', restricted: true, fileUrl: '/docs/nca-water-works.pdf' },
      { title: 'NSSF Compliance Certificate', type: 'PDF', size: '132 KB', category: 'Compliance', restricted: true, fileUrl: '/docs/nssf-certificate.pdf' },
      { title: 'Company Search (CR12)', type: 'PDF', size: '47 KB', category: 'Governance', restricted: true, fileUrl: '/docs/company-search-cr12.pdf' },
      { title: 'Project Compliance Certificate', type: 'PDF', size: '265 KB', category: 'Compliance', restricted: true, fileUrl: '/docs/project-compliance.pdf' },
    ]
    REAL.forEach((d) => docs.push({ id: uid(), date: '2026-04', createdAt: now, ...d }))
    return docs
  },

  portfolio: () => {
    const list = []
    subsidiaries.forEach((s) =>
      s.projects.forEach((p, i) => list.push({ id: uid(), entity: s.slug, order: i, ...p })),
    )
    return list
  },

  settings: () => ({
    hq: { ...site.hq },
    contact: { ...site.contact },
    social: site.social.map((s) => ({ ...s })),
    subsidiaryContacts: Object.fromEntries(subsidiaries.map((s) => [s.slug, { email: s.contact.email, web: s.contact.web }])),
  }),

  dataRoomCodes: () => [
    { id: uid(), code: 'KYUL-IR-2026', label: 'General investor access', active: true, createdAt: nowIso() },
  ],
  dataRoomRequests: () => [],
  submissions: () => [],
  invoices: () => JSON.parse(JSON.stringify(seedInvoices)),
  features: () => ({ finance: false, hr: false, procurement: false, plm: false, legal: false, kpis: false }),
  // Site Content overrides (see data/content-registry.js) — empty means "as authored".
  content: () => ({}),
}

// ── Generic access ───────────────────────────────────────────────────────
export async function readCol(name) {
  const s = store()
  let v = await s.getItem(name)
  if (v === null || v === undefined) {
    v = SEEDS[name] ? await SEEDS[name]() : []
    await s.setItem(name, v)
  } else if (typeof v === 'string') {
    try { v = JSON.parse(v) } catch { /* keep */ }
  }
  return v
}
export async function writeCol(name, val) {
  await store().setItem(name, val)
  return val
}

export async function listAll(name) {
  return await readCol(name)
}
export async function findOne(name, pred) {
  return (await readCol(name)).find(pred)
}
export async function insert(name, item) {
  const arr = await readCol(name)
  arr.unshift(item)
  await writeCol(name, arr)
  return item
}
export async function patchOne(name, id, patch) {
  const arr = await readCol(name)
  const i = arr.findIndex((x) => x.id === id)
  if (i < 0) return null
  arr[i] = { ...arr[i], ...patch, updatedAt: nowIso() }
  await writeCol(name, arr)
  return arr[i]
}
export async function removeOne(name, id) {
  const arr = await readCol(name)
  const next = arr.filter((x) => x.id !== id)
  await writeCol(name, next)
  return next.length !== arr.length
}
