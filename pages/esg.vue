<script setup>
import { group } from '~/data/group'

useSeoMeta({
  title: 'Sustainability & ESG',
  description:
    'Kyul Group’s approach to environmental stewardship, social impact and governance: formal jobs, NEMA-compliant delivery and investor-grade transparency.',
})

const commitments = [
  { icon: 'lucide:sun', text: 'Solar-powered boreholes and installations as a standard specification where feasible.' },
  { icon: 'lucide:recycle', text: 'NEMA-compliant, mercury-free practices across mining and civil works.' },
  { icon: 'lucide:users-round', text: 'Local employment and procurement that keeps value in the communities we build in.' },
  { icon: 'lucide:scale', text: 'Anti-bribery, conflict-of-interest and delegated-authority policies, Group-wide.' },
  { icon: 'lucide:hand-heart', text: 'Community shareholding on selected project SPVs.' },
  { icon: 'lucide:hard-hat', text: 'A genuine zero-harm safety culture on every site.' },
]
</script>

<template>
  <div>
    <PageHero
      size="lg"
      eyebrow="Sustainability & ESG"
      title="Returns, and the resilience we leave behind."
      :lede="group.esg.lede"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Sustainability' }]"
    />

    <!-- pillars -->
    <section class="shell py-20 md:py-24">
      <div class="grid gap-6 lg:grid-cols-3">
        <div v-for="(p, i) in group.esg.pillars" :key="p.name" v-reveal="i * 90" class="flex flex-col rounded-3xl border border-ink/[0.07] bg-white p-8 shadow-soft">
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-700"><Icon :name="p.icon" class="h-6 w-6" /></span>
          <h2 class="mt-5 font-display text-2xl text-forest-950">{{ p.name }}</h2>
          <p class="mt-3 flex-1 leading-relaxed text-forest-900/70">{{ p.text }}</p>
          <dl class="mt-6 space-y-3 border-t border-ink/[0.07] pt-6">
            <div v-for="m in p.metrics" :key="m.label" class="flex items-center justify-between gap-3">
              <dt class="text-sm text-forest-900/60">{{ m.label }}</dt>
              <dd class="text-right font-display text-base text-forest-950">{{ m.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- commitments -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading eyebrow="Our commitments" title="Sustainability, built into delivery." lede="ESG isn’t a report we publish once a year. It’s engineered into how every Kyul project is originated, built and governed." />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(c, i) in commitments" :key="i" v-reveal="(i % 3) * 70" class="flex gap-4 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="c.icon" class="h-5 w-5" /></span>
            <p class="text-sm leading-relaxed text-forest-900/75">{{ c.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- statement -->
    <section class="shell py-20 md:py-24">
      <div v-reveal class="mx-auto max-w-3xl text-center">
        <Icon name="lucide:quote" class="mx-auto h-9 w-9 text-gold-400" />
        <p class="mt-6 font-display text-2xl leading-snug text-forest-950 sm:text-3xl">
          “We measure success not only in returns, but in the jobs created, the infrastructure built and the communities
          strengthened along the way.”
        </p>
        <p class="mt-6 text-sm font-medium uppercase tracking-widest2 text-forest-900/50">Office of the Group CEO</p>
      </div>
    </section>

    <CtaBand
      eyebrow="Partner on impact"
      title="Invest in projects that build more than returns."
      :primary="{ label: 'Investor relations', to: '/investors' }"
      :secondary="{ label: 'Contact the Group', to: '/contact' }"
    />
  </div>
</template>
