<script setup>
definePageMeta({ layout: 'dashboard', title: 'Data Room' })
useHead({ title: 'Data Room · Group Portal' })

const codes = ref([])
const requests = ref([])
const loading = ref(true)
const newLabel = ref('')
const creating = ref(false)
const copied = ref(null)

async function load() {
  loading.value = true
  try {
    ;[codes.value, requests.value] = await Promise.all([
      $fetch('/api/data-room/codes'),
      $fetch('/api/data-room/requests'),
    ])
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function createCode() {
  creating.value = true
  try {
    const item = await $fetch('/api/data-room/codes', { method: 'POST', body: { label: newLabel.value || 'Investor access' } })
    codes.value.unshift(item)
    newLabel.value = ''
  } finally {
    creating.value = false
  }
}
async function toggle(c) {
  const updated = await $fetch(`/api/data-room/codes/${c.id}`, { method: 'PATCH', body: { active: !c.active } })
  const i = codes.value.findIndex((x) => x.id === c.id)
  if (i >= 0) codes.value[i] = updated
}
async function removeCode(c) {
  await $fetch(`/api/data-room/codes/${c.id}`, { method: 'DELETE' })
  codes.value = codes.value.filter((x) => x.id !== c.id)
}
function copy(code) {
  if (import.meta.client && navigator.clipboard) navigator.clipboard.writeText(code)
  copied.value = code
  setTimeout(() => (copied.value = null), 1500)
}
async function setReqStatus(r, status) {
  const updated = await $fetch(`/api/data-room/requests/${r.id}`, { method: 'PATCH', body: { status } })
  const i = requests.value.findIndex((x) => x.id === r.id)
  if (i >= 0) requests.value[i] = updated
}

const reqStatusStyle = {
  new: 'bg-gold-50 text-gold-700 border-gold-200',
  approved: 'bg-forest-50 text-forest-700 border-forest-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
}
</script>

<template>
  <div>
    <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Investor Data Room</h1>
    <p class="mt-1.5 text-sm text-forest-900/60">Issue access codes and manage requests for the secure investor data room.</p>

    <div class="mt-7 grid gap-6 lg:grid-cols-2">
      <!-- codes -->
      <div class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
        <h2 class="font-display text-lg text-forest-950">Access codes</h2>
        <p class="mt-1 text-sm text-forest-900/55">Share a code with verified investors to unlock the data room.</p>

        <div class="mt-4 flex gap-2">
          <input v-model="newLabel" type="text" placeholder="Label (e.g. DFI round, Jane Doe)" class="min-w-0 flex-1 rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" @keyup.enter="createCode" />
          <button class="btn-primary !py-2.5 shrink-0" :disabled="creating" @click="createCode">
            <Icon :name="creating ? 'lucide:loader-circle' : 'lucide:plus'" class="h-4 w-4" :class="creating && 'animate-spin'" /> Generate
          </button>
        </div>

        <ul class="mt-5 space-y-2.5">
          <li v-for="c in codes" :key="c.id" class="flex items-center gap-3 rounded-xl border border-ink/[0.07] bg-sand-50/40 px-4 py-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <code class="rounded bg-forest-950 px-2 py-0.5 font-mono text-xs text-gold-200">{{ c.code }}</code>
                <button class="text-forest-900/40 transition hover:text-forest-800" :title="copied === c.code ? 'Copied' : 'Copy'" @click="copy(c.code)">
                  <Icon :name="copied === c.code ? 'lucide:check' : 'lucide:copy'" class="h-3.5 w-3.5" />
                </button>
              </div>
              <p class="mt-1 truncate text-xs text-forest-900/55">{{ c.label }}</p>
            </div>
            <button class="rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold transition" :class="c.active ? 'border-forest-200 bg-forest-50 text-forest-700' : 'border-ink/10 bg-sand-100 text-forest-900/45'" @click="toggle(c)">
              {{ c.active ? 'Active' : 'Disabled' }}
            </button>
            <button class="text-forest-900/35 transition hover:text-red-500" title="Delete" @click="removeCode(c)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
          </li>
          <li v-if="!loading && !codes.length" class="py-6 text-center text-sm text-forest-900/45">No codes yet.</li>
        </ul>
      </div>

      <!-- requests -->
      <div class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
        <h2 class="font-display text-lg text-forest-950">Access requests</h2>
        <p class="mt-1 text-sm text-forest-900/55">Investors who requested data-room access from the website.</p>

        <ul class="mt-5 space-y-3">
          <li v-for="r in requests" :key="r.id" class="rounded-xl border border-ink/[0.07] bg-sand-50/40 p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-forest-950">{{ r.name }}</p>
                <p class="truncate text-xs text-forest-900/55">{{ r.email }}<span v-if="r.org"> · {{ r.org }}</span></p>
              </div>
              <span class="rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize" :class="reqStatusStyle[r.status]">{{ r.status }}</span>
            </div>
            <p v-if="r.message" class="mt-2 text-sm leading-relaxed text-forest-900/70">{{ r.message }}</p>
            <div class="mt-3 flex items-center gap-2">
              <button class="rounded-full bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-700 transition hover:bg-forest-100" @click="setReqStatus(r, 'approved')">Approve</button>
              <button class="rounded-full bg-sand-100 px-3 py-1.5 text-xs font-semibold text-forest-900/60 transition hover:bg-red-50 hover:text-red-600" @click="setReqStatus(r, 'declined')">Decline</button>
              <a :href="`mailto:${r.email}`" class="ml-auto text-xs font-semibold text-forest-700 hover:text-forest-950">Email →</a>
            </div>
          </li>
          <li v-if="!loading && !requests.length" class="py-6 text-center text-sm text-forest-900/45">No access requests yet.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
