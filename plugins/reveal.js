// v-reveal — gentle on-scroll reveal. Universal plugin so the directive
// resolves during SSR; the IntersectionObserver only runs on the client.
export default defineNuxtPlugin((nuxtApp) => {
  let io = null
  let reduce = false

  if (import.meta.client) {
    reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
    if (!reduce) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const el = entry.target
              const delay = Number(el.dataset.revealDelay || 0)
              el.style.transitionDelay = `${delay}ms`
              el.classList.add('reveal-in')
              io.unobserve(el)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (!import.meta.client) return
      if (reduce || !io) {
        el.classList.add('reveal-in')
        return
      }
      el.classList.add('reveal')
      if (binding.value) el.dataset.revealDelay = String(binding.value)
      io.observe(el)
    },
    unmounted(el) {
      io?.unobserve(el)
    },
  })
})
