<script setup>
import { subsidiaries } from '~/data/subsidiaries'
import { site } from '~/data/site'

const { c } = useContent()

useSeoMeta({
  title: 'Projects',
  description:
    'The Kyul Group portfolio: county infrastructure, water, roads, agribusiness and real estate delivered across Eastern Africa.',
})

const route = useRoute()
const router = useRouter()

const { data: portfolio } = await useFetch('/api/portfolio', { key: 'portfolio', default: () => [] })

// Admin-managed list first; static seed as fallback so the page never renders empty.
// Holdings' "Operating Co" equity rows are internal structure, not public projects.
const projects = computed(() => {
  const list = portfolio.value || []
  const all = list.length
    ? list
    : subsidiaries.flatMap((s) => (s.projects || []).map((p) => ({ ...p, entity: s.slug })))
  return all.filter((p) => p.sector !== 'Operating Co')
})

const yearNum = (y) => {
  const m = String(y || '').match(/\d{4}/)
  return m ? Number(m[0]) : 0
}
const isDelivered = (status) => /^(delivered|completed)$/i.test(status || '')

const sorted = computed(() =>
  [...projects.value].sort(
    (a, b) => isDelivered(b.status) - isDelivered(a.status) || yearNum(b.year) - yearNum(a.year),
  ),
)

// The Group's public sector families, mapped onto the granular sector tags that
// projects carry in data. Chips stay short; unmapped tags surface under All.
// Aliases let the homepage sector showcase link with its own naming.
const FAMILIES = [
  { name: 'Infrastructure', tags: ['Buildings', 'Roads', 'Infrastructure'], aliases: [] },
  { name: 'Water', tags: ['Water'], aliases: [] },
  { name: 'Real Estate', tags: ['Real Estate', 'Leasing'], aliases: [] },
  { name: 'Agribusiness', tags: ['Agribusiness'], aliases: [] },
  { name: 'Manufacturing', tags: ['Manufacturing', 'Plant'], aliases: [] },
  { name: 'Mining', tags: ['Mining'], aliases: ['Mining & Minerals'] },
]

const familyOf = (q) => {
  const v = String(q || '').toLowerCase()
  return FAMILIES.find(
    (f) =>
      f.name.toLowerCase() === v ||
      f.aliases.some((a) => a.toLowerCase() === v) ||
      f.tags.some((t) => t.toLowerCase() === v),
  )
}

const presentTags = computed(() => new Set(projects.value.map((p) => String(p.sector || '').toLowerCase())))
const sectors = computed(() => [
  'All',
  ...FAMILIES.filter((f) => f.tags.some((t) => presentTags.value.has(t.toLowerCase()))).map((f) => f.name),
])

const matchSector = (q) => familyOf(q)?.name || 'All'

const activeSector = ref(matchSector(route.query.sector))
const activeEntity = ref('all')

// Keep the chip honest across back/forward navigation.
watch(
  () => route.query.sector,
  (q) => { activeSector.value = matchSector(q) },
)

const setSector = (s) => {
  activeSector.value = s
  const query = { ...route.query }
  if (s === 'All') delete query.sector
  else query.sector = s
  router.replace({ query })
}

const resetFilters = () => {
  activeEntity.value = 'all'
  setSector('All')
}

const filtered = computed(() => {
  const fam = FAMILIES.find((f) => f.name === activeSector.value)
  return sorted.value.filter(
    (p) =>
      (!fam || fam.tags.some((t) => t.toLowerCase() === String(p.sector || '').toLowerCase())) &&
      (activeEntity.value === 'all' || p.entity === activeEntity.value),
  )
})

const countLine = computed(() => {
  const n = filtered.value.length
  const noun = n === 1 ? 'project' : 'projects'
  const unfiltered = activeSector.value === 'All' && activeEntity.value === 'all'
  return unfiltered ? `${n} ${noun} across the Group` : `${n} ${noun} shown`
})

// ItemList structured data (SEO/AEO) over the full, unfiltered portfolio.
// Projects have no detail pages, so items carry names only — same base logic as app.vue.
const base = (useRuntimeConfig().public.siteUrl || site.url).replace(/\/$/, '')
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Kyul Group project portfolio',
        url: `${base}/projects`,
        numberOfItems: sorted.value.length,
        itemListElement: sorted.value.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
        })),
      }),
    },
  ],
}))
</script>

<template>
  <div>
    <PageHero
      :eyebrow="c('projects.hero.eyebrow')"
      :title="c('projects.hero.title')"
      :lede="c('projects.hero.lede')"
      :image="c('projects.hero.image')"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Projects' }]"
    />

    <section class="shell py-14 md:py-20">
      <!-- filters — one compact band, ready to be made sticky under the header later -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0"
          role="group"
          aria-label="Filter by sector"
        >
          <button
            v-for="s in sectors"
            :key="s"
            class="chip min-h-10 shrink-0"
            :class="{ 'chip-active': activeSector === s }"
            :aria-pressed="activeSector === s"
            @click="setSector(s)"
          >{{ s }}</button>
        </div>

        <label class="inline-flex shrink-0 items-center gap-3">
          <span class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/70">Company</span>
          <span class="relative">
            <select
              v-model="activeEntity"
              class="h-10 appearance-none rounded-full border border-ink/15 bg-white/70 pl-4 pr-10 text-sm font-medium text-forest-900 transition-colors duration-300 hover:border-forest-900/40"
            >
              <option value="all">All companies</option>
              <option v-for="s in subsidiaries.filter((x) => x.slug !== 'holdings')" :key="s.slug" :value="s.slug">Kyul {{ s.short }}</option>
            </select>
            <Icon
              name="lucide:chevron-down"
              class="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/50"
              aria-hidden="true"
            />
          </span>
        </label>
      </div>

      <p class="mt-7 text-sm text-forest-900/70" aria-live="polite">{{ countLine }}</p>

      <h2 class="sr-only">Project portfolio</h2>
      <div v-if="filtered.length" class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="(p, i) in filtered"
          :key="p.id || `${p.entity}-${p.name}`"
          :project="p"
          :index="i"
        />
      </div>

      <div v-else class="mt-6 rounded-2xl border border-dashed border-ink/15 px-6 py-20 text-center">
        <p class="text-forest-900/70">No projects in this sector yet.</p>
        <button
          class="link-underline mt-4 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-forest-800"
          @click="resetFilters"
        >
          Reset filters<Icon name="lucide:rotate-ccw" class="h-3.5 w-3.5" />
        </button>
      </div>
    </section>

    <CtaBand
      :eyebrow="c('projects.cta.eyebrow')"
      :title="c('projects.cta.title')"
      :text="c('projects.cta.text')"
      :primary="{ label: 'Get in touch', to: '/contact' }"
      :secondary="{ label: 'Invest with Kyul', to: '/investors' }"
    />
  </div>
</template>
