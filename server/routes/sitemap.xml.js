import { subsidiaries } from '~/data/subsidiaries'
import { jobs } from '~/data/careers'
import { site } from '~/data/site'

// <lastmod> wants a W3C date; accepts 'YYYY-MM-DD' or full ISO strings, else omit.
const w3cDate = (d) => {
  const s = String(d || '').slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

export default defineEventHandler(async (event) => {
  // Same source as canonical/OG: NUXT_PUBLIC_SITE_URL (falls back to data/site.js).
  const base = (useRuntimeConfig(event).public.siteUrl || site.url).replace(/\/$/, '')

  // News comes from the CMS store (the same collection /api/news serves) — the
  // static seed only reflects first-boot content. Unpublished articles are excluded.
  const articles = (await listAll('news')).filter((a) => a.published !== false)
  const newestArticle = articles
    .map((a) => w3cDate(a.updatedAt || a.date))
    .filter(Boolean)
    .sort()
    .pop()

  const staticRoutes = [
    { loc: '/', priority: '1.0', freq: 'weekly' },
    { loc: '/about', priority: '0.8', freq: 'monthly' },
    { loc: '/subsidiaries', priority: '0.9', freq: 'monthly' },
    { loc: '/investors', priority: '0.8', freq: 'monthly' },
    { loc: '/news', priority: '0.7', freq: 'weekly', lastmod: newestArticle },
    { loc: '/careers', priority: '0.7', freq: 'weekly' },
    { loc: '/esg', priority: '0.6', freq: 'monthly' },
    { loc: '/contact', priority: '0.6', freq: 'yearly' },
    { loc: '/privacy', priority: '0.3', freq: 'yearly' },
  ]

  const dynamic = [
    ...subsidiaries.map((s) => ({ loc: `/subsidiaries/${s.slug}`, priority: '0.8', freq: 'monthly' })),
    ...articles.map((a) => ({
      loc: `/news/${a.slug || a.id}`,
      priority: '0.6',
      freq: 'monthly',
      lastmod: w3cDate(a.updatedAt || a.date),
    })),
    ...jobs.map((j) => ({ loc: `/careers/${j.slug}`, priority: '0.5', freq: 'weekly', lastmod: w3cDate(j.posted) })),
  ]

  const urls = [...staticRoutes, ...dynamic]
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${base}${u.loc}</loc>${lastmod}\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
