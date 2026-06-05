<script setup>
const props = defineProps({
  segments: { type: Array, required: true }, // [{ label, value, color }]
  centerValue: { type: String, default: '' },
  centerLabel: { type: String, default: '' },
  legend: { type: Boolean, default: true },
})

const total = computed(() => props.segments.reduce((s, x) => s + x.value, 0) || 1)
const R = 56
const C = 2 * Math.PI * R
const mounted = ref(false)
onMounted(() => requestAnimationFrame(() => (mounted.value = true)))

const arcs = computed(() => {
  let offset = 0
  return props.segments.map((s) => {
    const frac = s.value / total.value
    const len = frac * C
    const arc = { ...s, dash: `${len} ${C - len}`, offset: -offset, pct: Math.round(frac * 100) }
    offset += len
    return arc
  })
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
    <div class="relative shrink-0">
      <svg viewBox="0 0 140 140" class="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" :r="R" fill="none" stroke="#12201c" stroke-opacity="0.06" stroke-width="14" />
        <circle
          v-for="(a, i) in arcs" :key="i"
          cx="70" cy="70" :r="R" fill="none" :stroke="a.color" stroke-width="14" stroke-linecap="butt"
          :stroke-dasharray="mounted ? a.dash : `0 ${C}`" :stroke-dashoffset="a.offset"
          class="transition-[stroke-dasharray] duration-[900ms] ease-out-expo"
          :style="{ transitionDelay: `${i * 90}ms` }"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span class="font-display text-2xl text-forest-950">{{ centerValue }}</span>
        <span class="mt-0.5 text-[0.65rem] font-medium uppercase tracking-widest2 text-forest-900/45">{{ centerLabel }}</span>
      </div>
    </div>

    <ul v-if="legend" class="w-full space-y-2.5">
      <li v-for="(a, i) in arcs" :key="i" class="flex items-center gap-3">
        <span class="h-2.5 w-2.5 shrink-0 rounded-sm" :style="{ background: a.color }" />
        <span class="flex-1 text-sm text-forest-900/75">{{ a.label }}</span>
        <span class="text-sm font-semibold text-forest-950 tabular-nums">{{ a.pct }}%</span>
      </li>
    </ul>
  </div>
</template>
