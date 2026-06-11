<script setup>
import { jobs } from '~/data/careers'
import { subsidiaries } from '~/data/subsidiaries'

const settings = useSettings()

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

const perks = [
  { icon: 'lucide:trending-up', title: 'Real responsibility, early', text: 'Work on live projects with measurable impact from day one.' },
  { icon: 'lucide:graduation-cap', title: 'Professional growth', text: 'Mentorship from registered engineers and a path to professional registration.' },
  { icon: 'lucide:layers', title: 'Cross-Group exposure', text: 'Move and learn across six companies and five sectors.' },
  { icon: 'lucide:heart-handshake', title: 'Purpose that matters', text: 'Build infrastructure and create jobs across Eastern Africa.' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Careers"
      title="Build your career with Kyul."
      lede="We’re assembling the team that will deliver Eastern Africa’s next decade of infrastructure and investment. Find your place across the Group."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Careers' }]"
    />

    <!-- perks -->
    <section class="shell py-16 md:py-20">
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
            class="rounded-full border px-4 py-2 text-sm font-medium transition"
            :class="active === f.key ? 'border-forest-950 bg-forest-950 text-paper' : 'border-ink/12 text-forest-900/70 hover:border-forest-900/40 hover:text-forest-950'"
            @click="active = f.key"
          >{{ f.label }}</button>
        </div>

        <div class="grid gap-4">
          <JobCard v-for="(j, i) in filtered" :key="j.slug" :job="j" :index="i" />
        </div>
        <p v-if="!filtered.length" class="py-12 text-center text-forest-900/50">No open roles in this company right now. Check back soon.</p>
      </div>
    </section>

    <!-- speculative -->
    <section class="shell py-16 md:py-20">
      <div v-reveal class="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink/[0.07] bg-white p-8 shadow-soft md:flex-row md:items-center md:p-12">
        <div>
          <h2 class="h-display text-2xl text-forest-950">Don’t see your role?</h2>
          <p class="mt-2 max-w-xl text-forest-900/65">We’re always glad to hear from exceptional people. Send us your CV and tell us where you’d add value.</p>
        </div>
        <a :href="`mailto:${settings.contact.careersEmail}`" class="btn-primary shrink-0">Send your CV<Icon name="lucide:arrow-right" class="h-4 w-4" /></a>
      </div>
    </section>
  </div>
</template>
