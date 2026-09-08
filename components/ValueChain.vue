<script setup>
// "Concept to Cashflow" — the Group's signature journey (01 Originates → 06 Governs).
// tone='ink' sits on light canvases (default); tone='paper' on bg-forest-950 sections.
const { c, group, subsidiaryBySlug } = useContent()

const props = defineProps({
  tone: { type: String, default: 'ink' }, // 'ink' | 'paper'
})

const steps = computed(() => group.value.valueChain.steps)
const dark = computed(() => props.tone === 'paper')

// Measured intrinsic PNG dimensions for the clean (-t) logos shown in the stage
// panel — reserves the aspect ratio pre-load. Unmapped paths omit the attributes.
const LOGO_DIMS = {
  '/logos/kyul-engineering-t.png': { w: 1600, h: 989 },
  '/logos/kyul-ventures-t.png': { w: 1600, h: 823 },
  '/logos/kyul-enterprises-t.png': { w: 1159, h: 909 },
  '/logos/kyul-projects-t.png': { w: 1115, h: 649 },
}

const active = ref(0)
const step = computed(() => steps.value[active.value])
const sub = computed(() => subsidiaryBySlug(step.value.slug))
// Optional panel photo per step, set in Site Content (chain.<slug>.image); '' = forest design
const photo = computed(() => c(`chain.${step.value.slug}.image`))
// progress rule fills from node 01's centre to the active node's centre
const fill = computed(() => (active.value / (steps.value.length - 1)) * 100)

const root = ref(null)
const nodeEls = ref([])
const stageId = useId()

// Auto-advance: only while in view, paused on hover/focus, off under reduced motion.
const DELAY = 4200
let timer = null
let observer = null
let reduced = false
const inView = ref(false)
const paused = ref(false)
const userPaused = ref(false) // explicit control — WCAG 2.2.2

function tick() {
  if (reduced || paused.value || userPaused.value || !inView.value) return
  // the rotating stage only exists in the md+ layout; don't churn it on mobile
  if (!window.matchMedia('(min-width: 768px)').matches) return
  active.value = (active.value + 1) % steps.value.length
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
  nodeEls.value[i]?.focus()
}
function move(delta) {
  jump((active.value + delta + steps.value.length) % steps.value.length)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  observer = new IntersectionObserver(([e]) => { inView.value = e.isIntersecting }, { threshold: 0.25 })
  if (root.value) observer.observe(root.value)
  if (!reduced) timer = setInterval(tick, DELAY)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    @mouseenter="paused = true" @mouseleave="paused = false"
    @focusin="paused = true" @focusout="paused = false"
  >
    <!-- ── Desktop: horizontal journey ─────────────────────────────── -->
    <div v-reveal class="hidden md:block">
      <div class="relative">
        <!-- progress rule: hairline track + animated gold fill, node-centre to node-centre -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-[8.333%] top-5 h-px"
          :class="dark ? 'bg-paper/15' : 'bg-ink/10'"
        >
          <div
            class="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-300 shadow-[0_0_12px_rgba(217,185,98,0.35)] transition-[width] duration-500 ease-out-expo"
            :style="{ width: fill + '%' }"
          />
        </div>

        <div
          class="relative grid grid-cols-6"
          role="group" aria-label="Concept to Cashflow steps"
          @keydown.left.prevent="move(-1)"
          @keydown.right.prevent="move(1)"
          @keydown.home.prevent="jump(0)"
          @keydown.end.prevent="jump(steps.length - 1)"
        >
          <button
            v-for="(s, i) in steps" :key="s.slug"
            :ref="(el) => (nodeEls[i] = el)"
            type="button"
            class="flex min-w-0 flex-col items-center gap-3 px-2 pb-1"
            :class="dark && 'focus-visible:outline-gold-300'"
            :aria-current="i === active ? 'step' : null"
            :aria-controls="stageId"
            :aria-label="`${s.n} — ${s.entity}: ${s.action}`"
            @click="select(i)"
            @mouseenter="select(i)"
          >
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full border font-display text-[0.8rem] transition-all duration-300 ease-out-expo"
              :class="i === active
                ? 'scale-110 border-transparent bg-gold-300 text-forest-950 shadow-[0_0_0_6px_rgba(217,185,98,0.18)]'
                : dark
                  ? 'border-paper/25 bg-forest-950 text-paper/70'
                  : 'border-ink/15 bg-paper text-forest-900/70'"
            >{{ s.n }}</span>
            <span
              class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 lg:text-[0.68rem] lg:tracking-widest2"
              :class="i === active
                ? (dark ? 'text-gold-300' : 'text-gold-700')
                : (dark ? 'text-paper/60' : 'text-forest-900/70')"
            >{{ s.action }}</span>
          </button>
        </div>

        <!-- explicit pause control for the auto-rotation (WCAG 2.2.2) -->
        <button
          type="button"
          class="absolute -bottom-11 right-0 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300"
          :class="dark
            ? 'border-paper/20 text-paper/70 hover:border-gold-300 hover:text-gold-200 focus-visible:outline-gold-300'
            : 'border-ink/15 text-forest-900/70 hover:border-forest-900/40 hover:text-forest-950'"
          :aria-pressed="userPaused"
          :aria-label="userPaused ? 'Resume automatic step rotation' : 'Pause automatic step rotation'"
          @click="userPaused = !userPaused"
        >
          <Icon :name="userPaused ? 'lucide:play' : 'lucide:pause'" class="h-3.5 w-3.5" />
        </button>
      </div>

      <!-- stage: the active step, editorial -->
      <div :id="stageId" class="mt-12 min-h-[21rem] lg:mt-14 lg:min-h-[23.5rem]">
        <Transition name="stage" mode="out-in">
          <div
            :key="step.slug"
            class="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16"
          >
            <div class="min-w-0">
              <p
                class="text-[0.7rem] font-semibold uppercase tracking-widest2"
                :class="dark ? 'text-gold-300/80' : 'text-gold-700'"
              >Step {{ step.n }} · {{ sub?.arm }}</p>
              <h3
                class="mt-3 font-display text-5xl tracking-tightish lg:text-6xl"
                :class="dark ? 'text-paper' : 'text-forest-950'"
              >{{ step.action }}<span :class="dark ? 'text-gold-300' : 'text-gold-500'">.</span></h3>
              <NuxtLink
                :to="`/subsidiaries/${step.slug}`"
                class="group mt-5 inline-flex items-center gap-2 text-sm font-semibold underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-gold-400"
                :class="dark ? 'text-paper/90 hover:text-gold-200 focus-visible:outline-gold-300' : 'text-forest-800 hover:text-forest-950'"
              >
                {{ step.entity }}
                <Icon name="lucide:arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </NuxtLink>
              <p
                class="mt-5 max-w-xl text-lg leading-relaxed"
                :class="dark ? 'text-paper/65' : 'text-forest-900/70'"
              >{{ step.text }}</p>
            </div>

            <!-- art-directed panel: forest gradient + contours + mark by default; a
                 Site Content photo (chain.<slug>.image) sits under a forest wash instead -->
            <div
              aria-hidden="true"
              class="relative hidden aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-forest-700 via-forest-900 to-forest-950 shadow-lift md:flex"
            >
              <template v-if="photo">
                <img :src="photo" alt="" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" />
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/30 to-forest-950/10" />
              </template>
              <TopoContours v-else tone="paper" :opacity="0.12" />
              <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
              <span class="absolute right-4 top-1 font-display text-8xl leading-none" :class="photo ? 'text-paper/25' : 'text-paper/10'">{{ step.n }}</span>
              <template v-if="photo">
                <!-- logo badge keeps the mark legible over photography -->
                <span class="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/95 p-2.5 shadow-soft">
                  <img v-if="sub?.logo?.clean" :src="sub.logo.src" alt="" loading="lazy" decoding="async" class="h-full w-full object-contain" />
                  <KyulMark v-else class="w-9" />
                </span>
              </template>
              <template v-else>
                <img
                  v-if="sub?.logo?.clean"
                  :src="sub.logo.src" alt="" loading="lazy" decoding="async"
                  :width="LOGO_DIMS[sub.logo.src]?.w" :height="LOGO_DIMS[sub.logo.src]?.h"
                  class="relative w-[56%] max-w-[160px] object-contain"
                />
                <KyulMark v-else class="relative w-16" />
              </template>
              <span class="absolute bottom-5 left-5 h-1 w-9 rounded-full" :style="{ backgroundColor: sub?.accent }" />
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- ── Mobile: vertical journey, all steps visible ─────────────── -->
    <ol v-reveal class="md:hidden">
      <li
        v-for="(s, i) in steps" :key="s.slug"
        class="relative flex gap-5 pb-9 last:pb-0"
      >
        <span
          v-if="i < steps.length - 1"
          aria-hidden="true"
          class="absolute left-5 top-5 h-full w-px"
          :class="i === 0
            ? (dark ? 'bg-gradient-to-b from-gold-300/70 to-paper/15' : 'bg-gradient-to-b from-gold-500/70 to-ink/10')
            : (dark ? 'bg-paper/15' : 'bg-ink/10')"
        />
        <span
          class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-[0.8rem]"
          :class="dark ? 'border-paper/25 bg-forest-950 text-gold-300' : 'border-ink/15 bg-paper text-gold-700'"
        >{{ s.n }}</span>
        <div class="min-w-0 pt-0.5">
          <p
            class="text-[0.68rem] font-semibold uppercase tracking-widest2"
            :class="dark ? 'text-gold-300/80' : 'text-gold-700'"
          >{{ s.action }}</p>
          <h3 class="mt-1 font-display text-lg" :class="dark ? 'text-paper' : 'text-forest-950'">
            <NuxtLink
              :to="`/subsidiaries/${s.slug}`"
              class="transition-colors duration-300"
              :class="dark ? 'hover:text-gold-200 focus-visible:outline-gold-300' : 'hover:text-forest-700'"
            >{{ s.entity }}</NuxtLink>
          </h3>
          <p class="mt-1.5 text-sm leading-relaxed" :class="dark ? 'text-paper/55' : 'text-forest-900/65'">{{ s.text }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.stage-enter-active {
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.stage-leave-active {
  transition: opacity 0.18s ease;
}
.stage-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.stage-leave-to {
  opacity: 0;
}
</style>
