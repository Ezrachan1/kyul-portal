<script setup>
const props = defineProps({
  data: { type: Array, required: true }, // [{ label, value, color, target? }]
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  showValue: { type: Boolean, default: true },
})

const max = computed(() => Math.max(...props.data.map((d) => Math.max(d.value, d.target || 0))) * 1.02)
const mounted = ref(false)
onMounted(() => requestAnimationFrame(() => (mounted.value = true)))
const pct = (v) => `${Math.max(0, Math.min(100, (v / max.value) * 100))}%`
const fmt = (v) => `${props.prefix}${v.toLocaleString('en-KE')}${props.suffix}`
</script>

<template>
  <div class="space-y-4">
    <div v-for="(d, i) in data" :key="i">
      <div class="mb-1.5 flex items-baseline justify-between gap-3">
        <span class="truncate text-sm font-medium text-forest-900/80">{{ d.label }}</span>
        <span v-if="showValue" class="shrink-0 text-sm font-semibold text-forest-950 tabular-nums">{{ fmt(d.value) }}</span>
      </div>
      <div class="relative h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          class="absolute inset-y-0 left-0 rounded-full transition-[width] duration-[900ms] ease-out-expo"
          :style="{ width: mounted ? pct(d.value) : '0%', background: d.color || '#2d5d4b', transitionDelay: `${i * 80}ms` }"
        />
        <div
          v-if="d.target"
          class="absolute inset-y-[-3px] w-0.5 rounded bg-forest-950/55"
          :style="{ left: pct(d.target) }"
          :title="`Target ${fmt(d.target)}`"
        />
      </div>
    </div>
  </div>
</template>
