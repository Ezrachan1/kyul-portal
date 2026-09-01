<script setup>
import { group } from '~/data/group'

const series = group.turnover
const fy = series[series.length - 1]
const prev = series[series.length - 2]
const yoy = Math.round(((fy.value - prev.value) / prev.value) * 100)

// Inline area chart: ChartArea's axis text is ink-toned and unreadable on
// forest-950, so the band draws its own paper-legible series.
const gid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const W = 560
const H = 280
const pad = { l: 46, r: 16, t: 18, b: 30 }
const gridlines = 4

const max = (() => {
  const m = Math.max(...series.map((d) => d.value))
  const step = Math.pow(10, Math.floor(Math.log10(m)))
  return Math.ceil((m * 1.08) / step) * step
})()

const innerW = W - pad.l - pad.r
const innerH = H - pad.t - pad.b
const pts = series.map((d, i) => ({
  x: pad.l + (i / (series.length - 1)) * innerW,
  y: pad.t + innerH - (d.value / max) * innerH,
  ...d,
}))

function smoothPath(points) {
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    d += ` C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`
  }
  return d
}

const linePath = smoothPath(pts)
const base = H - pad.b
const areaPath = `${linePath} L ${pts[pts.length - 1].x},${base} L ${pts[0].x},${base} Z`
const last = pts[pts.length - 1]

const grid = Array.from({ length: gridlines + 1 }, (_, i) => {
  const t = i / gridlines
  return { y: pad.t + innerH * t, value: Math.round(max * (1 - t)) }
})

const chartLabel = `Area chart: Group turnover in KSh millions, ${series.map((d) => `${d.year}: ${d.value}`).join(', ')}.`
</script>

<template>
  <section class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28" aria-labelledby="investor-band-title">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_10%,rgba(45,93,75,0.4),transparent_65%),radial-gradient(45%_40%_at_5%_95%,rgba(189,144,56,0.1),transparent_70%)]" />
    <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />

    <div class="shell relative">
      <div class="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <!-- Narrative + stats -->
        <div class="min-w-0 lg:col-span-6">
          <p v-reveal class="eyebrow !text-gold-300">Investor relations</p>
          <h2 id="investor-band-title" v-reveal="70" class="h-display mt-5 text-balance text-3xl text-paper sm:text-4xl lg:text-[2.9rem]">
            Strong performance. Disciplined growth.
          </h2>
          <p v-reveal="140" class="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">
            Turnover has grown from KSh 95M in FY2021 to KSh 510M in FY2025 — consolidated under
            one audit, ring-fenced through Kyul Holdings, and reported to institutional standard.
          </p>

          <dl v-reveal="200" class="mt-10 grid grid-cols-2">
            <div class="flex min-w-0 flex-col border-t border-paper/10 py-5 pr-6">
              <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">FY2025 turnover</dt>
              <dd class="stat-display text-3xl text-paper sm:text-4xl">KSh <CountUp :to="fy.value" suffix="M" /></dd>
            </div>
            <div class="flex min-w-0 flex-col border-l border-t border-paper/10 py-5 pl-6">
              <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">YoY growth</dt>
              <dd class="stat-display text-3xl text-paper sm:text-4xl"><CountUp :to="yoy" prefix="+" suffix="%" /></dd>
            </div>
            <div class="flex min-w-0 flex-col border-b border-t border-paper/10 py-5 pr-6">
              <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">3-yr revenue CAGR</dt>
              <dd class="stat-display text-3xl text-paper sm:text-4xl"><CountUp :to="68" prefix="~" suffix="%" /></dd>
            </div>
            <div class="flex min-w-0 flex-col border-b border-l border-t border-paper/10 py-5 pl-6">
              <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">Operating companies</dt>
              <dd class="stat-display text-3xl text-paper sm:text-4xl"><CountUp :to="6" /></dd>
            </div>
          </dl>

          <div v-reveal="260" class="mt-10 flex flex-wrap gap-3">
            <NuxtLink to="/investors" class="btn-gold">Investor relations<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
            <NuxtLink to="/investors/data-room" class="btn-on-dark"><Icon name="lucide:lock" class="h-4 w-4" /> Secure data room</NuxtLink>
          </div>
        </div>

        <!-- Turnover chart -->
        <div v-reveal="180" class="min-w-0 lg:col-span-6">
          <div class="rounded-2xl border border-paper/10 bg-forest-900/60 p-6 backdrop-blur sm:p-8">
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <p class="text-xs font-medium uppercase tracking-widest2 text-paper/60">Group turnover · KSh millions</p>
              <span class="flex items-center gap-1.5 text-sm font-medium text-gold-200">
                <Icon name="lucide:trending-up" class="h-4 w-4" /> +{{ yoy }}% YoY
              </span>
            </div>

            <svg :viewBox="`0 0 ${W} ${H}`" class="mt-6 w-full" role="img" :aria-label="chartLabel" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient :id="`band-area-${gid}`" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#d9b962" stop-opacity="0.28" />
                  <stop offset="1" stop-color="#d9b962" stop-opacity="0" />
                </linearGradient>
              </defs>

              <g>
                <line
                  v-for="(g, i) in grid" :key="i"
                  :x1="pad.l" :x2="W - pad.r" :y1="g.y" :y2="g.y"
                  stroke="#f8f5ee" stroke-opacity="0.08" stroke-width="1"
                />
                <text
                  v-for="(g, i) in grid" :key="`t${i}`"
                  :x="pad.l - 10" :y="g.y + 4" text-anchor="end"
                  class="fill-paper/60" style="font-size: 17px"
                >{{ g.value }}</text>
              </g>

              <path :d="areaPath" :fill="`url(#band-area-${gid})`" />
              <path :d="linePath" fill="none" stroke="#d9b962" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

              <g v-for="(p, i) in pts" :key="`p${i}`">
                <circle :cx="p.x" :cy="p.y" r="3" fill="#d9b962" />
                <text :x="p.x" :y="H - 8" text-anchor="middle" class="fill-paper/60" style="font-size: 17px">{{ p.year }}</text>
              </g>

              <circle :cx="last.x" :cy="last.y" r="5.5" fill="#0a201b" stroke="#d9b962" stroke-width="2.5" />
            </svg>

            <p class="mt-5 text-xs leading-relaxed text-paper/55">
              Illustrative consolidated figures, FY2021–FY2025. Audited statements are released to
              verified investors in the secure data room.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
