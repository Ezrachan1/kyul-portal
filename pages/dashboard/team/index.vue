<script setup>
import { subsidiaries } from '~/data/subsidiaries'

definePageMeta({ layout: 'dashboard', title: 'Team & Leadership' })
useHead({ title: 'Team · Group Portal' })

const ENTITIES = [{ slug: 'group', name: 'Kyul Group (Board & Executive)' }, ...subsidiaries.map((s) => ({ slug: s.slug, name: s.name }))]

const entity = ref('group')
const rows = ref([])
const loading = ref(true)
const modal = ref(false)
const editingId = ref(null)
const uploading = ref(false)
const error = ref('')

const blank = () => ({ entity: 'group', name: '', title: '', bio: '', photo: '', order: 0 })
const form = reactive(blank())

async function load() {
  loading.value = true
  try {
    rows.value = await $fetch('/api/team', { query: { entity: entity.value } })
  } finally {
    loading.value = false
  }
}
watch(entity, load)
onMounted(load)

function openNew() {
  editingId.value = null
  Object.assign(form, blank(), { entity: entity.value, order: rows.value.length })
  error.value = ''
  modal.value = true
}
function openEdit(m) {
  editingId.value = m.id
  Object.assign(form, { entity: m.entity, name: m.name, title: m.title, bio: m.bio, photo: m.photo, order: m.order })
  error.value = ''
  modal.value = true
}
const { upload } = useUpload()
async function onPhoto(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    form.photo = await upload(file)
  } catch (err) {
    error.value = err?.data?.statusMessage || err?.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}
async function save() {
  error.value = ''
  if (!form.title.trim() && !form.name.trim()) {
    error.value = 'Enter at least a name or a role/title.'
    return
  }
  try {
    if (editingId.value) {
      const updated = await $fetch(`/api/team/${editingId.value}`, { method: 'PATCH', body: { ...form } })
      const i = rows.value.findIndex((r) => r.id === editingId.value)
      if (i >= 0) rows.value[i] = updated
    } else {
      const created = await $fetch('/api/team', { method: 'POST', body: { ...form } })
      if (created.entity === entity.value) rows.value.push(created)
    }
    modal.value = false
  } catch (err) {
    error.value = err?.data?.statusMessage || 'Could not save.'
  }
}
const confirmId = ref(null)
async function remove(id) {
  await $fetch(`/api/team/${id}`, { method: 'DELETE' })
  rows.value = rows.value.filter((r) => r.id !== id)
  confirmId.value = null
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Team & Leadership</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Add real names, photos and bios. These appear on the public website.</p>
      </div>
      <button class="btn-primary shrink-0 self-start sm:self-auto" @click="openNew"><Icon name="lucide:plus" class="h-4 w-4" /> Add member</button>
    </div>

    <div class="mt-6">
      <label class="mb-1.5 block text-xs font-semibold uppercase tracking-widest2 text-forest-900/45">Company / Board</label>
      <select v-model="entity" class="w-full max-w-sm rounded-xl border border-ink/12 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600">
        <option v-for="e in ENTITIES" :key="e.slug" :value="e.slug">{{ e.name }}</option>
      </select>
    </div>

    <div v-if="loading" class="flex justify-center py-16 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>
    <div v-else class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="m in rows" :key="m.id" class="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft">
        <div class="flex items-center gap-3">
          <img v-if="m.photo" :src="m.photo" :alt="m.name || m.title" class="h-12 w-12 rounded-full object-cover" />
          <span v-else class="flex h-12 w-12 items-center justify-center rounded-full bg-forest-950 font-display text-sm text-gold-200">{{ m.initials }}</span>
          <div class="min-w-0">
            <p class="truncate font-display text-base text-forest-950">{{ m.name || m.title }}</p>
            <p class="truncate text-xs text-forest-900/55">{{ m.name ? m.title : 'Name not set' }}</p>
          </div>
        </div>
        <p class="mt-3 line-clamp-2 text-sm text-forest-900/65">{{ m.bio }}</p>
        <div class="mt-4 flex gap-2">
          <button class="flex-1 rounded-lg bg-sand-50 py-2 text-xs font-semibold text-forest-800 transition hover:bg-sand-100" @click="openEdit(m)">Edit</button>
          <button class="rounded-lg px-3 text-forest-900/40 transition hover:bg-red-50 hover:text-red-500" @click="confirmId = m.id"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
        </div>
      </div>
      <p v-if="!rows.length" class="col-span-full py-10 text-center text-sm text-forest-900/45">No team members yet for this company.</p>
    </div>

    <UiModal :open="!!confirmId" title="Remove team member?" @close="confirmId = null">
      <div class="flex justify-end gap-2"><button class="btn-outline" @click="confirmId = null">Cancel</button><button class="btn bg-red-600 text-white hover:bg-red-700" @click="remove(confirmId)">Remove</button></div>
    </UiModal>

    <UiModal :open="modal" :title="editingId ? 'Edit member' : 'Add member'" @close="modal = false">
      <form class="space-y-4" @submit.prevent="save">
        <div class="flex items-center gap-4">
          <img v-if="form.photo" :src="form.photo" alt="" class="h-16 w-16 rounded-full object-cover" />
          <span v-else class="flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 text-forest-900/30"><Icon name="lucide:user" class="h-7 w-7" /></span>
          <label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink/12 bg-white px-4 py-2.5 text-sm font-medium text-forest-800 transition hover:bg-sand-50">
            <Icon :name="uploading ? 'lucide:loader-circle' : 'lucide:upload'" class="h-4 w-4" :class="uploading && 'animate-spin'" /> {{ uploading ? 'Uploading…' : 'Upload photo' }}
            <input type="file" accept="image/*" class="hidden" @change="onPhoto" />
          </label>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Full name</label>
          <input v-model="form.name" type="text" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" placeholder="e.g. Jane Kiprop" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Role / Title</label>
          <input v-model="form.title" type="text" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" placeholder="e.g. Managing Director" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Bio</label>
          <textarea v-model="form.bio" rows="3" class="w-full resize-y rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" />
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <div class="flex justify-end gap-2 pt-2"><button type="button" class="btn-outline" @click="modal = false">Cancel</button><button type="submit" class="btn-primary">{{ editingId ? 'Save changes' : 'Add member' }}</button></div>
      </form>
    </UiModal>
  </div>
</template>
