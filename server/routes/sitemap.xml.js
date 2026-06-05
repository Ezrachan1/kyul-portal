import { subsidiaries } from '~/data/subsidiaries'
import { articles } from '~/data/news'
import { jobs } from '~/data/careers'
import { site } from '~/data/site'

export default defineEventHandler((event) => {
  const base = site.url.replace(/\/$/, '')

  const staticRoutes = [
    { loc: '/', priority: '1.0', freq: 'weekly' },
    { loc: '/about', priority: '0.8', freq: 'monthly' },
    { loc: '/subsidiaries', priority: '0.9', freq: 'monthly' },
    { loc: '/investors', priority: '0.8', freq: 'monthly' },
    { loc: '/news', priority: '0.7', freq: 'weekly' },
    { loc: '/careers', priority: '0.7', freq: 'weekly' },
    { loc: '/esg', priority: '0.6', freq: 'monthly' },
    { loc: '/contact', priority: '0.6', freq: 'yearly' },
    { loc: '/privacy', priority: '0.3', freq: 'yearly' },
  ]

  const dynamic = [
    ...subsidiaries.map((s) => ({ loc: `/subsidiaries/${s.slug}`, priority: '0.8', freq: 'monthly' })),
    ...articles.map((a) => ({ loc: `/news/${a.slug}`, priority: '0.6', freq: 'monthly' })),
    ...jobs.map((j) => ({ loc: `/careers/${j.slug}`, priority: '0.5', freq: 'weekly' })),
  ]

  const urls = [...staticRoutes, ...dynamic]
    .map(
      (u) =>
        `  <url>\n    <loc>${base}${u.loc}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
