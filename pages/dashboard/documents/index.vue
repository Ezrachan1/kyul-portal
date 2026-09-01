<script setup>
definePageMeta({ layout: 'dashboard', title: 'Documents' })
useHead({ title: 'Documents · Group Portal' })

const rows = ref([])
const loading = ref(true)
const scope = ref('all')
const modal = ref(false)
const editingId = ref(null)
const uploading = ref(false)
const error = ref('')

const blank = () => ({ title: '', category: 'Corporate', type: 'PDF', size: '', restricted: false, fileUrl: '', date: '' })
const form = reactive(blank())

const CATEGORIES = ['Corporate', 'Governance', 'Compliance', 'ESG', 'Financials', 'Strategy', 'Risk']

async function load() {
  loading.value = true
  try {
    rows.value = await $fetch('/api/documents')
  } finally {
    loading.value = false
  }
}
onMounted(load)

const filtered = computed(() => {
  if (scope.value === 'public') return rows.value.filter((d) => !d.restricted)
  if (scope.value === 'restricted') return rows.value.filter((d) => d.restricted)
  return rows.value
})

function openNew() {
  editingId.value = null
  Object.assign(form, blank())
  error.value = ''
  modal.value = true
}
function openEdit(d) {
  editingId.value = d.id
  Object.assign(form, { title: d.title, category: d.category, type: d.type, size: d.size, restricted: d.restricted, fileUrl: d.fileUrl, date: d.date })
  error.value = ''
  modal.value = true
}

const { upload } = useUpload()
async function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    form.fileUrl = await upload(file)
    const ext = (file.name.split('.').pop() || '').toUpperCase()
    if (ext) form.type = ext
    form.size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`
  } catch (err) {
    error.value = err?.data?.statusMessage || err?.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}

async function save() {
  error.value = ''
  if (!form.title.trim()) {
    error.value = 'Title is required.'
    return
  }
  try {
    if (editingId.value) {
      const updated = await $fetch(`/api/documents/${editingId.value}`, { method: 'PATCH', body: { ...form } })
      const i = rows.value.findIndex((r) => r.id === editingId.value)
      if (i >= 0) rows.value[i] = updated
    } else {
      const created = await $fetch('/api/documents', { method: 'POST', body: { ...form } })
      rows.value.unshift(created)
    }
    modal.value = false
  } catch (err) {
    error.value = err?.data?.statusMessage || 'Could not save the document.'
  }
}

const confirmId = ref(null)
async function remove(id) {
  await $fetch(`/api/documents/${id}`, { method: 'DELETE' })
  rows.value = rows.value.filter((r) => r.id !== id)
  confirmId.value = null
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Documents</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Manage the public library and the secure data room. {{ rows.length }} documents.</p>
      </div>
      <button class="btn-primary shrink-0 self-start sm:self-auto" @click="openNew"><Icon name="lucide:plus" class="h-4 w-4" /> Add document</button>
    </div>

    <div class="mt-6 flex flex-wrap gap-1.5">
      <button v-for="s in ['all', 'public', 'restricted']" :key="s" class="rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition" :class="scope === s ? 'border-forest-950 bg-forest-950 text-paper' : 'border-ink/[0.12] bg-white text-forest-900/70 hover:border-forest-900/40'" @click="scope = s">{{ s === 'restricted' ? 'Data room' : s }}</button>
    </div>

    <div class="mt-5 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
      <div v-if="loading" class="flex justify-center py-16 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>
      <ul v-else class="divide-y divide-ink/[0.05]">
        <li v-for="d in filtered" :key="d.id" class="flex items-center gap-4 px-5 py-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="d.type === 'XLSX' ? 'lucide:sheet' : 'lucide:file-text'" class="h-5 w-5" /></span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-forest-950">{{ d.title }}</p>
            <p class="truncate text-xs text-forest-900/50">{{ d.category }} · {{ d.type }} · {{ d.size }}</p>
          </div>
          <span v-if="d.restricted" class="hidden rounded-full border border-gold-200 bg-gold-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-gold-700 sm:inline-block">Data room</span>
          <span v-else class="hidden rounded-full border border-forest-200 bg-forest-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-forest-700 sm:inline-block">Public</span>
          <a v-if="d.fileUrl" :href="d.fileUrl" target="_blank" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-sand-100 hover:text-forest-800" title="Open"><Icon name="lucide:external-link" class="h-4 w-4" /></a>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-sand-100 hover:text-forest-800" title="Edit" @click="openEdit(d)"><Icon name="lucide:pencil" class="h-4 w-4" /></button>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-red-50 hover:text-red-500" title="Delete" @click="confirmId = d.id"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
        </li>
      </ul>
    </div>

    <!-- delete confirm -->
    <UiModal :open="!!confirmId" title="Delete document?" subtitle="This cannot be undone." @close="confirmId = null">
      <div class="flex justify-end gap-2">
        <button class="btn-outline" @click="confirmId = null">Cancel</button>
        <button class="btn bg-red-600 text-white hover:bg-red-700" @click="remove(confirmId)">Delete</button>
      </div>
    </UiModal>

    <!-- add/edit -->
    <UiModal :open="modal" :title="editingId ? 'Edit document' : 'Add document'" @close="modal = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Title</label>
          <input v-model="form.title" type="text" class="w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Category</label>
            <select v-model="form.category" class="w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600">
              <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Type</label>
            <input v-model="form.type" type="text" class="w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">File</label>
          <div class="flex items-center gap-3">
            <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink/[0.12] bg-white px-4 py-2.5 text-sm font-medium text-forest-800 transition hover:bg-sand-50">
              <Icon :name="uploading ? 'lucide:loader-circle' : 'lucide:upload'" class="h-4 w-4" :class="uploading && 'animate-spin'" />
              {{ uploading ? 'Uploading…' : 'Upload file' }}
              <input type="file" class="hidden" @change="onFile" />
            </label>
            <span v-if="form.fileUrl" class="truncate text-xs text-forest-700">{{ form.fileUrl }}</span>
          </div>
          <input v-model="form.fileUrl" type="text" placeholder="or paste a file URL" class="mt-2 w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" />
        </div>
        <label class="flex items-center gap-3 rounded-xl border border-ink/[0.08] bg-sand-50/50 px-4 py-3">
          <input v-model="form.restricted" type="checkbox" class="h-4 w-4 rounded border-ink/30 text-forest-700 focus:ring-forest-600" />
          <span class="text-sm text-forest-900/80">Restrict to the secure data room (investors only)</span>
        </label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-outline" @click="modal = false">Cancel</button>
          <button type="submit" class="btn-primary">{{ editingId ? 'Save changes' : 'Add document' }}</button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
