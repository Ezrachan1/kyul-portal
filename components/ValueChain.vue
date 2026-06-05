<script setup>
import { group } from '~/data/group'
const steps = group.valueChain.steps
</script>

<template>
  <div class="grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
    <NuxtLink
      v-for="(s, i) in steps" :key="s.slug"
      v-reveal="i * 70"
      :to="`/subsidiaries/${s.slug}`"
      class="group relative flex flex-col bg-forest-950 p-6 transition-colors duration-300 hover:bg-forest-900"
    >
      <div class="flex items-center justify-between">
        <span class="font-display text-2xl text-gold-300/90">{{ s.n }}</span>
        <Icon name="lucide:arrow-up-right" class="h-4 w-4 text-paper/30 transition group-hover:text-gold-300" />
      </div>
      <p class="mt-5 text-[0.7rem] font-semibold uppercase tracking-widest2 text-gold-300/70">{{ s.action }}</p>
      <h3 class="mt-1.5 font-display text-lg text-paper">{{ s.entity }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-paper/55">{{ s.text }}</p>
    </NuxtLink>
  </div>
</template>
