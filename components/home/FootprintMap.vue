<script setup>
// "Where we operate" — stylized Kenya footprint. Composes inside a parent dark
// band: the section supplies bg-forest-950, grain and .shell; this is the column.

const MAP_W = 400
const MAP_H = 480

// Kenya's actual boundary — Natural Earth 50m (world-atlas), mainland ring
// projected plate-carrée into this 400x480 viewBox (Kenya straddles the
// equator, so the projection is effectively undistorted) and lightly
// simplified to ~200 points. Regenerate via scratch script if ever needed.
const KENYA =
  'M23 302.3L22.8 294.6L23.9 275.4L23.8 258.5L24.7 250L28.9 244.7L30.8 240.8L32.2 235.3L34.5 230.9L39.4 227.3L40.2 225.3L45.5 219.3L48.7 211.5L51.1 208.9L54 206.4L56 205.2L59.5 203.9L62.3 203.1L62.9 201.2L62.1 196.5L63.2 194.8L65 191.7L67.1 188.7L69 186.8L70.1 184.8L70.6 181.4L70.7 179.1L70.6 175.1L70.1 166.2L67.9 158.8L66.4 150.5L67.4 147.7L65.6 142.8L63.4 141.4L61.6 136.9L60.2 132.7L53.5 128L50.4 119.3L47.1 117.3L45.3 108.7L45 106.3L46.9 97.7L46.6 95.7L44.7 93.9L39.1 92.1L34.6 88.5L35.4 86L33.2 85.1L26.1 70.4L35.1 61.6L44 52.7L55.7 41.4L66.3 31L75.4 22L83.5 14L83.4 17.5L84.5 18.8L86.1 19.6L88.5 18.7L90.4 17.5L92.5 17.2L104.8 20.5L106.7 23.5L106.7 26.6L107.2 28.9L106.2 31.1L105.2 38L105.6 44.4L109.2 49L112.4 52.7L115 57.8L117.1 59.5L119.6 60.2L128.1 60.5L140.6 60.8L152.5 61.1L156.2 61.9L167.2 68.9L177.3 75.3L185.9 80.8L194.2 86.2L202.4 91.4L208.6 95.8L214.9 97.1L224.8 97.8L231.8 98L238.2 99.8L247.8 101.5L254.8 102.4L259.1 103.3L271.1 104.4L273 103.8L278.3 98.9L284.2 91.1L286.6 86.8L294.1 82.5L307.5 76.6L317 72.3L327.5 68.1L332.3 71.8L338.9 77.6L341.7 80.6L344.1 81.9L347.8 82.7L352.1 82.7L354.5 82.6L359.3 81.8L370.7 81.1L377.2 81.2L371.8 89L365.2 98.4L353.1 115.6L344 124.7L336.9 131.6L336.5 140.4L336.5 159.2L336.6 196.5L336.8 234L336.9 271.4L336.9 290.1L336.9 296.4L343 304.3L349.1 311.9L356.9 322.1L361.1 327.5L361.9 329.4L361.5 333L355.2 340.6L349.9 344.1L342.7 345.7L340.6 345.4L337.7 344.3L336.6 346.2L335.8 349L334.2 348.4L333.7 352.7L334.5 355.1L333.4 358.5L329.9 361.4L329.6 363.9L322.1 370.5L311.5 371.2L305.9 374.5L303.4 377.1L301.5 382.9L302.3 391.8L299.2 398.6L298.8 402L293.2 406.4L290.8 410.5L289 414.7L287.4 416.5L285.5 425.8L282.9 431.4L282.3 433.3L281.7 435L279.7 438.3L278.5 440.6L277.5 442.1L270.9 456.5L265.8 463.1L262 462.3L259.3 464.8L257.7 465.4L254.3 463L247.5 458.1L240.7 453.1L233.9 448.3L227 443.3L220.3 438.4L213.4 433.6L206.6 428.6L199.8 423.7L195.8 420.8L194.1 419.2L192.6 415.8L190.1 413.8L188 413.6L187.4 411.4L188.2 409L190.7 404.5L190.9 401.8L190.4 398.8L189.6 394L184.5 390.4L175.1 385.1L165.5 379.9L156.1 374.5L146.6 369.3L137.2 364L127.6 358.7L118.2 353.4L108.8 348.2L99.3 342.9L89.9 337.6L80.3 332.3L70.9 327L61.5 321.8L52 316.4L42.6 311.2L33 305.9L29.5 303.9L26.3 302.3Z'

// Lake Turkana — stylized lens anchored to the lake's real projected extents.
const LAKE_TURKANA =
  'M116.9 60.2C127 74 138 118 142.6 149.9C139 153 134.5 152 131.5 147C119 128 110.5 86 111.5 66C112.5 61.5 114.5 59.3 116.9 60.2Z'

// Positions share the outline's projection — relative geography, not survey data.
// tip: which way the tooltip hangs so it never leaves the viewport at 375px.
// Positions are county seats projected with the same transform as the outline.
// Notes only restate the legend (active projects / regional presence) plus the
// region name — per-county service claims live in the admin-managed portfolio.
const locations = [
  { id: 'turkana', name: 'Turkana', x: 98.3, y: 119.3, note: 'Regional presence', regional: true, tip: 'start' },
  { id: 'west-pokot', name: 'West Pokot', x: 77, y: 202.7, note: 'Active projects · Rift Valley', tip: 'start' },
  { id: 'elgeyo-marakwet', name: 'Elgeyo-Marakwet', x: 94.3, y: 228, note: 'Active projects · Rift Valley', tip: 'center' },
  { id: 'bungoma', name: 'Bungoma', x: 52.1, y: 232.5, note: 'Active projects · Western', tip: 'start' },
  { id: 'uasin-gishu', name: 'Uasin Gishu', x: 83.6, y: 234.7, note: 'Group HQ · County infrastructure', hq: true, tip: 'start' },
  { id: 'kakamega', name: 'Kakamega', x: 60.5, y: 245.3, note: 'Active projects · Western', tip: 'start' },
  { id: 'nandi', name: 'Nandi', x: 76.1, y: 248.9, note: 'Active projects · Rift Valley', tip: 'start' },
  { id: 'kisumu', name: 'Kisumu', x: 61, y: 261.7, note: 'Active projects · Nyanza', tip: 'start' },
  { id: 'nakuru', name: 'Nakuru', x: 119.1, y: 271.1, note: 'Active projects · Rift Valley', tip: 'center' },
  { id: 'machakos', name: 'Machakos', x: 171.9, y: 325.2, note: 'Regional presence', regional: true, tip: 'center' },
  { id: 'mombasa', name: 'Mombasa', x: 278.5, y: 437.5, note: 'Regional presence', regional: true, tip: 'end' },
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
