<script setup>
import { subsidiaries, subsidiaryBySlug } from '~/data/subsidiaries'
import { jobs } from '~/data/careers'

const route = useRoute()
const sub = computed(() => subsidiaryBySlug(route.params.slug))

if (!sub.value) {
  throw createError({ statusCode: 404, statusMessage: 'Company not found', fatal: true })
}

const others = computed(() => subsidiaries.filter((s) => s.slug !== sub.value.slug))
const openRoles = computed(() => jobs.filter((j) => j.entity === sub.value.slug))

// Team & portfolio are managed in the Group Portal
const { data: teamMembers } = await useFetch(() => `/api/team?entity=${route.params.slug}`, { default: () => [] })
const { data: portfolioItems } = await useFetch(() => `/api/portfolio?entity=${route.params.slug}`, { default: () => [] })

const settings = useSettings()
const subContact = computed(() => settings.value?.subsidiaryContacts?.[route.params.slug] || sub.value.contact)

useSeoMeta({
  title: () => sub.value.name,
  description: () => sub.value.summary,
  ogTitle: () => `${sub.value.name} · Kyul Group`,
  ogDescription: () => sub.value.summary,
})

const accentTint = (hex, alpha) => `${hex}${alpha}`
</script>

<template>
  <div v-if="sub" :style="{ '--accent': sub.accent, '--accent-ink': sub.accentInk }">
    <!-- HERO -->
    <section class="relative overflow-hidden bg-paper">
      <div class="pointer-events-none absolute inset-0" :style="{ background: `radial-gradient(70% 60% at 85% -5%, ${accentTint(sub.accent, '1f')}, transparent 60%)` }" />
      <div class="pointer-events-none absolute inset-x-0 top-0 h-1" :style="{ background: sub.accent }" />

      <div class="shell relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div class="lg:col-span-7">
          <nav class="mb-6 flex flex-wrap items-center gap-2 text-xs text-forest-900/45" aria-label="Breadcrumb">
            <NuxtLink to="/" class="transition hover:text-forest-900">Home</NuxtLink>
            <Icon name="lucide:chevron-right" class="h-3 w-3" />
            <NuxtLink to="/subsidiaries" class="transition hover:text-forest-900">Companies</NuxtLink>
            <Icon name="lucide:chevron-right" class="h-3 w-3" />
            <span class="text-forest-900/70">{{ sub.short }}</span>
          </nav>

          <p class="eyebrow" :style="{ color: sub.accentInk }">
            <span class="h-1.5 w-1.5 rounded-full" :style="{ background: sub.accent }" />{{ sub.arm }}
          </p>
          <h1 class="h-display mt-4 text-4xl text-balance text-forest-950 sm:text-5xl lg:text-[3.4rem]">{{ sub.name }}</h1>
          <p class="mt-4 font-display text-xl italic" :style="{ color: sub.accentInk }">{{ sub.tagline }}</p>
          <p class="mt-5 max-w-xl text-lg leading-relaxed text-forest-900/70">{{ sub.lede }}</p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" class="btn text-white shadow-soft transition hover:brightness-95" :style="{ background: sub.accent }">
              Request a proposal<Icon name="lucide:arrow-right" class="h-4 w-4" />
            </a>
            <NuxtLink to="/subsidiaries" class="btn-outline">All companies</NuxtLink>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="relative mx-auto max-w-sm">
            <div class="overflow-hidden rounded-[1.5rem] border border-ink/[0.08] shadow-lift ring-1 ring-black/[0.02]">
              <SubsidiaryLogo :sub="sub" class="aspect-square w-full" pad="p-[16%]" />
            </div>
            <div class="absolute -bottom-4 -right-4 h-20 w-20 rounded-2xl border" :style="{ borderColor: accentTint(sub.accent, '55'), background: accentTint(sub.accent, '12') }" />
          </div>
        </div>
      </div>
    </section>

    <!-- OFFERING BAR -->
    <section class="border-y border-ink/[0.06] bg-forest-950 text-paper">
      <div class="shell flex flex-col items-start gap-4 py-7 sm:flex-row sm:items-center sm:gap-6">
        <span class="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest2 text-gold-300/80">
          <span class="h-1.5 w-1.5 rounded-full" :style="{ background: sub.accent }" /> In brief
        </span>
        <p class="font-display text-lg text-paper/90 sm:text-xl">{{ sub.offering }}</p>
      </div>
    </section>

    <!-- ABOUT + STATS -->
    <section class="shell py-20 md:py-24">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-7">
          <SectionHeading eyebrow="About" :title="`Inside ${sub.short}`" />
          <div class="mt-6 space-y-5 text-lg leading-relaxed text-forest-900/75">
            <p v-for="(p, i) in sub.about" :key="i" v-reveal="i * 60">{{ p }}</p>
          </div>
        </div>
        <div class="lg:col-span-5">
          <div class="grid gap-4">
            <div
              v-for="(s, i) in sub.stats" :key="i" v-reveal="i * 80"
              class="flex items-center justify-between gap-4 rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft"
            >
              <span class="text-sm text-forest-900/60">{{ s.label }}</span>
              <span class="text-right font-display text-lg text-forest-950">{{ s.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading eyebrow="Capabilities" :title="`What ${sub.short} delivers`" />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(svc, i) in sub.services" :key="svc.name" v-reveal="(i % 3) * 70"
            class="group rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-card"
          >
            <span class="flex h-11 w-11 items-center justify-center rounded-xl transition" :style="{ background: accentTint(sub.accent, '14'), color: sub.accentInk }">
              <Icon :name="svc.icon" class="h-5 w-5" />
            </span>
            <h3 class="mt-4 font-display text-lg text-forest-950">{{ svc.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-forest-900/65">{{ svc.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PORTFOLIO -->
    <section class="shell py-20 md:py-24">
      <SectionHeading eyebrow="Portfolio" :title="sub.portfolioLabel" />
      <div class="mt-10 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
        <div class="hidden grid-cols-12 gap-4 border-b border-ink/[0.07] bg-sand-50/60 px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-widest2 text-forest-900/45 md:grid">
          <div class="col-span-4">Project</div>
          <div class="col-span-3">Scope</div>
          <div class="col-span-2">Value</div>
          <div class="col-span-1">Year</div>
          <div class="col-span-2 text-right">Status</div>
        </div>
        <div
          v-for="(p, i) in portfolioItems" :key="p.id || i" v-reveal="(i % 4) * 50"
          class="grid grid-cols-1 gap-2 border-b border-ink/[0.05] px-6 py-5 transition last:border-0 hover:bg-sand-50/50 md:grid-cols-12 md:items-center md:gap-4"
        >
          <div class="md:col-span-4">
            <p class="font-medium text-forest-950">{{ p.name }}</p>
            <p class="text-sm text-forest-900/55">{{ p.client }} · {{ p.location }}</p>
          </div>
          <div class="text-sm text-forest-900/70 md:col-span-3">{{ p.scope }}</div>
          <div class="text-sm font-medium text-forest-900/80 md:col-span-2">{{ p.value }}</div>
          <div class="text-sm text-forest-900/60 md:col-span-1">{{ p.year }}</div>
          <div class="md:col-span-2 md:text-right">
            <span class="pill" :style="{ borderColor: accentTint(sub.accent, '40'), color: sub.accentInk, background: accentTint(sub.accent, '0d') }">{{ p.status }}</span>
          </div>
        </div>
      </div>
      <p class="mt-4 text-xs text-forest-900/45">Selected, illustrative engagements. Full references available on request.</p>
    </section>

    <!-- TEAM -->
    <section class="border-t border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading eyebrow="Leadership" :title="`The ${sub.short} team`" lede="Experienced leaders, supported by the shared services and governance of Kyul Holdings." />
        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <TeamCard v-for="(m, i) in teamMembers" :key="m.id || i" :person="m" :index="i" :accent="sub.accent" />
        </div>
        <div v-if="openRoles.length" class="mt-10 flex items-center gap-3 rounded-2xl border border-ink/[0.07] bg-white p-5 text-sm shadow-soft">
          <Icon name="lucide:briefcase" class="h-5 w-5" :style="{ color: sub.accent }" />
          <span class="text-forest-900/75">{{ openRoles.length }} open role{{ openRoles.length > 1 ? 's' : '' }} at {{ sub.short }}.</span>
          <NuxtLink to="/careers" class="ml-auto font-semibold link-underline" :style="{ color: sub.accentInk }">View careers <Icon name="lucide:arrow-right" class="inline h-4 w-4" /></NuxtLink>
        </div>
      </div>
    </section>

    <!-- ENQUIRY -->
    <section id="enquire" class="shell py-20 md:py-24">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-5">
          <SectionHeading eyebrow="Get in touch" :title="`Work with ${sub.short}`" lede="Tell us about your project, tender or partnership. We respond within two business days." />
          <ul class="mt-8 space-y-3 text-forest-900/75">
            <li class="flex items-center gap-3"><Icon name="lucide:mail" class="h-4 w-4" :style="{ color: sub.accent }" /><a :href="`mailto:${subContact.email}`" class="link-underline">{{ subContact.email }}</a></li>
            <li v-if="subContact.web" class="flex items-center gap-3"><Icon name="lucide:globe" class="h-4 w-4" :style="{ color: sub.accent }" /><span>{{ subContact.web }}</span></li>
          </ul>
        </div>
        <div class="lg:col-span-7">
          <EnquiryForm
            :accent="sub.accent"
            cta="Submit enquiry"
            type="rfp"
            :entity="sub.slug"
            :source="`${sub.name} sub-portal`"
            :subjects="['Request a proposal / RFP', 'Partnership / Joint venture', 'Supplier registration', 'General enquiry']"
          />
        </div>
      </div>
    </section>

    <!-- OTHER COMPANIES -->
    <section class="border-t border-ink/[0.06] bg-forest-950 py-16 text-paper md:py-20">
      <div class="shell">
        <p class="eyebrow !text-gold-300">Explore the Group</p>
        <h2 class="h-display mt-4 text-2xl text-paper sm:text-3xl">The other Kyul companies</h2>
        <div class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <NuxtLink
            v-for="o in others" :key="o.slug" :to="`/subsidiaries/${o.slug}`"
            class="group flex items-center justify-between gap-3 rounded-xl border border-paper/10 bg-white/[0.03] p-4 transition hover:border-paper/25 hover:bg-white/[0.06]"
          >
            <span class="min-w-0">
              <span class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full" :style="{ background: o.accent }" />
                <span class="truncate text-sm font-semibold text-paper">{{ o.short }}</span>
              </span>
              <span class="mt-1 block truncate text-xs text-paper/45">{{ o.arm }}</span>
            </span>
            <Icon name="lucide:arrow-up-right" class="h-4 w-4 shrink-0 text-paper/30 transition group-hover:text-gold-300" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
