<script setup>
import { subsidiaries } from '~/data/subsidiaries'
import { group } from '~/data/group'

useSeoMeta({
  title: 'Our Companies',
  description:
    'The six operating companies of Kyul Group — Engineering, Ventures, Enterprises, Projects, Investment and Holdings — forming one integrated value chain.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="The companies"
      title="Six specialists. One Group."
      lede="Each company leads in its own discipline — and together they form a continuous chain from concept to cashflow, coordinated under a single governance structure."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Companies' }]"
    />

    <!-- structure note -->
    <section class="shell py-16 md:py-20">
      <div class="grid gap-10 rounded-3xl border border-ink/[0.07] bg-white p-8 shadow-soft md:grid-cols-3 md:p-12">
        <div v-reveal>
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:crown" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-lg text-forest-950">Kyul Group Inc.</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">The ultimate parent and brand — strategy, policy and board-level oversight of the entire Group.</p>
        </div>
        <div v-reveal="90">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:layers" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-lg text-forest-950">Kyul Holdings Ltd.</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">The sub-holding vehicle — owns equity in the five operating companies and runs shared services and treasury.</p>
        </div>
        <div v-reveal="180">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:building-2" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-lg text-forest-950">Operating companies</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">Five delivery specialists. No company holds shares in another — keeping ownership clean and risk ring-fenced.</p>
        </div>
      </div>
    </section>

    <!-- companies grid -->
    <section class="shell pb-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SubsidiaryCard v-for="(s, i) in subsidiaries" :key="s.slug" :sub="s" :index="i" />
      </div>
    </section>

    <!-- value chain -->
    <section class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="shell relative">
        <SectionHeading tone="paper" align="center" eyebrow="How they work together" :title="group.valueChain.title" :lede="group.valueChain.lede" />
        <div class="mt-14"><ValueChain /></div>
      </div>
    </section>

    <CtaBand
      title="Looking for a specific capability?"
      text="Tell us about your project or partnership — we’ll route it to the right company in the Group."
      :primary="{ label: 'Contact the Group', to: '/contact' }"
      :secondary="{ label: 'Investor relations', to: '/investors' }"
    />
  </div>
</template>
