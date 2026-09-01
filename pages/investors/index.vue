<script setup>
import { investors } from '~/data/investors'
import { group } from '~/data/group'
import { subsidiaries } from '~/data/subsidiaries'
import { site } from '~/data/site'

useSeoMeta({
  title: 'Investor Relations',
  description:
    'Kyul Group is structured for institutional and diaspora investors: clean ownership, ring-fenced SPVs and audited reporting. Begin your due diligence here.',
})

const bySlug = (s) => subsidiaries.find((x) => x.slug === s)
const revenueMix = [
  { label: 'Engineering', value: 38, color: bySlug('engineering').accent },
  { label: 'Enterprises', value: 22, color: bySlug('enterprises').accent },
  { label: 'Investment', value: 16, color: bySlug('investment').accent },
  { label: 'Projects', value: 12, color: bySlug('projects').accent },
  { label: 'Ventures', value: 8, color: bySlug('ventures').accent },
  { label: 'Holdings', value: 4, color: bySlug('holdings').accent },
]

const series = group.turnover
const turnoverSeries = series.map((d) => ({ label: d.year, value: d.value }))
const fy = series[series.length - 1]
const prev = series[series.length - 2]
const first = series[0]
const yoy = Math.round(((fy.value - prev.value) / prev.value) * 100)
const turnoverAlt = `Area chart: Group turnover in KSh millions, ${series.map((d) => `${d.year}: ${d.value}`).join(', ')}.`

// The four headline proof points, as an editorial dl (CAGR per investors.highlights)
const statTiles = [
  { to: fy.value, prefix: 'KSh ', suffix: 'M', label: `FY${fy.year} turnover`, note: `From KSh ${first.value}M in FY${first.year}` },
  { to: yoy, prefix: '+', suffix: '%', label: 'YoY growth', note: `FY${prev.year} → FY${fy.year}` },
  { to: 68, prefix: '~', suffix: '%', label: '3-yr revenue CAGR', note: 'FY2023 → FY2025' },
  { to: 6, prefix: '', suffix: '', label: 'Operating companies', note: 'One sub-holding structure' },
]
const tileClass = (i) => [
  'flex min-w-0 flex-col border-t border-ink/10 py-6',
  i % 2 === 1 ? 'border-l pl-6' : 'pr-6',
  i === 2 ? 'lg:border-l lg:pl-6' : '',
]

// Ticker-style facts under the hero H1 — audit/reporting cadence per group.governance & thesis
const heroMeta = [
  { dt: 'Established', dd: `${site.founded} · Eldoret` },
  { dt: 'Consolidated audit', dd: 'Annual' },
  { dt: 'Reporting', dd: 'Quarterly' },
  { dt: 'Capital structure', dd: 'KES · USD' },
]

// Thesis proof column — values from group.stats and group.esg metrics
const proofPoints = [
  { value: 'KSh 350M+', label: 'Project value delivered', note: 'Infrastructure, water & roads' },
  { value: '12+', label: 'Counties active', note: 'Rift Valley, Western & Nyanza' },
  { value: '600+', label: 'Local jobs supported', note: 'Formal employment across sites' },
  { value: '5', label: 'Sectors', note: 'Infrastructure to real estate' },
]

// Ownership chain per group.governance.lede
const structure = [
  { tier: 'Strategic parent', entity: 'Kyul Group Inc.' },
  { tier: 'Sub-holding', entity: 'Kyul Holdings Limited' },
  { tier: 'Operating companies', entity: 'Five ring-fenced entities' },
]
const structureAlt =
  'Ownership chain: Kyul Group Inc. owns Kyul Holdings Limited, which holds equity in the five operating companies. No operating company holds shares in another.'

const docIcon = (type) => (type === 'XLSX' ? 'lucide:sheet' : 'lucide:file-text')
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmtDate = (d) => {
  const m = String(d || '').match(/^(\d{4})-(\d{2})/)
  return m ? `${MONTHS[Number(m[2]) - 1] || ''} ${m[1]}`.trim() : String(d || '')
}

// Document library is managed in the Group Portal
const { data: docsData } = await useFetch('/api/documents', { default: () => [] })
const publicDocs = computed(() => (docsData.value || []).filter((d) => !d.restricted))
</script>

<template>
  <div>
    <!-- ── Hero — bespoke capital-markets band ─────────────────────────── -->
    <section class="relative overflow-hidden bg-forest-950 text-paper">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_10%,rgba(45,93,75,0.4),transparent_65%),radial-gradient(45%_40%_at_5%_95%,rgba(189,144,56,0.1),transparent_70%)]" />
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="pointer-events-none absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div class="shell relative py-20 md:py-28 lg:py-32">
        <nav class="mb-7 flex flex-wrap items-center gap-2 text-xs text-paper/60" aria-label="Breadcrumb">
          <NuxtLink to="/" class="inline-flex min-h-10 items-center transition hover:text-paper/90">Home</NuxtLink>
          <Icon name="lucide:chevron-right" class="h-3 w-3 text-paper/30" aria-hidden="true" />
          <span class="text-paper/80">Investors</span>
        </nav>

        <p v-reveal class="eyebrow !text-gold-300">Investor relations</p>
        <h1 v-reveal="80" class="h-display mt-4 max-w-4xl text-balance text-4xl text-paper sm:text-5xl lg:text-[4.25rem]">
          Capital. Transparency. Opportunity.
        </h1>
        <p v-reveal="160" class="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
          {{ investors.lede }}
        </p>

        <div v-reveal="240" class="mt-9 flex flex-wrap gap-3">
          <NuxtLink to="/investors/data-room" class="btn-gold"><Icon name="lucide:lock" class="h-4 w-4" aria-hidden="true" /> Enter data room</NuxtLink>
          <a :href="`mailto:${site.contact.investorEmail}`" class="btn-on-dark">Contact IR</a>
        </div>

        <div v-reveal="320" class="mt-14 md:mt-16">
          <KyulLine tone="paper" :node="8" />
          <dl class="mt-6 grid grid-cols-2 gap-x-10 gap-y-6 lg:grid-cols-4">
            <div v-for="m in heroMeta" :key="m.dt" class="min-w-0">
              <dt class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-paper/60">{{ m.dt }}</dt>
              <dd class="mt-1 text-sm font-medium text-paper">{{ m.dd }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- ── Headline figures — hairline-divided editorial dl ────────────── -->
    <section class="shell pt-16 md:pt-20">
      <h2 class="sr-only">Group at a glance</h2>
      <dl class="grid grid-cols-2 border-b border-ink/10 lg:grid-cols-4">
        <div v-for="(t, i) in statTiles" :key="t.label" v-reveal="i * 80" :class="tileClass(i)">
          <dt class="order-last mt-2 text-xs font-medium uppercase tracking-widest2 text-forest-900/70">
            {{ t.label }}
            <span class="mt-1 block normal-case tracking-normal text-forest-900/70">{{ t.note }}</span>
          </dt>
          <dd class="stat-display text-3xl text-forest-950 sm:text-4xl">
            <CountUp :to="t.to" :prefix="t.prefix" :suffix="t.suffix" />
          </dd>
        </div>
      </dl>
    </section>

    <!-- ── Investment thesis — prose + proof points ────────────────────── -->
    <section class="mt-16 border-y border-ink/[0.06] bg-sand-50/70 py-20 md:mt-20 md:py-28">
      <div class="shell">
        <div class="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div class="min-w-0 lg:col-span-7">
            <SectionHeading
              eyebrow="The investment case"
              title="Why investors choose Kyul."
              :lede="group.narrative"
            />

            <div class="mt-10">
              <article
                v-for="(t, i) in investors.thesis"
                :key="t.title"
                v-reveal="i * 70"
                class="flex gap-5 border-t border-ink/10 py-6"
              >
                <span
                  aria-hidden="true"
                  class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700 ring-1 ring-forest-900/10"
                >
                  <Icon :name="t.icon" class="h-4 w-4" />
                </span>
                <div class="min-w-0">
                  <h3 class="font-display text-xl text-forest-950">{{ t.title }}</h3>
                  <p class="mt-2 max-w-xl text-sm leading-relaxed text-forest-900/70">{{ t.text }}</p>
                </div>
              </article>
            </div>
          </div>

          <div class="min-w-0 lg:col-span-5">
            <p class="text-[0.7rem] font-semibold uppercase tracking-widest2 text-forest-900/70">Proof points</p>
            <dl class="mt-4">
              <div
                v-for="(p, i) in proofPoints"
                :key="p.label"
                v-reveal="i * 80"
                class="flex min-w-0 flex-col border-t border-ink/10 py-5"
              >
                <dt class="order-last mt-1.5 text-xs font-medium uppercase tracking-widest2 text-forest-900/70">
                  {{ p.label }}
                  <span class="mt-0.5 block normal-case tracking-normal text-forest-900/70">{{ p.note }}</span>
                </dt>
                <dd class="stat-display text-3xl text-forest-950">{{ p.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Financial performance ───────────────────────────────────────── -->
    <section class="shell py-20 md:py-28">
      <SectionHeading
        eyebrow="Performance"
        title="Consolidated Group performance."
        lede="Illustrative consolidated figures. Audited statements are available in the secure investor data room."
      />

      <div class="mt-12 grid gap-6 lg:grid-cols-12">
        <div v-reveal class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-8 lg:col-span-7">
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <p class="text-xs font-medium uppercase tracking-widest2 text-forest-900/70">Group turnover · KSh millions</p>
            <span class="pill !border-forest-200 !bg-forest-50 !text-forest-700"><Icon name="lucide:trending-up" class="h-3.5 w-3.5" aria-hidden="true" /> +{{ yoy }}% YoY</span>
          </div>
          <div class="mt-6"><ChartArea :data="turnoverSeries" :height="300" suffix="M" color="#2d5d4b" :aria-label="turnoverAlt" /></div>
          <p class="mt-5 text-xs leading-relaxed text-forest-900/70">
            FY{{ first.year }} – FY{{ fy.year }}, consolidated across the six operating companies.
          </p>
        </div>

        <div v-reveal="120" class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-8 lg:col-span-5">
          <p class="text-xs font-medium uppercase tracking-widest2 text-forest-900/70">Revenue mix by company · FY2025</p>
          <div class="mt-6"><ChartDonut :segments="revenueMix" center-value="KSh 510M" center-label="Group" /></div>
          <p class="mt-5 text-xs leading-relaxed text-forest-900/70">
            Share of consolidated FY2025 turnover by operating company.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Governance & structure ──────────────────────────────────────── -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-28">
      <div class="shell">
        <div class="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div class="min-w-0 lg:col-span-5">
            <SectionHeading
              eyebrow="Governance & structure"
              title="Clean ownership, by design."
              :lede="group.governance.lede"
            />

            <div v-reveal="200" class="mt-12 max-w-sm">
              <p class="sr-only">{{ structureAlt }}</p>
              <div aria-hidden="true" class="relative">
                <span class="flow-spine absolute bottom-3 left-[3px] top-3 w-px" />
                <div v-for="s in structure" :key="s.tier" class="flex items-center gap-3 py-[0.55rem] sm:gap-4">
                  <span class="relative z-10 h-[7px] w-[7px] shrink-0 rounded-full bg-gold-300 shadow-[0_0_0_4px_rgba(217,185,98,0.16)]" />
                  <span class="w-[7.5rem] shrink-0 text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-950">
                    {{ s.tier }}
                  </span>
                  <span class="h-px min-w-4 flex-1 bg-ink/10" />
                  <span class="min-w-0 text-right text-[0.65rem] font-medium uppercase tracking-[0.14em] text-forest-900/70">
                    {{ s.entity }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="min-w-0 lg:col-span-7">
            <div class="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              <div
                v-for="(g, i) in group.governance.points"
                :key="g.title"
                v-reveal="i * 70"
                class="min-w-0 border-t border-ink/10 pt-6"
              >
                <span
                  aria-hidden="true"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-700 ring-1 ring-forest-900/10"
                >
                  <Icon :name="g.icon" class="h-4 w-4" />
                </span>
                <h3 class="mt-4 font-sans text-base font-semibold text-forest-950">{{ g.title }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-forest-900/70">{{ g.text }}</p>
              </div>
            </div>

            <h3 class="mt-12 text-[0.7rem] font-semibold uppercase tracking-widest2 text-forest-900/70">Governance instruments</h3>
            <ul class="mt-4 grid gap-x-10 sm:grid-cols-2">
              <li v-for="g in investors.governanceDocs" :key="g.title" class="flex items-center gap-3 border-t border-ink/10 py-4">
                <Icon :name="g.icon" class="h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                <span class="text-sm text-forest-900/75">{{ g.title }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Document library ────────────────────────────────────────────── -->
    <section class="shell py-20 md:py-28">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="min-w-0 lg:col-span-5">
          <SectionHeading
            eyebrow="Document library"
            title="Corporate & governance documents."
            lede="Public materials are available below. Financial statements and confidential documents are released to verified investors in the secure data room."
          />
          <NuxtLink to="/investors/data-room" class="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-forest-900">
            <Icon name="lucide:lock" class="h-4 w-4" aria-hidden="true" /> Enter the data room
          </NuxtLink>
        </div>

        <div class="min-w-0 lg:col-span-7">
          <ul v-if="publicDocs.length" class="border-b border-ink/10">
            <li v-for="(d, i) in publicDocs" :key="d.id" v-reveal="i * 50">
              <a
                :href="d.fileUrl || '#'"
                :target="d.fileUrl ? '_blank' : undefined"
                :rel="d.fileUrl ? 'noopener' : undefined"
                class="group -mx-3 flex items-center gap-4 border-t border-ink/10 px-3 py-5 transition hover:bg-sand-50/60"
              >
                <Icon :name="docIcon(d.type)" class="h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium text-forest-950">{{ d.title }}</span>
                  <span class="mt-0.5 block text-xs text-forest-900/70">
                    {{ d.category }} · {{ d.type }} · {{ d.size }}<template v-if="d.date"> · {{ fmtDate(d.date) }}</template>
                  </span>
                </span>
                <Icon name="lucide:download" class="h-5 w-5 shrink-0 text-forest-900/45 transition group-hover:text-forest-800" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p v-else class="border-t border-ink/10 py-6 text-sm leading-relaxed text-forest-900/70">
            Public documents are being prepared. Verified investors can access the full library in the secure data room.
          </p>
        </div>
      </div>
    </section>

    <!-- ── Secure data room — dark closing band ────────────────────────── -->
    <section class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28" aria-labelledby="data-room-title">
      <TopoContours tone="paper" :opacity="0.07" />
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_15%_15%,rgba(45,93,75,0.35),transparent_65%)]" />
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />

      <div class="shell relative">
        <div class="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div class="min-w-0 lg:col-span-6">
            <span aria-hidden="true" class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-300/40 text-gold-300">
              <Icon name="lucide:lock" class="h-5 w-5" />
            </span>
            <p v-reveal class="eyebrow mt-6 !text-gold-300">Secure data room</p>
            <h2 id="data-room-title" v-reveal="70" class="h-display mt-4 text-balance text-3xl text-paper sm:text-4xl">
              Ready to look under the bonnet?
            </h2>
            <p v-reveal="140" class="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">
              Access financials, reports, governance and the project pipeline — released to verified
              investors in the secure data room.
            </p>
            <div v-reveal="210" class="mt-9 flex flex-wrap gap-3">
              <NuxtLink to="/investors/data-room" class="btn-gold"><Icon name="lucide:lock" class="h-4 w-4" aria-hidden="true" /> Request access</NuxtLink>
              <NuxtLink to="/contact" class="btn-on-dark">Contact the Group</NuxtLink>
            </div>
          </div>

          <div class="min-w-0 lg:col-span-6">
            <p class="text-[0.7rem] font-semibold uppercase tracking-widest2 text-paper/60">Inside the data room</p>
            <ul class="mt-4 border-b border-paper/10">
              <li v-for="(d, i) in investors.dataRoom" :key="d.title" v-reveal="i * 50" class="flex items-center gap-4 border-t border-paper/10 py-4">
                <Icon name="lucide:lock" class="h-4 w-4 shrink-0 text-gold-300/80" aria-hidden="true" />
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-paper">{{ d.title }}</span>
                  <span class="mt-0.5 block text-xs text-paper/60">{{ d.category }} · {{ d.type }} · {{ d.size }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Vertical cousin of .kyul-line: gold origin fading down through ink */
.flow-spine {
  background: linear-gradient(180deg, rgba(189, 144, 56, 0.65), rgba(18, 32, 28, 0.12) 60%, transparent);
}
</style>
