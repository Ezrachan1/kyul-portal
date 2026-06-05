<script setup>
definePageMeta({ layout: false })
useHead({ title: 'Sign in · Group Portal' })

const { login, isAuthed, ready, fetchMe } = useAuth()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

onMounted(async () => {
  if (!ready.value) await fetchMe()
  if (isAuthed.value) navigateTo(route.query.redirect || '/dashboard')
})

async function submit() {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }
  busy.value = true
  try {
    await login(email.value.trim(), password.value)
    navigateTo(route.query.redirect || '/dashboard')
  } catch (e) {
    error.value = e?.data?.statusMessage || e?.statusMessage || 'Invalid email or password.'
  } finally {
    busy.value = false
  }
}

const features = [
  { icon: 'lucide:receipt', text: 'Raise and manage Group invoices with VAT and inter-company support.' },
  { icon: 'lucide:bar-chart-3', text: 'See consolidated performance across all six companies at a glance.' },
  { icon: 'lucide:users', text: 'Manage news, leadership, documents, the data room and your team.' },
]
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- brand panel -->
    <div class="relative hidden overflow-hidden bg-forest-950 p-12 text-paper lg:flex lg:flex-col lg:justify-between">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-forest-800/40 blur-3xl" />
      <KyulWordmark tone="paper" size="lg" />
      <div class="relative">
        <p class="eyebrow !text-gold-300">Group Portal</p>
        <h1 class="h-display mt-4 text-4xl text-paper">One Group.<br />One command centre.</h1>
        <p class="mt-5 max-w-md text-paper/65">Secure, role-based access to the Kyul Group Inc. operational portal.</p>
        <ul class="mt-9 space-y-4">
          <li v-for="f in features" :key="f.text" class="flex items-start gap-3">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gold-300"><Icon :name="f.icon" class="h-5 w-5" /></span>
            <span class="text-sm leading-relaxed text-paper/75">{{ f.text }}</span>
          </li>
        </ul>
      </div>
      <p class="relative text-xs text-paper/35">Powered by Savlicon</p>
    </div>

    <!-- form panel -->
    <div class="flex items-center justify-center bg-sand-50 px-6 py-12">
      <div class="w-full max-w-sm">
        <div class="mb-8 lg:hidden"><KyulWordmark /></div>
        <h2 class="h-display text-2xl text-forest-950">Sign in</h2>
        <p class="mt-2 text-sm text-forest-900/60">Welcome back. Enter your credentials to access the Group Portal.</p>

        <form class="mt-8 space-y-4" novalidate @submit.prevent="submit">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Work email</label>
            <input v-model="email" type="email" autocomplete="username" placeholder="you@kyulgroup.com"
              class="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-forest-600" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-forest-900">Password</label>
            <input v-model="password" type="password" autocomplete="current-password" placeholder="••••••••"
              class="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-forest-600" />
          </div>
          <p v-if="error" class="flex items-center gap-1.5 text-sm text-red-600"><Icon name="lucide:circle-alert" class="h-4 w-4" /> {{ error }}</p>
          <button type="submit" :disabled="busy" class="btn-primary w-full">
            <Icon v-if="busy" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
            {{ busy ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="mt-6 text-xs text-forest-900/50">Forgot your password or need an account? Contact your Group administrator.</p>
        <NuxtLink to="/" class="mt-6 inline-flex items-center gap-1.5 text-sm text-forest-900/55 transition hover:text-forest-900"><Icon name="lucide:arrow-left" class="h-4 w-4" /> Back to website</NuxtLink>
      </div>
    </div>
  </div>
</template>
