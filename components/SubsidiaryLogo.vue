<script setup>
const props = defineProps({
  sub: { type: Object, required: true },
  pad: { type: String, default: 'p-[12%]' },
})

const bgClass = computed(() => {
  if (props.sub.logo.clean) return 'bg-white'
  return props.sub.logo.tone === 'dark' ? 'bg-[#0e1220]' : 'bg-[#eceef1]'
})
const src = computed(() => (props.sub.logo.clean ? props.sub.logo.src : props.sub.logo.full))
</script>

<template>
  <div class="flex items-center justify-center overflow-hidden" :class="bgClass">
    <img
      :src="src" :alt="`${sub.name} logo`" loading="lazy"
      class="h-full w-full object-contain" :class="sub.logo.clean ? pad : ''"
    />
  </div>
</template>
