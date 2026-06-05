<script setup>
definePageMeta({ layout: 'dashboard', title: 'Users & Roles' })
useHead({ title: 'Users · Group Portal' })

const { user: me, isSuper } = useAuth()

const ROLES = [
  { value: 'admin', label: 'Administrator', desc: 'Full access to all available modules and users.' },
  { value: 'editor', label: 'Editor', desc: 'Manage news, team, documents, data room and the inbox.' },
  { value: 'finance', label: 'Finance', desc: 'Manage invoices and view the overview.' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access to the overview.' },
]
const roleLabel = (r) => ROLES.find((x) => x.value === r)?.label || r

const rows = ref([])
const loading = ref(true)
const modal = ref(false)
const editingId = ref(null)
const error = ref('')

const blank = () => ({ name: '', email: '', role: 'editor', password: '', active: true })
const form = reactive(blank())

const availableRoles = computed(() => (isSuper.value ? [...ROLES, { value: 'super-admin', label: 'Super Admin' }] : ROLES))

async function load() {
  loading.value = true
  try {
    rows.value = await $fetch('/api/users')
  } finally {
    loading.value = false
  }
}
onMounted(load)

function openNew() {
  editingId.value = null
  Object.assign(form, blank())
  error.value = ''
  modal.value = true
}
function openEdit(u) {
  editingId.value = u.id
  Object.assign(form, { name: u.name, email: u.email, role: u.role, password: '', active: u.active !== false })
  error.value = ''
  modal.value = true
}
async function save() {
  error.value = ''
  if (!form.name.trim() || !form.email.trim()) {
    error.value = 'Name and email are required.'
    return
  }
  try {
    if (editingId.value) {
      const body = { name: form.name, role: form.role, active: form.active }
      if (form.password) body.password = form.password
      const updated = await $fetch(`/api/users/${editingId.value}`, { method: 'PATCH', body })
      const i = rows.value.findIndex((r) => r.id === editingId.value)
      if (i >= 0) rows.value[i] = updated
    } else {
      const created = await $fetch('/api/users', { method: 'POST', body: { ...form } })
      rows.value.unshift(created)
    }
    modal.value = false
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not save the user.'
  }
}
const confirmId = ref(null)
async function remove(id) {
  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    rows.value = rows.value.filter((r) => r.id !== id)
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not delete.'
  }
  confirmId.value = null
}
const roleStyle = {
  'super-admin': 'bg-forest-950 text-gold-200',
  admin: 'bg-forest-50 text-forest-700 border border-forest-200',
  editor: 'bg-gold-50 text-gold-700 border border-gold-200',
  finance: 'bg-sand-100 text-forest-900/70 border border-ink/10',
  viewer: 'bg-sand-100 text-forest-900/55 border border-ink/10',
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Users & Roles</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Create accounts and assign what each person can manage.</p>
      </div>
      <button class="btn-primary shrink-0 self-start sm:self-auto" @click="openNew"><Icon name="lucide:user-plus" class="h-4 w-4" /> Add user</button>
    </div>

    <div class="mt-6 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
      <div v-if="loading" class="flex justify-center py-16 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>
      <ul v-else class="divide-y divide-ink/[0.05]">
        <li v-for="u in rows" :key="u.id" class="flex items-center gap-4 px-5 py-4">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-950 text-xs font-semibold text-gold-200">{{ (u.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('') }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-forest-950">{{ u.name }}<span v-if="u.id === me?.id" class="ml-2 text-xs font-normal text-forest-900/40">(you)</span></p>
            <p class="truncate text-xs text-forest-900/50">{{ u.email }}</p>
          </div>
          <span class="rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize" :class="roleStyle[u.role]">{{ roleLabel(u.role) }}</span>
          <span v-if="u.active === false" class="hidden rounded-full border border-ink/10 bg-sand-100 px-2.5 py-0.5 text-[0.68rem] font-semibold text-forest-900/45 sm:inline-block">Disabled</span>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-sand-100 hover:text-forest-800" title="Edit" @click="openEdit(u)"><Icon name="lucide:pencil" class="h-4 w-4" /></button>
          <button v-if="u.id !== me?.id && !u.system" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-red-50 hover:text-red-500" title="Delete" @click="confirmId = u.id"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
        </li>
      </ul>
    </div>

    <UiModal :open="!!confirmId" title="Delete user?" subtitle="They will lose access immediately." @close="confirmId = null">
      <div class="flex justify-end gap-2"><button class="btn-outline" @click="confirmId = null">Cancel</button><button class="btn bg-red-600 text-white hover:bg-red-700" @click="remove(confirmId)">Delete</button></div>
    </UiModal>

    <UiModal :open="modal" :title="editingId ? 'Edit user' : 'Add user'" @close="modal = false">
      <form class="space-y-4" @submit.prevent="save">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Full name</label>
          <input v-model="form.name" type="text" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Email</label>
          <input v-model="form.email" type="email" :disabled="!!editingId" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600 disabled:opacity-60" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Role</label>
          <select v-model="form.role" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600">
            <option v-for="r in availableRoles" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
          <p class="mt-1.5 text-xs text-forest-900/50">{{ ROLES.find((r) => r.value === form.role)?.desc || 'Full system access.' }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-forest-900">{{ editingId ? 'New password (optional)' : 'Password' }}</label>
          <input v-model="form.password" type="password" :placeholder="editingId ? 'Leave blank to keep current' : 'At least 6 characters'" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600" />
        </div>
        <label v-if="editingId" class="flex items-center gap-3 text-sm text-forest-900/80"><input v-model="form.active" type="checkbox" class="h-4 w-4 rounded border-ink/30 text-forest-700 focus:ring-forest-600" /> Account active</label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <div class="flex justify-end gap-2 pt-2"><button type="button" class="btn-outline" @click="modal = false">Cancel</button><button type="submit" class="btn-primary">{{ editingId ? 'Save changes' : 'Create user' }}</button></div>
      </form>
    </UiModal>
  </div>
</template>
