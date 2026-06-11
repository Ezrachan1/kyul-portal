<script setup>
const props = defineProps({
  tone: { type: String, default: 'ink' }, // 'ink' (light bg) | 'paper' (dark bg)
  to: { type: String, default: '/' },
  size: { type: String, default: 'md' }, // 'md' | 'lg'
  sub: { type: Boolean, default: false },
})

const markSize = computed(() => (props.size === 'lg' ? 'h-11 w-11' : 'h-9 w-9 sm:h-10 sm:w-10'))
const wordSize = computed(() => (props.size === 'lg' ? 'text-[1.5rem]' : 'text-[1.18rem] sm:text-[1.3rem]'))
</script>

<template>
  <NuxtLink :to="to" class="group inline-flex items-center gap-2.5" aria-label="Kyul Group home">
    <KyulMark :class="[markSize, 'shrink-0 transition-transform duration-500 ease-out-expo group-hover:-rotate-[4deg]']" />
    <span class="flex flex-col leading-none">
      <span class="font-display tracking-tightish" :class="wordSize">
        <span class="font-semibold" :class="tone === 'paper' ? 'text-paper' : 'text-forest-950'">Kyul</span><span
          class="font-normal" :class="tone === 'paper' ? 'text-gold-200' : 'text-forest-700'"> Group</span><span
          class="align-super text-[0.5em] font-semibold" :class="tone === 'paper' ? 'text-gold-200/80' : 'text-forest-700/80'">&nbsp;Inc.</span>
      </span>
      <span
        v-if="sub"
        class="mt-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.32em]"
        :class="tone === 'paper' ? 'text-gold-300/80' : 'text-gold-700'"
      >Integrated · Eastern Africa</span>
    </span>
  </NuxtLink>
</template>
