<script setup>
defineProps({
  eyebrow: { type: String, default: 'Get in touch' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  primary: { type: Object, default: () => ({ label: 'Contact us', to: '/contact' }) },
  secondary: { type: Object, default: null },
})
</script>

<template>
  <section class="shell py-16 md:py-24">
    <div v-reveal class="relative overflow-hidden rounded-3xl bg-forest-950 px-8 py-14 text-paper md:px-16 md:py-20">
      <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
      <div class="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-forest-700/30 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />

      <div class="relative max-w-2xl">
        <p class="eyebrow !text-gold-300">{{ eyebrow }}</p>
        <h2 class="h-display mt-4 text-3xl text-balance text-paper sm:text-4xl lg:text-[2.75rem]">{{ title }}</h2>
        <p v-if="text" class="mt-5 text-lg leading-relaxed text-paper/70">{{ text }}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <NuxtLink :to="primary.to" class="btn-gold">{{ primary.label }}<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
          <NuxtLink v-if="secondary" :to="secondary.to" class="btn-on-dark">{{ secondary.label }}</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
