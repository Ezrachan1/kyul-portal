<script setup>
const { data: articles } = await useFetch('/api/news', { default: () => [] })

// Chips derived from the data itself (API returns newest-first), capped at 5.
const categories = computed(() => {
  const seen = []
  for (const a of articles.value) {
    if (a.category && !seen.includes(a.category)) seen.push(a.category)
    if (seen.length === 5) break
  }
  return ['All', ...seen]
})

const active = ref('All')

const list = computed(() => {
  const src = active.value === 'All' ? articles.value : articles.value.filter((a) => a.category === active.value)
  return [...src].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const featured = computed(() => list.value.find((a) => a.featured) || list.value[0] || null)
const rest = computed(() => list.value.filter((a) => a.slug !== featured.value?.slug).slice(0, 3))

const shortDate = (iso) => formatDate(iso, { day: 'numeric', month: 'short', year: 'numeric' })

// Art-directed panel built from palette tokens only; the combo varies by
// category so the featured card reads differently as filters change.
const PANEL_TINTS = [
  { glow: 'rgba(94, 144, 121, 0.5)', from: '#dbe9e1', to: '#b9d3c6' }, // forest 400 / 100 / 200
  { glow: 'rgba(217, 185, 98, 0.35)', from: '#f4f0e6', to: '#eae3d3' }, // gold 300 / sand 100 / 200
  { glow: 'rgba(141, 182, 164, 0.5)', from: '#f1f6f3', to: '#dbe9e1' }, // forest 300 / 50 / 100
  { glow: 'rgba(205, 166, 70, 0.3)', from: '#f2e8c9', to: '#f4f0e6' }, // gold 400 / 100 / sand 100
]
const tintFor = (cat) => {
  let h = 0
  for (const ch of String(cat || '')) h = (h * 31 + ch.charCodeAt(0)) % 997
  return PANEL_TINTS[h % PANEL_TINTS.length]
}
const panelStyle = computed(() => {
  const t = tintFor(featured.value?.category)
  return {
    background: [
      `radial-gradient(85% 75% at 88% 10%, ${t.glow}, transparent 62%)`,
      'radial-gradient(42% 34% at 10% 94%, rgba(217, 185, 98, 0.14), transparent 72%)',
      `linear-gradient(150deg, ${t.from}, ${t.to})`,
    ].join(', '),
  }
})
</script>

<template>
  <section v-if="articles.length" class="py-20 md:py-28">
    <div class="shell">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="News & insights" title="From across the Group" />
        <NuxtLink to="/news" v-reveal="120" class="btn-outline hidden md:inline-flex">
          All insights<Icon name="lucide:arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <!-- category filter -->
      <div
        v-if="categories.length > 2"
        v-reveal="80"
        class="-mx-[var(--shell-x)] mt-9 flex gap-2 overflow-x-auto px-[var(--shell-x)] py-1.5 md:mx-0 md:flex-wrap md:px-0"
        role="group"
        aria-label="Filter news by category"
      >
        <button
          v-for="c in categories" :key="c"
          type="button"
          class="chip min-h-10 shrink-0"
          :class="active === c && 'chip-active'"
          :aria-pressed="active === c"
          @click="active = c"
        >{{ c }}</button>
      </div>
      <p class="sr-only" aria-live="polite">{{ list.length }} articles in {{ active === 'All' ? 'all categories' : active }}</p>

      <!-- featured article: 60/40 editorial split -->
      <Transition name="feat" mode="out-in">
        <article v-if="featured" :key="featured.slug" v-reveal="140" class="mt-10 grid gap-8 md:mt-14 lg:grid-cols-5 lg:gap-12">
          <NuxtLink
            :to="`/news/${featured.slug}`"
            tabindex="-1"
            aria-hidden="true"
            class="group relative block aspect-[16/10] min-w-0 overflow-hidden rounded-[1.5rem] shadow-soft lg:col-span-3 lg:aspect-auto lg:min-h-[24rem]"
          >
            <div
              class="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
              :style="panelStyle"
            >
              <TopoContours tone="ink" :opacity="0.07" />
            </div>
            <span class="eyebrow absolute left-6 top-6 sm:left-8 sm:top-8">{{ featured.category }}</span>
            <div class="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
              <KyulLine :node="6" />
            </div>
          </NuxtLink>

          <div class="flex min-w-0 flex-col justify-center lg:col-span-2">
            <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/70">
              {{ featured.category }} · {{ formatDate(featured.date) }}
            </p>
            <h3 class="mt-4 font-display text-2xl leading-snug tracking-tightish text-balance md:text-3xl">
              <NuxtLink
                :to="`/news/${featured.slug}`"
                class="transition-colors duration-300 hover:text-forest-700"
              >{{ featured.title }}</NuxtLink>
            </h3>
            <p class="mt-4 leading-relaxed text-forest-900/70 line-clamp-3">{{ featured.excerpt }}</p>
            <p class="mt-5 text-sm text-forest-900/70">{{ featured.author }} · {{ featured.readingTime }} min read</p>
            <NuxtLink
              :to="`/news/${featured.slug}`"
              class="link-underline mt-7 inline-flex items-center gap-1.5 self-start py-2.5 text-sm font-semibold text-forest-800"
            >
              Read<Icon name="lucide:arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
        </article>
      </Transition>

      <!-- three compact editorial rows -->
      <div v-if="rest.length" class="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-3">
        <NuxtLink
          v-for="(a, i) in rest" :key="a.slug"
          v-reveal="i * 80"
          :to="`/news/${a.slug}`"
          class="hairline group flex min-w-0 flex-col border-t pt-6"
        >
          <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/70">
            {{ shortDate(a.date) }} · {{ a.category }}
          </p>
          <h3 class="mt-3 font-display text-xl leading-snug tracking-tightish transition-colors duration-300 line-clamp-3 group-hover:text-forest-700">
            {{ a.title }}
          </h3>
          <span class="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-forest-800">
            Read
            <Icon name="lucide:arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </NuxtLink>
      </div>

      <NuxtLink
        to="/news"
        class="link-underline mt-10 inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-forest-800 md:hidden"
      >
        All insights<Icon name="lucide:arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.feat-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.feat-leave-active {
  transition: opacity 0.15s ease;
}
.feat-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.feat-leave-to {
  opacity: 0;
}
</style>
