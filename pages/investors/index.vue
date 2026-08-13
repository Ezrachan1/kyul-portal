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

const docIcon = (type) => (type === 'XLSX' ? 'lucide:sheet' : 'lucide:file-text')

// Document library is managed in the Group Portal
const { data: docsData } = await useFetch('/api/documents', { default: () => [] })
const publicDocs = computed(() => (docsData.value || []).filter((d) => !d.restricted))
</script>

<template>
  <div>
    <PageHero
      size="lg"
      eyebrow="Investor relations"
      title="Investment-ready, by design."
      :lede="investors.lede"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Investors' }]"
    >
      <template #actions>
        <NuxtLink to="/investors/data-room" class="btn-gold"><Icon name="lucide:lock" class="h-4 w-4" /> Enter data room</NuxtLink>
        <a :href="`mailto:${site.contact.investorEmail}`" class="btn-on-dark">Contact IR</a>
      </template>
    </PageHero>

    <!-- Highlights -->
    <section class="shell pt-14 md:pt-16">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(h, i) in investors.highlights" :key="i" v-reveal="i * 80" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <p class="font-display text-3xl text-forest-950">{{ h.value }}</p>
          <p class="mt-1.5 text-sm font-medium text-forest-900/75">{{ h.label }}</p>
          <p class="mt-0.5 text-xs text-forest-900/45">{{ h.note }}</p>
        </div>
      </div>
    </section>

    <!-- Performance -->
    <section class="shell py-20 md:py-24">
      <SectionHeading eyebrow="Performance" title="Consolidated Group performance." lede="Illustrative consolidated figures. Audited statements are available in the secure investor data room." />
      <div class="mt-12 grid gap-6 lg:grid-cols-12">
        <div class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-8 lg:col-span-7">
          <div class="flex items-baseline justify-between">
            <p class="text-sm font-medium text-forest-900/60">Group turnover · KSh millions</p>
            <span class="pill !border-forest-200 !bg-forest-50 !text-forest-700"><Icon name="lucide:trending-up" class="h-3.5 w-3.5" /> +59% YoY</span>
          </div>
          <div class="mt-6"><ChartArea :data="group.turnover" :height="280" suffix="M" color="#2d5d4b" /></div>
        </div>
        <div class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-8 lg:col-span-5">
          <p class="text-sm font-medium text-forest-900/60">Revenue mix by company · FY2025</p>
          <div class="mt-6"><ChartDonut :segments="revenueMix" center-value="KSh 510M" center-label="Group" /></div>
        </div>
      </div>
    </section>

    <!-- Thesis -->
    <section class="border-y border-ink/[0.06] bg-sand-50/70 py-20 md:py-24">
      <div class="shell">
        <SectionHeading eyebrow="The investment case" title="Why investors choose Kyul." />
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(t, i) in investors.thesis" :key="t.title" v-reveal="(i % 4) * 70" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="t.icon" class="h-5 w-5" /></span>
            <h3 class="mt-4 font-display text-lg text-forest-950">{{ t.title }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-forest-900/65">{{ t.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Documents -->
    <section class="shell py-20 md:py-24">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="min-w-0 lg:col-span-5">
          <SectionHeading eyebrow="Document library" title="Corporate & governance documents." lede="Public materials are available below. Financial statements and confidential documents are released to verified investors in the secure data room." />
          <NuxtLink to="/investors/data-room" class="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-forest-900">
            <Icon name="lucide:lock" class="h-4 w-4" /> Enter the data room
          </NuxtLink>
        </div>
        <div class="min-w-0 lg:col-span-7">
          <ul class="divide-y divide-ink/[0.07] overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
            <li v-for="(d, i) in publicDocs" :key="d.id" v-reveal="i * 50">
              <a :href="d.fileUrl || '#'" :target="d.fileUrl ? '_blank' : undefined" class="group flex items-center gap-4 px-5 py-4 transition hover:bg-sand-50/60">
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="docIcon(d.type)" class="h-5 w-5" /></span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium text-forest-950">{{ d.title }}</span>
                  <span class="block text-xs text-forest-900/50">{{ d.category }} · {{ d.type }} · {{ d.size }}</span>
                </span>
                <Icon name="lucide:download" class="h-5 w-5 shrink-0 text-forest-900/35 transition group-hover:text-forest-800" />
              </a>
            </li>
          </ul>
          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div v-for="g in investors.governanceDocs" :key="g.title" class="flex items-center gap-3 rounded-xl border border-ink/[0.07] bg-sand-50/50 px-4 py-3">
              <Icon :name="g.icon" class="h-4 w-4 shrink-0 text-forest-600" />
              <span class="text-sm text-forest-900/75">{{ g.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      eyebrow="Investor relations"
      title="Ready to look under the bonnet?"
      text="Request access to the secure data room for audited financials, the cap table and the project pipeline."
      :primary="{ label: 'Request data room access', to: '/investors/data-room' }"
      :secondary="{ label: 'Contact the Group', to: '/contact' }"
    />
  </div>
</template>
