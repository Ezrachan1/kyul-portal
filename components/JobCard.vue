<script setup>
import { subsidiaryBySlug } from '~/data/subsidiaries'
const props = defineProps({
  job: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
const entity = computed(() => (props.job.entity === 'group' ? null : subsidiaryBySlug(props.job.entity)))
const entityName = computed(() => (entity.value ? entity.value.short : 'Kyul Group'))
const accent = computed(() => (entity.value ? entity.value.accent : '#bd9038'))
</script>

<template>
  <NuxtLink
    v-reveal="(index % 2) * 80"
    :to="`/careers/${job.slug}`"
    class="group flex flex-col gap-4 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft transition-all duration-400 ease-out-expo hover:-translate-y-1 hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-widest2" :style="{ color: accent }">
          <span class="h-1.5 w-1.5 rounded-full" :style="{ background: accent }" />
          {{ entityName }}
        </span>
        <span class="text-forest-900/30">·</span>
        <span class="text-xs text-forest-900/55">{{ job.department }}</span>
      </div>
      <h3 class="mt-2 font-display text-xl text-forest-950">{{ job.title }}</h3>
      <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-forest-900/65">{{ job.summary }}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span class="pill"><Icon name="lucide:map-pin" class="h-3.5 w-3.5" /> {{ job.location }}</span>
        <span class="pill"><Icon name="lucide:clock" class="h-3.5 w-3.5" /> {{ job.type }}</span>
        <span class="pill"><Icon name="lucide:bar-chart-3" class="h-3.5 w-3.5" /> {{ job.level }}</span>
      </div>
    </div>
    <span class="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-forest-50 px-4 py-2.5 text-sm font-semibold text-forest-800 transition group-hover:bg-forest-950 group-hover:text-paper sm:self-center">
      View role
      <Icon name="lucide:arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  </NuxtLink>
</template>
