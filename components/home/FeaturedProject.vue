<script setup>
import { subsidiaryBySlug } from '~/data/subsidiaries'

defineProps({
  heading: { type: String, default: 'Featured project' },
})

// Mirrors the real engineering seed so the section never renders empty.
const fallback = {
  name: 'County HQ Office Block',
  client: 'Uasin Gishu County',
  location: 'Eldoret',
  value: 'KSh 180M',
  year: '2024–25',
  scope: '4-storey RC frame & finishing, ~3,200m²',
  sector: 'Buildings',
  status: 'Delivered',
}

const { data: portfolio } = await useFetch('/api/portfolio', { key: 'portfolio', default: () => [] })

const project = computed(() => {
  const list = portfolio.value || []
  return (
    list.find((p) => /county hq/i.test(p.name || '') && p.entity === 'engineering') ||
    list.find((p) => p.status === 'Delivered') ||
    fallback
  )
})

const isFlagship = computed(() => /county hq/i.test(project.value.name || ''))

const sub = computed(() => subsidiaryBySlug(project.value.entity || 'engineering'))
const entitySlug = computed(() => sub.value?.slug || 'engineering')
const entityName = computed(() => (sub.value ? `Kyul ${sub.value.short}` : 'Kyul Engineering'))

// Derivations from free-text seed fields — each degrades gracefully.
const fmtInt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const area = computed(() => {
  const m = (project.value.scope || '').match(/(~?)([\d,]+)\s*m²/)
  return m ? { approx: m[1] === '~', num: Number(m[2].replace(/,/g, '')) } : null
})
const storeys = computed(() => {
  const m = (project.value.scope || '').match(/(\d+)\s*-\s*storey/i)
  return m ? Number(m[1]) : null
})
const STOREY_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']

const deliveredYear = computed(() => {
  const last = String(project.value.year || '').split(/[–—-]/).pop().trim()
  return last.length === 2 ? `20${last}` : last
})
const yearNum = computed(() => (/^\d{4}$/.test(deliveredYear.value) ? Number(deliveredYear.value) : null))

const metaCells = computed(() => {
  const p = project.value
  return [
    area.value
      ? { label: 'Floor area', value: `${area.value.approx ? '~' : ''}${fmtInt(area.value.num)} m²` }
      : { label: 'Scope', value: p.scope },
    storeys.value
      ? { label: p.sector || 'Sector', value: `${STOREY_WORDS[storeys.value] || storeys.value}-storey building` }
      : { label: 'Sector', value: p.sector },
    isFlagship.value
      ? { label: 'Contract', value: 'Design & Build' }
      : { label: 'Client', value: p.client },
    { label: 'Status', value: [p.status, deliveredYear.value].filter(Boolean).join(' ') },
  ]
})

const narrative = computed(() =>
  isFlagship.value
    ? 'A modern, citizen-centric county headquarters delivered on programme and within budget.'
    : `Delivered for ${project.value.client} — designed, built and handed over under the Group’s single-point delivery model.`,
)

const stats = computed(() => {
  const p = project.value
  return [
    { label: 'Contract value', text: p.value },
    area.value
      ? { label: 'Floor area', num: area.value.num, prefix: area.value.approx ? '~' : '', suffix: ' m²' }
      : { label: 'Sector', text: p.sector },
    yearNum.value
      ? { label: 'Handover', num: yearNum.value, separator: '' }
      : { label: 'Year', text: p.year },
  ]
})
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="shell-wide">
      <p v-reveal class="eyebrow">{{ heading }}</p>

      <div class="mt-10 grid gap-8 lg:grid-cols-5 lg:gap-12">
        <!-- Visual panel. Layer 1 is the photo slot: swap the gradient for a
             background image later and the treatment layers above it still read. -->
        <div
          v-reveal="80"
          class="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-forest-950 bg-cover bg-center shadow-lift sm:min-h-[26rem] lg:col-span-3"
          :style="project.image ? { backgroundImage: `url(${project.image})` } : undefined"
        >
          <div v-if="!project.image" class="pointer-events-none absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" aria-hidden="true" />
          <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_18%_8%,rgba(45,93,75,0.55),transparent_65%),radial-gradient(45%_38%_at_92%_96%,rgba(189,144,56,0.13),transparent_72%)]"
            :class="project.image && 'opacity-40'"
            aria-hidden="true"
          />
          <TopoContours v-if="!project.image" tone="paper" :opacity="0.08" />
          <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" aria-hidden="true" />

          <p
            v-if="!project.image"
            class="pointer-events-none absolute -left-2 top-1/2 -translate-y-[60%] select-none whitespace-nowrap font-display text-[5.5rem] leading-none tracking-tightish text-paper/[0.07] sm:text-[8rem] lg:text-[9.5rem]"
            aria-hidden="true"
          >
            {{ project.name }}
          </p>

          <!-- caption scrim keeps the micro-labels legible once a photo lands -->
          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest-950/80 to-transparent" aria-hidden="true" />
          <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <KyulLine tone="paper" :node="2" />
            <div class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-paper/60">
                {{ project.location }} · {{ project.year }}
              </p>
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-gold-200">{{ entityName }}</p>
            </div>
          </div>
        </div>

        <!-- Story -->
        <div v-reveal="160" class="flex min-w-0 flex-col justify-center lg:col-span-2">
          <h2 class="h-display text-balance text-3xl text-forest-950 sm:text-4xl lg:text-[2.6rem]">
            {{ project.name }}
          </h2>
          <p class="mt-3 text-forest-900/70">{{ project.client }} · {{ project.location }}</p>

          <dl class="mt-9 grid grid-cols-2 gap-x-8 gap-y-7">
            <div v-for="(cell, i) in metaCells" :key="i" class="min-w-0">
              <KyulLine :node="-1" />
              <dt class="mt-3 text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/70">{{ cell.label }}</dt>
              <dd class="mt-1 font-medium leading-snug text-forest-950">{{ cell.value }}</dd>
            </div>
          </dl>

          <p class="mt-9 text-lg leading-relaxed text-forest-900/70">{{ narrative }}</p>

          <div class="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <NuxtLink to="/projects" class="btn-primary">
              View the portfolio<Icon name="lucide:arrow-right" class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink
              :to="`/subsidiaries/${entitySlug}`"
              class="link-underline inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-forest-800"
            >
              {{ entityName }}<Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Proof strip -->
      <div v-reveal="120" class="hairline mt-12 border-t pt-8 md:mt-16">
        <div class="flex flex-wrap items-center gap-x-12 gap-y-6">
          <div v-for="s in stats" :key="s.label" class="min-w-0">
            <p class="stat-display text-2xl text-forest-950 sm:text-[1.75rem]">
              <CountUp v-if="s.num != null" :to="s.num" :prefix="s.prefix || ''" :suffix="s.suffix || ''" :separator="s.separator ?? ','" />
              <template v-else>{{ s.text }}</template>
            </p>
            <p class="mt-1 text-[0.65rem] font-medium uppercase tracking-widest2 text-forest-900/70">{{ s.label }}</p>
          </div>

          <span class="pill sm:ml-auto">
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="project.status === 'Delivered' ? 'bg-forest-600' : 'bg-gold-500'"
              aria-hidden="true"
            />
            {{ project.status || 'In progress' }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
