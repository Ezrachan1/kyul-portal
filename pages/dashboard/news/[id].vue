<script setup>
import { subsidiaries } from '~/data/subsidiaries'

definePageMeta({ layout: 'dashboard', title: 'Edit article' })

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
useHead({ title: () => (isNew.value ? 'New article' : 'Edit article') + ' · Group Portal' })

const CATEGORIES = ['Group News', 'Press Release', 'Project Update', 'Insight']
const BLOCK_TYPES = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h2', label: 'Heading' },
  { value: 'q', label: 'Pull quote' },
]
const entityOptions = [{ value: '', label: 'Kyul Group (Group-wide)' }, ...subsidiaries.map((s) => ({ value: s.slug, label: s.name }))]

const form = reactive({
  title: '', category: 'Group News', date: new Date().toISOString().slice(0, 10),
  author: 'Kyul Group Communications', entity: '', readingTime: 3, featured: false, published: true,
  excerpt: '', body: [{ type: 'p', text: '' }],
})
const loading = ref(true)
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  if (!isNew.value) {
    try {
      const a = await $fetch(`/api/news/${route.params.id}`)
      Object.assign(form, {
        title: a.title, category: a.category, date: a.date, author: a.author,
        entity: a.entity || '', readingTime: a.readingTime, featured: !!a.featured,
        published: a.published !== false, excerpt: a.excerpt,
        body: Array.isArray(a.body) && a.body.length ? a.body : [{ type: 'p', text: '' }],
      })
    } catch {
      error.value = 'Could not load this article.'
    }
  }
  loading.value = false
})

function addBlock() {
  form.body.push({ type: 'p', text: '' })
}
function removeBlock(i) {
  form.body.splice(i, 1)
  if (!form.body.length) addBlock()
}
function move(i, d) {
  const j = i + d
  if (j < 0 || j >= form.body.length) return
  const [b] = form.body.splice(i, 1)
  form.body.splice(j, 0, b)
}

async function save() {
  error.value = ''
  if (!form.title.trim()) {
    error.value = 'Title is required.'
    return
  }
  saving.value = true
  const payload = {
    ...form,
    entity: form.entity || null,
    body: form.body.filter((b) => b.text.trim()),
  }
  try {
    if (isNew.value) await $fetch('/api/news', { method: 'POST', body: payload })
    else await $fetch(`/api/news/${route.params.id}`, { method: 'PATCH', body: payload })
    navigateTo('/dashboard/news')
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not save the article.'
    saving.value = false
  }
}

const inputCls = 'w-full rounded-xl border border-ink/12 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600'
</script>

<template>
  <div>
    <NuxtLink to="/dashboard/news" class="inline-flex items-center gap-1.5 text-sm text-forest-900/55 transition hover:text-forest-900"><Icon name="lucide:arrow-left" class="h-4 w-4" /> News & Insights</NuxtLink>
    <h1 class="h-display mt-3 text-2xl text-forest-950 sm:text-3xl">{{ isNew ? 'New article' : 'Edit article' }}</h1>

    <div v-if="loading" class="flex justify-center py-20 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>

    <form v-else class="mt-7 grid gap-6 lg:grid-cols-12" @submit.prevent="save">
      <div class="space-y-5 lg:col-span-8">
        <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Title</label>
          <input v-model="form.title" type="text" :class="inputCls" placeholder="Headline" />
          <label class="mb-1.5 mt-4 block text-sm font-medium text-forest-900">Excerpt</label>
          <textarea v-model="form.excerpt" rows="2" :class="[inputCls, 'resize-y']" placeholder="One or two sentences shown on cards and previews." />
        </div>

        <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg text-forest-950">Content</h2>
            <button type="button" class="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-100" @click="addBlock"><Icon name="lucide:plus" class="h-4 w-4" /> Add block</button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(b, i) in form.body" :key="i" class="rounded-xl border border-ink/[0.07] bg-sand-50/40 p-3">
              <div class="mb-2 flex items-center gap-2">
                <select v-model="b.type" class="rounded-lg border border-ink/12 bg-white px-2.5 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-forest-600">
                  <option v-for="t in BLOCK_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
                <div class="ml-auto flex items-center gap-1">
                  <button type="button" class="rounded p-1 text-forest-900/40 hover:bg-white hover:text-forest-800" @click="move(i, -1)"><Icon name="lucide:chevron-up" class="h-4 w-4" /></button>
                  <button type="button" class="rounded p-1 text-forest-900/40 hover:bg-white hover:text-forest-800" @click="move(i, 1)"><Icon name="lucide:chevron-down" class="h-4 w-4" /></button>
                  <button type="button" class="rounded p-1 text-forest-900/40 hover:bg-red-50 hover:text-red-500" @click="removeBlock(i)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
                </div>
              </div>
              <textarea v-model="b.text" rows="2" :class="[inputCls, 'resize-y bg-white', b.type === 'h2' && 'font-display', b.type === 'q' && 'italic']" :placeholder="b.type === 'h2' ? 'Section heading' : b.type === 'q' ? 'A pull quote' : 'Paragraph text'" />
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4">
        <div class="space-y-5 lg:sticky lg:top-24">
          <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
            <h2 class="font-display text-base text-forest-950">Settings</h2>
            <div class="mt-4 space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-forest-900">Category</label>
                <select v-model="form.category" :class="inputCls"><option v-for="c in CATEGORIES" :key="c">{{ c }}</option></select>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-forest-900">Company</label>
                <select v-model="form.entity" :class="inputCls"><option v-for="o in entityOptions" :key="o.value" :value="o.value">{{ o.label }}</option></select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">Date</label>
                  <input v-model="form.date" type="date" :class="inputCls" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">Read (min)</label>
                  <input v-model.number="form.readingTime" type="number" min="1" :class="inputCls" />
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-forest-900">Author</label>
                <input v-model="form.author" type="text" :class="inputCls" />
              </div>
              <label class="flex items-center gap-3 text-sm text-forest-900/80"><input v-model="form.featured" type="checkbox" class="h-4 w-4 rounded border-ink/30 text-forest-700 focus:ring-forest-600" /> Feature on homepage</label>
              <label class="flex items-center gap-3 text-sm text-forest-900/80"><input v-model="form.published" type="checkbox" class="h-4 w-4 rounded border-ink/30 text-forest-700 focus:ring-forest-600" /> Published (visible on site)</label>
            </div>
          </div>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <div class="flex gap-2">
            <button type="submit" :disabled="saving" class="btn-primary flex-1"><Icon :name="saving ? 'lucide:loader-circle' : 'lucide:check'" class="h-4 w-4" :class="saving && 'animate-spin'" /> {{ saving ? 'Saving…' : 'Save' }}</button>
            <NuxtLink to="/dashboard/news" class="btn-outline">Cancel</NuxtLink>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
