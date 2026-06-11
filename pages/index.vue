<script setup>
import { group } from '~/data/group'
import { subsidiaries } from '~/data/subsidiaries'
import { articles } from '~/data/news'
import { site } from '~/data/site'

useSeoMeta({
  title: 'Building Africa’s Future. Together.',
  description:
    'Kyul Group Inc. is an integrated project delivery and investment group that originates, designs, finances, builds and operates bankable projects across Eastern Africa.',
  ogTitle: 'Kyul Group Inc. · Building Africa’s Future. Together.',
  ogDescription: 'An integrated project delivery and investment group across Eastern Africa.',
})

const featured = articles.filter((a) => a.featured).slice(0, 3)
const heroStats = group.stats.slice(0, 3)
</script>

<template>
  <div>
    <!-- ───────────────────────── HERO ───────────────────────── -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_-10%,#eef6f1,transparent_70%)]" />
      <div class="pointer-events-none absolute right-[-10%] top-10 h-[30rem] w-[30rem] rounded-full bg-gold-100/40 blur-3xl" />

      <div class="shell relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div class="lg:col-span-7">
          <p v-reveal class="eyebrow">Kyul Group Inc. · Eastern Africa</p>
          <h1 v-reveal="70" class="h-display mt-5 text-[2.7rem] leading-[1.02] text-balance text-forest-950 sm:text-6xl lg:text-[4.6rem]">
            Building Africa’s<br class="hidden sm:block" /> Future. <span class="italic text-forest-700">Together.</span>
          </h1>
          <p v-reveal="150" class="mt-7 max-w-xl text-lg leading-relaxed text-forest-900/70">
            One Group, six specialist companies, and a single thread of accountability, from the first feasibility
            study to a completed, revenue-generating asset.
          </p>
          <div v-reveal="220" class="mt-9 flex flex-wrap gap-3">
            <NuxtLink to="/subsidiaries" class="btn-primary">Explore the Group<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
            <NuxtLink to="/investors" class="btn-outline">Investor relations</NuxtLink>
          </div>
          <div v-reveal="300" class="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-forest-900/55">
            <span class="flex items-center gap-2"><Icon name="lucide:map-pin" class="h-4 w-4 text-gold-600" /> Eldoret, Kenya</span>
            <span class="hidden h-4 w-px bg-ink/10 sm:block" />
            <span class="flex items-center gap-2"><Icon name="lucide:calendar" class="h-4 w-4 text-gold-600" /> Established {{ site.founded }}</span>
            <span class="hidden h-4 w-px bg-ink/10 sm:block" />
            <span class="flex items-center gap-2"><Icon name="lucide:layers" class="h-4 w-4 text-gold-600" /> Six operating companies</span>
          </div>
        </div>

        <div v-reveal="180" class="lg:col-span-5">
          <div class="relative mx-auto max-w-md">
            <div class="overflow-hidden rounded-[1.75rem] border border-ink/[0.08] bg-white shadow-lift ring-1 ring-black/[0.02]">
              <img src="/logos/kyul-group.png" alt="Kyul Group Inc." class="aspect-square w-full object-cover" />
            </div>
            <!-- floating stat card -->
            <div class="absolute -bottom-6 -left-4 w-52 rounded-2xl border border-ink/[0.07] bg-white/90 p-4 shadow-card backdrop-blur sm:-left-8">
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/45">Group turnover, 2025</p>
              <p class="mt-1 font-display text-2xl text-forest-950">KSh 510M</p>
              <div class="mt-2 flex items-center gap-1.5 text-xs font-medium text-forest-700">
                <Icon name="lucide:trending-up" class="h-4 w-4" /> +59% year on year
              </div>
            </div>
            <div class="absolute -right-3 -top-3 hidden h-16 w-16 rounded-2xl border border-gold-300/50 bg-gold-100/40 sm:block" />
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────────────────── STATS BAND ───────────────────────── -->
    <section class="relative overflow-hidden bg-forest-950 text-paper">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="shell relative py-14 md:py-16">
        <div class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(s, i) in group.stats" :key="i" v-reveal="i * 80" class="border-l border-paper/15 pl-5">
            <p class="font-display text-3xl text-gold-200 sm:text-4xl">{{ s.value }}</p>
            <p class="mt-2 text-sm font-medium text-paper/85">{{ s.label }}</p>
            <p v-if="s.sub" class="mt-0.5 text-xs text-paper/45">{{ s.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────────────────── POSITIONING ───────────────────────── -->
    <section class="shell py-20 md:py-28">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-5">
          <SectionHeading eyebrow="The Group" title="An integrated group, built for accountability." />
          <p v-reveal="160" class="mt-6 text-lg leading-relaxed text-forest-900/70">{{ group.intro }}</p>
          <p v-reveal="200" class="mt-4 leading-relaxed text-forest-900/65">{{ group.narrative }}</p>
          <NuxtLink v-reveal="240" to="/about" class="mt-7 inline-flex items-center gap-1.5 font-semibold text-forest-800 link-underline">
            More about Kyul Group <Icon name="lucide:arrow-right" class="h-4 w-4" />
          </NuxtLink>
        </div>
        <div class="lg:col-span-7">
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="(v, i) in group.values" :key="v.name" v-reveal="i * 70"
              class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-card"
            >
              <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
                <Icon :name="v.icon" class="h-5 w-5" />
              </span>
              <h3 class="mt-4 font-display text-lg text-forest-950">{{ v.name }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ v.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────────────────── COMPANIES ───────────────────────── -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-28">
      <div class="shell">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="The companies"
            title="Six specialists. One value chain."
            lede="Each company is a leader in its field, and a link in a continuous chain from concept to cashflow."
          />
          <NuxtLink to="/subsidiaries" class="btn-outline hidden shrink-0 md:inline-flex">View all companies</NuxtLink>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SubsidiaryCard v-for="(s, i) in subsidiaries" :key="s.slug" :sub="s" :index="i" />
        </div>
      </div>
    </section>

    <!-- ───────────────────────── CONCEPT TO CASHFLOW ───────────────────────── -->
    <section class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="shell relative">
        <SectionHeading
          tone="paper" align="center"
          eyebrow="The integrated model"
          :title="group.valueChain.title"
          :lede="group.valueChain.lede"
        />
        <div class="mt-14">
          <ValueChain />
        </div>
      </div>
    </section>

    <!-- ───────────────────────── SECTORS ───────────────────────── -->
    <section class="shell py-20 md:py-28">
      <SectionHeading
        align="center"
        eyebrow="Where we operate"
        title="Five high-growth sectors"
        lede="Diversified by design, so the Group is resilient, and our companies reinforce one another."
      />
      <div class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div
          v-for="(s, i) in group.sectors" :key="s.name" v-reveal="i * 70"
          class="group rounded-2xl border border-ink/[0.07] bg-white p-6 text-center shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-card"
        >
          <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-700 transition group-hover:bg-forest-950 group-hover:text-gold-200">
            <Icon :name="s.icon" class="h-6 w-6" />
          </span>
          <h3 class="mt-4 font-display text-lg text-forest-950">{{ s.name }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest-900/60">{{ s.text }}</p>
        </div>
      </div>
    </section>

    <!-- ───────────────────────── INVESTOR STRIP ───────────────────────── -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-28">
      <div class="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Investor relations"
            title="Investment-ready, by design."
            lede="Clean ownership through Kyul Holdings, ring-fenced project SPVs and consolidated, audited reporting: the transparency institutional and diaspora investors expect."
          />
          <div v-reveal="200" class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/investors" class="btn-primary">Investor relations<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
            <NuxtLink to="/investors/data-room" class="btn-outline"><Icon name="lucide:lock" class="h-4 w-4" /> Data room</NuxtLink>
          </div>
        </div>
        <div v-reveal="120" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-card sm:p-8">
          <div class="flex items-baseline justify-between">
            <div>
              <p class="text-sm font-medium text-forest-900/60">Consolidated Group turnover</p>
              <p class="font-display text-3xl text-forest-950">KSh 510M <span class="text-base font-normal text-forest-700">FY2025</span></p>
            </div>
            <span class="pill !border-forest-200 !bg-forest-50 !text-forest-700"><Icon name="lucide:trending-up" class="h-3.5 w-3.5" /> +59%</span>
          </div>
          <div class="mt-6">
            <ChartArea :data="group.turnover" :height="260" prefix="" suffix="M" color="#2d5d4b" />
          </div>
          <p class="mt-3 text-center text-xs text-forest-900/45">Group turnover, KSh millions · 2021–2025 (illustrative)</p>
        </div>
      </div>
    </section>

    <!-- ───────────────────────── NEWS ───────────────────────── -->
    <section class="shell py-20 md:py-28">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading eyebrow="News & insights" title="From across the Group" />
        <NuxtLink to="/news" class="btn-outline hidden shrink-0 md:inline-flex">All news</NuxtLink>
      </div>
      <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ArticleCard v-for="(a, i) in featured" :key="a.slug" :article="a" :index="i" />
      </div>
    </section>

    <!-- ───────────────────────── CTA ───────────────────────── -->
    <CtaBand
      eyebrow="Partner with Kyul"
      title="Let’s build something that lasts."
      text="Whether you’re an investor, a partner or a client, the conversation starts here."
      :primary="{ label: 'Get in touch', to: '/contact' }"
      :secondary="{ label: 'Explore careers', to: '/careers' }"
    />
  </div>
</template>
