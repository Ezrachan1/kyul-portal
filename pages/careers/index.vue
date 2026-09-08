<script setup>
import { jobs } from '~/data/careers'
import { subsidiaries } from '~/data/subsidiaries'

const settings = useSettings()
const { c } = useContent()

useSeoMeta({
  title: 'Careers',
  description: 'Build your career with Kyul Group: open roles across engineering, design, trade, development, investment and Group services.',
})

const filters = computed(() => [
  { key: 'all', label: 'All roles' },
  ...subsidiaries.map((s) => ({ key: s.slug, label: s.short })),
  { key: 'group', label: 'Group' },
])
const active = ref('all')
const sorted = [...jobs].sort((a, b) => new Date(b.posted) - new Date(a.posted))
const filtered = computed(() => (active.value === 'all' ? sorted : sorted.filter((j) => j.entity === active.value)))

// Perk copy lives in the content registry (careers.perks.<i>.title / .text); icons stay here
const PERK_ICONS = ['lucide:trending-up', 'lucide:graduation-cap', 'lucide:layers', 'lucide:heart-handshake']
const perks = computed(() =>
  PERK_ICONS.map((icon, i) => ({ icon, title: c('careers.perks.' + i + '.title'), text: c('careers.perks.' + i + '.text') })),
)
</script>

<template>
  <div>
    <PageHero
      :eyebrow="c('careers.hero.eyebrow')"
      :title="c('careers.hero.title')"
      :lede="c('careers.hero.lede')"
      :image="c('careers.hero.image')"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Careers' }]"
    />

    <!-- perks -->
    <section class="shell py-16 md:py-20">
      <h2 class="sr-only">Why join Kyul</h2>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(p, i) in perks" :key="p.title" v-reveal="i * 70" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="p.icon" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-base text-forest-950">{{ p.title }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ p.text }}</p>
        </div>
      </div>
    </section>

    <!-- roles -->
    <section class="border-t border-ink/[0.06] bg-sand-50/70 py-16 md:py-20">
      <div class="shell">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Open positions" :title="`${filtered.length} open role${filtered.length === 1 ? '' : 's'}`" />
        </div>
        <div class="mb-9 mt-8 flex flex-wrap gap-2">
          <button
            v-for="f in filters" :key="f.key"
            class="chip min-h-10"
            :class="{ 'chip-active': active === f.key }"
            :aria-pressed="active === f.key"
            @click="active = f.key"
          >{{ f.label }}</button>
        </div>

        <div class="grid gap-4">
          <JobCard v-for="(j, i) in filtered" :key="j.slug" :job="j" :index="i" />
        </div>
        <p v-if="!filtered.length" class="py-12 text-center text-forest-900/70">No open roles in this company right now. Check back soon.</p>
      </div>
    </section>

    <!-- speculative -->
    <section class="shell py-16 md:py-20">
      <div v-reveal class="flex flex-col items-start justify-between gap-6 rounded-2xl border border-ink/[0.07] bg-white p-8 shadow-soft md:flex-row md:items-center md:p-12">
        <div>
          <h2 class="h-display text-2xl text-forest-950">{{ c('careers.speculative.title') }}</h2>
          <p class="mt-2 max-w-xl text-forest-900/65">{{ c('careers.speculative.text') }}</p>
        </div>
        <a :href="`mailto:${settings.contact.careersEmail}`" class="btn-primary shrink-0">Send your CV<Icon name="lucide:arrow-right" class="h-4 w-4" /></a>
      </div>
    </section>
  </div>
</template>
