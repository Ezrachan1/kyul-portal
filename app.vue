<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { site } from '~/data/site'

const route = useRoute()
// Single source of truth for the public URL: NUXT_PUBLIC_SITE_URL (falls back to data/site.js).
const base = (useRuntimeConfig().public.siteUrl || site.url).replace(/\/$/, '')
const canonical = computed(() => base + route.path)
const ogImage = `${base}/og-image.png`

// Canonical + absolute OG/Twitter URLs so search and social line up with the live domain.
useHead({
  link: [{ rel: 'canonical', href: canonical }],
  meta: [
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:image', content: ogImage },
  ],
})

// Organisation structured data (SEO / AEO)
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Corporation',
        name: 'Kyul Group Inc.',
        slogan: site.tagline,
        url: base,
        logo: `${base}/icon-512.png`,
        description:
          'Integrated project delivery and investment group operating across infrastructure, agribusiness, mining, manufacturing and real estate in Eastern Africa.',
        foundingDate: String(site.founded),
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: site.contact.phone,
            email: site.contact.email,
            contactType: 'customer service',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Eldoret',
          addressRegion: 'Uasin Gishu',
          addressCountry: 'KE',
        },
        subOrganization: [
          'Kyul Engineering Limited',
          'Kyul Ventures Limited',
          'Kyul Enterprises Limited',
          'Kyul Projects Limited',
          'Kyul Investment Limited',
          'Kyul Holdings Limited',
        ].map((n) => ({ '@type': 'Organization', name: n })),
      }),
    },
  ],
})
</script>
