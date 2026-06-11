<script setup>
import { site } from '~/data/site'
import { subsidiaries } from '~/data/subsidiaries'

useSeoMeta({
  title: 'Contact',
  description: 'Contact Kyul Group Inc. in Eldoret, Kenya: general enquiries, investor relations, media and a directory of all six companies.',
})

const settings = useSettings()
const channels = computed(() => [
  { icon: 'lucide:mail', label: 'General enquiries', value: settings.value.contact.email, href: `mailto:${settings.value.contact.email}` },
  { icon: 'lucide:trending-up', label: 'Investor relations', value: settings.value.contact.investorEmail, href: `mailto:${settings.value.contact.investorEmail}` },
  { icon: 'lucide:newspaper', label: 'Media & press', value: settings.value.contact.pressEmail, href: `mailto:${settings.value.contact.pressEmail}` },
  { icon: 'lucide:briefcase', label: 'Careers', value: settings.value.contact.careersEmail, href: `mailto:${settings.value.contact.careersEmail}` },
])
</script>

<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Let’s start a conversation."
      lede="Whether you’re an investor, a partner, a client or a future colleague, reach the right part of the Group below."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Contact' }]"
    />

    <section class="shell py-16 md:py-20">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <!-- info -->
        <div class="lg:col-span-5">
          <div class="rounded-2xl border border-ink/[0.07] bg-white p-7 shadow-soft">
            <h2 class="font-display text-xl text-forest-950">Group headquarters</h2>
            <address class="mt-4 space-y-3 not-italic text-forest-900/75">
              <p class="flex items-start gap-3"><Icon name="lucide:map-pin" class="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /><span>{{ settings.hq.line1 }}<br />{{ settings.hq.line2 }}<br />{{ settings.hq.postal }}, {{ settings.hq.country }}</span></p>
              <p class="flex items-center gap-3"><Icon name="lucide:phone" class="h-5 w-5 shrink-0 text-gold-600" /><a :href="`tel:${settings.contact.phoneHref || settings.contact.phone}`" class="link-underline">{{ settings.contact.phone }}</a></p>
              <p v-if="settings.contact.mobile" class="flex items-center gap-3"><Icon name="lucide:smartphone" class="h-5 w-5 shrink-0 text-gold-600" /><a :href="`tel:${settings.contact.mobileHref || settings.contact.mobile}`" class="link-underline">{{ settings.contact.mobile }}</a></p>
            </address>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <a v-for="c in channels" :key="c.label" :href="c.href" class="group rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 text-forest-700"><Icon :name="c.icon" class="h-5 w-5" /></span>
              <p class="mt-3 text-xs font-semibold uppercase tracking-widest2 text-forest-900/45">{{ c.label }}</p>
              <p class="mt-1 truncate text-sm font-medium text-forest-800 group-hover:text-forest-950">{{ c.value }}</p>
            </a>
          </div>

          <!-- map -->
          <div class="mt-5 overflow-hidden rounded-2xl border border-ink/[0.07] shadow-soft">
            <iframe
              title="Kyul Group HQ, Eldoret, Kenya"
              class="h-64 w-full grayscale-[0.2]"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=35.22%2C0.48%2C35.33%2C0.56&layer=mapnik&marker=0.5143%2C35.2698"
            />
          </div>
        </div>

        <!-- form -->
        <div class="lg:col-span-7">
          <SectionHeading eyebrow="Send a message" title="How can we help?" />
          <div class="mt-7">
            <EnquiryForm source="Contact page" :subjects="['General enquiry', 'Investor relations', 'Partnership / Joint venture', 'Supplier / RFP', 'Media & press', 'Careers']" cta="Send message" />
          </div>
        </div>
      </div>
    </section>

    <!-- subsidiary directory -->
    <section class="border-t border-ink/[0.06] bg-sand-50/70 py-16 md:py-20">
      <div class="shell">
        <SectionHeading eyebrow="Company directory" title="Reach a specific company." />
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="s in subsidiaries" :key="s.slug" :to="`/subsidiaries/${s.slug}`"
            class="group flex items-center justify-between gap-3 rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <span class="min-w-0">
              <span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full" :style="{ background: s.accent }" /><span class="truncate font-semibold text-forest-950">{{ s.name }}</span></span>
              <span class="mt-1 block truncate text-sm text-forest-900/55">{{ settings.subsidiaryContacts?.[s.slug]?.email || s.contact.email }}</span>
            </span>
            <Icon name="lucide:arrow-up-right" class="h-4 w-4 shrink-0 text-forest-900/30 transition group-hover:text-forest-800" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
