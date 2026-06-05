<script setup>
defineProps({
  sub: { type: Object, required: true },
  index: { type: Number, default: 0 },
})
</script>

<template>
  <NuxtLink
    v-reveal="(index % 3) * 90"
    :to="`/subsidiaries/${sub.slug}`"
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/[0.07] bg-white shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-card"
  >
    <!-- accent top line -->
    <span class="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100" :style="{ background: sub.accent }" />

    <!-- logo plate -->
    <SubsidiaryLogo :sub="sub" class="aspect-[5/4] border-b border-ink/[0.06]" />

    <div class="flex flex-1 flex-col p-6">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" :style="{ background: sub.accent }" />
        <span class="text-[0.7rem] font-semibold uppercase tracking-widest2 text-forest-900/55">{{ sub.arm }}</span>
      </div>
      <h3 class="mt-3 font-display text-xl text-forest-950">{{ sub.name }}</h3>
      <p class="mt-2.5 flex-1 text-sm leading-relaxed text-forest-900/65">{{ sub.summary }}</p>
      <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800">
        Explore
        <Icon name="lucide:arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </div>
  </NuxtLink>
</template>
