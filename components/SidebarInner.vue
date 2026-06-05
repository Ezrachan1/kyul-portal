<script setup>
const route = useRoute()
const { user, isSuper, can } = useAuth()

const features = useState('kyul-features', () => ({}))
onMounted(async () => {
  try {
    features.value = await $fetch('/api/features')
  } catch {
    /* not critical */
  }
})

const MODULES = {
  finance: { label: 'Finance & Accounting', icon: 'lucide:wallet' },
  hr: { label: 'HR & Payroll', icon: 'lucide:users' },
  procurement: { label: 'Procurement', icon: 'lucide:shopping-cart' },
  plm: { label: 'Project Lifecycle', icon: 'lucide:kanban' },
  legal: { label: 'Legal & Compliance', icon: 'lucide:scale' },
  kpis: { label: 'Executive KPIs', icon: 'lucide:gauge' },
}

const items = computed(() => {
  const list = [{ label: 'Overview', icon: 'lucide:layout-dashboard', to: '/dashboard' }]
  if (can(['admin', 'finance'])) list.push({ label: 'Invoices', icon: 'lucide:receipt', to: '/dashboard/invoices' })
  if (can(['admin', 'editor'])) list.push({ label: 'Inbox', icon: 'lucide:inbox', to: '/dashboard/inbox' })
  if (can(['admin', 'editor'])) list.push({ label: 'News & Insights', icon: 'lucide:newspaper', to: '/dashboard/news' })
  if (can(['admin', 'editor'])) list.push({ label: 'Team & Leadership', icon: 'lucide:contact', to: '/dashboard/team' })
  if (can(['admin', 'editor'])) list.push({ label: 'Portfolio', icon: 'lucide:briefcase', to: '/dashboard/portfolio' })
  if (can(['admin', 'editor'])) list.push({ label: 'Documents', icon: 'lucide:folder', to: '/dashboard/documents' })
  if (can(['admin'])) list.push({ label: 'Data Room', icon: 'lucide:folder-lock', to: '/dashboard/data-room' })
  if (can(['admin'])) list.push({ label: 'Users & Roles', icon: 'lucide:user-cog', to: '/dashboard/users' })
  if (can(['admin'])) list.push({ label: 'Site Settings', icon: 'lucide:settings', to: '/dashboard/settings' })
  // modules enabled by the super-admin appear to admins as well
  for (const [k, m] of Object.entries(MODULES)) {
    if (features.value[k]) list.push({ label: m.label, icon: m.icon, to: `/dashboard/modules/${k}` })
  }
  return list
})

const isActive = (to) => (to === '/dashboard' ? route.path === to : route.path.startsWith(to))
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-2.5 border-b border-paper/10 px-5 py-5">
      <KyulMark class="h-9 w-9 shrink-0" />
      <div class="leading-none">
        <p class="font-display text-base text-paper">Kyul Group</p>
        <p class="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-gold-300/80">Group Portal</p>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-5">
      <p class="px-3 pb-2 text-[0.62rem] font-semibold uppercase tracking-widest2 text-paper/35">Workspace</p>
      <NuxtLink
        v-for="item in items" :key="item.to" :to="item.to"
        class="group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
        :class="isActive(item.to) ? 'bg-white/10 text-paper' : 'text-paper/65 hover:bg-white/[0.06] hover:text-paper'"
      >
        <Icon :name="item.icon" class="h-[1.15rem] w-[1.15rem]" :class="isActive(item.to) ? 'text-gold-300' : 'text-paper/55 group-hover:text-paper'" />
        {{ item.label }}
        <span v-if="isActive(item.to)" class="ml-auto h-1.5 w-1.5 rounded-full bg-gold-300" />
      </NuxtLink>

      <template v-if="isSuper">
        <p class="px-3 pb-2 pt-6 text-[0.62rem] font-semibold uppercase tracking-widest2 text-paper/35">Administration</p>
        <NuxtLink
          to="/dashboard/system"
          class="group mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
          :class="isActive('/dashboard/system') ? 'bg-white/10 text-paper' : 'text-paper/65 hover:bg-white/[0.06] hover:text-paper'"
        >
          <Icon name="lucide:sliders-horizontal" class="h-[1.15rem] w-[1.15rem]" :class="isActive('/dashboard/system') ? 'text-gold-300' : 'text-paper/55 group-hover:text-paper'" />
          System & Modules
        </NuxtLink>
      </template>
    </nav>

    <div class="border-t border-paper/10 px-5 py-4">
      <div class="mb-3 flex items-center gap-2 text-xs text-paper/45">
        <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span class="capitalize">{{ (user?.role || '').replace('-', ' ') }}</span>
      </div>
      <NuxtLink to="/" class="flex items-center gap-2 text-sm text-paper/60 transition hover:text-paper">
        <Icon name="lucide:arrow-left" class="h-4 w-4" /> Back to website
      </NuxtLink>
      <a href="https://savlicon.co.ke" target="_blank" rel="noopener" class="mt-3 block text-[0.68rem] text-paper/35 transition hover:text-paper/60">Powered by Savlicon</a>
    </div>
  </div>
</template>
