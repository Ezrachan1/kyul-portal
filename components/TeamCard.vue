<script setup>
const props = defineProps({
  person: { type: Object, required: true },
  index: { type: Number, default: 0 },
  accent: { type: String, default: '#2d5d4b' },
})
const roleText = computed(() => props.person.role || props.person.title || '')
const heading = computed(() => props.person.name || roleText.value)
const sub = computed(() => (props.person.name ? roleText.value : ''))
</script>

<template>
  <div v-reveal="(index % 3) * 80" class="group rounded-2xl border border-ink/[0.07] bg-white p-6 shadow-soft transition-all duration-400 hover:shadow-card">
    <div class="flex items-center gap-4">
      <img v-if="person.photo" :src="person.photo" :alt="heading" class="h-14 w-14 shrink-0 rounded-full object-cover" />
      <span
        v-else
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold text-paper"
        :style="{ background: `linear-gradient(150deg, ${accent}, #0a201b)` }"
      >{{ person.initials }}</span>
      <div class="min-w-0">
        <h3 class="truncate font-display text-lg text-forest-950">{{ heading }}</h3>
        <p class="truncate text-sm text-forest-900/55">{{ sub }}</p>
      </div>
    </div>
    <p v-if="person.bio" class="mt-4 text-sm leading-relaxed text-forest-900/65">{{ person.bio }}</p>
  </div>
</template>
