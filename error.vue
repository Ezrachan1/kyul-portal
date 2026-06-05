<script setup>
const props = defineProps({ error: Object })
const code = computed(() => props.error?.statusCode || 500)
const msg = computed(() => (code.value === 404 ? 'We couldn’t find that page.' : 'Something went wrong.'))
useHead({ title: `${code.value}` })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-forest-950 text-paper">
    <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
    <div class="relative flex flex-1 items-center">
      <div class="shell">
        <KyulWordmark tone="paper" size="lg" />
        <p class="mt-16 font-display text-[7rem] leading-none text-gold-300/90 sm:text-[10rem]">{{ code }}</p>
        <h1 class="h-display mt-4 text-3xl text-paper sm:text-4xl">{{ msg }}</h1>
        <p class="mt-4 max-w-md text-paper/65">
          The page may have moved. Let’s get you back to the Kyul Group portal.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          <NuxtLink to="/" class="btn-gold">Back to home<Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
          <NuxtLink to="/subsidiaries" class="btn-on-dark">Explore the companies</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
