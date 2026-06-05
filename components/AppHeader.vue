<script setup>
import { mainNav } from '~/data/nav'

const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 12)

const route = useRoute()
const menuOpen = ref(false)
const openGroup = ref(null) // mobile accordion

// desktop dropdown
const dropdownOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    dropdownOpen.value = false
  },
)

watch(menuOpen, (v) => {
  if (import.meta.client) document.documentElement.classList.toggle('overflow-hidden', v)
})

if (import.meta.client) {
  useEventListener(window, 'keydown', (e) => {
    if (e.key === 'Escape') {
      menuOpen.value = false
      dropdownOpen.value = false
    }
  })
}

const isActive = (to) => route.path === to || (to !== '/' && route.path.startsWith(to))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo"
    :class="scrolled || menuOpen ? 'bg-paper/95 shadow-soft backdrop-blur-md' : 'bg-paper/70 backdrop-blur-sm'"
  >
    <div class="absolute inset-x-0 bottom-0 h-px bg-ink/[0.08]" />
    <div class="shell-wide flex items-center justify-between gap-6 py-3.5 sm:py-4">
      <KyulWordmark />

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 lg:flex" aria-label="Primary">
        <template v-for="item in mainNav" :key="item.label">
          <div v-if="item.children" class="relative" @mouseleave="dropdownOpen = false">
            <button
              class="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-forest-900/80 transition hover:text-forest-950"
              :class="isActive(item.to) && 'text-forest-950'"
              :aria-expanded="dropdownOpen"
              @click="dropdownOpen = !dropdownOpen"
              @mouseenter="dropdownOpen = true"
            >
              {{ item.label }}
              <Icon name="lucide:chevron-down" class="h-3.5 w-3.5 transition-transform" :class="dropdownOpen && 'rotate-180'" />
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out-expo" enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-150" leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="dropdownOpen"
                class="absolute left-1/2 top-full z-50 mt-3 w-[34rem] -translate-x-1/2"
                @mouseleave="dropdownOpen = false"
              >
                <div class="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white p-2 shadow-card">
                  <div class="grid grid-cols-2 gap-1">
                    <NuxtLink
                      v-for="c in item.children" :key="c.to" :to="c.to"
                      class="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-sand-50"
                    >
                      <span class="mt-1 h-2 w-2 shrink-0 rounded-full ring-2 ring-white" :style="{ background: c.accent }" />
                      <span class="min-w-0">
                        <span class="block text-sm font-semibold text-forest-950">{{ c.short }}</span>
                        <span class="block truncate text-xs text-forest-900/55">{{ c.arm }}</span>
                      </span>
                    </NuxtLink>
                  </div>
                  <NuxtLink to="/subsidiaries" class="mt-1 flex items-center justify-between rounded-xl bg-forest-950 px-4 py-3 text-sm font-medium text-paper transition hover:bg-forest-900">
                    <span>Explore all six companies</span>
                    <Icon name="lucide:arrow-right" class="h-4 w-4" />
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <NuxtLink
            v-else :to="item.to"
            class="rounded-full px-3.5 py-2 text-sm font-medium text-forest-900/80 transition hover:text-forest-950"
            :class="isActive(item.to) && 'text-forest-950'"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard"
          class="hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-forest-900/80 transition hover:text-forest-950 md:inline-flex"
        >
          <Icon name="lucide:layout-dashboard" class="h-4 w-4" />
          Portal
        </NuxtLink>
        <NuxtLink to="/contact" class="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">Get in touch</NuxtLink>

        <!-- Mobile toggle -->
        <button
          class="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest-950 transition hover:bg-forest-900/[0.06] lg:hidden"
          :aria-expanded="menuOpen" aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out-expo" enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200" leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" class="lg:hidden">
        <div class="shell max-h-[calc(100vh-5rem)] overflow-y-auto pb-8 pt-2">
          <nav class="flex flex-col" aria-label="Mobile">
            <template v-for="item in mainNav" :key="item.label">
              <div v-if="item.children" class="border-b border-ink/[0.06]">
                <button
                  class="flex w-full items-center justify-between py-3.5 text-left font-display text-lg text-forest-950"
                  @click="openGroup = openGroup === item.label ? null : item.label"
                >
                  {{ item.label }}
                  <Icon name="lucide:chevron-down" class="h-4 w-4 transition-transform" :class="openGroup === item.label && 'rotate-180'" />
                </button>
                <div v-if="openGroup === item.label" class="grid grid-cols-1 gap-1 pb-3">
                  <NuxtLink
                    v-for="c in item.children" :key="c.to" :to="c.to"
                    class="flex items-center gap-3 rounded-lg px-2 py-2.5 text-forest-900/80"
                  >
                    <span class="h-2 w-2 rounded-full" :style="{ background: c.accent }" />
                    <span class="text-sm font-medium">{{ c.short }}</span>
                    <span class="text-xs text-forest-900/45">· {{ c.arm }}</span>
                  </NuxtLink>
                </div>
              </div>
              <NuxtLink v-else :to="item.to" class="border-b border-ink/[0.06] py-3.5 font-display text-lg text-forest-950">
                {{ item.label }}
              </NuxtLink>
            </template>
          </nav>
          <div class="mt-6 flex flex-col gap-3">
            <NuxtLink to="/contact" class="btn-primary w-full">Get in touch</NuxtLink>
            <NuxtLink to="/dashboard" class="btn-outline w-full">
              <Icon name="lucide:layout-dashboard" class="h-4 w-4" /> Group Portal
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
