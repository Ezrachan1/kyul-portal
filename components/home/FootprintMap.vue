<script setup>
// "Where we operate" — stylized Kenya footprint. Composes inside a parent dark
// band: the section supplies bg-forest-950, grain and .shell; this is the column.

const MAP_W = 400
const MAP_H = 480

// Hand-authored simplified Kenya outline, projected from rough lat/lon anchors
// (x = (lon − 33.5) × 47, y = (5.4 − lat) × 45.5): Ilemi apex, Ethiopia border,
// Mandera tip, the long Somalia diagonal, coast past Lamu/Mombasa, the Tanzania
// line with the Kilimanjaro notch, the Lake Victoria bite and the Uganda border.
const KENYA =
  'M23 54 L85 18 L120 43 C160 62 190 78 211 82 L261 86 C300 80 350 70 395 65 ' +
  'L352 284 L378 321 C362 335 352 342 348 349 C332 366 318 378 310 391 ' +
  'C302 404 296 417 290 430 L268 458 L196 400 L193 382 L21 291 ' +
  'C30 288 42 275 52 264 L59 250 C50 246 32 243 24 241 L23 237 L28 225 ' +
  'C38 210 44 202 48 195 L45 132 Z'

// Lake Turkana — the long desert lake tilting south-south-east from the border.
const LAKE_TURKANA =
  'M120 39 C130 60 140 100 146 137 C140 142 134 141 130 134 C120 105 114 68 112 45 C114 40 117 38 120 39 Z'

// Positions share the outline's projection — relative geography, not survey data.
// tip: which way the tooltip hangs so it never leaves the viewport at 375px.
// Notes only restate the legend (active projects / regional presence) plus the
// region name — per-county service claims live in the admin-managed portfolio.
const locations = [
  { id: 'turkana', name: 'Turkana', x: 99, y: 104, note: 'Regional presence', regional: true, tip: 'start' },
  { id: 'west-pokot', name: 'West Pokot', x: 76, y: 189, note: 'Active projects · Rift Valley', tip: 'start' },
  { id: 'elgeyo-marakwet', name: 'Elgeyo-Marakwet', x: 97, y: 213, note: 'Active projects · Rift Valley', tip: 'center' },
  { id: 'bungoma', name: 'Bungoma', x: 50, y: 220, note: 'Active projects · Western', tip: 'start' },
  { id: 'uasin-gishu', name: 'Uasin Gishu', x: 83, y: 224, note: 'Group HQ · County infrastructure', hq: true, tip: 'start' },
  { id: 'kakamega', name: 'Kakamega', x: 59, y: 233, note: 'Active projects · Western', tip: 'start' },
  { id: 'nandi', name: 'Nandi', x: 75, y: 240, note: 'Active projects · Rift Valley', tip: 'start' },
  { id: 'kisumu', name: 'Kisumu', x: 57, y: 252, note: 'Active projects · Nyanza', tip: 'start' },
  { id: 'nakuru', name: 'Nakuru', x: 121, y: 259, note: 'Active projects · Rift Valley', tip: 'center' },
  { id: 'machakos', name: 'Machakos', x: 177, y: 315, note: 'Regional presence', regional: true, tip: 'center' },
  { id: 'mombasa', name: 'Mombasa', x: 290, y: 430, note: 'Regional presence', regional: true, tip: 'end' },
]

const root = ref(null)
const open = ref(null)
// A focus event that opens the tooltip is followed by a click from the same
// tap/press (Android, keyboard Enter, mouse-down) — swallow that one click.
let skipClick = null
let focusHeld = null

const tipId = (id) => `fp-tip-${id}`
const posStyle = (loc) => ({ left: `${(loc.x / MAP_W) * 100}%`, top: `${(loc.y / MAP_H) * 100}%` })
const tipAlign = (loc) =>
  loc.tip === 'start' ? '-left-2' : loc.tip === 'end' ? '-right-2' : 'left-1/2 -translate-x-1/2'

function onEnter(e, id) {
  if (e.pointerType === 'mouse') open.value = id
}
function onLeave(e) {
  if (e.pointerType === 'mouse' && open.value !== focusHeld) open.value = null
}
function onFocus(id) {
  focusHeld = id
  if (open.value !== id) {
    open.value = id
    skipClick = id
  }
}
function onBlur(id) {
  focusHeld = null
  skipClick = null
  if (open.value === id) open.value = null
}
function onClick(id) {
  if (skipClick === id) {
    skipClick = null
    return
  }
  open.value = open.value === id ? null : id
}

// iOS never focuses buttons on tap, so a tap elsewhere must close the tooltip.
function onDocDown(e) {
  if (root.value && !root.value.contains(e.target)) open.value = null
}
onMounted(() => document.addEventListener('pointerdown', onDocDown, true))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocDown, true))
</script>

<template>
  <div ref="root" @keydown.escape="open = null">
    <div class="max-w-2xl">
      <p v-reveal class="eyebrow !text-gold-300">Where we operate</p>
      <h2 v-reveal="80" class="h-display mt-4 text-balance text-3xl text-paper sm:text-4xl lg:text-[2.75rem]">
        12+ counties. One expanding footprint.
      </h2>
      <p v-reveal="140" class="mt-5 text-lg leading-relaxed text-paper/60">
        Headquartered in Eldoret, the Group delivers infrastructure, water, roads and
        agribusiness programmes across the Rift Valley, Western Kenya and beyond.
      </p>
      <div v-reveal="200" class="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2.5">
        <span class="flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-widest2 text-paper/60">
          <span class="h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_8px_rgba(217,185,98,0.55)]" aria-hidden="true" />
          Active projects
        </span>
        <span class="flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-widest2 text-paper/60">
          <span class="h-2 w-2 rounded-full border border-gold-300/90" aria-hidden="true" />
          Regional presence
        </span>
      </div>
    </div>

    <div v-reveal="160" class="relative mx-auto mt-12 w-full max-w-[26rem] sm:max-w-[28rem]">
      <svg :viewBox="`0 0 ${MAP_W} ${MAP_H}`" class="pointer-events-none h-auto w-full" fill="none" aria-hidden="true">
        <defs>
          <clipPath id="fp-kenya-clip"><path :d="KENYA" /></clipPath>
        </defs>
        <path
          :d="KENYA"
          fill="#143029" fill-opacity="0.4"
          stroke="#f8f5ee" stroke-opacity="0.35" stroke-width="1.2"
          stroke-linejoin="round" vector-effect="non-scaling-stroke"
        />
        <!-- faint interior terrain, clipped to the outline -->
        <g clip-path="url(#fp-kenya-clip)" stroke="#f8f5ee" stroke-opacity="0.07" stroke-width="1">
          <path d="M-10 150 C60 135 140 165 220 150 S360 130 410 145" />
          <path d="M-10 260 C70 245 150 275 230 258 S370 240 410 255" />
          <path d="M-10 370 C60 358 150 382 240 366 S370 350 410 362" />
        </g>
        <path :d="LAKE_TURKANA" fill="#f8f5ee" fill-opacity="0.05" stroke="#f8f5ee" stroke-opacity="0.16" stroke-width="1" />
      </svg>

      <div
        v-for="(loc, i) in locations"
        :key="loc.id"
        class="absolute"
        :class="open === loc.id ? 'z-20' : 'z-10'"
        :style="posStyle(loc)"
      >
        <button
          type="button"
          class="group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-gold-300"
          :aria-label="loc.name"
          :aria-expanded="open === loc.id"
          :aria-controls="tipId(loc.id)"
          :aria-describedby="tipId(loc.id)"
          @pointerenter="onEnter($event, loc.id)"
          @pointerleave="onLeave"
          @focus="onFocus(loc.id)"
          @blur="onBlur(loc.id)"
          @click="onClick(loc.id)"
        >
          <span
            v-if="loc.hq"
            class="relative block h-[11px] w-[11px] rounded-full bg-gold-300 shadow-[0_0_0_5px_rgba(217,185,98,0.14)] transition-transform duration-300 ease-out-expo group-hover:scale-110 group-focus-visible:scale-110"
            aria-hidden="true"
          >
            <span class="fp-ping" :style="{ animationDelay: `${i * 0.4}s` }" />
          </span>
          <span
            v-else-if="loc.regional"
            class="block h-2 w-2 rounded-full border border-gold-300/90 transition-transform duration-300 ease-out-expo group-hover:scale-125 group-focus-visible:scale-125"
            aria-hidden="true"
          />
          <span
            v-else
            class="relative block h-[7px] w-[7px] rounded-full bg-gold-300 shadow-[0_0_8px_rgba(217,185,98,0.5)] transition-transform duration-300 ease-out-expo group-hover:scale-125 group-focus-visible:scale-125"
            aria-hidden="true"
          >
            <span class="fp-ping" :style="{ animationDelay: `${i * 0.4}s` }" />
          </span>
          <span
            v-if="loc.hq"
            class="pointer-events-none absolute left-[calc(50%+12px)] top-1/2 -translate-y-1/2 text-[0.55rem] font-semibold uppercase tracking-widest2 text-gold-200/90"
            aria-hidden="true"
          >HQ</span>
        </button>

        <div
          :id="tipId(loc.id)"
          role="tooltip"
          class="pointer-events-none absolute bottom-4 w-max max-w-[11.5rem] rounded-xl border border-paper/10 bg-forest-900/95 px-3.5 py-2.5 shadow-lift backdrop-blur-sm transition-all duration-300 ease-out-expo"
          :class="[tipAlign(loc), open === loc.id ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0']"
        >
          <p class="text-sm font-semibold leading-snug text-paper">{{ loc.name }}</p>
          <p class="mt-0.5 text-xs leading-snug text-paper/60">{{ loc.note }}</p>
        </div>
      </div>
    </div>

    <NuxtLink
      v-reveal="220"
      to="/subsidiaries"
      class="link-underline mt-10 inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-gold-200"
    >
      Explore the Group<Icon name="lucide:arrow-right" class="h-4 w-4" />
    </NuxtLink>
  </div>
</template>

<style scoped>
.fp-ping {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: rgba(217, 185, 98, 0.45);
  animation: fp-ping 3.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}
@keyframes fp-ping {
  0% { transform: scale(1); opacity: 0.6; }
  60%, 100% { transform: scale(3); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .fp-ping { animation: none; opacity: 0; }
}
</style>
