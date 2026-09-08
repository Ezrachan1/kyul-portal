<script setup>
// "Why Kyul" — light editorial section. Plain paper canvas: it sits between
// the dark footprint/sectors band and the investor/news sections, so no tint.
const { c, group } = useContent()

const advantages = computed(() => group.value.advantages)

// The model as a compact vertical journey. Micro-labels are the stage nouns;
// entities come from the value chain so the order stays canonical.
const STAGES = ['Originate', 'Design', 'Capital', 'Build', 'Supply', 'Govern']
const flow = computed(() => group.value.valueChain.steps.map((s, i) => ({ label: STAGES[i], entity: s.entity })))

const flowAlt = computed(
  () =>
    'The Kyul model: ' +
    group.value.valueChain.steps.map((s) => `${s.entity} ${s.action.toLowerCase()}`).join(', ') +
    '.',
)
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="shell">
      <div class="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <!-- ── Heading + model diagram ─────────────────────────────────── -->
        <div class="min-w-0 lg:col-span-5">
          <SectionHeading
            :eyebrow="c('home.why.eyebrow')"
            :title="c('home.why.title')"
            :lede="c('home.why.lede')"
          />

          <div v-reveal="200" class="mt-12 max-w-sm">
            <p class="sr-only">{{ flowAlt }}</p>
            <div aria-hidden="true" class="relative">
              <span class="flow-spine absolute bottom-3 left-[3px] top-3 w-px" />
              <div
                v-for="f in flow" :key="f.label"
                class="flex items-center gap-3 py-[0.55rem] sm:gap-4"
              >
                <span class="relative z-10 h-[7px] w-[7px] shrink-0 rounded-full bg-gold-300 shadow-[0_0_0_4px_rgba(217,185,98,0.16)]" />
                <span class="w-[5.5rem] shrink-0 text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-950">
                  {{ f.label }}
                </span>
                <span class="h-px min-w-4 flex-1 bg-ink/10" />
                <span class="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-forest-900/60">
                  {{ f.entity }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Six advantages — editorial two-column list ───────────────── -->
        <div class="min-w-0 lg:col-span-7">
          <div class="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            <div
              v-for="(a, i) in advantages" :key="a.title"
              v-reveal="i * 70"
              class="min-w-0 border-t border-ink/10 pt-6"
            >
              <span
                aria-hidden="true"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-700 ring-1 ring-forest-900/10"
              >
                <Icon :name="a.icon" class="h-4 w-4" />
              </span>
              <h3 class="mt-4 font-sans text-base font-semibold text-forest-950">{{ a.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-forest-900/65">{{ a.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Vertical cousin of .kyul-line: gold origin fading down through ink */
.flow-spine {
  background: linear-gradient(180deg, rgba(189, 144, 56, 0.65), rgba(18, 32, 28, 0.12) 60%, transparent);
}
</style>
