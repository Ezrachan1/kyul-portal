<script setup>
import { site } from '~/data/site'

const route = useRoute()
const { user, logout } = useAuth()
const drawer = ref(false)
watch(() => route.fullPath, () => (drawer.value = false))

async function signOut() {
  await logout()
  navigateTo('/dashboard/login')
}
</script>

<template>
  <div class="min-h-screen bg-sand-50 text-ink">
    <!-- Sidebar (desktop) -->
    <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-forest-950 text-paper lg:flex">
      <SidebarInner />
    </aside>

    <!-- Drawer (mobile) -->
    <Transition enter-active-class="transition" enter-from-class="opacity-0" leave-active-class="transition" leave-to-class="opacity-0">
      <div v-if="drawer" class="fixed inset-0 z-50 bg-ink/50 lg:hidden" @click="drawer = false" />
    </Transition>
    <Transition enter-active-class="transition duration-300 ease-out-expo" enter-from-class="-translate-x-full" leave-active-class="transition duration-200" leave-to-class="-translate-x-full">
      <aside v-if="drawer" class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-forest-950 text-paper lg:hidden">
        <SidebarInner />
      </aside>
    </Transition>

    <!-- Main -->
    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 border-b border-ink/[0.07] bg-paper/85 backdrop-blur-md">
        <div class="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div class="flex items-center gap-3">
            <button class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-forest-900 hover:bg-forest-900/[0.06] lg:hidden" aria-label="Open menu" @click="drawer = true">
              <Icon name="lucide:menu" class="h-6 w-6" />
            </button>
            <div>
              <p class="text-[0.7rem] font-semibold uppercase tracking-widest2 text-forest-900/45">Group Portal</p>
              <p class="font-display text-base text-forest-950">{{ route.meta.title || 'Dashboard' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-forest-900/70 transition hover:text-forest-950 sm:inline-flex">
              <Icon name="lucide:external-link" class="h-4 w-4" /> View site
            </NuxtLink>
            <div class="flex items-center gap-2.5 rounded-full border border-ink/[0.08] bg-white py-1.5 pl-1.5 pr-3 shadow-soft">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-forest-950 text-xs font-semibold text-gold-200">
                {{ (user?.name || 'GA').split(' ').map(p => p[0]).slice(0,2).join('') }}
              </span>
              <span class="hidden text-left leading-tight sm:block">
                <span class="block text-xs font-semibold text-forest-950">{{ user?.name || 'Group Admin' }}</span>
                <span class="block text-[0.68rem] text-forest-900/50">{{ user?.role || 'Administrator' }}</span>
              </span>
              <button class="ml-1 text-forest-900/45 transition hover:text-forest-900" aria-label="Sign out" @click="signOut">
                <Icon name="lucide:log-out" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="px-5 py-7 sm:px-8 sm:py-9">
        <slot />
      </main>
    </div>
  </div>
</template>
