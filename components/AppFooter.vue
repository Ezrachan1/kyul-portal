<script setup>
import { site } from '~/data/site'
import { footerNav } from '~/data/nav'

const settings = useSettings()
const year = 2026
</script>

<template>
  <footer class="relative overflow-hidden bg-forest-950 text-paper">
    <div class="pointer-events-none absolute inset-0 opacity-[0.04] bg-grain" />
    <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-forest-800/40 blur-3xl" />

    <div class="shell-wide relative">
      <!-- Top -->
      <div class="grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <KyulWordmark tone="paper" size="lg" sub />
          <p class="mt-6 max-w-sm font-display text-xl leading-snug text-paper/90">
            {{ site.tagline }}
          </p>
          <p class="mt-5 max-w-sm text-sm leading-relaxed text-paper/55">
            An integrated project delivery and investment group — originating, designing, financing, building and
            operating bankable projects across Eastern Africa.
          </p>

          <ul class="mt-7 space-y-2.5 text-sm text-paper/70">
            <li class="flex items-start gap-3">
              <Icon name="lucide:map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <span>{{ settings.hq.line1 }}, {{ settings.hq.line2 }}, {{ settings.hq.country }}</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="lucide:phone" class="h-4 w-4 shrink-0 text-gold-300" />
              <a :href="`tel:${settings.contact.phoneHref || settings.contact.phone}`" class="link-underline">{{ settings.contact.phone }}</a>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="lucide:mail" class="h-4 w-4 shrink-0 text-gold-300" />
              <a :href="`mailto:${settings.contact.email}`" class="link-underline">{{ settings.contact.email }}</a>
            </li>
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          <div v-for="col in footerNav" :key="col.title">
            <h3 class="text-[0.72rem] font-semibold uppercase tracking-widest2 text-gold-300/90">{{ col.title }}</h3>
            <ul class="mt-4 space-y-2.5">
              <li v-for="l in col.links" :key="l.to">
                <NuxtLink :to="l.to" class="link-underline text-sm text-paper/65 transition hover:text-paper">
                  {{ l.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <!-- Bottom -->
      <div class="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-paper/50">
          <span>© {{ year }} {{ site.legalName }} All rights reserved.</span>
          <NuxtLink to="/privacy" class="transition hover:text-paper/80">Privacy</NuxtLink>
          <NuxtLink to="/privacy#cookies" class="transition hover:text-paper/80">Cookies</NuxtLink>
          <NuxtLink to="/investors" class="transition hover:text-paper/80">Investor Relations</NuxtLink>
        </div>

        <div class="flex items-center gap-5">
          <div class="flex items-center gap-2">
            <a
              v-for="s in settings.social" :key="s.label" :href="s.href" :aria-label="s.label" target="_blank" rel="noopener"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper/60 transition hover:border-gold-400/60 hover:text-paper"
            >
              <Icon :name="s.icon" class="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <!-- Savlicon credit -->
      <div class="flex items-center justify-center gap-2 border-t border-paper/[0.07] py-6 text-xs text-paper/45">
        <Icon name="lucide:code-xml" class="h-3.5 w-3.5 text-gold-400/70" />
        <span>
          Powered by
          <a :href="site.builtBy.url" target="_blank" rel="noopener"
             class="font-medium text-paper/75 underline decoration-gold-400/50 underline-offset-2 transition hover:text-paper">
            Savlicon
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>
