<script setup>
import { subsidiaryBySlug } from '~/data/subsidiaries'
const props = defineProps({
  article: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
const accent = computed(() => {
  const s = props.article.entity ? subsidiaryBySlug(props.article.entity) : null
  return s ? s.accent : '#2d5d4b'
})
</script>

<template>
  <NuxtLink
    v-reveal="(index % 3) * 80"
    :to="`/news/${article.slug}`"
    class="group flex flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-card"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-forest-950">
      <div class="absolute inset-0 opacity-[0.06] bg-grain" />
      <div
        class="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105"
        :style="{ background: `radial-gradient(120% 120% at 85% 15%, ${accent}33, transparent 60%), linear-gradient(150deg, #143029, #0a201b)` }"
      />
      <div class="absolute left-5 top-5">
        <span class="pill !border-paper/20 !bg-white/10 !text-paper backdrop-blur">{{ article.category }}</span>
      </div>
      <KyulMark aria-hidden="true" class="absolute -bottom-6 -right-5 h-28 w-28 opacity-[0.10]" />
      <div class="absolute bottom-5 left-5 right-16">
        <p class="font-display text-lg leading-snug text-paper/95 line-clamp-2">{{ article.title }}</p>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <div class="flex items-center gap-3 text-xs text-forest-900/70">
        <span>{{ formatDate(article.date) }}</span>
        <span class="h-1 w-1 rounded-full bg-forest-900/25" />
        <span>{{ article.readingTime }} min read</span>
      </div>
      <p class="mt-3 flex-1 text-sm leading-relaxed text-forest-900/70 line-clamp-3">{{ article.excerpt }}</p>
      <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800">
        Read article
        <Icon name="lucide:arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </div>
  </NuxtLink>
</template>
