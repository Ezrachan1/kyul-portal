<script setup>
import { group } from '~/data/group'
import { subsidiaryBySlug } from '~/data/subsidiaries'

// Value-chain order is canonical (01 Originates … 06 Governs) — join accents via slug.
const chain = group.valueChain.steps.map((step) => {
  const sub = subsidiaryBySlug(step.slug)
  return { ...step, short: sub?.short || step.entity, accent: sub?.accent || '#d9b962' }
})

const groupMenu = [
  { label: 'About', to: '/about', icon: 'lucide:landmark', text: 'Vision, history, leadership & governance' },
  { label: 'Sustainability & ESG', to: '/esg', icon: 'lucide:leaf', text: 'Environment, community & clean governance' },
  { label: 'Careers', to: '/careers', icon: 'lucide:briefcase', text: 'Build your career across the Group' },
]
const investorsMenu = [
  { label: 'Investor Relations', to: '/investors', icon: 'lucide:trending-up', text: 'Performance, strategy & the case for capital' },
  { label: 'Data Room', to: '/investors/data-room', icon: 'lucide:folder-lock', text: 'Diligence documents for qualified investors' },
]

const nav = [
  { key: 'group', label: 'The Group', items: groupMenu, match: ['/about', '/esg', '/careers'] },
  { key: 'companies', label: 'Companies', mega: true, match: ['/subsidiaries'] },
  { label: 'Projects', to: '/projects' },
  { key: 'investors', label: 'Investors', items: investorsMenu, match: ['/investors'] },
  { label: 'Insights', to: '/news' },
]

const route = useRoute()
const { y } = useWindowScroll()
// Gated on mount so SSR (which can't know the restored scroll) and the first
// client render agree — the style catches up one frame later, no mismatch.
const mounted = useMounted()
const scrolled = computed(() => mounted.value && y.value > 12)

const headerEl = ref(null)
const menuOpen = ref(false) // mobile
const openMenu = ref(null) // 'group' | 'companies' | 'investors'
const triggerEls = {}

let closeTimer = null
let openedByHover = false
const cancelClose = () => clearTimeout(closeTimer)
const scheduleClose = () => {
  cancelClose()
  closeTimer = setTimeout(() => (openMenu.value = null), 140)
}
const toggleMenu = (key) => {
  cancelClose()
  if (openMenu.value === key) {
    // First click after a hover-open commits it instead of snapping closed.
    if (openedByHover) {
      openedByHover = false
      return
    }
    openMenu.value = null
  } else {
    openedByHover = false
    openMenu.value = key
  }
}

// Hover intent is mouse-only, so a touch tap doesn't open-then-toggle-closed.
const hoverOpen = (e, key) => {
  if (e.pointerType !== 'mouse') return
  cancelClose()
  openedByHover = true
  openMenu.value = key
}
const hoverClear = (e) => {
  if (e.pointerType !== 'mouse') return
  cancelClose()
  openMenu.value = null
}
const hoverHold = (e) => e.pointerType === 'mouse' && cancelClose()
const hoverLeave = (e) => e.pointerType === 'mouse' && scheduleClose()

const isActive = (to) => route.path === to || (to !== '/' && route.path.startsWith(to))
const itemActive = (item) => (item.to ? isActive(item.to) : item.match.some(isActive))

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    openMenu.value = null
  },
)

watch(menuOpen, (v) => {
  if (import.meta.client) document.documentElement.classList.toggle('overflow-hidden', v)
})

// The mobile panel is lg:hidden — release the menu (and its scroll lock) if the
// viewport crosses into the desktop layout while it is open.
const isLg = useMediaQuery('(min-width: 1024px)')
watch(isLg, (v) => {
  if (v) menuOpen.value = false
})

const burgerEl = ref(null)
if (import.meta.client) {
  useEventListener(window, 'keydown', (e) => {
    if (e.key !== 'Escape') return
    if (openMenu.value) {
      triggerEls[openMenu.value]?.focus()
      openMenu.value = null
    }
    if (menuOpen.value) {
      menuOpen.value = false
      burgerEl.value?.focus() // don't strand focus in the removed panel
    }
  })
}

onClickOutside(headerEl, () => (openMenu.value = null))
onBeforeUnmount(() => cancelClose())
</script>

<template>
  <header
    ref="headerEl"
    class="fixed inset-x-0 top-0 z-50 flex flex-col text-paper transition-all duration-500 ease-out-expo"
    :class="[
      scrolled || openMenu || menuOpen ? 'bg-forest-950/95 shadow-lift backdrop-blur-md' : 'bg-forest-950',
      menuOpen && 'h-[100dvh] lg:h-auto',
    ]"
  >
    <!-- Deterministic bar height: must equal the layout's pt-16 sm:pt-[4.75rem] offset -->
    <div class="shell-wide flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] sm:h-[4.75rem]">
      <KyulWordmark tone="paper" class="focus-visible:outline-gold-300" />

      <!-- Desktop nav (panels live inside so pointer containment covers them) -->
      <nav class="hidden items-center gap-0.5 lg:flex" aria-label="Primary" @pointerenter="hoverHold" @pointerleave="hoverLeave">
        <template v-for="item in nav" :key="item.label">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-gold-300"
            :class="isActive(item.to) ? 'text-paper' : 'text-paper/70 hover:text-paper'"
            @pointerenter="hoverClear"
          >
            {{ item.label }}
            <span v-if="isActive(item.to)" class="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-300" aria-hidden="true" />
          </NuxtLink>

          <!-- Mega trigger has no `relative`, so its panel anchors to the header itself -->
          <div v-else :class="!item.mega && 'relative'">
            <button
              :ref="(el) => el && (triggerEls[item.key] = el)"
              type="button"
              class="relative flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-gold-300"
              :class="openMenu === item.key || itemActive(item) ? 'text-paper' : 'text-paper/70 hover:text-paper'"
              :aria-expanded="openMenu === item.key"
              :aria-controls="`nav-panel-${item.key}`"
              @click="toggleMenu(item.key)"
              @pointerenter="hoverOpen($event, item.key)"
            >
              {{ item.label }}
              <Icon
                name="lucide:chevron-down"
                class="h-3.5 w-3.5 transition-transform duration-300"
                :class="openMenu === item.key && 'rotate-180'"
                aria-hidden="true"
              />
              <span v-if="itemActive(item)" class="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-300" aria-hidden="true" />
            </button>

            <!-- Small dropdown -->
            <Transition
              enter-active-class="transition duration-300 ease-out-expo" enter-from-class="opacity-0 translate-y-2"
              leave-active-class="transition duration-200 ease-out-expo" leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="!item.mega && openMenu === item.key" :id="`nav-panel-${item.key}`" class="absolute left-0 top-full w-72 pt-4">
                <div class="overflow-hidden rounded-2xl border border-ink/[0.08] bg-paper p-2 shadow-lift">
                  <NuxtLink
                    v-for="link in item.items" :key="link.to" :to="link.to"
                    class="flex items-start gap-3 rounded-xl p-3 transition-colors duration-300 hover:bg-sand-100/70"
                  >
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-700">
                      <Icon :name="link.icon" class="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span class="min-w-0">
                      <span class="block text-sm font-semibold text-forest-950">{{ link.label }}</span>
                      <span class="mt-0.5 block text-xs leading-snug text-forest-900/70">{{ link.text }}</span>
                    </span>
                  </NuxtLink>
                </div>
              </div>
            </Transition>

            <!-- Companies mega-menu: the value chain, in canonical order -->
            <Transition
              enter-active-class="transition duration-300 ease-out-expo" enter-from-class="opacity-0 translate-y-2"
              leave-active-class="transition duration-200 ease-out-expo" leave-to-class="opacity-0 translate-y-1"
            >
              <div v-if="item.mega && openMenu === item.key" :id="`nav-panel-${item.key}`" class="absolute inset-x-0 top-full">
                <div class="max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain border-b border-ink/[0.08] bg-paper shadow-lift">
                  <div class="shell-wide py-8">
                    <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                      <div>
                        <p class="eyebrow">Our Group</p>
                        <p class="mt-2 font-display text-2xl text-forest-950">Six specialists. One value chain.</p>
                      </div>
                      <p class="hidden max-w-sm text-sm leading-relaxed text-forest-900/70 xl:block">
                        {{ group.valueChain.lede }}
                      </p>
                    </div>

                    <KyulLine class="mt-7" :node="1.2" />

                    <ul class="mt-5 grid grid-cols-3 gap-2 xl:grid-cols-6">
                      <li v-for="step in chain" :key="step.slug" class="min-w-0">
                        <NuxtLink
                          :to="`/subsidiaries/${step.slug}`"
                          class="relative block h-full rounded-xl border border-transparent p-4 pl-5 transition-all duration-300 ease-out-expo hover:border-ink/[0.06] hover:bg-white hover:shadow-soft"
                        >
                          <span class="absolute bottom-4 left-0 top-4 w-[2px] rounded-full" :style="{ background: step.accent }" aria-hidden="true" />
                          <span class="flex items-baseline gap-2">
                            <span class="stat-display text-sm font-semibold text-gold-700">{{ step.n }}</span>
                            <span class="truncate text-[0.66rem] font-semibold uppercase tracking-widest2 text-forest-900/70">{{ step.short }}</span>
                          </span>
                          <span class="mt-1.5 block font-display text-lg text-forest-950">{{ step.action }}</span>
                          <span class="mt-1.5 block text-xs leading-relaxed text-forest-900/70">{{ step.text }}</span>
                        </NuxtLink>
                      </li>
                    </ul>

                    <div class="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.07] pt-5">
                      <p class="text-xs text-forest-900/70">Six operating companies · One governance structure · KSh 510M FY2025 group turnover</p>
                      <NuxtLink to="/subsidiaries" class="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950">
                        Explore the Group
                        <Icon name="lucide:arrow-right" class="h-4 w-4" aria-hidden="true" />
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </template>
      </nav>

      <div class="flex items-center gap-2 sm:gap-2.5">
        <NuxtLink to="/dashboard/login" class="btn-on-dark hidden !px-4 !py-2.5 focus-visible:outline-gold-300 xl:inline-flex">
          <Icon name="lucide:lock" class="h-3.5 w-3.5" aria-hidden="true" />
          Investor Portal
        </NuxtLink>
        <!-- Icon-only portal link where the full label doesn't fit (lg → xl) -->
        <NuxtLink
          to="/dashboard/login" aria-label="Investor Portal"
          class="hidden h-10 w-10 items-center justify-center rounded-full border border-white/25 text-paper transition-colors duration-300 hover:border-white/50 hover:bg-white/10 focus-visible:outline-gold-300 lg:inline-flex xl:hidden"
        >
          <Icon name="lucide:lock" class="h-4 w-4" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink to="/contact" class="btn-gold hidden !px-5 !py-2.5 focus-visible:outline-gold-300 sm:inline-flex">Get in touch</NuxtLink>

        <button
          ref="burgerEl"
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full text-paper transition-colors duration-300 hover:bg-white/10 focus-visible:outline-gold-300 lg:hidden"
          :aria-expanded="menuOpen" aria-controls="mobile-menu" aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile menu: full-screen, dark, sectioned -->
    <Transition
      enter-active-class="transition duration-300 ease-out-expo" enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-200 ease-out-expo" leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="menuOpen" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" class="relative min-h-0 flex-1 overflow-y-auto overscroll-contain lg:hidden">
        <div class="pointer-events-none absolute inset-0 bg-grain opacity-[0.05]" aria-hidden="true" />
        <div class="shell relative flex min-h-full flex-col pb-10 pt-5">
          <nav class="flex-1 space-y-8" aria-label="Mobile">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-gold-300/80">The Group</p>
              <NuxtLink
                v-for="link in groupMenu" :key="link.to" :to="link.to"
                class="flex min-h-[48px] items-center justify-between border-b border-white/[0.07] py-3 font-display text-xl focus-visible:outline-gold-300"
                :class="isActive(link.to) ? 'text-gold-200' : 'text-paper'"
              >
                {{ link.label }}
                <Icon name="lucide:arrow-right" class="h-4 w-4 shrink-0 text-paper/30" aria-hidden="true" />
              </NuxtLink>
            </div>

            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-gold-300/80">Companies · The value chain</p>
              <div class="relative mt-3">
                <span class="absolute bottom-3 left-[1px] top-3 w-px bg-gradient-to-b from-gold-300/50 via-white/10 to-transparent" aria-hidden="true" />
                <NuxtLink
                  v-for="step in chain" :key="step.slug" :to="`/subsidiaries/${step.slug}`"
                  class="flex min-h-[48px] items-center gap-3 py-1.5 focus-visible:outline-gold-300"
                >
                  <span class="relative h-5 w-[3px] shrink-0 rounded-full" :style="{ background: step.accent }" aria-hidden="true" />
                  <span class="stat-display w-7 shrink-0 text-sm text-gold-300/80">{{ step.n }}</span>
                  <span class="min-w-0 flex-1 truncate text-[0.95rem] font-medium" :class="isActive(`/subsidiaries/${step.slug}`) ? 'text-gold-200' : 'text-paper'">{{ step.short }}</span>
                  <span class="shrink-0 text-xs text-paper/60">{{ step.action }}</span>
                  <Icon name="lucide:chevron-right" class="h-4 w-4 shrink-0 text-paper/30" aria-hidden="true" />
                </NuxtLink>
                <NuxtLink to="/subsidiaries" class="mt-1 inline-flex min-h-[44px] items-center gap-1.5 pl-6 text-sm font-semibold text-gold-200 focus-visible:outline-gold-300">
                  Explore the Group
                  <Icon name="lucide:arrow-right" class="h-4 w-4" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>

            <div>
              <NuxtLink
                to="/projects"
                class="flex min-h-[48px] items-center justify-between border-y border-white/[0.07] py-3 font-display text-xl focus-visible:outline-gold-300"
                :class="isActive('/projects') ? 'text-gold-200' : 'text-paper'"
              >
                Projects
                <Icon name="lucide:arrow-right" class="h-4 w-4 shrink-0 text-paper/30" aria-hidden="true" />
              </NuxtLink>
              <NuxtLink
                to="/news"
                class="flex min-h-[48px] items-center justify-between border-b border-white/[0.07] py-3 font-display text-xl focus-visible:outline-gold-300"
                :class="isActive('/news') ? 'text-gold-200' : 'text-paper'"
              >
                Insights
                <Icon name="lucide:arrow-right" class="h-4 w-4 shrink-0 text-paper/30" aria-hidden="true" />
              </NuxtLink>
            </div>

            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-widest2 text-gold-300/80">Investors</p>
              <NuxtLink
                v-for="link in investorsMenu" :key="link.to" :to="link.to"
                class="flex min-h-[48px] items-center justify-between border-b border-white/[0.07] py-3 font-display text-xl focus-visible:outline-gold-300"
                :class="route.path === link.to ? 'text-gold-200' : 'text-paper'"
              >
                {{ link.label }}
                <Icon name="lucide:arrow-right" class="h-4 w-4 shrink-0 text-paper/30" aria-hidden="true" />
              </NuxtLink>
            </div>
          </nav>

          <div class="mt-9 flex flex-col gap-3">
            <NuxtLink to="/contact" class="btn-gold w-full focus-visible:outline-gold-300">Get in touch</NuxtLink>
            <NuxtLink to="/dashboard/login" class="btn-on-dark w-full focus-visible:outline-gold-300">
              <Icon name="lucide:lock" class="h-4 w-4" aria-hidden="true" />
              Investor Portal
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
