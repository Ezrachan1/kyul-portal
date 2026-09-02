<script setup>
import { subsidiaries, subsidiaryBySlug } from '~/data/subsidiaries'

definePageMeta({ layout: 'dashboard', title: 'Portfolio' })
useHead({ title: 'Portfolio · Group Portal' })

const entity = ref('engineering')
const rows = ref([])
const loading = ref(true)
const modal = ref(false)
const editingId = ref(null)
const error = ref('')

const blank = () => ({ entity: 'engineering', name: '', client: '', location: '', value: '', year: '', scope: '', sector: '', status: '', image: '' })
const form = reactive(blank())

// Project photo — shown on /projects cards and the homepage featured project.
const { uploadImage } = useUpload()
const fileEl = ref(null)
const uploading = ref(false)
async function onPhoto(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    // Resized and re-encoded in the browser, so phone photos upload quickly.
    form.image = await uploadImage(file, { maxEdge: 1920 })
  } catch (err) {
    error.value = err?.data?.statusMessage || err?.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

const current = computed(() => subsidiaryBySlug(entity.value))
const label = computed(() => current.value?.portfolioLabel || 'Portfolio')

async function load() {
  loading.value = true
  try {
    rows.value = await $fetch('/api/portfolio', { query: { entity: entity.value } })
  } finally {
    loading.value = false
  }
}
watch(entity, load)
onMounted(load)

function openNew() {
  editingId.value = null
  Object.assign(form, blank(), { entity: entity.value })
  error.value = ''
  modal.value = true
}
function openEdit(p) {
  editingId.value = p.id
  Object.assign(form, { entity: p.entity, name: p.name, client: p.client, location: p.location, value: p.value, year: p.year, scope: p.scope, sector: p.sector, status: p.status, image: p.image || '' })
  error.value = ''
  modal.value = true
}
async function save() {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'Project / item name is required.'
    return
  }
  try {
    if (editingId.value) {
      const updated = await $fetch(`/api/portfolio/${editingId.value}`, { method: 'PATCH', body: { ...form } })
      const i = rows.value.findIndex((r) => r.id === editingId.value)
      if (i >= 0) rows.value[i] = updated
    } else {
      const created = await $fetch('/api/portfolio', { method: 'POST', body: { ...form, order: rows.value.length } })
      if (created.entity === entity.value) rows.value.push(created)
    }
    modal.value = false
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not save.'
  }
}
const confirmId = ref(null)
async function remove(id) {
  await $fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
  rows.value = rows.value.filter((r) => r.id !== id)
  confirmId.value = null
}
const inputCls = 'w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600'
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Portfolio</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Manage the projects, holdings and track record shown on each company’s sub-portal.</p>
      </div>
      <button class="btn-primary shrink-0 self-start sm:self-auto" @click="openNew"><Icon name="lucide:plus" class="h-4 w-4" /> Add item</button>
    </div>

    <div class="mt-6 flex flex-wrap items-end gap-4">
      <div>
        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-forest-900/45">Company</label>
        <select v-model="entity" class="w-full max-w-xs rounded-xl border border-ink/[0.12] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600">
          <option v-for="s in subsidiaries" :key="s.slug" :value="s.slug">{{ s.name }}</option>
        </select>
      </div>
      <p class="pb-2.5 text-sm text-forest-900/55">Shown on the sub-portal as <span class="font-medium text-forest-800">“{{ label }}”</span></p>
    </div>

    <div v-if="loading" class="flex justify-center py-16 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>
    <div v-else class="mt-5 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
      <ul class="divide-y divide-ink/[0.05]">
        <li v-for="p in rows" :key="p.id" class="flex items-center gap-4 px-5 py-4">
          <img v-if="p.image" :src="p.image" alt="" class="h-10 w-14 shrink-0 rounded-lg object-cover ring-1 ring-ink/10" />
          <span v-else class="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-sand-100 text-forest-900/30"><Icon name="lucide:image" class="h-4 w-4" /></span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-forest-950">{{ p.name }}</p>
            <p class="truncate text-xs text-forest-900/50">{{ [p.client, p.location, p.value, p.year].filter(Boolean).join(' · ') }}</p>
          </div>
          <span v-if="p.status" class="hidden rounded-full border border-ink/10 bg-sand-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-forest-700 sm:inline-block">{{ p.status }}</span>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-sand-100 hover:text-forest-800" title="Edit" @click="openEdit(p)"><Icon name="lucide:pencil" class="h-4 w-4" /></button>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-red-50 hover:text-red-500" title="Delete" @click="confirmId = p.id"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
        </li>
        <li v-if="!rows.length" class="py-12 text-center text-sm text-forest-900/45">No portfolio items for this company yet.</li>
      </ul>
    </div>

    <UiModal :open="!!confirmId" title="Remove item?" @close="confirmId = null">
      <div class="flex justify-end gap-2"><button class="btn-outline" @click="confirmId = null">Cancel</button><button class="btn bg-red-600 text-white hover:bg-red-700" @click="remove(confirmId)">Remove</button></div>
    </UiModal>

    <UiModal :open="modal" :title="editingId ? 'Edit portfolio item' : 'Add portfolio item'" @close="modal = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Project / item name</label>
          <input v-model="form.name" type="text" :class="inputCls" placeholder="e.g. County HQ Office Block" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="mb-1.5 block text-sm font-medium text-forest-900">Client</label><input v-model="form.client" type="text" :class="inputCls" /></div>
          <div><label class="mb-1.5 block text-sm font-medium text-forest-900">Location</label><input v-model="form.location" type="text" :class="inputCls" /></div>
          <div><label class="mb-1.5 block text-sm font-medium text-forest-900">Value</label><input v-model="form.value" type="text" :class="inputCls" placeholder="KSh 180M" /></div>
          <div><label class="mb-1.5 block text-sm font-medium text-forest-900">Year</label><input v-model="form.year" type="text" :class="inputCls" placeholder="2024–25" /></div>
          <div><label class="mb-1.5 block text-sm font-medium text-forest-900">Sector</label><input v-model="form.sector" type="text" :class="inputCls" /></div>
          <div><label class="mb-1.5 block text-sm font-medium text-forest-900">Status</label><input v-model="form.status" type="text" :class="inputCls" placeholder="Delivered" /></div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Scope</label>
          <textarea v-model="form.scope" rows="2" :class="[inputCls, 'resize-y']" placeholder="Short scope description" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Project photo <span class="text-forest-900/40">(optional — shown on the public Projects page)</span></label>
          <div class="flex items-center gap-3">
            <img v-if="form.image" :src="form.image" alt="Project photo preview" class="h-16 w-24 rounded-lg object-cover ring-1 ring-ink/10" />
            <span v-else class="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-ink/15 bg-sand-50/60 text-forest-900/30"><Icon name="lucide:image" class="h-5 w-5" /></span>
            <div class="flex flex-col gap-1.5">
              <button type="button" class="btn-outline !px-4 !py-2 text-xs" :disabled="uploading" @click="fileEl?.click()">
                <Icon v-if="uploading" name="lucide:loader-circle" class="h-3.5 w-3.5 animate-spin" />
                {{ uploading ? 'Uploading…' : form.image ? 'Replace photo' : 'Upload photo' }}
              </button>
              <button v-if="form.image" type="button" class="text-left text-xs font-medium text-red-600 hover:underline" @click="form.image = ''">Remove photo</button>
            </div>
            <input ref="fileEl" type="file" accept="image/*" class="hidden" @change="onPhoto" />
          </div>
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <div class="flex justify-end gap-2 pt-2"><button type="button" class="btn-outline" @click="modal = false">Cancel</button><button type="submit" class="btn-primary">{{ editingId ? 'Save changes' : 'Add item' }}</button></div>
      </form>
    </UiModal>
  </div>
</template>
