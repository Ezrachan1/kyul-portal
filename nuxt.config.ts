// Kyul Group Inc. — Public Corporate Portal (Layer 1)
// Delivered by Savlicon Technology & Digital Solutions — savlicon.co.ke
// (server routes: /sitemap.xml)

// This app deploys to Cloudflare PAGES (not a Workers project — a Workers build emits an
// `ASSETS` binding, which Pages reserves, and would also skip the KV store below).
// A Pages build sets CF_PAGES=1 automatically; to force it anywhere else (or to be explicit),
// set the build env var NITRO_PRESET=cloudflare-pages. Both paths select the Pages preset + KV.
const isCloudflare = !!process.env.CF_PAGES || (process.env.NITRO_PRESET || '').includes('cloudflare')

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Override in production via NUXT_SESSION_SECRET
    sessionSecret: 'kyul-group-portal-dev-secret-change-me',
    // First-run seed passwords — set via NUXT_SEED_ADMIN_PASSWORD / NUXT_SEED_SUPERADMIN_PASSWORD.
    // Left blank here on purpose: no plaintext credentials in the repo. If unset at seed time,
    // a random password is generated and logged once (see server/utils/db.js).
    seedAdminPassword: '',
    seedSuperadminPassword: '',
    public: {
      siteUrl: 'https://www.kyulgroup.com',
    },
  },

  icon: {
    mode: 'svg',
    class: 'kyul-icon',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: (t) => (t ? `${t} · Kyul Group Inc.` : 'Kyul Group Inc. · Building Africa’s Future. Together.'),
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0f3a32' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            'Kyul Group is an integrated project delivery and investment group across infrastructure, agribusiness, mining, manufacturing and real estate in Eastern Africa.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Kyul Group Inc.' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  routeRules: {
    // The Group Portal is private + app-like — render it client-side only.
    '/dashboard/**': { ssr: false },
  },

  nitro: {
    // Auto-select the Cloudflare Pages preset when building on Cloudflare.
    preset: isCloudflare ? 'cloudflare-pages' : undefined,
    storage: {
      // Cloudflare KV in production (edge); a local file store everywhere else.
      db: isCloudflare
        ? { driver: 'cloudflare-kv-binding', binding: 'KYUL_DB' }
        : { driver: 'fs', base: '.data/db' },
    },
    devStorage: {
      // Dev server persists to disk (defaults to memory otherwise).
      db: { driver: 'fs', base: '.data/db' },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/sitemap.xml'],
    },
  },
})
