<script setup>
const { c, group } = useContent()

useSeoMeta({
  title: 'Sustainability & ESG',
  description:
    'Kyul Group’s approach to environmental stewardship, social impact and governance: formal jobs, NEMA-compliant delivery and investor-grade transparency.',
})

// Commitment copy lives in the content registry (esg.commitments.<i>.text); icons stay here
const ICONS = ['lucide:sun', 'lucide:recycle', 'lucide:users-round', 'lucide:scale', 'lucide:hand-heart', 'lucide:hard-hat']
const commitments = computed(() => ICONS.map((icon, i) => ({ icon, text: c('esg.commitments.' + i + '.text') })))
</script>

<template>
  <div>
    <PageHero
      size="lg"
      :eyebrow="c('esg.hero.eyebrow')"
      :title="c('esg.hero.title')"
      :lede="group.esg.lede"
      :image="c('esg.hero.image')"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Sustainability' }]"
    />

    <!-- pillars -->
    <section class="shell py-20 md:py-24">
      <div class="grid gap-6 lg:grid-cols-3">
        <div v-for="(p, i) in group.esg.pillars" :key="p.name" v-reveal="i * 90" class="flex flex-col rounded-2xl border border-ink/[0.07] bg-white p-8 shadow-soft">
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-700"><Icon :name="p.icon" class="h-6 w-6" /></span>
          <h2 class="mt-5 font-display text-2xl text-forest-950">{{ p.name }}</h2>
          <p class="mt-3 flex-1 leading-relaxed text-forest-900/70">{{ p.text }}</p>
          <dl class="mt-6 space-y-3 border-t border-ink/[0.07] pt-6">
            <div v-for="m in p.metrics" :key="m.label" class="flex items-center justify-between gap-3">
              <dt class="text-sm text-forest-900/70">{{ m.label }}</dt>
              <dd class="text-right font-display text-base text-forest-950">{{ m.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- commitments -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading :eyebrow="c('esg.commitments.eyebrow')" :title="c('esg.commitments.title')" :lede="c('esg.commitments.lede')" />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(item, i) in commitments" :key="i" v-reveal="(i % 3) * 70" class="flex gap-4 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="item.icon" class="h-5 w-5" /></span>
            <p class="text-sm leading-relaxed text-forest-900/75">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- statement -->
    <section class="shell py-20 md:py-24">
      <div v-reveal class="mx-auto max-w-3xl text-center">
        <Icon name="lucide:quote" class="mx-auto h-9 w-9 text-gold-400" />
        <p class="mt-6 font-display text-2xl leading-snug text-forest-950 sm:text-3xl">
          “{{ c('esg.quote.text') }}”
        </p>
        <p class="mt-6 text-sm font-medium uppercase tracking-widest2 text-forest-900/70">{{ c('esg.quote.by') }}</p>
      </div>
    </section>

    <CtaBand
      :eyebrow="c('esg.cta.eyebrow')"
      :title="c('esg.cta.title')"
      :primary="{ label: 'Investor relations', to: '/investors' }"
      :secondary="{ label: 'Contact the Group', to: '/contact' }"
    />
  </div>
</template>
