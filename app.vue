<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { site } from '~/data/site'

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
        url: site.url,
        logo: `${site.url}/icon-512.png`,
        description:
          'Integrated project delivery and investment group operating across infrastructure, agribusiness, mining, manufacturing and real estate in Eastern Africa.',
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
