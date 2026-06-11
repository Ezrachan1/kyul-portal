<script setup>
import { jobs, jobBySlug } from '~/data/careers'
import { subsidiaryBySlug } from '~/data/subsidiaries'

const route = useRoute()
const job = computed(() => jobBySlug(route.params.slug))
if (!job.value) throw createError({ statusCode: 404, statusMessage: 'Role not found', fatal: true })

const entity = computed(() => (job.value.entity === 'group' ? null : subsidiaryBySlug(job.value.entity)))
const entityName = computed(() => (entity.value ? entity.value.name : 'Kyul Group'))
const accent = computed(() => (entity.value ? entity.value.accent : '#bd9038'))
const other = computed(() => jobs.filter((j) => j.slug !== job.value.slug).slice(0, 3))

useSeoMeta({
  title: () => job.value.title,
  description: () => job.value.summary,
})

const app = reactive({ name: '', email: '', phone: '', link: '', note: '' })
const sent = ref(false)
const sending = ref(false)
const errors = reactive({})
async function apply() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!app.name.trim()) errors.name = 'Required'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(app.email)) errors.email = 'Valid email required'
  if (Object.keys(errors).length) return
  sending.value = true
  try {
    await $fetch('/api/submissions', {
      method: 'POST',
      body: {
        type: 'application',
        name: app.name,
        email: app.email,
        subject: `Application for ${job.value.title}`,
        message: app.note || '',
        source: `Careers: ${job.value.title}`,
        entity: job.value.entity === 'group' ? null : job.value.entity,
        meta: { phone: app.phone, link: app.link, role: job.value.title },
      },
    })
    sent.value = true
  } catch (e) {
    errors.submit = e?.data?.statusMessage || 'Something went wrong. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div v-if="job" :style="{ '--accent': accent }">
    <header class="border-b border-ink/[0.06] bg-sand-50/60">
      <div class="shell py-12 md:py-16">
        <nav class="mb-6 flex items-center gap-2 text-xs text-forest-900/45">
          <NuxtLink to="/careers" class="transition hover:text-forest-900">Careers</NuxtLink>
          <Icon name="lucide:chevron-right" class="h-3 w-3" />
          <span class="text-forest-900/70">{{ job.title }}</span>
        </nav>
        <NuxtLink v-if="entity" :to="`/subsidiaries/${entity.slug}`" class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest2" :style="{ color: entity.accentInk }">
          <span class="h-1.5 w-1.5 rounded-full" :style="{ background: accent }" />{{ entityName }}
        </NuxtLink>
        <p v-else class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest2 text-gold-700"><span class="h-1.5 w-1.5 rounded-full bg-gold-500" /> Kyul Group</p>
        <h1 class="h-display mt-3 text-3xl text-forest-950 sm:text-4xl">{{ job.title }}</h1>
        <div class="mt-5 flex flex-wrap gap-2">
          <span class="pill"><Icon name="lucide:map-pin" class="h-3.5 w-3.5" /> {{ job.location }}</span>
          <span class="pill"><Icon name="lucide:clock" class="h-3.5 w-3.5" /> {{ job.type }}</span>
          <span class="pill"><Icon name="lucide:bar-chart-3" class="h-3.5 w-3.5" /> {{ job.level }}</span>
          <span class="pill"><Icon name="lucide:building-2" class="h-3.5 w-3.5" /> {{ job.department }}</span>
        </div>
      </div>
    </header>

    <div class="shell grid gap-12 py-14 md:py-18 lg:grid-cols-12 lg:gap-16">
      <!-- content -->
      <div class="lg:col-span-7">
        <p class="text-lg leading-relaxed text-forest-900/75">{{ job.summary }}</p>

        <div class="mt-10">
          <h2 class="font-display text-xl text-forest-950">What you’ll do</h2>
          <ul class="mt-4 space-y-3">
            <li v-for="(r, i) in job.responsibilities" :key="i" class="flex gap-3 text-forest-900/75">
              <Icon name="lucide:check" class="mt-1 h-4 w-4 shrink-0" :style="{ color: accent }" /><span>{{ r }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-10">
          <h2 class="font-display text-xl text-forest-950">What you’ll bring</h2>
          <ul class="mt-4 space-y-3">
            <li v-for="(r, i) in job.requirements" :key="i" class="flex gap-3 text-forest-900/75">
              <Icon name="lucide:dot" class="mt-1 h-4 w-4 shrink-0" :style="{ color: accent }" /><span>{{ r }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-10 rounded-2xl border border-ink/[0.07] bg-sand-50/60 p-6 text-sm text-forest-900/65">
          Kyul Group is an equal-opportunity employer. We welcome applications from all qualified candidates and are
          committed to a diverse, inclusive workplace.
        </div>
      </div>

      <!-- apply -->
      <div class="lg:col-span-5">
        <div class="lg:sticky lg:top-24">
          <div class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-card sm:p-8">
            <h2 class="font-display text-xl text-forest-950">Apply for this role</h2>
            <Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="opacity-0">
              <div v-if="sent" key="ok" class="mt-6 text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" :style="{ background: `${accent}1a`, color: accent }"><Icon name="lucide:check" class="h-6 w-6" /></span>
                <p class="mt-4 font-display text-lg text-forest-950">Application received</p>
                <p class="mt-1.5 text-sm text-forest-900/65">Thank you, {{ app.name.split(' ')[0] }}. Our talent team will be in touch if there’s a fit.</p>
              </div>
              <form v-else key="form" class="mt-5 space-y-4" novalidate @submit.prevent="apply">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">Full name</label>
                  <input v-model="app.name" type="text" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2" :style="{ '--tw-ring-color': accent }" />
                  <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">Email</label>
                  <input v-model="app.email" type="email" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2" :style="{ '--tw-ring-color': accent }" />
                  <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">Phone</label>
                  <input v-model="app.phone" type="tel" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2" :style="{ '--tw-ring-color': accent }" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">CV / portfolio link</label>
                  <input v-model="app.link" type="url" placeholder="https://" class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2" :style="{ '--tw-ring-color': accent }" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-forest-900">Cover note</label>
                  <textarea v-model="app.note" rows="3" class="w-full resize-y rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-2.5 text-sm outline-none transition focus:ring-2" :style="{ '--tw-ring-color': accent }" />
                </div>
                <p v-if="errors.submit" class="flex items-center gap-1.5 text-sm text-red-600"><Icon name="lucide:circle-alert" class="h-4 w-4" /> {{ errors.submit }}</p>
                <button type="submit" :disabled="sending" class="btn w-full text-white transition hover:brightness-95" :style="{ background: accent }">
                  <Icon v-if="sending" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />{{ sending ? 'Submitting…' : 'Submit application' }}
                </button>
              </form>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <section class="border-t border-ink/[0.06] bg-sand-50/70 py-16">
      <div class="shell">
        <h2 class="h-display text-2xl text-forest-950">Other open roles</h2>
        <div class="mt-8 grid gap-4">
          <JobCard v-for="(j, i) in other" :key="j.slug" :job="j" :index="i" />
        </div>
      </div>
    </section>
  </div>
</template>
