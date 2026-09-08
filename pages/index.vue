<script setup>
const { c, group, subsidiaries } = useContent()

useSeoMeta({
  title: 'Building Africa’s Future. Together.',
  description:
    'Kyul Group Inc. is an integrated project delivery and investment group that originates, finances, builds and operates bankable projects across Eastern Africa.',
  ogTitle: 'Kyul Group Inc. · Building Africa’s Future. Together.',
  ogDescription: 'An integrated project delivery and investment group across Eastern Africa.',
})

// Companies presented in value-chain order (01 Originates → 06 Governs)
const chainOrder = computed(() => group.value.valueChain.steps.map((s) => s.slug))
const companies = computed(() =>
  chainOrder.value.map((slug) => subsidiaries.value.find((s) => s.slug === slug)).filter(Boolean),
)
</script>

<template>
  <div>
    <HomeHero />

    <!-- ───────────── Concept to Cashflow — the signature journey ───────────── -->
    <section class="relative overflow-hidden py-20 md:py-28">
      <div class="shell">
        <SectionHeading
          align="center"
          :eyebrow="c('home.chain.eyebrow')"
          :title="group.valueChain.title"
          :lede="group.valueChain.lede"
        />
        <div class="mt-14">
          <ValueChain />
        </div>
      </div>
    </section>

    <!-- ───────────── Featured project — proof over promise ───────────── -->
    <HomeFeaturedProject />

    <!-- ───────────── Six specialists ───────────── -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-28">
      <div class="shell">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            :eyebrow="c('home.companies.eyebrow')"
            :title="c('home.companies.title')"
            :lede="c('home.companies.lede')"
          />
          <NuxtLink to="/subsidiaries" class="btn-outline hidden shrink-0 md:inline-flex">Explore the Group</NuxtLink>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SubsidiaryCard v-for="(s, i) in companies" :key="s.slug" :sub="s" :index="i" />
        </div>
        <NuxtLink to="/subsidiaries" class="btn-outline mt-8 inline-flex md:hidden">Explore the Group</NuxtLink>
      </div>
    </section>

    <!-- ───────────── Footprint + sectors — one dark editorial band ───────────── -->
    <section class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="shell-wide relative grid gap-16 lg:grid-cols-2 lg:gap-12">
        <HomeFootprintMap class="min-w-0" />
        <HomeSectorShowcase class="min-w-0" />
      </div>
    </section>

    <!-- ───────────── Why Kyul ───────────── -->
    <HomeWhyKyul />

    <!-- ───────────── Investor relations ───────────── -->
    <HomeInvestorBand />

    <!-- ───────────── News & insights ───────────── -->
    <HomeNewsEditorial />

    <!-- ───────────── CTA ───────────── -->
    <CtaBand
      :eyebrow="c('home.cta.eyebrow')"
      :title="c('home.cta.title')"
      :text="c('home.cta.text')"
      :primary="{ label: 'Start a project', to: '/contact' }"
      :secondary="{ label: 'Invest with Kyul', to: '/investors' }"
      :tertiary="{ label: 'Partner with us', to: '/contact' }"
    />
  </div>
</template>
