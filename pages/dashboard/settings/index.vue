<script setup>
import { subsidiaries } from '~/data/subsidiaries'

definePageMeta({ layout: 'dashboard', title: 'Site Settings' })
useHead({ title: 'Site Settings · Group Portal' })

const form = reactive({ hq: {}, contact: {}, social: [], subsidiaryContacts: {} })
const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')

const SOCIAL_ICONS = [
  { value: 'lucide:linkedin', label: 'LinkedIn' },
  { value: 'lucide:twitter', label: 'X / Twitter' },
  { value: 'lucide:facebook', label: 'Facebook' },
  { value: 'lucide:instagram', label: 'Instagram' },
  { value: 'lucide:youtube', label: 'YouTube' },
  { value: 'lucide:globe', label: 'Website' },
]

onMounted(async () => {
  try {
    const s = await $fetch('/api/settings')
    form.hq = { ...s.hq }
    form.contact = { ...s.contact }
    form.social = (s.social || []).map((x) => ({ ...x }))
    form.subsidiaryContacts = {}
    for (const sub of subsidiaries) form.subsidiaryContacts[sub.slug] = { ...(s.subsidiaryContacts?.[sub.slug] || { email: '', web: '' }) }
  } catch {
    error.value = 'Could not load settings.'
  }
  loading.value = false
})

function addSocial() {
  form.social.push({ label: '', icon: 'lucide:linkedin', href: '' })
}
function removeSocial(i) {
  form.social.splice(i, 1)
}

async function save() {
  error.value = ''
  saved.value = false
  saving.value = true
  // derive tel hrefs from numbers
  const contact = { ...form.contact }
  if (contact.phone) contact.phoneHref = String(contact.phone).replace(/[^\d+]/g, '')
  if (contact.mobile) contact.mobileHref = String(contact.mobile).replace(/[^\d+]/g, '')
  try {
    await $fetch('/api/settings', {
      method: 'PATCH',
      body: { hq: form.hq, contact, social: form.social, subsidiaryContacts: form.subsidiaryContacts },
    })
    saved.value = true
    setTimeout(() => (saved.value = false), 2500)
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not save settings.'
  } finally {
    saving.value = false
  }
}

const inputCls = 'w-full rounded-xl border border-ink/[0.12] bg-sand-50/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-600'
const lbl = 'mb-1.5 block text-sm font-medium text-forest-900'
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="h-display text-2xl text-forest-950 sm:text-3xl">Site Settings</h1>
        <p class="mt-1.5 text-sm text-forest-900/60">Contacts, addresses and social links shown across the public website.</p>
      </div>
      <button class="btn-primary shrink-0 self-start sm:self-auto" :disabled="saving" @click="save">
        <Icon :name="saving ? 'lucide:loader-circle' : saved ? 'lucide:check' : 'lucide:save'" class="h-4 w-4" :class="saving && 'animate-spin'" />
        {{ saving ? 'Saving…' : saved ? 'Saved' : 'Save changes' }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20 text-forest-900/40"><Icon name="lucide:loader-circle" class="h-6 w-6 animate-spin" /></div>

    <div v-else class="mt-7 grid gap-6 lg:grid-cols-2">
      <!-- HQ -->
      <section class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
        <h2 class="flex items-center gap-2 font-display text-lg text-forest-950"><Icon name="lucide:map-pin" class="h-5 w-5 text-forest-700" /> Headquarters</h2>
        <div class="mt-5 space-y-4">
          <div><label :class="lbl">Address line 1</label><input v-model="form.hq.line1" :class="inputCls" /></div>
          <div><label :class="lbl">Address line 2</label><input v-model="form.hq.line2" :class="inputCls" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label :class="lbl">Region</label><input v-model="form.hq.region" :class="inputCls" /></div>
            <div><label :class="lbl">Country</label><input v-model="form.hq.country" :class="inputCls" /></div>
          </div>
          <div><label :class="lbl">Postal</label><input v-model="form.hq.postal" :class="inputCls" /></div>
        </div>
      </section>

      <!-- Contacts -->
      <section class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft">
        <h2 class="flex items-center gap-2 font-display text-lg text-forest-950"><Icon name="lucide:mail" class="h-5 w-5 text-forest-700" /> Contact channels</h2>
        <div class="mt-5 space-y-4">
          <div><label :class="lbl">General enquiries email</label><input v-model="form.contact.email" type="email" :class="inputCls" /></div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label :class="lbl">Investor relations email</label><input v-model="form.contact.investorEmail" type="email" :class="inputCls" /></div>
            <div><label :class="lbl">Careers / CV email</label><input v-model="form.contact.careersEmail" type="email" :class="inputCls" /></div>
            <div><label :class="lbl">Media / press email</label><input v-model="form.contact.pressEmail" type="email" :class="inputCls" /></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label :class="lbl">Phone</label><input v-model="form.contact.phone" :class="inputCls" /></div>
            <div><label :class="lbl">Mobile</label><input v-model="form.contact.mobile" :class="inputCls" /></div>
          </div>
        </div>
      </section>

      <!-- Socials -->
      <section class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft lg:col-span-2">
        <div class="flex items-center justify-between">
          <h2 class="flex items-center gap-2 font-display text-lg text-forest-950"><Icon name="lucide:share-2" class="h-5 w-5 text-forest-700" /> Social links</h2>
          <button class="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-2 text-sm font-semibold text-forest-800 transition hover:bg-forest-100" @click="addSocial"><Icon name="lucide:plus" class="h-4 w-4" /> Add link</button>
        </div>
        <div class="mt-5 space-y-3">
          <div v-for="(s, i) in form.social" :key="i" class="grid grid-cols-12 gap-2 sm:gap-3">
            <select v-model="s.icon" :class="[inputCls, 'col-span-5 sm:col-span-3']"><option v-for="o in SOCIAL_ICONS" :key="o.value" :value="o.value">{{ o.label }}</option></select>
            <input v-model="s.label" :class="[inputCls, 'col-span-7 sm:col-span-3']" placeholder="Label" />
            <input v-model="s.href" :class="[inputCls, 'col-span-10 sm:col-span-5']" placeholder="https://…" />
            <button class="col-span-2 inline-flex items-center justify-center rounded-xl border border-ink/10 text-forest-900/40 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:col-span-1" @click="removeSocial(i)"><Icon name="lucide:trash-2" class="h-4 w-4" /></button>
          </div>
          <p v-if="!form.social.length" class="text-sm text-forest-900/45">No social links yet.</p>
        </div>
      </section>

      <!-- Company contacts -->
      <section class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft lg:col-span-2">
        <h2 class="flex items-center gap-2 font-display text-lg text-forest-950"><Icon name="lucide:building-2" class="h-5 w-5 text-forest-700" /> Company contacts</h2>
        <p class="mt-1 text-sm text-forest-900/55">Shown on each sub-portal and in the contact directory.</p>
        <div class="mt-5 space-y-3">
          <div v-for="sub in subsidiaries" :key="sub.slug" class="grid grid-cols-1 items-center gap-2 rounded-xl border border-ink/[0.06] bg-sand-50/40 p-3 sm:grid-cols-12 sm:gap-3">
            <span class="flex items-center gap-2 text-sm font-medium text-forest-900 sm:col-span-3"><span class="h-2 w-2 rounded-full" :style="{ background: sub.accent }" />{{ sub.short }}</span>
            <input v-model="form.subsidiaryContacts[sub.slug].email" :class="[inputCls, 'sm:col-span-5']" placeholder="email@kyulgroup.com" />
            <input v-model="form.subsidiaryContacts[sub.slug].web" :class="[inputCls, 'sm:col-span-4']" placeholder="website / page" />
          </div>
        </div>
      </section>
    </div>

    <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
