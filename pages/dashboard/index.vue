<script setup>
import { group } from '~/data/group'
import { subsidiaries } from '~/data/subsidiaries'
import { issuers } from '~/data/invoices'

definePageMeta({ layout: 'dashboard', title: 'Overview' })
useHead({ title: 'Overview · Group Portal' })

const { user, can } = useAuth()
const { invoices, ensure } = useInvoices()
const canFinance = computed(() => can(['admin', 'finance']))

const sum = (list) => list.reduce((s, i) => s + invoiceTotals(i).total, 0)
const outstanding = computed(() => sum(invoices.value.filter((i) => i.status === 'pending' || i.status === 'overdue')))
const overdue = computed(() => sum(invoices.value.filter((i) => i.status === 'overdue')))
const collected = computed(() => sum(invoices.value.filter((i) => i.status === 'paid')))
const counts = computed(() => {
  const c = { paid: 0, pending: 0, overdue: 0, draft: 0 }
  invoices.value.forEach((i) => (c[i.status] = (c[i.status] || 0) + 1))
  return c
})

const compactKes = (n) => {
  if (n >= 1e6) return 'KSh ' + (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return 'KSh ' + (n / 1e3).toFixed(0) + 'K'
  return 'KSh ' + Math.round(n)
}

const greeting = ref('Welcome')
onMounted(() => {
  if (canFinance.value) ensure()
  const h = new Date().getHours()
  greeting.value = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
})

const kpis = computed(() => {
  const base = [{ label: 'Group turnover · FY2025', value: 'KSh 510M', sub: '+59% YoY', tone: 'forest', spark: group.turnover.map((t) => t.value) }]
  if (!canFinance.value) return base
  return [
    ...base,
    { label: 'Outstanding receivables', value: compactKes(outstanding.value), sub: `${counts.value.pending + counts.value.overdue} open invoices`, tone: 'gold' },
    { label: 'Overdue', value: compactKes(overdue.value), sub: `${counts.value.overdue} invoice${counts.value.overdue === 1 ? '' : 's'}`, tone: 'red' },
    { label: 'Collected (paid)', value: compactKes(collected.value), sub: `${counts.value.paid} invoices settled`, tone: 'green' },
  ]
})

const statusSegments = computed(() => [
  { label: 'Paid', value: counts.value.paid, color: '#2d5d4b' },
  { label: 'Pending', value: counts.value.pending, color: '#cda646' },
  { label: 'Overdue', value: counts.value.overdue, color: '#c0532f' },
  { label: 'Draft', value: counts.value.draft, color: '#9aa39c' },
])

const bySlug = (s) => subsidiaries.find((x) => x.slug === s)
const revenueByCompany = [
  { label: 'Engineering', value: 194, target: 210, color: bySlug('engineering').accent },
  { label: 'Enterprises', value: 112, target: 100, color: bySlug('enterprises').accent },
  { label: 'Investment', value: 82, target: 80, color: bySlug('investment').accent },
  { label: 'Projects', value: 61, target: 75, color: bySlug('projects').accent },
  { label: 'Ventures', value: 41, target: 40, color: bySlug('ventures').accent },
  { label: 'Holdings', value: 20, target: 20, color: bySlug('holdings').accent },
]

const compliance = [
  { entity: 'Engineering', status: 'green', note: 'KRA & NCA current' },
  { entity: 'Ventures', status: 'green', note: 'Filings current' },
  { entity: 'Enterprises', status: 'amber', note: 'VAT return due 20 Jun' },
  { entity: 'Projects', status: 'green', note: 'Licences current' },
  { entity: 'Investment', status: 'green', note: 'Audit complete' },
  { entity: 'Holdings', status: 'green', note: 'Consolidated audit done' },
]
const ragColor = { green: '#2d7d46', amber: '#cda646', red: '#c0532f' }

const recent = computed(() => [...invoices.value].slice(0, 5))
const statusStyle = {
  paid: 'bg-forest-50 text-forest-700 border-forest-200',
  pending: 'bg-gold-50 text-gold-700 border-gold-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  draft: 'bg-sand-100 text-forest-900/60 border-ink/10',
}
</script>

<template>
  <div>
    <!-- greeting -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">{{ greeting }}, {{ (user?.name || 'Administrator').split(' ')[0] }}.</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Here’s how the Group is tracking today.</p>
      </div>
      <NuxtLink v-if="canFinance" to="/dashboard/invoices/new" class="btn-primary shrink-0 self-start sm:self-auto"><Icon name="lucide:plus" class="h-4 w-4" /> New invoice</NuxtLink>
    </div>

    <!-- KPIs -->
    <div class="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="k in kpis" :key="k.label" class="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft">
        <div class="flex items-start justify-between">
          <p class="text-xs font-medium text-forest-900/55">{{ k.label }}</p>
          <span class="h-2 w-2 rounded-full" :style="{ background: k.tone === 'red' ? '#c0532f' : k.tone === 'gold' ? '#cda646' : '#2d5d4b' }" />
        </div>
        <p class="mt-2 font-display text-2xl text-forest-950">{{ k.value }}</p>
        <div class="mt-1 flex items-center justify-between">
          <p class="text-xs" :class="k.tone === 'red' ? 'text-red-600' : 'text-forest-900/50'">{{ k.sub }}</p>
          <Sparkline v-if="k.spark" :values="k.spark" color="#2d5d4b" class="!h-7 w-16" />
        </div>
      </div>
    </div>

    <!-- charts -->
    <div class="mt-5 grid gap-4 lg:grid-cols-12">
      <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft" :class="canFinance ? 'lg:col-span-8' : 'lg:col-span-12'">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg text-forest-950">Group turnover</h2>
          <span class="text-xs text-forest-900/45">KSh millions · 2021–2025</span>
        </div>
        <div class="mt-5"><ChartArea :data="group.turnover" :height="260" suffix="M" color="#2d5d4b" /></div>
      </div>
      <div v-if="canFinance" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft lg:col-span-4">
        <h2 class="font-display text-lg text-forest-950">Invoice status</h2>
        <div class="mt-6 flex justify-center"><ChartDonut :segments="statusSegments" :center-value="String(invoices.length)" center-label="Invoices" :legend="true" /></div>
      </div>
    </div>

    <!-- revenue by company + compliance -->
    <div class="mt-5 grid gap-4 lg:grid-cols-12">
      <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft lg:col-span-7">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg text-forest-950">Revenue vs target by company</h2>
          <span class="hidden items-center gap-1.5 text-xs text-forest-900/45 sm:flex"><span class="h-3 w-0.5 bg-forest-950/55" /> target</span>
        </div>
        <p class="mt-1 text-xs text-forest-900/45">FY2025 · KSh millions</p>
        <div class="mt-6"><ChartBars :data="revenueByCompany" suffix="M" /></div>
      </div>
      <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft lg:col-span-5">
        <h2 class="font-display text-lg text-forest-950">Compliance status</h2>
        <p class="mt-1 text-xs text-forest-900/45">Statutory filings & audit · RAG</p>
        <ul class="mt-5 space-y-2.5">
          <li v-for="c in compliance" :key="c.entity" class="flex items-center gap-3">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: ragColor[c.status] }" />
            <span class="text-sm font-medium text-forest-900/80">{{ c.entity }}</span>
            <span class="ml-auto truncate text-xs text-forest-900/50">{{ c.note }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- recent invoices -->
    <div v-if="canFinance" class="mt-5 rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
      <div class="flex items-center justify-between border-b border-ink/[0.06] px-6 py-4">
        <h2 class="font-display text-lg text-forest-950">Recent invoices</h2>
        <NuxtLink to="/dashboard/invoices" class="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950">View all <Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
      </div>
      <div class="divide-y divide-ink/[0.05]">
        <NuxtLink
          v-for="inv in recent" :key="inv.id" :to="`/dashboard/invoices/${inv.id}`"
          class="flex items-center gap-4 px-6 py-4 transition hover:bg-sand-50/60"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white" :style="{ background: issuers[inv.issuer]?.accent }">{{ issuers[inv.issuer]?.code }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-forest-950">{{ inv.client.name }}</p>
            <p class="truncate text-xs text-forest-900/50">{{ inv.number }} · {{ formatDate(inv.issueDate, { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
          </div>
          <span class="hidden text-sm font-semibold text-forest-950 tabular-nums sm:block">{{ kes(invoiceTotals(inv).total) }}</span>
          <span class="rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize" :class="statusStyle[inv.status]">{{ inv.status }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
