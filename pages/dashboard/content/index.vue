<script setup>
import { contentSections } from '~/data/content-registry'

definePageMeta({ layout: 'dashboard', title: 'Site Content' })
useHead({ title: 'Site Content · Group Portal' })

const route = useRoute()
const router = useRouter()
const { uploadImage } = useUpload()

const allFields = contentSections.flatMap((s) => s.fields)
const sectionIds = contentSections.map((s) => s.id)
const validSection = (id) => (id && sectionIds.includes(String(id)) ? String(id) : '')

// `overrides` mirrors the server store (customised keys only). `draft` is what
// the editor shows: one string per registry key, '' meaning "use the original".
const overrides = ref({})
const draft = reactive(Object.fromEntries(allFields.map((f) => [f.key, ''])))
const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const search = ref('')
const active = ref(validSection(route.query.s) || contentSections[0].id)
const uploadingKey = ref('')
const uploadError = reactive({})

const str = (v) => (v === undefined || v === null ? '' : String(v))
const asMap = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {})

function initDraft(src) {
  for (const f of allFields) draft[f.key] = str(src[f.key])
}

onMounted(async () => {
  try {
    overrides.value = asMap(await $fetch('/api/content'))
    initDraft(overrides.value)
  } catch {
    error.value = 'Could not load site content.'
  }
  loading.value = false
})

// A key is dirty when the draft differs from what the server holds. An empty
// draft is sent as '' so the server clears that key back to the original.
const isChanged = (key) => str(draft[key]) !== str(overrides.value[key])
const changedKeys = computed(() => allFields.map((f) => f.key).filter(isChanged))
const pendingCount = computed(() => changedKeys.value.length)
const isCustomised = (key) => str(overrides.value[key]) !== ''
const customised = computed(() => Object.fromEntries(contentSections.map((s) => [s.id, s.fields.filter((f) => isCustomised(f.key)).length])))

// Active section, kept in sync with ?s= so a section survives reload and can be linked.
const activeSection = computed(() => contentSections.find((s) => s.id === active.value) || contentSections[0])
function selectSection(id) {
  search.value = ''
  active.value = id
}
watch(active, (id) => {
  if (route.query.s !== id) router.replace({ query: { ...route.query, s: id } })
})
watch(
  () => route.query.s,
  (s) => {
    const id = validSection(s)
    if (id && id !== active.value) active.value = id
  },
)

// Search every section by label, key or original copy; results replace the active section.
const query = computed(() => search.value.trim().toLowerCase())
const matches = (f) => {
  const q = query.value
  return f.label.toLowerCase().includes(q) || f.key.toLowerCase().includes(q) || str(f.default).toLowerCase().includes(q)
}
const groups = computed(() => {
  if (!query.value) return [{ section: activeSection.value, fields: activeSection.value.fields }]
  return contentSections.map((s) => ({ section: s, fields: s.fields.filter(matches) })).filter((g) => g.fields.length)
})
const matchCount = computed(() => groups.value.reduce((n, g) => n + g.fields.length, 0))

const isWide = (key) => (key.endsWith('hero.image') && !key.startsWith('sub.')) || key === 'brand.ogImage'
const fieldId = (key) => `content-${key}`

async function onFile(e, field) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  uploadingKey.value = field.key
  uploadError[field.key] = ''
  try {
    // Resized and re-encoded in the browser, so large photos upload quickly.
    draft[field.key] = await uploadImage(file, { maxEdge: field.maxEdge || 2000 })
  } catch (err) {
    uploadError[field.key] = err?.data?.statusMessage || err?.message || 'Upload failed.'
  } finally {
    uploadingKey.value = ''
  }
}

async function save() {
  if (!pendingCount.value || saving.value) return
  error.value = ''
  saved.value = false
  saving.value = true
  const body = {}
  for (const key of changedKeys.value) body[key] = str(draft[key])
  try {
    // The server answers with the full override map, minus anything equal to its default.
    overrides.value = asMap(await $fetch('/api/content', { method: 'PATCH', body }))
    initDraft(overrides.value)
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not save site content.'
  } finally {
    saving.value = false
  }
}

onBeforeRouteLeave(() => {
  if (pendingCount.value && !window.confirm('You have unsaved changes. Leave without saving?')) return false
})
// Closing or reloading the tab with pending edits also warns.
const beforeUnload = (e) => {
  if (pendingCount.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))

const inputCls = 'w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600'
const lbl = 'text-sm font-medium text-forest-900'
const pill = 'rounded-full bg-gold-50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest2 text-gold-700 ring-1 ring-gold-200'
const minor = 'shrink-0 text-xs font-medium text-forest-700 hover:underline'
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Site Content</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Change the photos, logos and wording shown on the public website. Leave a field empty to use the original.</p>
      </div>
      <button class="btn-primary shrink-0 self-start sm:self-auto" :disabled="saving || !pendingCount" @click="save">
        <Icon :name="saving ? 'lucide:loader-circle' : saved ? 'lucide:check' : 'lucide:save'" class="h-4 w-4" :class="saving && 'animate-spin'" />
        {{ saving ? 'Saving…' : saved ? 'Saved' : pendingCount ? `Save ${pendingCount} ${pendingCount === 1 ? 'change' : 'changes'}` : 'Save changes' }}
      </button>
    </div>
    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>

    <div v-if="loading" class="flex justify-center py-20 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>

    <div v-else class="mt-7 grid gap-6 lg:grid-cols-12 lg:items-start">
      <!-- Sections -->
      <aside class="min-w-0 lg:sticky lg:top-24 lg:col-span-3">
        <div class="relative">
          <Icon name="lucide:search" class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
          <input v-model="search" type="text" :class="[inputCls, 'pl-10 pr-9']" placeholder="Search all fields…" aria-label="Search fields" />
          <button v-if="search" type="button" class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-forest-900/40 transition hover:text-forest-900" aria-label="Clear search" @click="search = ''"><Icon name="lucide:x" class="h-4 w-4" /></button>
        </div>
        <select :value="active" :class="[inputCls, 'mt-3 lg:hidden']" aria-label="Section" @change="selectSection($event.target.value)">
          <option v-for="s in contentSections" :key="s.id" :value="s.id">{{ s.label }}{{ customised[s.id] ? ` · ${customised[s.id]} customised` : '' }}</option>
        </select>
        <nav class="mt-3 hidden rounded-2xl border border-ink/[0.07] bg-white p-2 shadow-soft lg:block lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto" aria-label="Sections">
          <button v-for="s in contentSections" :key="s.id" type="button" class="flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm transition" :class="s.id === active && !query ? 'bg-forest-950 text-paper' : 'text-forest-900 hover:bg-sand-50'" @click="selectSection(s.id)">
            <span class="truncate">{{ s.label }}</span>
            <span v-if="customised[s.id]" class="shrink-0 rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums" :class="s.id === active && !query ? 'bg-gold-300 text-forest-950' : 'bg-gold-50 text-gold-700 ring-1 ring-gold-200'">{{ customised[s.id] }}</span>
          </button>
        </nav>
      </aside>

      <!-- Fields -->
      <div class="min-w-0 lg:col-span-9">
        <p v-if="query" class="mb-4 text-sm text-forest-900/55">
          <template v-if="matchCount">{{ matchCount }} {{ matchCount === 1 ? 'field matches' : 'fields match' }} “{{ search.trim() }}”</template>
          <template v-else>No fields match “{{ search.trim() }}”.</template>
        </p>

        <section v-for="g in groups" :key="g.section.id" class="min-w-0" :class="query && 'mb-8 last:mb-0'">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <h2 class="font-display text-xl text-forest-950">{{ g.section.label }}</h2>
              <p v-if="g.section.intro" class="mt-1 text-sm text-forest-900/55">{{ g.section.intro }}</p>
            </div>
            <NuxtLink :to="g.section.page" target="_blank" class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-100">View page <Icon name="lucide:external-link" class="h-4 w-4" /></NuxtLink>
          </div>

          <div class="mt-5 space-y-4">
            <div v-for="field in g.fields" :key="field.key" class="min-w-0 rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft">
              <div class="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <label :for="field.type === 'image' ? null : fieldId(field.key)" :title="field.key" :class="lbl" class="break-words">{{ field.label }}</label>
                <span v-if="isCustomised(field.key)" :class="pill">Customised</span>
                <span v-if="isChanged(field.key)" class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-forest-700">Unsaved</span>
              </div>

              <!-- Image -->
              <div v-if="field.type === 'image'" class="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div class="w-full shrink-0 overflow-hidden rounded-xl border border-ink/[0.07] bg-sand-50" :class="isWide(field.key) ? 'aspect-[16/9] sm:w-72' : 'aspect-square sm:w-44'">
                  <img v-if="draft[field.key] || field.default" :src="draft[field.key] || field.default" alt="" class="h-full w-full object-contain" />
                  <div v-else class="flex h-full w-full items-center justify-center text-forest-900/30"><Icon name="lucide:image" class="h-8 w-8" /></div>
                </div>
                <div class="min-w-0 flex-1">
                  <p v-if="field.hint" class="text-xs text-forest-900/50">{{ field.hint }}</p>
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <label class="btn-outline cursor-pointer !px-4 !py-2 text-xs" :class="uploadingKey === field.key && 'pointer-events-none opacity-50'">
                      <Icon v-if="uploadingKey === field.key" name="lucide:loader-circle" class="h-3.5 w-3.5 animate-spin" />
                      <Icon v-else name="lucide:upload" class="h-3.5 w-3.5" />
                      {{ uploadingKey === field.key ? 'Uploading…' : 'Upload image' }}
                      <input type="file" accept="image/*" class="hidden" :disabled="!!uploadingKey" @change="onFile($event, field)" />
                    </label>
                    <button v-if="draft[field.key]" type="button" class="btn-ghost !px-4 !py-2 text-xs" @click="draft[field.key] = ''">Use original</button>
                  </div>
                  <p v-if="draft[field.key]" class="mt-2 break-all text-[0.7rem] text-forest-900/40">{{ draft[field.key] }}</p>
                  <p v-if="uploadError[field.key]" class="mt-2 text-sm text-red-600">{{ uploadError[field.key] }}</p>
                </div>
              </div>

              <!-- Text, textarea, number -->
              <template v-else>
                <textarea v-if="field.type === 'textarea'" :id="fieldId(field.key)" v-model="draft[field.key]" rows="3" :class="[inputCls, 'resize-y']" :placeholder="field.default" />
                <input v-else-if="field.type === 'number'" :id="fieldId(field.key)" v-model="draft[field.key]" type="text" inputmode="decimal" :class="inputCls" :placeholder="field.default" />
                <input v-else :id="fieldId(field.key)" v-model="draft[field.key]" type="text" :class="inputCls" :placeholder="field.default" />
                <p v-if="field.hint" class="mt-2 text-xs text-forest-900/50">{{ field.hint }}</p>
                <div v-if="draft[field.key]" class="mt-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <p class="min-w-0 flex-1 break-words text-xs text-forest-900/45">Original: {{ field.default }}</p>
                  <button type="button" :class="minor" @click="draft[field.key] = ''">Use original</button>
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
