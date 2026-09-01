<script setup>
import { group } from '~/data/group'
import { subsidiaries } from '~/data/subsidiaries'

useSeoMeta({
  title: 'About the Group',
  description:
    'Kyul Group Inc. is the apex holding and governance entity of the Kyul family: strategy, brand and oversight across six specialist companies in Eastern Africa.',
})

const opcos = subsidiaries.filter((s) => s.slug !== 'holdings')

// Leadership is managed in the Group Portal
const { data: leadership } = await useFetch('/api/team?entity=group', { default: () => [] })
</script>

<template>
  <div>
    <PageHero
      size="lg"
      eyebrow="About the Group"
      title="The apex of the Kyul corporate family."
      :lede="group.intro"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'The Group' }]"
    >
      <template #actions>
        <NuxtLink to="/investors" class="btn-gold">Investor relations<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
        <NuxtLink to="/subsidiaries" class="btn-on-dark">The companies</NuxtLink>
      </template>
    </PageHero>

    <!-- Narrative -->
    <section class="shell py-20 md:py-24">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-7">
          <p v-reveal class="font-display text-2xl leading-snug text-forest-950 sm:text-[1.7rem]">{{ group.narrative }}</p>
          <p v-reveal="120" class="mt-6 leading-relaxed text-forest-900/70">
            The Group operates across infrastructure, agribusiness, mining, manufacturing and real estate, a deliberate
            diversification that makes Kyul resilient and lets each company reinforce the others.
          </p>
        </div>
        <div class="lg:col-span-5">
          <div v-reveal="100" class="rounded-2xl border border-ink/[0.07] bg-forest-950 p-7 text-paper shadow-card">
            <h2 class="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-widest2 text-gold-300"><Icon name="lucide:eye" class="h-4 w-4" /> Vision</h2>
            <p class="mt-3 font-display text-xl leading-snug">{{ group.vision }}</p>
            <div class="my-6 h-px bg-paper/10" />
            <h2 class="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-widest2 text-gold-300"><Icon name="lucide:flag" class="h-4 w-4" /> Mission</h2>
            <p class="mt-3 leading-relaxed text-paper/80">{{ group.mission }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading eyebrow="What we stand for" title="Five values, lived on every project." />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(v, i) in group.values" :key="v.name" v-reveal="(i % 3) * 70" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="v.icon" class="h-5 w-5" /></span>
            <h3 class="mt-4 font-display text-lg text-forest-950">{{ v.name }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ v.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Governance + structure -->
    <section id="governance" class="shell scroll-mt-24 py-20 md:py-24">
      <SectionHeading eyebrow="Governance & structure" title="Clean ownership, by design." :lede="group.governance.lede" />

      <!-- structure diagram -->
      <div v-reveal class="mt-14 rounded-2xl border border-ink/[0.07] bg-white p-8 shadow-soft md:p-12">
        <div class="flex flex-col items-center">
          <div class="w-full max-w-xs rounded-2xl bg-forest-950 px-6 py-5 text-center text-paper shadow-card">
            <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-gold-300/80">Parent & Brand</p>
            <p class="mt-1 font-display text-lg">Kyul Group Inc.</p>
          </div>
          <div class="h-8 w-px bg-ink/15" />
          <div class="w-full max-w-xs rounded-2xl border-2 border-forest-900/15 bg-forest-50 px-6 py-5 text-center">
            <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-700">Sub-Holding</p>
            <p class="mt-1 font-display text-lg text-forest-950">Kyul Holdings Ltd.</p>
            <p class="mt-1 text-xs text-forest-900/70">Owns equity in the five operating companies</p>
          </div>
          <div class="h-8 w-px bg-ink/15" />
          <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div v-for="o in opcos" :key="o.slug" class="rounded-xl border border-ink/[0.08] bg-white px-4 py-4 text-center shadow-soft">
              <span class="mx-auto block h-2 w-2 rounded-full" :style="{ background: o.accent }" />
              <p class="mt-2 text-sm font-semibold text-forest-950">{{ o.short }}</p>
              <p class="mt-0.5 text-[0.68rem] text-forest-900/70">{{ o.arm.replace(' Arm', '') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(p, i) in group.governance.points" :key="p.title" v-reveal="i * 70" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700"><Icon :name="p.icon" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-base text-forest-950">{{ p.title }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ p.text }}</p>
        </div>
      </div>
    </section>

    <!-- Leadership -->
    <section id="leadership" class="scroll-mt-24 border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading eyebrow="Leadership" title="The Board & Group executive." lede="Kyul Group Inc. is governed by its Board of Directors, with each subsidiary led by its own managing director and technical board." />
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TeamCard v-for="(m, i) in leadership" :key="m.id || i" :person="m" :index="i" accent="#2d5d4b" />
        </div>
        <p class="mt-6 text-xs text-forest-900/70">Named board appointments are confirmed in the Group’s governance documentation, available to investors on request.</p>
      </div>
    </section>

    <!-- History -->
    <section class="shell py-20 md:py-24">
      <SectionHeading eyebrow="Our journey" title="From a single practice to an integrated Group." />
      <div class="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
        <div v-for="(h, i) in group.history" :key="h.year" v-reveal="(i % 2) * 80" class="flex gap-5">
          <div class="flex flex-col items-center">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-950 font-display text-sm text-gold-200">{{ h.year }}</span>
            <span v-if="i < group.history.length - 1" class="mt-2 w-px flex-1 bg-ink/10" />
          </div>
          <div class="pb-2">
            <h3 class="font-display text-lg text-forest-950">{{ h.title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ h.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantages -->
    <section class="border-t border-ink/[0.06] bg-forest-950 py-20 text-paper md:py-24">
      <div class="shell">
        <SectionHeading tone="paper" eyebrow="Why Kyul" title="What sets the Group apart." />
        <div class="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(a, i) in group.advantages" :key="a.title" v-reveal="(i % 3) * 70" class="border-l border-paper/15 pl-5">
            <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-gold-300"><Icon :name="a.icon" class="h-5 w-5" /></span>
            <h3 class="mt-4 font-display text-lg text-paper">{{ a.title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-paper/60">{{ a.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="Build with a Group that thinks long term."
      text="Partner with us, invest with us, or join the team shaping Eastern Africa’s next decade."
      :primary="{ label: 'Contact us', to: '/contact' }"
      :secondary="{ label: 'Sustainability', to: '/esg' }"
    />
  </div>
</template>
