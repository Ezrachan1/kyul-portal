<script setup>
const props = defineProps({
  data: { type: Array, required: true }, // [{ label, value }]
  color: { type: String, default: '#2d5d4b' },
  height: { type: Number, default: 300 },
  suffix: { type: String, default: '' },
  prefix: { type: String, default: '' },
  gridlines: { type: Number, default: 4 },
})

const gid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const W = 760
const H = computed(() => props.height)
const pad = { l: 48, r: 18, t: 20, b: 36 }

const max = computed(() => {
  const m = Math.max(...props.data.map((d) => d.value))
  const step = Math.pow(10, Math.floor(Math.log10(m || 1)))
  return Math.ceil((m * 1.08) / step) * step
})

const pts = computed(() => {
  const n = props.data.length
  const innerW = W - pad.l - pad.r
  const innerH = H.value - pad.t - pad.b
  return props.data.map((d, i) => ({
    x: pad.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: pad.t + innerH - (d.value / max.value) * innerH,
    ...d,
  }))
})

function smoothPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}

const linePath = computed(() => smoothPath(pts.value))
const areaPath = computed(() => {
  if (!pts.value.length) return ''
  const base = H.value - pad.b
  return `${linePath.value} L ${pts.value[pts.value.length - 1].x},${base} L ${pts.value[0].x},${base} Z`
})

const grid = computed(() => {
  const lines = []
  const innerH = H.value - pad.t - pad.b
  for (let i = 0; i <= props.gridlines; i++) {
    const t = i / props.gridlines
    lines.push({ y: pad.t + innerH * t, value: Math.round(max.value * (1 - t)) })
  }
  return lines
})

const fmt = (v) => `${props.prefix}${v.toLocaleString('en-KE')}${props.suffix}`
const last = computed(() => pts.value[pts.value.length - 1])
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="{ height: 'auto' }" role="img" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient :id="`area-${gid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="color" stop-opacity="0.22" />
        <stop offset="1" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- gridlines -->
    <g>
      <line
        v-for="(g, i) in grid" :key="i"
        :x1="pad.l" :x2="W - pad.r" :y1="g.y" :y2="g.y"
        stroke="#12201c" stroke-opacity="0.07" stroke-width="1"
      />
      <text
        v-for="(g, i) in grid" :key="`t${i}`"
        :x="pad.l - 10" :y="g.y + 4" text-anchor="end"
        class="fill-forest-900/40" style="font-size: 12px"
      >{{ fmt(g.value) }}</text>
    </g>

    <!-- area + line -->
    <path :d="areaPath" :fill="`url(#area-${gid})`" />
    <path :d="linePath" fill="none" :stroke="color" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- markers -->
    <g v-for="(p, i) in pts" :key="`p${i}`">
      <circle :cx="p.x" :cy="p.y" r="3" :fill="color" />
      <text :x="p.x" :y="H - 12" text-anchor="middle" class="fill-forest-900/50" style="font-size: 12px">{{ p.label ?? p.year }}</text>
    </g>

    <!-- last value callout -->
    <g v-if="last">
      <circle :cx="last.x" :cy="last.y" r="5.5" fill="white" :stroke="color" stroke-width="2.5" />
    </g>
  </svg>
</template>
