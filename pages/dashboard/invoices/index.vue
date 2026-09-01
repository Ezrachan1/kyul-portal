<script setup>
import { issuers } from '~/data/invoices'

definePageMeta({ layout: 'dashboard', title: 'Invoices' })
useHead({ title: 'Invoices · Group Portal' })

const { invoices, ensure, pending } = useInvoices()
onMounted(ensure)

const search = ref('')
const status = ref('all')
const tabs = ['all', 'pending', 'overdue', 'paid', 'draft']

const filtered = computed(() => {
  let list = [...invoices.value]
  if (status.value !== 'all') list = list.filter((i) => i.status === status.value)
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (i) =>
        i.client.name.toLowerCase().includes(q) ||
        i.number.toLowerCase().includes(q) ||
        issuers[i.issuer]?.name.toLowerCase().includes(q),
    )
  }
  return list.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
})

const filteredTotal = computed(() => filtered.value.reduce((s, i) => s + invoiceTotals(i).total, 0))

const statusStyle = {
  paid: 'bg-forest-50 text-forest-700 border-forest-200',
  pending: 'bg-gold-50 text-gold-700 border-gold-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  draft: 'bg-sand-100 text-forest-900/60 border-ink/10',
}
const countFor = (s) => (s === 'all' ? invoices.value.length : invoices.value.filter((i) => i.status === s).length)
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Invoices</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">{{ invoices.length }} invoices across the Group · {{ kes(filteredTotal) }} shown</p>
      </div>
      <NuxtLink to="/dashboard/invoices/new" class="btn-primary shrink-0 self-start sm:self-auto"><Icon name="lucide:plus" class="h-4 w-4" /> New invoice</NuxtLink>
    </div>

    <!-- controls -->
    <div class="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="t in tabs" :key="t"
          class="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition"
          :class="status === t ? 'border-forest-950 bg-forest-950 text-paper' : 'border-ink/[0.12] bg-white text-forest-900/70 hover:border-forest-900/40'"
          @click="status = t"
        >
          {{ t }}
          <span class="rounded-full px-1.5 text-[0.65rem]" :class="status === t ? 'bg-white/15 text-paper' : 'bg-ink/[0.06] text-forest-900/50'">{{ countFor(t) }}</span>
        </button>
      </div>
      <div class="relative lg:w-72">
        <Icon name="lucide:search" class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
        <input v-model="search" type="text" placeholder="Search client or number…"
          class="w-full rounded-full border border-ink/[0.12] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-forest-600" />
      </div>
    </div>

    <!-- table -->
    <div class="mt-5 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
      <div class="hidden grid-cols-12 gap-4 border-b border-ink/[0.06] bg-sand-50/60 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-widest2 text-forest-900/45 md:grid">
        <div class="col-span-4">Invoice</div>
        <div class="col-span-2">Issued</div>
        <div class="col-span-2">Due</div>
        <div class="col-span-2 text-right">Amount</div>
        <div class="col-span-2 text-right">Status</div>
      </div>
      <div class="divide-y divide-ink/[0.05]">
        <NuxtLink
          v-for="inv in filtered" :key="inv.id" :to="`/dashboard/invoices/${inv.id}`"
          class="grid grid-cols-1 gap-3 px-6 py-4 transition hover:bg-sand-50/60 md:grid-cols-12 md:items-center md:gap-4"
        >
          <div class="flex items-center gap-3 md:col-span-4">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-bold text-white" :style="{ background: issuers[inv.issuer]?.accent }">{{ issuers[inv.issuer]?.code }}</span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-forest-950">{{ inv.client.name }}</p>
              <p class="truncate text-xs text-forest-900/50">{{ inv.number }}</p>
            </div>
          </div>
          <div class="text-sm text-forest-900/70 md:col-span-2">
            <span class="md:hidden text-forest-900/45">Issued: </span>{{ formatDate(inv.issueDate, { day: 'numeric', month: 'short', year: 'numeric' }) }}
          </div>
          <div class="text-sm text-forest-900/70 md:col-span-2">
            <span class="md:hidden text-forest-900/45">Due: </span>{{ formatDate(inv.dueDate, { day: 'numeric', month: 'short', year: 'numeric' }) }}
          </div>
          <div class="text-sm font-semibold text-forest-950 tabular-nums md:col-span-2 md:text-right">{{ kes(invoiceTotals(inv).total) }}</div>
          <div class="md:col-span-2 md:text-right">
            <span class="inline-block rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize" :class="statusStyle[inv.status]">{{ inv.status }}</span>
          </div>
        </NuxtLink>
      </div>
      <div v-if="!filtered.length" class="flex flex-col items-center px-6 py-16 text-center">
        <span class="flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-forest-900/40"><Icon name="lucide:receipt" class="h-6 w-6" /></span>
        <p class="mt-4 font-display text-lg text-forest-950">No invoices found</p>
        <p class="mt-1 text-sm text-forest-900/55">Try a different filter, or create a new invoice.</p>
        <NuxtLink to="/dashboard/invoices/new" class="btn-primary mt-5"><Icon name="lucide:plus" class="h-4 w-4" /> New invoice</NuxtLink>
      </div>
    </div>
  </div>
</template>
