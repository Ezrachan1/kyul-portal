<script setup>
import { subsidiaryBySlug } from '~/data/subsidiaries'

const route = useRoute()
const { data: article, error } = await useFetch(`/api/news/${route.params.slug}`)
if (!article.value || error.value) throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })

const { data: all } = await useFetch('/api/news', { default: () => [] })
const entity = computed(() => (article.value.entity ? subsidiaryBySlug(article.value.entity) : null))
const related = computed(() => (all.value || []).filter((a) => a.slug !== article.value.slug).slice(0, 3))

// CMS excerpts can run to 400 chars; search engines want meta descriptions ≤160.
const metaDescription = computed(() => {
  const s = String(article.value.excerpt || '')
  if (!s) return undefined // fall back to the site-wide default
  return s.length > 160 ? s.slice(0, 157).replace(/\s+\S*$/, '') + '…' : s
})

useSeoMeta({
  title: () => article.value.title,
  description: () => metaDescription.value,
  ogType: 'article',
  ogTitle: () => article.value.title,
  ogDescription: () => article.value.excerpt,
})
</script>

<template>
  <article v-if="article">
    <!-- header -->
    <header class="border-b border-ink/[0.06] bg-sand-50/60">
      <div class="shell max-w-prose2 py-14 md:py-20">
        <nav class="mb-7 flex items-center gap-2 text-xs text-forest-900/45">
          <NuxtLink to="/news" class="transition hover:text-forest-900">News & Insights</NuxtLink>
          <Icon name="lucide:chevron-right" class="h-3 w-3" />
          <span class="truncate text-forest-900/70">{{ article.category }}</span>
        </nav>
        <div class="flex items-center gap-3">
          <span class="pill" :style="entity ? { borderColor: `${entity.accent}55`, color: entity.accentInk } : {}">{{ article.category }}</span>
          <NuxtLink v-if="entity" :to="`/subsidiaries/${entity.slug}`" class="text-xs font-semibold" :style="{ color: entity.accentInk }">{{ entity.name }}</NuxtLink>
        </div>
        <h1 class="h-display mt-5 text-3xl text-balance text-forest-950 sm:text-4xl lg:text-[2.9rem]">{{ article.title }}</h1>
        <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-forest-900/55">
          <span class="flex items-center gap-1.5"><Icon name="lucide:user" class="h-4 w-4" /> {{ article.author }}</span>
          <span class="h-1 w-1 rounded-full bg-forest-900/25" />
          <span class="flex items-center gap-1.5"><Icon name="lucide:calendar" class="h-4 w-4" /> {{ formatDate(article.date) }}</span>
          <span class="h-1 w-1 rounded-full bg-forest-900/25" />
          <span class="flex items-center gap-1.5"><Icon name="lucide:clock" class="h-4 w-4" /> {{ article.readingTime }} min read</span>
        </div>
      </div>
    </header>

    <!-- body -->
    <div class="shell max-w-prose2 py-14 md:py-18">
      <div class="prose-kyul text-lg">
        <template v-for="(b, i) in article.body" :key="i">
          <h2 v-if="b.type === 'h2'">{{ b.text }}</h2>
          <blockquote v-else-if="b.type === 'q'">{{ b.text }}</blockquote>
          <p v-else>{{ b.text }}</p>
        </template>
      </div>

      <div class="mt-12 flex items-center justify-between border-t border-ink/[0.08] pt-7">
        <NuxtLink to="/news" class="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 link-underline"><Icon name="lucide:arrow-left" class="h-4 w-4" /> All news</NuxtLink>
        <NuxtLink to="/contact" class="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 link-underline">Media enquiries <Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
      </div>
    </div>

    <!-- related -->
    <section class="border-t border-ink/[0.06] bg-sand-50/70 py-16 md:py-20">
      <div class="shell">
        <h2 class="h-display text-2xl text-forest-950 sm:text-3xl">More from the Group</h2>
        <div class="mt-9 grid gap-6 md:grid-cols-3">
          <ArticleCard v-for="(a, i) in related" :key="a.slug" :article="a" :index="i" />
        </div>
      </div>
    </section>
  </article>
</template>
