<script setup>
import { site } from '~/data/site'

const { c, n } = useContent()
</script>

<template>
  <!-- Pulled up under the fixed header so the forest ground reads continuous -->
  <section class="relative -mt-16 overflow-hidden bg-forest-950 pt-16 text-paper sm:-mt-[4.75rem] sm:pt-[4.75rem]">
    <!-- optional photo sits under a forest wash so the title stays legible -->
    <img v-if="c('home.hero.image')" :src="c('home.hero.image')" alt="" aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full object-cover" />
    <div v-if="c('home.hero.image')" class="pointer-events-none absolute inset-0 bg-forest-950/75" />
    <!-- layered terrain: gradient wash → topographic contours → grain -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_0%,rgba(45,93,75,0.55),transparent_65%),radial-gradient(50%_40%_at_95%_100%,rgba(189,144,56,0.14),transparent_70%)]" />
    <TopoContours tone="paper" :opacity="0.07" />
    <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />

    <div class="shell relative">
      <div class="grid items-center gap-14 py-20 md:py-24 lg:grid-cols-12 lg:gap-10 lg:py-32">
        <div class="lg:col-span-7">
          <p v-reveal class="eyebrow !text-gold-300">{{ c('home.hero.eyebrow') }}</p>
          <h1 v-reveal="70" class="h-display mt-6 text-balance text-[2.9rem] leading-[1.02] text-paper sm:text-6xl lg:text-[5rem]">
            {{ c('home.hero.titleLine1') }}<br class="hidden sm:block" />
            {{ c('home.hero.titleLine2') }} <span class="italic text-gold-200">{{ c('home.hero.titleAccent') }}</span>
          </h1>
          <p v-reveal="150" class="mt-7 max-w-xl text-lg leading-relaxed text-paper/70 sm:text-xl">
            {{ c('home.hero.lede') }}
          </p>
          <div v-reveal="220" class="mt-10 flex flex-wrap gap-3">
            <NuxtLink to="/projects" class="btn-gold">Explore our projects<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
            <NuxtLink to="/investors" class="btn-on-dark">Invest with Kyul<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
          </div>
        </div>

        <div v-reveal="180" class="lg:col-span-5">
          <div class="relative mx-auto max-w-sm">
            <div class="overflow-hidden rounded-[1.75rem] border border-paper/10 bg-forest-900/50 shadow-lift backdrop-blur">
              <div class="flex items-center justify-center bg-[radial-gradient(60%_60%_at_50%_35%,rgba(217,185,98,0.1),transparent_70%)] px-10 pb-6 pt-10">
                <img :src="c('brand.logo')" :alt="site.name" width="1600" height="1600" fetchpriority="high" class="h-44 w-auto object-contain sm:h-52" />
              </div>
              <div class="border-t border-paper/10 px-8 py-6">
                <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-paper/60">{{ c('home.hero.cardLabel') }}</p>
                <p class="stat-display mt-1.5 text-4xl text-paper">KSh <CountUp :to="n('home.hero.cardValue')" suffix="M" /></p>
                <div class="mt-2.5 flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-sm font-medium text-gold-200">
                    <Icon name="lucide:trending-up" class="h-4 w-4" /> {{ c('home.hero.cardGrowth') }}
                  </span>
                  <NuxtLink
                    to="/investors"
                    aria-label="Investor relations"
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/80 transition-all duration-300 ease-out-expo hover:border-gold-300 hover:text-gold-200"
                  >
                    <Icon name="lucide:arrow-up-right" class="h-4 w-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- proof row — evidence for the headline -->
      <div v-reveal="120" class="relative border-t border-paper/10 py-8 lg:py-10">
        <dl class="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
          <div class="flex min-w-0 flex-col">
            <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">{{ c('home.stats.foundedLabel') }}</dt>
            <dd class="stat-display text-3xl text-paper sm:text-4xl"><CountUp :to="n('home.stats.founded')" separator="" /></dd>
          </div>
          <div class="flex min-w-0 flex-col lg:border-l lg:border-paper/10 lg:pl-8">
            <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">{{ c('home.stats.countiesLabel') }}</dt>
            <dd class="stat-display text-3xl text-paper sm:text-4xl"><CountUp :to="n('home.stats.counties')" suffix="+" /></dd>
          </div>
          <div class="flex min-w-0 flex-col lg:border-l lg:border-paper/10 lg:pl-8">
            <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">{{ c('home.stats.deliveredLabel') }}</dt>
            <dd class="stat-display text-3xl text-paper sm:text-4xl">KSh <CountUp :to="n('home.stats.delivered')" suffix="M+" /></dd>
          </div>
          <div class="flex min-w-0 flex-col lg:border-l lg:border-paper/10 lg:pl-8">
            <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-paper/60">{{ c('home.stats.turnoverLabel') }} <span class="normal-case text-gold-200">· {{ c('home.stats.turnoverNote') }}</span></dt>
            <dd class="stat-display text-3xl text-paper sm:text-4xl">KSh <CountUp :to="n('home.stats.turnover')" suffix="M" /></dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
