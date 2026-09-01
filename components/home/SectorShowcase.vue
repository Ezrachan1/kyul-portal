<script setup>
// Five high-growth sectors — vertical numbered index with an editorial detail
// panel. Dark-canvas only: the parent supplies the bg-forest-950 section and
// shell; this root is just a column of content.
import { group } from '~/data/group'

const sectors = group.sectors
const nn = (i) => String(i + 1).padStart(2, '0')

const active = ref(0)
const sector = computed(() => sectors[active.value])

const root = ref(null)
const listWrap = ref(null)
const rowEls = ref([])
const panelId = useId()

// The sliding Kyul line pointer — measured so uneven row heights stay exact.
const lineTop = ref(null)
function placeLine() {
  const el = rowEls.value[active.value]
  if (el) lineTop.value = el.offsetTop + el.offsetHeight / 2
}
watch(active, () => nextTick(placeLine))

// Auto-advance: only while in view, paused on hover/focus, off under reduced motion.
const DELAY = 5000
let timer = null
let observer = null
let resizer = null
let reduced = false
const inView = ref(false)
const paused = ref(false)
const userPaused = ref(false) // explicit control — WCAG 2.2.2

function tick() {
  if (reduced || paused.value || userPaused.value || !inView.value) return
  active.value = (active.value + 1) % sectors.length
}
function restart() {
  if (!timer) return
  clearInterval(timer)
  timer = setInterval(tick, DELAY)
}
function select(i) {
  active.value = i
  restart()
}
function jump(i) {
  select(i)
  rowEls.value[i]?.focus()
}
function move(delta) {
  jump((active.value + delta + sectors.length) % sectors.length)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  observer = new IntersectionObserver(([e]) => { inView.value = e.isIntersecting }, { threshold: 0.25 })
  if (root.value) observer.observe(root.value)
  if (!reduced) timer = setInterval(tick, DELAY)
  placeLine()
  resizer = new ResizeObserver(placeLine)
  if (listWrap.value) resizer.observe(listWrap.value)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  observer?.disconnect()
  resizer?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    @mouseenter="paused = true" @mouseleave="paused = false"
    @focusin="paused = true" @focusout="paused = false"
  >
    <SectionHeading
      eyebrow="Five high-growth sectors"
      title="We invest and build across the sectors shaping Africa."
      tone="paper"
    />

    <div class="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
      <!-- ── Numbered index ──────────────────────────────────────────── -->
      <div v-reveal="120" ref="listWrap" class="relative min-w-0 lg:col-span-6">
        <div
          class="divide-y divide-paper/10"
          role="group" aria-label="Investment sectors"
          @keydown.up.prevent="move(-1)"
          @keydown.down.prevent="move(1)"
          @keydown.home.prevent="jump(0)"
          @keydown.end.prevent="jump(sectors.length - 1)"
        >
          <button
            v-for="(s, i) in sectors" :key="s.name"
            :ref="(el) => (rowEls[i] = el)"
            type="button"
            class="group flex w-full items-baseline gap-4 py-4 pl-12 pr-2 text-left transition-colors duration-300 focus-visible:outline-gold-300 sm:gap-5 sm:py-[1.15rem]"
            :aria-current="i === active ? 'true' : null"
            :aria-controls="panelId"
            @click="select(i)"
            @mouseenter="select(i)"
          >
            <span
              class="stat-display w-7 shrink-0 text-sm transition-colors duration-300"
              :class="i === active ? 'text-gold-300' : 'text-paper/55 group-hover:text-paper/75'"
            >{{ nn(i) }}</span>
            <span
              class="min-w-0 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 sm:text-[0.85rem] sm:tracking-widest2"
              :class="i === active ? 'text-paper' : 'text-paper/60 group-hover:text-paper/80'"
            >{{ s.name }}</span>
          </button>
        </div>

        <!-- sliding pointer: the signature line's node marks the active row -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-0 w-8 -translate-y-1/2 transition-[top,opacity] duration-500 ease-out-expo"
          :class="lineTop === null && 'opacity-0'"
          :style="{ top: (lineTop ?? 0) + 'px' }"
        >
          <KyulLine tone="paper" :node="82" />
        </div>

        <!-- explicit pause control for the auto-rotation (WCAG 2.2.2) -->
        <button
          type="button"
          class="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors duration-300 hover:border-gold-300 hover:text-gold-200 focus-visible:outline-gold-300"
          :aria-pressed="userPaused"
          :aria-label="userPaused ? 'Resume automatic sector rotation' : 'Pause automatic sector rotation'"
          @click="userPaused = !userPaused"
        >
          <Icon :name="userPaused ? 'lucide:play' : 'lucide:pause'" class="h-3.5 w-3.5" />
        </button>
      </div>

      <!-- ── Active sector panel ─────────────────────────────────────── -->
      <div
        :id="panelId"
        v-reveal="180"
        class="min-w-0 lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-paper/10 lg:pl-12"
      >
        <Transition name="sector" mode="out-in">
          <div :key="sector.name" class="min-h-[16rem] sm:min-h-[14rem]">
            <span
              aria-hidden="true"
              class="flex h-14 w-14 items-center justify-center rounded-full border border-gold-300/30 bg-gold-300/10 text-gold-200"
            >
              <Icon :name="sector.icon" class="h-6 w-6" />
            </span>
            <h3 class="mt-6 font-display text-3xl tracking-tightish text-paper sm:text-[2.1rem]">
              {{ sector.name }}
            </h3>
            <p class="mt-4 max-w-md text-lg leading-relaxed text-paper/65">{{ sector.text }}</p>
            <NuxtLink
              :to="{ path: '/projects', query: { sector: sector.name } }"
              class="link-underline mt-8 inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-gold-200 focus-visible:outline-gold-300"
            >
              Explore our projects<Icon name="lucide:arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sector-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sector-leave-active {
  transition: opacity 0.15s ease;
}
.sector-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.sector-leave-to {
  opacity: 0;
}
</style>
