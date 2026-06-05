<script setup>
const props = defineProps({
  values: { type: Array, required: true },
  color: { type: String, default: '#2d5d4b' },
})
const gid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const W = 120
const H = 40
const points = computed(() => {
  const min = Math.min(...props.values)
  const max = Math.max(...props.values)
  const span = max - min || 1
  const n = props.values.length
  return props.values.map((v, i) => ({
    x: (i / (n - 1)) * W,
    y: H - 4 - ((v - min) / span) * (H - 8),
  }))
})
const line = computed(() => points.value.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '))
const area = computed(() => `${line.value} L ${W},${H} L 0,${H} Z`)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="h-10 w-full" preserveAspectRatio="none">
    <defs>
      <linearGradient :id="`spark-${gid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="color" stop-opacity="0.2" />
        <stop offset="1" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="area" :fill="`url(#spark-${gid})`" />
    <path :d="line" fill="none" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
  </svg>
</template>
