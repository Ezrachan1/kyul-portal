<script setup>
import { issuers, VAT_RATE } from '~/data/invoices'

definePageMeta({ layout: 'dashboard', title: 'New invoice' })
useHead({ title: 'New invoice · Group Portal' })

const { create, nextNumber, ensure } = useInvoices()

const form = reactive({
  issuer: 'engineering',
  client: { name: '', address: '', email: '' },
  issueDate: '',
  dueDate: '',
  status: 'pending',
  taxRate: VAT_RATE,
  items: [{ description: '', qty: 1, unitPrice: 0 }],
  notes: '',
})

const error = ref('')
const issuerList = Object.entries(issuers).map(([slug, v]) => ({ slug, ...v }))

const saving = ref(false)
onMounted(() => {
  ensure()
  const today = new Date()
  const due = new Date(today.getTime() + 30 * 864e5)
  form.issueDate = today.toISOString().slice(0, 10)
  form.dueDate = due.toISOString().slice(0, 10)
})

const number = computed(() => nextNumber(form.issuer))
const totals = computed(() => invoiceTotals(form))

function addItem() {
  form.items.push({ description: '', qty: 1, unitPrice: 0 })
}
function removeItem(i) {
  form.items.splice(i, 1)
  if (!form.items.length) addItem()
}

async function save() {
  error.value = ''
  if (!form.client.name.trim()) {
    error.value = 'Please enter the client name.'
    return
  }
  const valid = form.items.filter((i) => i.description.trim() && Number(i.unitPrice) > 0)
  if (!valid.length) {
    error.value = 'Add at least one line item with a description and amount.'
    return
  }
  saving.value = true
  try {
    const inv = await create({
      issuer: form.issuer,
      number: number.value,
      client: { ...form.client },
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: form.status,
      taxRate: Number(form.taxRate),
      items: valid.map((i) => ({ description: i.description.trim(), qty: Number(i.qty) || 1, unitPrice: Number(i.unitPrice) || 0 })),
      notes: form.notes.trim(),
    })
    navigateTo(`/dashboard/invoices/${inv.id}`)
  } catch (e) {
    saving.value = false
    error.value = e?.data?.statusMessage || 'Could not save the invoice. Please try again.'
  }
}

const inputCls =
  'w-full rounded-xl border border-ink/[0.12] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-forest-600'
</script>

<template>
  <div>
    <NuxtLink to="/dashboard/invoices" class="inline-flex items-center gap-1.5 text-sm text-forest-900/55 transition hover:text-forest-900"><Icon name="lucide:arrow-left" class="h-4 w-4" /> Invoices</NuxtLink>
    <h1 class="h-display mt-3 text-2xl text-forest-950 sm:text-3xl">New invoice</h1>

    <div class="mt-7 grid gap-6 lg:grid-cols-12">
      <!-- form -->
      <form class="space-y-5 lg:col-span-8" @submit.prevent="save">
        <!-- issuer + client -->
        <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <h2 class="font-display text-lg text-forest-950">Issuing company & client</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Issued by</label>
              <div class="relative">
                <select v-model="form.issuer" :class="[inputCls, 'appearance-none pr-10']">
                  <option v-for="o in issuerList" :key="o.slug" :value="o.slug">{{ o.name }}</option>
                </select>
                <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
              </div>
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Client / Bill to</label>
              <input v-model="form.client.name" type="text" :class="inputCls" placeholder="Client organisation" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Client email</label>
              <input v-model="form.client.email" type="email" :class="inputCls" placeholder="accounts@client.com" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Client address</label>
              <input v-model="form.client.address" type="text" :class="inputCls" placeholder="P.O. Box, Town" />
            </div>
          </div>
        </div>

        <!-- dates + status -->
        <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Issue date</label>
              <input v-model="form.issueDate" type="date" :class="inputCls" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Due date</label>
              <input v-model="form.dueDate" type="date" :class="inputCls" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-forest-900">Status</label>
              <div class="relative">
                <select v-model="form.status" :class="[inputCls, 'appearance-none pr-10 capitalize']">
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
              </div>
            </div>
          </div>
        </div>

        <!-- line items -->
        <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg text-forest-950">Line items</h2>
            <button type="button" class="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-100" @click="addItem"><Icon name="lucide:plus" class="h-4 w-4" /> Add item</button>
          </div>
          <div class="mt-5 space-y-3">
            <div v-for="(it, i) in form.items" :key="i" class="grid grid-cols-12 gap-2 sm:gap-3">
              <input v-model="it.description" type="text" :class="[inputCls, 'col-span-12 sm:col-span-6']" placeholder="Description" />
              <input v-model.number="it.qty" type="number" min="0" step="any" :class="[inputCls, 'col-span-3 sm:col-span-2']" placeholder="Qty" />
              <input v-model.number="it.unitPrice" type="number" min="0" step="any" :class="[inputCls, 'col-span-6 sm:col-span-3']" placeholder="Unit price" />
              <button type="button" class="col-span-3 inline-flex items-center justify-center rounded-xl border border-ink/10 text-forest-900/40 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:col-span-1" :aria-label="`Remove item ${i + 1}`" @click="removeItem(i)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
            </div>
          </div>
          <div class="mt-5 flex items-center gap-3 border-t border-ink/[0.06] pt-4">
            <label class="text-sm font-medium text-forest-900">VAT rate</label>
            <div class="relative w-28">
              <input :value="(form.taxRate * 100).toFixed(0)" type="number" min="0" max="100" :class="[inputCls, 'pr-7']" @input="form.taxRate = (Number($event.target.value) || 0) / 100" />
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-forest-900/40">%</span>
            </div>
          </div>
        </div>

        <!-- notes -->
        <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Notes / payment terms</label>
          <textarea v-model="form.notes" rows="3" :class="[inputCls, 'resize-y']" placeholder="e.g. Net 30 days. Bank details, contract reference…" />
        </div>

        <p v-if="error" class="flex items-center gap-1.5 text-sm text-red-600"><Icon name="lucide:circle-alert" class="h-4 w-4" /> {{ error }}</p>

        <div class="flex flex-wrap gap-3">
          <button type="submit" :disabled="saving" class="btn-primary">
            <Icon :name="saving ? 'lucide:loader-circle' : 'lucide:check'" class="h-4 w-4" :class="saving && 'animate-spin'" />
            {{ saving ? 'Saving…' : 'Create invoice' }}
          </button>
          <NuxtLink to="/dashboard/invoices" class="btn-outline">Cancel</NuxtLink>
        </div>
      </form>

      <!-- summary -->
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-24">
          <div class="overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-card">
            <div class="px-6 py-5 text-white" :style="{ background: issuers[form.issuer]?.accent }">
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 opacity-80">Invoice</p>
              <p class="mt-1 font-display text-lg">{{ number }}</p>
              <p class="mt-0.5 text-sm opacity-80">{{ issuers[form.issuer]?.name }}</p>
            </div>
            <div class="space-y-3 p-6">
              <div class="flex justify-between text-sm"><span class="text-forest-900/60">Subtotal</span><span class="font-medium text-forest-950 tabular-nums">{{ kes(totals.subtotal) }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-forest-900/60">VAT ({{ (form.taxRate * 100).toFixed(0) }}%)</span><span class="font-medium text-forest-950 tabular-nums">{{ kes(totals.tax) }}</span></div>
              <div class="flex justify-between border-t border-ink/[0.08] pt-3"><span class="font-display text-base text-forest-950">Total</span><span class="font-display text-lg text-forest-950 tabular-nums">{{ kes(totals.total) }}</span></div>
            </div>
          </div>
          <p class="mt-3 px-1 text-xs text-forest-900/45">This invoice is saved to the Group ledger and visible to Finance and Admin users.</p>
        </div>
      </div>
    </div>
  </div>
</template>
