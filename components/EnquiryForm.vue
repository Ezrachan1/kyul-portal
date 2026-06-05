<script setup>
const props = defineProps({
  accent: { type: String, default: '#2d5d4b' },
  subjects: { type: Array, default: () => ['General enquiry', 'Partnership', 'Media', 'Investor relations'] },
  cta: { type: String, default: 'Send enquiry' },
  compact: { type: Boolean, default: false },
  type: { type: String, default: 'enquiry' }, // enquiry | rfp
  source: { type: String, default: '' },
  entity: { type: String, default: null },
})

const form = reactive({ name: '', email: '', org: '', subject: props.subjects[0], message: '' })
const submitted = ref(false)
const sending = ref(false)
const errors = reactive({})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Please enter a valid email.'
  if (form.message.trim().length < 10) errors.message = 'Please add a little more detail.'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return
  sending.value = true
  try {
    await $fetch('/api/submissions', {
      method: 'POST',
      body: {
        type: props.type,
        name: form.name,
        email: form.email,
        org: form.org,
        subject: form.subject,
        message: form.message,
        source: props.source,
        entity: props.entity,
      },
    })
    submitted.value = true
  } catch (e) {
    errors.submit = e?.data?.statusMessage || 'Something went wrong. Please try again in a moment.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <Transition
      mode="out-in"
      enter-active-class="transition duration-400 ease-out-expo" enter-from-class="opacity-0 translate-y-2"
    >
      <div
        v-if="submitted" key="done"
        class="flex flex-col items-center rounded-2xl border border-ink/[0.07] bg-white p-10 text-center shadow-soft"
      >
        <span class="flex h-14 w-14 items-center justify-center rounded-full" :style="{ background: `${accent}1a`, color: accent }">
          <Icon name="lucide:check" class="h-7 w-7" />
        </span>
        <h3 class="mt-5 font-display text-2xl text-forest-950">Thank you, {{ form.name.split(' ')[0] }}.</h3>
        <p class="mt-2 max-w-md text-forest-900/65">
          Your enquiry has been received. A member of our team will respond within two business days.
        </p>
        <button class="btn-ghost mt-6" @click="submitted = false">Send another</button>
      </div>

      <form v-else key="form" class="rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft sm:p-8" novalidate @submit.prevent="submit">
        <div class="grid gap-5" :class="!compact && 'sm:grid-cols-2'">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Full name</label>
            <input
              v-model="form.name" type="text" autocomplete="name"
              class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-transparent focus:ring-2"
              :style="{ '--tw-ring-color': accent }" placeholder="Your name"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-red-600">{{ errors.name }}</p>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Email</label>
            <input
              v-model="form.email" type="email" autocomplete="email"
              class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-transparent focus:ring-2"
              :style="{ '--tw-ring-color': accent }" placeholder="you@company.com"
            />
            <p v-if="errors.email" class="mt-1.5 text-xs text-red-600">{{ errors.email }}</p>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Organisation <span class="text-forest-900/40">(optional)</span></label>
            <input
              v-model="form.org" type="text" autocomplete="organization"
              class="w-full rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-transparent focus:ring-2"
              :style="{ '--tw-ring-color': accent }" placeholder="Company or institution"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Subject</label>
            <div class="relative">
              <select
                v-model="form.subject"
                class="w-full appearance-none rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-transparent focus:ring-2"
                :style="{ '--tw-ring-color': accent }"
              >
                <option v-for="s in subjects" :key="s">{{ s }}</option>
              </select>
              <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/40" />
            </div>
          </div>
        </div>
        <div class="mt-5">
          <label class="mb-1.5 block text-sm font-medium text-forest-900">Message</label>
          <textarea
            v-model="form.message" rows="4"
            class="w-full resize-y rounded-xl border border-ink/12 bg-sand-50/60 px-4 py-3 text-sm text-forest-950 outline-none transition focus:border-transparent focus:ring-2"
            :style="{ '--tw-ring-color': accent }" placeholder="How can we help?"
          />
          <p v-if="errors.message" class="mt-1.5 text-xs text-red-600">{{ errors.message }}</p>
        </div>
        <p v-if="errors.submit" class="mt-4 flex items-center gap-1.5 text-sm text-red-600"><Icon name="lucide:circle-alert" class="h-4 w-4" /> {{ errors.submit }}</p>
        <div class="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-forest-900/50">By submitting, you agree to our <NuxtLink to="/privacy" class="underline underline-offset-2">privacy policy</NuxtLink>.</p>
          <button
            type="submit" :disabled="sending"
            class="btn w-full text-paper shadow-soft transition hover:brightness-95 disabled:opacity-60 sm:w-auto"
            :style="{ background: accent }"
          >
            <Icon v-if="sending" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
            {{ sending ? 'Sending…' : cta }}
            <Icon v-if="!sending" name="lucide:send" class="h-4 w-4" />
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>
