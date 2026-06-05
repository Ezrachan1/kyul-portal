<script setup>
definePageMeta({ layout: 'dashboard', title: 'System & Modules' })
useHead({ title: 'System · Group Portal' })

const features = useState('kyul-features', () => ({}))
const saving = ref(null)
const loading = ref(true)

const MODULES = [
  { key: 'finance', label: 'Finance & Accounting', icon: 'lucide:wallet', desc: 'Double-entry accounting, consolidated P&L, budgets and tax.' },
  { key: 'hr', label: 'HR & Payroll', icon: 'lucide:users', desc: 'Employee records, leave, performance and payroll (PAYE/NHIF/NSSF).' },
  { key: 'procurement', label: 'Procurement & Supply Chain', icon: 'lucide:shopping-cart', desc: 'Vendors, purchase orders, goods receipt and inventory.' },
  { key: 'plm', label: 'Project Lifecycle', icon: 'lucide:kanban', desc: 'The Ventures → Projects → Engineering delivery pipeline.' },
  { key: 'legal', label: 'Legal & Compliance', icon: 'lucide:scale', desc: 'Contracts, governance documents and the compliance register.' },
  { key: 'kpis', label: 'Executive KPI Centre', icon: 'lucide:gauge', desc: 'Board-level consolidated KPIs and risk register.' },
]

async function load() {
  loading.value = true
  try {
    features.value = await $fetch('/api/features')
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function toggle(key) {
  saving.value = key
  try {
    features.value = await $fetch('/api/features', { method: 'PATCH', body: { [key]: !features.value[key] } })
  } finally {
    saving.value = null
  }
}
</script>

<template>
  <div>
    <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">System & Modules</h1>
    <p class="mt-1.5 text-sm text-forest-900/60">Super-admin controls. Enable a module to make it available to administrators.</p>

    <div class="mt-6 flex items-start gap-3 rounded-2xl border border-forest-200 bg-forest-50 p-4 text-sm text-forest-900/75">
      <Icon name="lucide:shield" class="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
      <p>This area is visible only to the super-admin. Modules switched on here appear in the portal navigation for administrators; switched off, they stay hidden from all other users.</p>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <div v-for="m in MODULES" :key="m.key" class="flex items-start gap-4 rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="m.icon" class="h-5 w-5" /></span>
        <div class="min-w-0 flex-1">
          <p class="font-display text-base text-forest-950">{{ m.label }}</p>
          <p class="mt-1 text-sm leading-relaxed text-forest-900/60">{{ m.desc }}</p>
        </div>
        <button
          class="relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
          :class="features[m.key] ? 'bg-forest-700' : 'bg-ink/15'"
          :disabled="saving === m.key"
          role="switch" :aria-checked="!!features[m.key]" :aria-label="`Toggle ${m.label}`"
          @click="toggle(m.key)"
        >
          <span class="inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition" :class="features[m.key] ? 'translate-x-6' : 'translate-x-1'" style="height: 1.1rem; width: 1.1rem" />
        </button>
      </div>
    </div>
  </div>
</template>
