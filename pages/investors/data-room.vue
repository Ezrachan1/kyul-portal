<script setup>
import { site } from '~/data/site'

useSeoMeta({
  title: 'Investor Data Room',
  description: 'Secure document repository for verified Kyul Group investors.',
  robots: 'noindex, nofollow',
})

const { data: docs, error, refresh } = await useFetch('/api/data-room/documents', { default: () => [] })
const authed = computed(() => !error.value)

// ---- gate: access code -----------------------------------------------------
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
  activeCat.value = 'All'
}

// ---- gate: request access --------------------------------------------------
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

// ---- index: categories derived from the documents themselves ---------------
const grouped = computed(() => {
  const map = {}
  for (const d of docs.value || []) ((map[d.category || 'General'] ||= [])).push(d)
  return map
})
const catList = computed(() =>
  Object.keys(grouped.value).map((name, i) => ({ name, n: i + 1, count: grouped.value[name].length })),
)

const activeCat = ref('All')
// A category can vanish if the admin list changes between sessions.
watch(catList, (list) => {
  if (activeCat.value !== 'All' && !list.some((c) => c.name === activeCat.value)) activeCat.value = 'All'
})

const sections = computed(() =>
  catList.value
    .filter((c) => activeCat.value === 'All' || c.name === activeCat.value)
    .map((c) => ({ ...c, items: grouped.value[c.name] })),
)
const shownCount = computed(() => sections.value.reduce((n, s) => n + s.items.length, 0))
const liveLine = computed(() => {
  const noun = shownCount.value === 1 ? 'document' : 'documents'
  return `${shownCount.value} ${noun} shown · ${activeCat.value === 'All' ? 'all categories' : activeCat.value}`
})

const docIcon = (type) => (type === 'XLSX' ? 'lucide:sheet' : 'lucide:file-text')
const pad2 = (n) => String(n).padStart(2, '0')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmtDate(d) {
  const m = String(d || '').match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/)
  if (!m) return d
  const mon = MONTHS[Number(m[2]) - 1] || ''
  return m[3] ? `${Number(m[3])} ${mon} ${m[1]}` : `${mon} ${m[1]}`
}
</script>

<template>
  <div>
    <!-- ================= LOCKED — the gate ================= -->
    <section v-if="!authed" class="relative overflow-hidden bg-forest-950 py-20 text-paper md:py-28">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(45,93,75,0.35),transparent_65%),radial-gradient(40%_35%_at_90%_100%,rgba(189,144,56,0.08),transparent_70%)]" />
      <TopoContours tone="paper" :opacity="0.06" />
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />

      <div class="shell relative">
        <div class="mx-auto max-w-lg">
          <div v-reveal class="text-center">
            <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/40 bg-white/5 text-gold-300">
              <Icon name="lucide:lock" class="h-7 w-7" aria-hidden="true" />
            </span>
            <p class="eyebrow mt-8 justify-center !text-gold-300">Investor data room</p>
            <h1 class="h-display mt-4 text-balance text-3xl text-paper sm:text-4xl">
              Secure access to Kyul's institutional information.
            </h1>
            <p class="mt-4 text-pretty leading-relaxed text-paper/70">
              Audited statements, governance records and compliance certificates,
              released to verified investors only.
            </p>
          </div>

          <!-- code entry -->
          <form v-reveal="120" class="mt-10" novalidate @submit.prevent="enter">
            <label for="dr-code" class="mb-2 block text-center text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/70">Access code</label>
            <input
              id="dr-code"
              v-model="code"
              type="text"
              placeholder="KYUL-IR-XXXX"
              autocomplete="off"
              spellcheck="false"
              :aria-invalid="gateError ? 'true' : undefined"
              :aria-describedby="gateError ? 'dr-code-error' : undefined"
              class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-4 text-center text-lg font-medium tracking-[0.08em] text-paper outline-none transition placeholder:text-paper/35 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30"
            />
            <p v-if="gateError" id="dr-code-error" class="mt-3 flex items-center justify-center gap-1.5 text-sm text-red-300">
              <Icon name="lucide:circle-alert" class="h-4 w-4 shrink-0" aria-hidden="true" /> {{ gateError }}
            </p>
            <button type="submit" :disabled="checking" class="btn-gold mt-4 w-full">
              <Icon v-if="checking" name="lucide:loader-circle" class="h-4 w-4 animate-spin" aria-hidden="true" />
              {{ checking ? 'Verifying…' : 'Enter' }}
            </button>
          </form>

          <!-- quiet divider -->
          <div v-reveal="180" class="mt-14 flex items-center gap-4">
            <span class="h-px flex-1 bg-paper/10" aria-hidden="true" />
            <h2 class="font-sans text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/70">No access code?</h2>
            <span class="h-px flex-1 bg-paper/10" aria-hidden="true" />
          </div>

          <!-- request access -->
          <div v-reveal="220" class="mt-8">
            <div v-if="reqSent" class="rounded-2xl border border-gold-400/30 bg-white/5 p-8 text-center">
              <Icon name="lucide:check-circle-2" class="mx-auto h-9 w-9 text-gold-300" aria-hidden="true" />
              <p class="mt-3 font-display text-lg text-paper">Request received</p>
              <p class="mt-1.5 text-sm leading-relaxed text-paper/70">Our investor relations team will be in touch to verify your access.</p>
            </div>

            <form v-else novalidate @submit.prevent="requestAccess">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="min-w-0">
                  <label for="dr-name" class="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/60">Full name</label>
                  <input id="dr-name" v-model="req.name" type="text" autocomplete="name" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper outline-none transition placeholder:text-paper/35 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
                </div>
                <div class="min-w-0">
                  <label for="dr-email" class="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/60">Email</label>
                  <input id="dr-email" v-model="req.email" type="email" autocomplete="email" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper outline-none transition placeholder:text-paper/35 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
                </div>
              </div>
              <div class="mt-4">
                <label for="dr-org" class="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/60">Organisation <span class="font-normal normal-case tracking-normal text-paper/60">(optional)</span></label>
                <input id="dr-org" v-model="req.org" type="text" autocomplete="organization" class="w-full rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper outline-none transition placeholder:text-paper/35 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
              </div>
              <div class="mt-4">
                <label for="dr-message" class="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-widest2 text-paper/60">Your interest <span class="font-normal normal-case tracking-normal text-paper/60">(optional)</span></label>
                <textarea id="dr-message" v-model="req.message" rows="3" class="w-full resize-y rounded-xl border border-paper/15 bg-white/5 px-4 py-3 text-paper outline-none transition placeholder:text-paper/35 focus:border-gold-400/60 focus:ring-2 focus:ring-gold-400/30" />
              </div>
              <p v-if="reqError" class="mt-3 flex items-center gap-1.5 text-sm text-red-300">
                <Icon name="lucide:circle-alert" class="h-4 w-4 shrink-0" aria-hidden="true" /> {{ reqError }}
              </p>
              <button type="submit" class="btn-on-dark mt-5 w-full">Request access<Icon name="lucide:arrow-right" class="h-4 w-4" aria-hidden="true" /></button>
            </form>
          </div>

          <div class="mt-12 text-center">
            <NuxtLink to="/investors" class="inline-flex min-h-10 items-center gap-1.5 py-2 text-sm text-paper/70 transition hover:text-paper">
              <Icon name="lucide:arrow-left" class="h-4 w-4" aria-hidden="true" /> Back to investor relations
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= UNLOCKED — the index ================= -->
    <div v-else>
      <!-- signed-in band -->
      <section class="border-b border-ink/[0.07] bg-white">
        <div class="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 items-center gap-4">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/50 bg-gold-50 text-gold-600">
              <Icon name="lucide:folder-lock" class="h-5 w-5" aria-hidden="true" />
            </span>
            <div class="min-w-0">
              <h1 class="truncate font-display text-xl text-forest-950">Investor Data Room</h1>
              <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-forest-900/70">
                <span class="inline-flex items-center gap-1.5 font-medium text-forest-700">
                  <span class="h-1.5 w-1.5 rounded-full bg-forest-500" aria-hidden="true" />Access verified
                </span>
                <span aria-hidden="true">·</span>
                <span>Confidential · {{ site.legalName }}</span>
              </p>
            </div>
          </div>
          <button class="btn-outline shrink-0 !py-2.5" @click="signOut"><Icon name="lucide:log-out" class="h-4 w-4" aria-hidden="true" /> Sign out</button>
        </div>
      </section>

      <section class="shell py-12 md:py-16">
        <p class="sr-only" role="status" aria-live="polite">{{ liveLine }}</p>

        <div v-if="!catList.length" class="rounded-2xl border border-dashed border-ink/15 px-6 py-20 text-center">
          <p class="text-forest-900/70">No documents have been released yet. Please check back shortly.</p>
        </div>

        <div v-else class="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <!-- category rail (lg+) -->
          <nav aria-label="Document categories" class="hidden min-w-0 lg:col-span-3 lg:block">
            <div class="sticky top-24">
              <p class="text-[0.68rem] font-semibold uppercase tracking-widest2 text-forest-900/70">Index</p>
              <ul class="mt-4 border-l border-ink/[0.09]">
                <li>
                  <button
                    class="-ml-px flex w-full min-h-10 items-center justify-between gap-3 border-l py-2 pl-4 pr-2 text-left text-sm transition-colors duration-300"
                    :class="activeCat === 'All' ? 'border-gold-500 font-semibold text-forest-950' : 'border-transparent text-forest-900/70 hover:text-forest-950'"
                    :aria-pressed="activeCat === 'All'"
                    @click="activeCat = 'All'"
                  >
                    <span class="truncate">All documents</span>
                    <span class="stat-display text-xs" :class="activeCat === 'All' ? 'text-gold-600' : 'text-forest-900/70'">{{ (docs || []).length }}</span>
                  </button>
                </li>
                <li v-for="c in catList" :key="c.name">
                  <button
                    class="-ml-px flex w-full min-h-10 items-center justify-between gap-3 border-l py-2 pl-4 pr-2 text-left text-sm transition-colors duration-300"
                    :class="activeCat === c.name ? 'border-gold-500 font-semibold text-forest-950' : 'border-transparent text-forest-900/70 hover:text-forest-950'"
                    :aria-pressed="activeCat === c.name"
                    @click="activeCat = c.name"
                  >
                    <span class="truncate">{{ c.name }}</span>
                    <span class="stat-display text-xs" :class="activeCat === c.name ? 'text-gold-600' : 'text-forest-900/70'">{{ c.count }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <!-- category chips (mobile) + document sections -->
          <div class="min-w-0 lg:col-span-9">
            <div
              class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden"
              role="group"
              aria-label="Filter by category"
            >
              <button
                class="chip min-h-10 shrink-0"
                :class="{ 'chip-active': activeCat === 'All' }"
                :aria-pressed="activeCat === 'All'"
                @click="activeCat = 'All'"
              >All</button>
              <button
                v-for="c in catList"
                :key="c.name"
                class="chip min-h-10 shrink-0"
                :class="{ 'chip-active': activeCat === c.name }"
                :aria-pressed="activeCat === c.name"
                @click="activeCat = c.name"
              >{{ c.name }} <span class="stat-display text-xs opacity-70">{{ c.count }}</span></button>
            </div>

            <div class="mt-8 space-y-14 lg:mt-0">
              <section v-for="s in sections" :key="s.name">
                <div class="flex items-baseline gap-3">
                  <span class="stat-display text-sm text-gold-600" aria-hidden="true">{{ pad2(s.n) }}</span>
                  <h2 class="font-display text-xl text-forest-950">{{ s.name }}</h2>
                  <span class="text-xs text-forest-900/70">{{ s.count }} {{ s.count === 1 ? 'document' : 'documents' }}</span>
                </div>
                <div class="kyul-line mt-4" />

                <ul class="divide-y divide-ink/[0.08]">
                  <li v-for="d in s.items" :key="d.id" class="flex items-center gap-4 py-4 transition-colors duration-300 hover:bg-sand-50/70">
                    <span class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-forest-700 sm:flex">
                      <Icon :name="docIcon(d.type)" class="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate font-medium text-forest-950">{{ d.title }}</p>
                      <p class="mt-0.5 text-xs text-forest-900/70">{{ d.type }} · {{ d.size }}<template v-if="d.date"> · {{ fmtDate(d.date) }}</template></p>
                    </div>
                    <a
                      v-if="d.fileUrl"
                      :href="d.fileUrl"
                      target="_blank"
                      rel="noopener"
                      :aria-label="`Download ${d.title}`"
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 text-forest-800 transition-colors duration-300 hover:border-forest-900 hover:bg-forest-950 hover:text-paper"
                    >
                      <Icon name="lucide:download" class="h-4 w-4" aria-hidden="true" />
                    </a>
                    <span v-else class="pill shrink-0 !text-forest-900/70">On request</span>
                  </li>
                </ul>
              </section>
            </div>

            <p class="mt-16 flex items-center justify-center gap-2 border-t border-ink/[0.09] pt-6 text-xs text-forest-900/70">
              <Icon name="lucide:lock" class="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
              Confidential — do not redistribute. Every view and download is recorded.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
