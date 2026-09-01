<script setup>
import { subsidiaryBySlug } from '~/data/subsidiaries'

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const sub = computed(() => subsidiaryBySlug(props.project.entity))
const accent = computed(() => sub.value?.accent || '#2d5d4b')

const delivered = computed(() => /^(delivered|completed)$/i.test(props.project.status || ''))
const initial = computed(() => (props.project.name || '·').trim().charAt(0))

// Photo-ready slot: drop a background-image onto this layer later and the
// accent tint + cropped initial still read over it.
const artStyle = computed(() => ({
  background: `linear-gradient(130deg, ${accent.value}33 0%, ${accent.value}0f 55%, transparent 100%)`,
}))

const joinDot = (...parts) => parts.filter(Boolean).join(' · ')
</script>

<template>
  <article
    v-reveal="(index % 3) * 90"
    class="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-card"
  >
    <!-- art-directed header band; admin-uploaded photo takes over when present -->
    <div class="relative h-40 shrink-0 overflow-hidden border-b border-ink/[0.06] bg-sand-100">
      <div
        class="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        :style="project.image ? { backgroundImage: `url(${project.image})` } : artStyle"
        aria-hidden="true"
      >
        <span
          v-if="!project.image"
          class="absolute -bottom-14 -right-1 select-none font-display text-[10.5rem] leading-none tracking-tightish"
          :style="{ color: accent, opacity: 0.16 }"
        >{{ initial }}</span>
      </div>
      <span
        class="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
        :style="{ background: accent }"
        aria-hidden="true"
      />
    </div>

    <div class="flex flex-1 flex-col p-6">
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span class="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/70">
          <span class="h-1.5 w-1.5 rounded-full" :style="{ background: accent }" aria-hidden="true" />
          {{ project.sector }}
        </span>
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold"
          :class="delivered ? 'bg-forest-50 text-forest-800' : 'bg-gold-50 text-gold-700'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="delivered ? 'bg-forest-600' : 'bg-gold-500'" aria-hidden="true" />
          {{ project.status || 'In progress' }}
        </span>
      </div>

      <h3 class="mt-3.5 font-display text-xl leading-snug text-forest-950">{{ project.name }}</h3>
      <p class="mt-1.5 text-sm text-forest-900/70">{{ joinDot(project.client, project.location) }}</p>
      <p class="mt-3 text-sm font-medium tabular-nums text-forest-950">{{ joinDot(project.value, project.year) }}</p>
      <p class="mt-2.5 flex-1 text-sm leading-relaxed text-forest-900/65 line-clamp-2">{{ project.scope }}</p>

      <div v-if="sub" class="hairline mt-4 border-t pt-2.5">
        <NuxtLink
          :to="`/subsidiaries/${sub.slug}`"
          class="link-underline inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-forest-800"
        >
          {{ delivered ? 'Delivered by' : 'Led by' }} Kyul {{ sub.short }}
          <Icon name="lucide:arrow-right" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
