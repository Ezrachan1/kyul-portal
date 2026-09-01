<script setup>
const props = defineProps({
  sub: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

// Value-chain position by slug — keep the Group's 01→06 order and verbs exact.
const CHAIN = {
  projects: { n: '01', role: 'Originate' },
  ventures: { n: '02', role: 'Design' },
  investment: { n: '03', role: 'Fund' },
  engineering: { n: '04', role: 'Build' },
  enterprises: { n: '05', role: 'Supply' },
  holdings: { n: '06', role: 'Govern' },
}

const chain = computed(() => CHAIN[props.sub.slug])

// Non-clean logos only exist as framed renders on their native tone.
const logoSrc = computed(() => (props.sub.logo.clean ? props.sub.logo.src : props.sub.logo.full))

// Measured intrinsic PNG dimensions (public/logos) so the browser reserves the
// aspect ratio before load. Unmapped paths simply omit the attributes.
const LOGO_DIMS = {
  '/logos/kyul-engineering-t.png': { w: 1600, h: 989 },
  '/logos/kyul-ventures-t.png': { w: 1600, h: 823 },
  '/logos/kyul-enterprises-t.png': { w: 1159, h: 909 },
  '/logos/kyul-projects-t.png': { w: 1115, h: 649 },
  '/logos/kyul-investment.png': { w: 1067, h: 1600 },
  '/logos/kyul-holdings.png': { w: 1600, h: 1600 },
}
const logoDims = computed(() => LOGO_DIMS[logoSrc.value])

// ~12% accent wash melting into the white card body.
const bandStyle = computed(() => ({
  background: `linear-gradient(165deg, ${props.sub.accent}1f 0%, ${props.sub.accent}0c 48%, #ffffff 92%)`,
}))

const servicesLine = computed(() =>
  (props.sub.services || []).slice(0, 3).map((s) => s.name || s).join(' · ')
)
</script>

<template>
  <NuxtLink
    v-reveal="(index % 3) * 90"
    :to="`/subsidiaries/${sub.slug}`"
    class="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-card"
  >
    <!-- accent top rule -->
    <span
      aria-hidden="true"
      class="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
      :style="{ background: sub.accent }"
    />

    <!-- capability header band -->
    <div class="relative h-36 overflow-hidden" :style="bandStyle">
      <span
        v-if="chain"
        aria-hidden="true"
        class="absolute -bottom-4 -right-2 select-none whitespace-nowrap font-display text-[4.75rem] uppercase leading-none tracking-tightish opacity-[0.15] transition-transform duration-700 ease-out-expo group-hover:-translate-x-2"
        :style="{ color: sub.accent }"
      >{{ chain.role }}</span>
      <div class="relative flex h-full items-center px-6">
        <img
          :src="logoSrc"
          alt=""
          loading="lazy"
          decoding="async"
          :width="logoDims?.w"
          :height="logoDims?.h"
          class="max-h-14 w-auto max-w-[65%] object-contain transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          :class="sub.logo.clean ? '' : 'rounded-lg ring-1 ring-ink/10'"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col p-6 pt-5">
      <span
        v-if="chain"
        class="text-[0.7rem] font-semibold uppercase tracking-widest2"
        :style="{ color: sub.accentInk }"
      >{{ chain.n }} · {{ chain.role }}</span>
      <h3 class="mt-2.5 font-display text-xl text-forest-950">{{ sub.short }}</h3>
      <p class="mt-1 font-display text-sm italic text-forest-900/70">{{ sub.tagline }}</p>
      <p class="mt-2.5 text-sm leading-relaxed text-forest-900/65 line-clamp-2">{{ sub.summary }}</p>

      <!-- services strip: always visible on touch, hover-revealed on lg -->
      <div
        v-if="servicesLine"
        class="overflow-hidden transition-all duration-500 ease-out-expo lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-16 lg:group-hover:opacity-100 lg:group-focus-visible:max-h-16 lg:group-focus-visible:opacity-100"
      >
        <p class="pt-3 text-xs leading-relaxed text-forest-900/70">{{ servicesLine }}</p>
      </div>

      <span class="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-forest-800">
        <span class="link-underline group-hover:after:origin-left group-hover:after:scale-x-100">Explore</span>
        <Icon name="lucide:arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </div>
  </NuxtLink>
</template>
