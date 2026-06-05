<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  crumbs: { type: Array, default: () => [] }, // [{label, to}]
  size: { type: String, default: 'md' }, // 'md' | 'lg'
})
</script>

<template>
  <section class="relative overflow-hidden bg-forest-950 text-paper">
    <div class="pointer-events-none absolute inset-0 opacity-[0.05] bg-grain" />
    <div class="pointer-events-none absolute -left-32 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-forest-800/30 blur-3xl" />
    <div class="pointer-events-none absolute right-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

    <div class="shell relative" :class="size === 'lg' ? 'py-20 md:py-28 lg:py-32' : 'py-16 md:py-22 lg:py-24'">
      <nav v-if="crumbs.length" class="mb-7 flex flex-wrap items-center gap-2 text-xs text-paper/45" aria-label="Breadcrumb">
        <template v-for="(c, i) in crumbs" :key="i">
          <NuxtLink v-if="c.to" :to="c.to" class="transition hover:text-paper/80">{{ c.label }}</NuxtLink>
          <span v-else class="text-paper/70">{{ c.label }}</span>
          <Icon v-if="i < crumbs.length - 1" name="lucide:chevron-right" class="h-3 w-3 text-paper/30" />
        </template>
      </nav>

      <p v-if="eyebrow" v-reveal class="eyebrow !text-gold-300">{{ eyebrow }}</p>
      <h1
        v-reveal="80"
        class="h-display mt-4 max-w-4xl text-balance text-4xl text-paper sm:text-5xl"
        :class="size === 'lg' ? 'lg:text-[4.25rem]' : 'lg:text-[3.25rem]'"
      >
        {{ title }}
      </h1>
      <p v-if="lede" v-reveal="160" class="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
        {{ lede }}
      </p>

      <div v-if="$slots.actions" v-reveal="240" class="mt-9 flex flex-wrap gap-3">
        <slot name="actions" />
      </div>
      <slot />
    </div>
  </section>
</template>
