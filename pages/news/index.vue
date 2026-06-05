<script setup>
import { categories } from '~/data/news'

useSeoMeta({
  title: 'News & Insights',
  description: 'Project updates, press releases and thought leadership from across Kyul Group and its six companies.',
})

const { data: articles } = await useFetch('/api/news', { default: () => [] })
const active = ref('All')
const filtered = computed(() => (active.value === 'All' ? articles.value : articles.value.filter((a) => a.category === active.value)))
</script>

<template>
  <div>
    <PageHero
      eyebrow="News & insights"
      title="From across the Group."
      lede="Project milestones, press releases and perspectives on building and investing in Eastern Africa."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'News & Insights' }]"
    />

    <section class="shell py-16 md:py-20">
      <!-- filters -->
      <div class="mb-10 flex flex-wrap gap-2">
        <button
          v-for="c in categories" :key="c"
          class="rounded-full border px-4 py-2 text-sm font-medium transition"
          :class="active === c ? 'border-forest-950 bg-forest-950 text-paper' : 'border-ink/12 text-forest-900/70 hover:border-forest-900/40 hover:text-forest-950'"
          @click="active = c"
        >{{ c }}</button>
      </div>

      <TransitionGroup
        tag="div" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        enter-active-class="transition duration-400 ease-out-expo" enter-from-class="opacity-0 translate-y-3"
        leave-active-class="absolute" leave-to-class="opacity-0"
      >
        <ArticleCard v-for="(a, i) in filtered" :key="a.slug" :article="a" :index="i" />
      </TransitionGroup>

      <p v-if="!filtered.length" class="py-16 text-center text-forest-900/50">No articles in this category yet.</p>
    </section>

    <CtaBand
      eyebrow="Stay informed"
      title="Follow the Group’s journey."
      text="From county infrastructure to investment milestones — keep up with what Kyul is building."
      :primary="{ label: 'Contact the Group', to: '/contact' }"
      :secondary="{ label: 'Investor relations', to: '/investors' }"
    />
  </div>
</template>
