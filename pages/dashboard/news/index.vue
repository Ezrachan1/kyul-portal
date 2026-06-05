<script setup>
import { subsidiaryBySlug } from '~/data/subsidiaries'

definePageMeta({ layout: 'dashboard', title: 'News & Insights' })
useHead({ title: 'News · Group Portal' })

const rows = ref([])
const loading = ref(true)
async function load() {
  loading.value = true
  try {
    rows.value = await $fetch('/api/news')
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function togglePublish(a) {
  const updated = await $fetch(`/api/news/${a.id}`, { method: 'PATCH', body: { published: a.published === false } })
  const i = rows.value.findIndex((r) => r.id === a.id)
  if (i >= 0) rows.value[i] = updated
}
const confirmId = ref(null)
async function remove(id) {
  await $fetch(`/api/news/${id}`, { method: 'DELETE' })
  rows.value = rows.value.filter((r) => r.id !== id)
  confirmId.value = null
}
const entityName = (e) => (e ? subsidiaryBySlug(e)?.short || 'Group' : 'Group')
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">News & Insights</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Publish project updates, press releases and insights to the public website.</p>
      </div>
      <NuxtLink to="/dashboard/news/new" class="btn-primary shrink-0 self-start sm:self-auto"><Icon name="lucide:plus" class="h-4 w-4" /> New article</NuxtLink>
    </div>

    <div class="mt-6 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
      <div v-if="loading" class="flex justify-center py-16 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>
      <ul v-else class="divide-y divide-ink/[0.05]">
        <li v-for="a in rows" :key="a.id" class="flex items-center gap-4 px-5 py-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-semibold text-forest-950">{{ a.title }}</p>
              <span v-if="a.featured" class="hidden rounded bg-gold-100 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-gold-700 sm:inline-block">Featured</span>
            </div>
            <p class="truncate text-xs text-forest-900/50">{{ a.category }} · {{ entityName(a.entity) }} · {{ formatDate(a.date, { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
          </div>
          <button class="rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold transition" :class="a.published === false ? 'border-ink/10 bg-sand-100 text-forest-900/45' : 'border-forest-200 bg-forest-50 text-forest-700'" @click="togglePublish(a)">
            {{ a.published === false ? 'Draft' : 'Published' }}
          </button>
          <NuxtLink :to="`/dashboard/news/${a.id}`" class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-sand-100 hover:text-forest-800" title="Edit"><Icon name="lucide:pencil" class="h-4 w-4" /></NuxtLink>
          <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-900/45 transition hover:bg-red-50 hover:text-red-500" title="Delete" @click="confirmId = a.id"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
        </li>
      </ul>
    </div>

    <UiModal :open="!!confirmId" title="Delete article?" subtitle="This removes it from the public site." @close="confirmId = null">
      <div class="flex justify-end gap-2">
        <button class="btn-outline" @click="confirmId = null">Cancel</button>
        <button class="btn bg-red-600 text-white hover:bg-red-700" @click="remove(confirmId)">Delete</button>
      </div>
    </UiModal>
  </div>
</template>
