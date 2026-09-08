<script setup>
const { c, group, subsidiaries } = useContent()

useSeoMeta({
  title: 'Our Companies',
  description:
    'The six operating companies of Kyul Group (Engineering, Ventures, Enterprises, Projects, Investment and Holdings), forming one integrated value chain.',
})

// Cards read as the value chain (01 Originates → 06 Governs), matching their numbering.
const chainOrder = computed(() => group.value.valueChain.steps.map((s) => s.slug))
const companies = computed(() => chainOrder.value.map((slug) => subsidiaries.value.find((s) => s.slug === slug)).filter(Boolean))
</script>

<template>
  <div>
    <PageHero
      :eyebrow="c('companies.hero.eyebrow')"
      :title="c('companies.hero.title')"
      :lede="c('companies.hero.lede')"
      :image="c('companies.hero.image')"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Companies' }]"
    />

    <!-- structure note -->
    <section class="shell py-16 md:py-20">
      <div class="grid gap-10 rounded-3xl border border-ink/[0.07] bg-white p-8 shadow-soft md:grid-cols-3 md:p-12">
        <div v-reveal>
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:crown" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-lg text-forest-950">{{ c('companies.structure.parent.title') }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ c('companies.structure.parent.text') }}</p>
        </div>
        <div v-reveal="90">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:layers" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-lg text-forest-950">{{ c('companies.structure.holdings.title') }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ c('companies.structure.holdings.text') }}</p>
        </div>
        <div v-reveal="180">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:building-2" class="h-5 w-5" /></span>
          <h3 class="mt-4 font-display text-lg text-forest-950">{{ c('companies.structure.opcos.title') }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ c('companies.structure.opcos.text') }}</p>
        </div>
      </div>
    </section>

    <!-- companies grid -->
    <section class="shell pb-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SubsidiaryCard v-for="(s, i) in companies" :key="s.slug" :sub="s" :index="i" />
      </div>
    </section>

    <!-- value chain -->
    <section class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="shell relative">
        <SectionHeading tone="paper" align="center" :eyebrow="c('companies.chain.eyebrow')" :title="group.valueChain.title" :lede="group.valueChain.lede" />
        <div class="mt-14"><ValueChain tone="paper" /></div>
      </div>
    </section>

    <CtaBand
      :title="c('companies.cta.title')"
      :text="c('companies.cta.text')"
      :primary="{ label: 'Contact the Group', to: '/contact' }"
      :secondary="{ label: 'Investor relations', to: '/investors' }"
    />
  </div>
</template>
