<script setup>
definePageMeta({ layout: 'dashboard', title: 'Inbox' })
useHead({ title: 'Inbox · Group Portal' })

const rows = ref([])
const selected = ref(null)
const typeFilter = ref('all')
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    rows.value = await $fetch('/api/submissions')
    if (!selected.value && rows.value.length) selected.value = rows.value[0]
  } finally {
    loading.value = false
  }
}
onMounted(load)

const types = [
  { key: 'all', label: 'All' },
  { key: 'enquiry', label: 'Enquiries' },
  { key: 'rfp', label: 'Proposals / RFPs' },
  { key: 'application', label: 'Applications' },
]
const filtered = computed(() =>
  (typeFilter.value === 'all' ? rows.value : rows.value.filter((r) => r.type === typeFilter.value)).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  ),
)
const newCount = computed(() => rows.value.filter((r) => r.status === 'new').length)

const typeMeta = {
  enquiry: { label: 'Enquiry', icon: 'lucide:mail', color: '#2d5d4b' },
  rfp: { label: 'Proposal / RFP', icon: 'lucide:file-text', color: '#bd9038' },
  application: { label: 'Application', icon: 'lucide:user-plus', color: '#1c3a6e' },
}
const statusStyle = {
  new: 'bg-gold-50 text-gold-700 border-gold-200',
  read: 'bg-sand-100 text-forest-900/60 border-ink/10',
  'in-progress': 'bg-forest-50 text-forest-700 border-forest-200',
  closed: 'bg-sand-100 text-forest-900/45 border-ink/10',
}

async function setStatus(row, status) {
  const updated = await $fetch(`/api/submissions/${row.id}`, { method: 'PATCH', body: { status } })
  const i = rows.value.findIndex((r) => r.id === row.id)
  if (i >= 0) rows.value[i] = updated
  if (selected.value?.id === row.id) selected.value = updated
}
function select(row) {
  selected.value = row
  if (row.status === 'new') setStatus(row, 'read')
}
async function remove(row) {
  await $fetch(`/api/submissions/${row.id}`, { method: 'DELETE' })
  rows.value = rows.value.filter((r) => r.id !== row.id)
  if (selected.value?.id === row.id) selected.value = rows.value[0] || null
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Inbox</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Proposals, enquiries and applications received from the website · {{ newCount }} new</p>
      </div>
      <button class="btn-outline !py-2.5 self-start" @click="load"><Icon name="lucide:refresh-cw" class="h-4 w-4" /> Refresh</button>
    </div>

    <div class="mt-6 flex flex-wrap gap-1.5">
      <button
        v-for="t in types" :key="t.key"
        class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
        :class="typeFilter === t.key ? 'border-forest-950 bg-forest-950 text-paper' : 'border-ink/12 bg-white text-forest-900/70 hover:border-forest-900/40'"
        @click="typeFilter = t.key"
      >{{ t.label }}</button>
    </div>

    <div class="mt-5 grid gap-4 lg:grid-cols-12">
      <!-- list -->
      <div class="lg:col-span-5">
        <div class="overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
          <div v-if="loading" class="flex justify-center py-16 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>
          <div v-else-if="!filtered.length" class="py-16 text-center text-sm text-forest-900/50">No messages here yet.</div>
          <ul v-else class="max-h-[70vh] divide-y divide-ink/[0.05] overflow-y-auto">
            <li
              v-for="r in filtered" :key="r.id"
              class="flex cursor-pointer items-start gap-3 px-5 py-4 transition hover:bg-sand-50/60"
              :class="selected?.id === r.id && 'bg-sand-50'"
              @click="select(r)"
            >
              <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" :style="{ background: typeMeta[r.type]?.color }">
                <Icon :name="typeMeta[r.type]?.icon" class="h-4 w-4" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-forest-950">{{ r.name }}</p>
                  <span v-if="r.status === 'new'" class="h-2 w-2 shrink-0 rounded-full bg-gold-400" />
                </div>
                <p class="truncate text-xs text-forest-900/55">{{ r.subject || typeMeta[r.type]?.label }}</p>
                <p class="mt-0.5 truncate text-xs text-forest-900/40">{{ formatDate(r.createdAt, { day: 'numeric', month: 'short' }) }} · {{ r.source || r.type }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- detail -->
      <div class="lg:col-span-7">
        <div v-if="selected" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-8">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" :style="{ background: typeMeta[selected.type]?.color }">
                <Icon :name="typeMeta[selected.type]?.icon" class="h-3.5 w-3.5" /> {{ typeMeta[selected.type]?.label }}
              </span>
              <h2 class="mt-3 font-display text-xl text-forest-950">{{ selected.subject || 'No subject' }}</h2>
              <p class="mt-1 text-sm text-forest-900/55">{{ formatDate(selected.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <select :value="selected.status" class="appearance-none rounded-full border border-ink/12 bg-white py-1.5 pl-3 pr-8 text-xs font-medium capitalize outline-none focus:ring-2 focus:ring-forest-600" @change="setStatus(selected, $event.target.value)">
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="in-progress">In progress</option>
                  <option value="closed">Closed</option>
                </select>
                <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-forest-900/40" />
              </div>
              <button class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-forest-900/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500" aria-label="Delete" @click="remove(selected)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
            </div>
          </div>

          <dl class="mt-6 grid gap-x-6 gap-y-3 border-y border-ink/[0.06] py-5 sm:grid-cols-2">
            <div><dt class="text-xs text-forest-900/45">From</dt><dd class="text-sm font-medium text-forest-950">{{ selected.name }}</dd></div>
            <div><dt class="text-xs text-forest-900/45">Email</dt><dd class="text-sm"><a :href="`mailto:${selected.email}`" class="text-forest-700 underline decoration-gold-400/50 underline-offset-2">{{ selected.email }}</a></dd></div>
            <div v-if="selected.org"><dt class="text-xs text-forest-900/45">Organisation</dt><dd class="text-sm text-forest-950">{{ selected.org }}</dd></div>
            <div v-if="selected.source"><dt class="text-xs text-forest-900/45">Source</dt><dd class="text-sm text-forest-950">{{ selected.source }}</dd></div>
            <div v-if="selected.meta?.phone"><dt class="text-xs text-forest-900/45">Phone</dt><dd class="text-sm text-forest-950">{{ selected.meta.phone }}</dd></div>
            <div v-if="selected.meta?.link"><dt class="text-xs text-forest-900/45">CV / Portfolio</dt><dd class="truncate text-sm"><a :href="selected.meta.link" target="_blank" class="text-forest-700 underline">{{ selected.meta.link }}</a></dd></div>
          </dl>

          <p class="mt-5 whitespace-pre-line text-sm leading-relaxed text-forest-900/75">{{ selected.message || 'No message' }}</p>

          <a :href="`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your enquiry to Kyul Group')}`" class="btn-primary mt-7 !py-2.5"><Icon name="lucide:reply" class="h-4 w-4" /> Reply by email</a>
        </div>
        <div v-else class="flex h-full min-h-[20rem] items-center justify-center rounded-2xl border border-dashed border-ink/15 text-sm text-forest-900/40">
          Select a message to read it.
        </div>
      </div>
    </div>
  </div>
</template>
