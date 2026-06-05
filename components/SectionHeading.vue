<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lede: { type: String, default: '' },
  align: { type: String, default: 'left' }, // 'left' | 'center'
  tone: { type: String, default: 'ink' }, // 'ink' | 'paper'
})
</script>

<template>
  <div :class="[align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl']">
    <p v-if="eyebrow" v-reveal class="eyebrow" :class="[align === 'center' && 'justify-center', tone === 'paper' && '!text-gold-300']">
      {{ eyebrow }}
    </p>
    <h2
      v-if="title" v-reveal="80"
      class="h-display mt-4 text-balance text-3xl sm:text-4xl lg:text-[2.75rem]"
      :class="tone === 'paper' ? 'text-paper' : 'text-forest-950'"
    >
      {{ title }}
    </h2>
    <p
      v-if="lede" v-reveal="140"
      class="mt-5 text-lg leading-relaxed"
      :class="[tone === 'paper' ? 'text-paper/70' : 'text-forest-900/70', align === 'center' && 'mx-auto']"
    >
      {{ lede }}
    </p>
    <slot />
  </div>
</template>
