<script setup>
import { site } from '~/data/site'
import { subsidiaryBySlug } from '~/data/subsidiaries'

const settings = useSettings()
const year = new Date().getFullYear()

// Companies listed in the value-chain order (the Group's signature sequence)
const chain = ['projects', 'ventures', 'investment', 'engineering', 'enterprises', 'holdings']

const columns = [
  {
    title: 'The Group',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Sustainability', to: '/esg' },
      { label: 'Careers', to: '/careers' },
    ],
  },
  {
    title: 'Companies',
    links: chain.map((slug) => ({ label: subsidiaryBySlug(slug).short, to: `/subsidiaries/${slug}` })),
  },
  {
    title: 'Projects',
    links: [
      { label: 'All Projects', to: '/projects' },
    ],
  },
  {
    title: 'Investors',
    links: [
      { label: 'Investor Relations', to: '/investors' },
      { label: 'Data Room', to: '/investors/data-room' },
      { label: 'Investor Portal', to: '/dashboard/login' },
    ],
  },
  {
    title: 'Insights',
    links: [
      { label: 'News', to: '/news' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

const social = computed(() => (settings.value?.social?.length ? settings.value.social : site.social))
</script>

<template>
  <footer class="relative overflow-hidden bg-forest-950 text-paper">
    <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />

    <!-- Monogram watermark -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute -top-24 right-[-5rem] select-none font-display text-[26rem] font-semibold leading-none text-paper/[0.03] md:right-[-2rem] md:text-[40rem]"
    >K</span>

    <div class="shell-wide relative">
      <div class="pt-1.5"><KyulLine tone="paper" :node="10" /></div>

      <!-- Signature block -->
      <div class="pt-16 md:pt-20">
        <KyulWordmark tone="paper" sub />
        <p class="mt-9 max-w-3xl font-display text-3xl leading-[1.1] tracking-tightish text-paper sm:text-4xl lg:text-[2.85rem]">
          Building Africa&rsquo;s Future.
          <em class="font-medium text-gold-300">Together.</em>
        </p>
        <p class="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-paper/50">
          An integrated group originating, designing, financing, building and operating bankable
          projects across Eastern Africa.
        </p>
      </div>

      <!-- Navigation + contact -->
      <div class="grid gap-x-8 gap-y-12 py-14 md:py-16 lg:grid-cols-12">
        <nav class="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8 xl:col-span-9 xl:grid-cols-5" aria-label="Footer">
          <div v-for="col in columns" :key="col.title" class="min-w-0">
            <h3 class="text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/60">{{ col.title }}</h3>
            <ul class="mt-4 space-y-2.5">
              <li v-for="l in col.links" :key="l.label">
                <NuxtLink :to="l.to" class="link-underline text-sm text-paper/70 transition-colors duration-300 hover:text-paper">
                  {{ l.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>

        <div class="min-w-0 lg:col-span-4 xl:col-span-3">
          <h3 class="text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/60">Head Office</h3>
          <ul class="mt-4 space-y-3 text-sm text-paper/70">
            <li class="flex items-start gap-3">
              <Icon name="lucide:map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <span>{{ settings.hq.line1 }}<br>{{ settings.hq.line2 }}, {{ settings.hq.country }}</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="lucide:phone" class="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <a :href="`tel:${settings.contact.phoneHref || settings.contact.phone}`" class="link-underline transition-colors duration-300 hover:text-paper">
                {{ settings.contact.phone }}
              </a>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="lucide:mail" class="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <a :href="`mailto:${settings.contact.email}`" class="link-underline transition-colors duration-300 hover:text-paper">
                {{ settings.contact.email }}
              </a>
            </li>
          </ul>

          <div class="mt-7 flex items-center gap-2.5">
            <a
              v-for="s in social" :key="s.label" :href="s.href" :aria-label="s.label" target="_blank" rel="noopener"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors duration-300 hover:border-gold-400/60 hover:text-paper"
            >
              <Icon :name="s.icon" class="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <!-- Legal -->
      <div class="flex flex-col gap-4 border-t border-paper/10 py-7 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span>© {{ year }} {{ site.legalName }} All rights reserved.</span>
          <NuxtLink to="/privacy" class="transition-colors duration-300 hover:text-paper/80">Privacy</NuxtLink>
          <NuxtLink to="/privacy#cookies" class="transition-colors duration-300 hover:text-paper/80">Cookies</NuxtLink>
        </div>

        <!-- Savlicon credit — required -->
        <div class="flex items-center gap-2">
          <Icon name="lucide:code-xml" class="h-3.5 w-3.5 text-gold-400/70" aria-hidden="true" />
          <span>
            Powered by
            <a
              :href="site.builtBy.url" target="_blank" rel="noopener"
              class="font-medium text-paper/75 underline decoration-gold-400/50 underline-offset-2 transition hover:text-paper"
            >Savlicon</a>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
