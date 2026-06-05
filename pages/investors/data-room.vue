<script setup>
import { site } from '~/data/site'

useSeoMeta({
  title: 'Investor Data Room',
  description: 'Secure document repository for verified Kyul Group investors.',
  robots: 'noindex, nofollow',
})

const { data: docs, error, refresh } = await useFetch('/api/data-room/documents', { default: () => [] })
const authed = computed(() => !error.value)

const code = ref('')
const gateError = ref('')
const checking = ref(false)

async function enter() {
  gateError.value = ''
  checking.value = true
  try {
    await $fetch('/api/data-room/verify', { method: 'POST', body: { code: code.value } })
    await refresh()
    if (error.value) gateError.value = 'That access code was not recognised.'
  } catch (e) {
    gateError.value = e?.data?.statusMessage || 'That access code was not recognised. Please check and try again.'
  } finally {
    checking.value = false
  }
}
async function signOut() {
  await $fetch('/api/data-room/logout', { method: 'POST' })
  await refresh()
  code.value = ''
}

// request access
const showRequest = ref(false)
const req = reactive({ name: '', email: '', org: '', message: '' })
const reqSent = ref(false)
const reqError = ref('')
async function requestAccess() {
  reqError.value = ''
  if (!req.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(req.email)) {
    reqError.value = 'Please enter your name and a valid email.'
    return
  }
  try {
    await $fetch('/api/data-room/requests', { method: 'POST', body: { ...req } })
    reqSent.value = true
  } catch (e) {
    reqError.value = e?.data?.statusMessage || 'Something went wrong. Please try again.'
  }
}

const grouped = computed(() => {
  const map = {}
  for (const d of docs.value || []) (map[d.category] ||= []).push(d)
  return map
})
const docIcon = (type) => (type === 'XLSX' ? 'lucide:sheet' : 'lucide:file-text')
</script>

<template>
  <div>
    <!-- GATE -->
    <section v-if="!authed" class="relative flex min-h-[80vh] items-center overflow-hidden bg-forest-950 text-paper">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-forest-800/30 blur-3xl" />
      <div class="shell relative">
        <div class="mx-auto max-w-md text-center">
          <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/30 bg-white/5 text-gold-300"><Icon name="lucide:shield-check" class="h-8 w-8" /></span>
          <p class="eyebrow mt-7 justify-center !text-gold-300">Secure data room</p>
          <h1 class="h-display mt-4 text-3xl text-paper sm:text-4xl">Verified investor access</h1>
          <p class="mt-4 text-paper/65">This repository holds confidential financial and governance documents. Enter your access code to continue.</p>

          <form v-if="!showRequest" class="mt-8 text-left" @submit.prevent="enter">
            <label class="mb-1.5 block text-sm font-medium text-paper/80">Access code</label>
            <input v-model="code" type="text" placeholder="KYUL-IR-XXXX" autocomplete="off" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3.5 text-paper placeholder:text-paper/30 outline-none transition focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
            <p v-if="gateError" class="mt-2 flex items-center gap-1.5 text-sm text-red-300"><Icon name="lucide:circle-alert" class="h-4 w-4" /> {{ gateError }}</p>
            <button type="submit" :disabled="checking" class="btn-gold mt-4 w-full">
              <Icon v-if="checking" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />{{ checking ? 'Verifying…' : 'Enter data room' }}
            </button>
            <button type="button" class="mt-4 w-full text-sm text-paper/55 transition hover:text-paper" @click="showRequest = true">Don’t have a code? Request access</button>
          </form>

          <!-- request access -->
          <div v-else class="mt-8 text-left">
            <div v-if="reqSent" class="rounded-2xl border border-gold-400/30 bg-white/5 p-6 text-center">
              <Icon name="lucide:check-circle-2" class="mx-auto h-9 w-9 text-gold-300" />
              <p class="mt-3 font-display text-lg text-paper">Request received</p>
              <p class="mt-1 text-sm text-paper/65">Our investor relations team will be in touch to verify your access.</p>
            </div>
            <form v-else class="space-y-3" @submit.prevent="requestAccess">
              <input v-model="req.name" type="text" placeholder="Full name" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/30 outline-none focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
              <input v-model="req.email" type="email" placeholder="Email" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/30 outline-none focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
              <input v-model="req.org" type="text" placeholder="Organisation (optional)" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/30 outline-none focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
              <textarea v-model="req.message" rows="2" placeholder="Tell us about your interest" class="w-full resize-y rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper placeholder:text-paper/30 outline-none focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
              <p v-if="reqError" class="text-sm text-red-300">{{ reqError }}</p>
              <button type="submit" class="btn-gold w-full">Request access</button>
              <button type="button" class="w-full text-sm text-paper/55 transition hover:text-paper" @click="showRequest = false">Back to code entry</button>
            </form>
          </div>

          <NuxtLink to="/investors" class="mt-6 inline-flex items-center gap-1.5 text-sm text-paper/55 transition hover:text-paper"><Icon name="lucide:arrow-left" class="h-4 w-4" /> Back to investor relations</NuxtLink>
        </div>
      </div>
    </section>

    <!-- VAULT -->
    <div v-else>
      <section class="border-b border-ink/[0.07] bg-white">
        <div class="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon name="lucide:folder-lock" class="h-5 w-5" /></span>
            <div>
              <p class="font-display text-lg text-forest-950">Investor Data Room</p>
              <p class="text-xs text-forest-900/55">Confidential · Access logged · {{ site.legalName }}</p>
            </div>
          </div>
          <button class="btn-outline !py-2.5" @click="signOut"><Icon name="lucide:log-out" class="h-4 w-4" /> Sign out</button>
        </div>
      </section>

      <section class="shell py-12 md:py-16">
        <div class="mb-8 flex items-start gap-3 rounded-2xl border border-gold-300/40 bg-gold-50 p-4 text-sm text-forest-900/75">
          <Icon name="lucide:eye" class="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
          <p>Documents in this room are confidential. Every view and download is recorded. Please do not redistribute.</p>
        </div>

        <div v-for="(items, cat) in grouped" :key="cat" class="mb-10">
          <h2 class="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-widest2 text-forest-900/45"><span class="h-1.5 w-1.5 rounded-full bg-gold-400" /> {{ cat }}</h2>
          <ul class="mt-4 divide-y divide-ink/[0.07] overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft">
            <li v-for="d in items" :key="d.id" class="group flex items-center gap-4 px-5 py-4 transition hover:bg-sand-50/60">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon :name="docIcon(d.type)" class="h-5 w-5" /></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate font-medium text-forest-950">{{ d.title }}</span>
                <span class="block text-xs text-forest-900/50">{{ d.type }} · {{ d.size }}</span>
              </span>
              <a v-if="d.fileUrl" :href="d.fileUrl" target="_blank" class="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-4 py-2 text-xs font-semibold text-forest-800 transition group-hover:bg-forest-950 group-hover:text-paper"><Icon name="lucide:download" class="h-4 w-4" /> Download</a>
              <span v-else class="rounded-full bg-sand-100 px-3 py-1.5 text-xs text-forest-900/45">On request</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
