<script setup>
// SSR renders the final value so crawlers and no-JS clients see the real number;
// the count-up only plays client-side, on first intersection, motion permitting.
const props = defineProps({
  to: { type: Number, required: true },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  duration: { type: Number, default: 1400 },
  separator: { type: String, default: ',' },
})

const el = ref(null)
const shown = ref(props.to)
watch(() => props.to, (v) => { shown.value = v })

const fmt = (n) => {
  const [i, d] = n.toFixed(props.decimals).split('.')
  return props.prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator) + (d ? '.' + d : '') + props.suffix
}

onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const ease = (t) => 1 - Math.pow(1 - t, 3)
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / props.duration)
        shown.value = props.to * ease(p)
        if (p < 1) requestAnimationFrame(tick)
      }
      shown.value = 0
      requestAnimationFrame(tick)
    },
    { threshold: 0.4 },
  )
  io.observe(el.value)
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <span ref="el">{{ fmt(shown) }}</span>
</template>
