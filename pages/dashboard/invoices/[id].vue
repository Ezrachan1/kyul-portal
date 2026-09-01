<script setup>
import { issuers } from '~/data/invoices'
import { site } from '~/data/site'

definePageMeta({ layout: 'dashboard', title: 'Invoice' })

const route = useRoute()
const { get, update, remove, ensure, loaded } = useInvoices()
onMounted(ensure)
const inv = computed(() => get(route.params.id))
const issuer = computed(() => (inv.value ? issuers[inv.value.issuer] : null))
const totals = computed(() => (inv.value ? invoiceTotals(inv.value) : { subtotal: 0, tax: 0, total: 0 }))

useHead({ title: () => (inv.value ? `${inv.value.number} · Invoice` : 'Invoice') })

const statusStyle = {
  paid: 'bg-forest-50 text-forest-700 border-forest-200',
  pending: 'bg-gold-50 text-gold-700 border-gold-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  draft: 'bg-sand-100 text-forest-900/60 border-ink/10',
}

async function setStatus(s) {
  if (inv.value) await update(inv.value.id, { status: s })
}
const confirmDelete = ref(false)
async function doDelete() {
  await remove(inv.value.id)
  navigateTo('/dashboard/invoices')
}
function printInvoice() {
  window.print()
}
</script>

<template>
  <div v-if="inv">
    <!-- toolbar -->
    <div class="no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <NuxtLink to="/dashboard/invoices" class="inline-flex items-center gap-1.5 text-sm text-forest-900/55 transition hover:text-forest-900"><Icon name="lucide:arrow-left" class="h-4 w-4" /> All invoices</NuxtLink>
      <div class="flex flex-wrap items-center gap-2">
        <div class="relative">
          <select :value="inv.status" class="appearance-none rounded-full border border-ink/[0.12] bg-white py-2 pl-4 pr-9 text-sm font-medium capitalize outline-none transition focus:ring-2 focus:ring-forest-600" @change="setStatus($event.target.value)">
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
        </div>
        <button v-if="inv.status !== 'paid'" class="btn-outline !py-2.5" @click="setStatus('paid')"><Icon name="lucide:check-circle-2" class="h-4 w-4" /> Mark paid</button>
        <button class="btn-primary !py-2.5" @click="printInvoice"><Icon name="lucide:printer" class="h-4 w-4" /> Print / PDF</button>
        <button class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/[0.12] text-forest-900/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500" aria-label="Delete invoice" @click="confirmDelete = true"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
      </div>
    </div>

    <!-- delete confirm -->
    <div v-if="confirmDelete" class="no-print mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-red-800">Delete invoice {{ inv.number }}? This cannot be undone.</p>
      <div class="flex gap-2">
        <button class="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700" @click="doDelete">Delete</button>
        <button class="rounded-full border border-ink/[0.12] bg-white px-4 py-2 text-sm font-medium" @click="confirmDelete = false">Cancel</button>
      </div>
    </div>

    <!-- INVOICE SHEET -->
    <div class="print-sheet mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-card">
      <div class="h-1.5" :style="{ background: issuer.accent }" />
      <div class="p-8 sm:p-12">
        <!-- header -->
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-3">
            <KyulMark class="h-12 w-12 shrink-0" />
            <div>
              <p class="font-display text-lg text-forest-950">{{ issuer.name }}</p>
              <p class="text-xs text-forest-900/55">A Kyul Group company</p>
              <p class="mt-2 text-xs leading-relaxed text-forest-900/60">{{ site.hq.line1 }}, {{ site.hq.line2 }}<br />{{ site.hq.country }} · {{ issuer.email }}</p>
            </div>
          </div>
          <div class="text-left sm:text-right">
            <p class="font-display text-3xl text-forest-950">Invoice</p>
            <p class="mt-1 text-sm font-medium text-forest-900/70">{{ inv.number }}</p>
            <span class="mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize" :class="statusStyle[inv.status]">{{ inv.status }}</span>
          </div>
        </div>

        <!-- meta -->
        <div class="mt-9 grid gap-6 sm:grid-cols-2">
          <div>
            <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/45">Bill to</p>
            <p class="mt-2 font-medium text-forest-950">{{ inv.client.name }}</p>
            <p v-if="inv.client.address" class="text-sm text-forest-900/60">{{ inv.client.address }}</p>
            <p v-if="inv.client.email" class="text-sm text-forest-900/60">{{ inv.client.email }}</p>
          </div>
          <div class="grid grid-cols-2 gap-y-2 self-start text-sm sm:justify-items-end">
            <span class="text-forest-900/55">Issue date</span><span class="font-medium text-forest-950">{{ formatDate(inv.issueDate) }}</span>
            <span class="text-forest-900/55">Due date</span><span class="font-medium text-forest-950">{{ formatDate(inv.dueDate) }}</span>
            <span class="text-forest-900/55">Currency</span><span class="font-medium text-forest-950">{{ inv.currency }}</span>
          </div>
        </div>

        <!-- items -->
        <div class="mt-9 overflow-x-auto rounded-xl border border-ink/[0.08]">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-sand-50/70 text-left text-[0.68rem] font-semibold uppercase tracking-widest2 text-forest-900/45">
                <th class="px-4 py-3">Description</th>
                <th class="px-4 py-3 text-right">Qty</th>
                <th class="px-4 py-3 text-right">Unit price</th>
                <th class="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ink/[0.06]">
              <tr v-for="(it, i) in inv.items" :key="i">
                <td class="px-4 py-3 text-forest-900/80">{{ it.description }}</td>
                <td class="px-4 py-3 text-right tabular-nums text-forest-900/70">{{ num(it.qty) }}</td>
                <td class="px-4 py-3 text-right tabular-nums text-forest-900/70">{{ kes(it.unitPrice) }}</td>
                <td class="px-4 py-3 text-right font-medium tabular-nums text-forest-950">{{ kes(it.qty * it.unitPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- totals -->
        <div class="mt-6 flex justify-end">
          <div class="w-full max-w-xs space-y-2.5">
            <div class="flex justify-between text-sm"><span class="text-forest-900/60">Subtotal</span><span class="font-medium tabular-nums text-forest-950">{{ kes(totals.subtotal) }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-forest-900/60">VAT ({{ (inv.taxRate * 100).toFixed(0) }}%)</span><span class="font-medium tabular-nums text-forest-950">{{ kes(totals.tax) }}</span></div>
            <div class="flex items-center justify-between rounded-xl px-4 py-3 text-white" :style="{ background: issuer.accent }">
              <span class="font-display">Total due</span><span class="font-display text-lg tabular-nums">{{ kes(totals.total) }}</span>
            </div>
          </div>
        </div>

        <!-- notes + bank -->
        <div class="mt-9 grid gap-6 border-t border-ink/[0.08] pt-6 sm:grid-cols-2">
          <div v-if="inv.notes">
            <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/45">Notes</p>
            <p class="mt-2 text-sm leading-relaxed text-forest-900/65">{{ inv.notes }}</p>
          </div>
          <div>
            <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-900/45">Payment details</p>
            <p class="mt-2 text-sm leading-relaxed text-forest-900/65">
              Bank: Equity Bank, Eldoret Branch<br />
              Account name: {{ issuer.name }}<br />
              Account no.: 0123 456 789 · Currency: {{ inv.currency }}
            </p>
          </div>
        </div>

        <!-- footer -->
        <div class="mt-9 flex flex-col items-center gap-1 border-t border-ink/[0.08] pt-6 text-center">
          <p class="text-xs text-forest-900/55">Thank you for your business. Payment is due by {{ formatDate(inv.dueDate) }}.</p>
          <p class="text-[0.68rem] text-forest-900/40">Generated via the Kyul Group Portal · Powered by Savlicon ({{ site.builtBy.label }})</p>
        </div>
      </div>
    </div>
  </div>

  <!-- not found -->
  <div v-else-if="loaded" class="flex flex-col items-center py-24 text-center">
    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-forest-900/40"><Icon name="lucide:file-question" class="h-6 w-6" /></span>
    <p class="mt-4 font-display text-lg text-forest-950">Invoice not found</p>
    <p class="mt-1 text-sm text-forest-900/55">It may have been deleted.</p>
    <NuxtLink to="/dashboard/invoices" class="btn-primary mt-5">Back to invoices</NuxtLink>
  </div>

  <!-- loading -->
  <div v-else class="flex items-center justify-center py-24 text-forest-900/40">
    <Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" />
  </div>
</template>
