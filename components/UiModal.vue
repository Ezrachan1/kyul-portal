<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
const emit = defineEmits(['close'])

watch(
  () => props.open,
  (v) => {
    if (import.meta.client) document.documentElement.classList.toggle('overflow-hidden', v)
  },
)
onUnmounted(() => {
  if (import.meta.client) document.documentElement.classList.remove('overflow-hidden')
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200" enter-from-class="opacity-0"
        leave-active-class="transition duration-150" leave-to-class="opacity-0"
      >
        <div v-if="open" class="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
          <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="emit('close')" />
          <Transition
            enter-active-class="transition duration-300 ease-out-expo" enter-from-class="translate-y-6 opacity-0 sm:translate-y-3"
            appear
          >
            <div class="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl">
              <div class="flex items-start justify-between gap-4 border-b border-ink/[0.07] px-6 py-5">
                <div>
                  <h2 class="font-display text-lg text-forest-950">{{ title }}</h2>
                  <p v-if="subtitle" class="mt-0.5 text-sm text-forest-900/55">{{ subtitle }}</p>
                </div>
                <button class="-mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-forest-900/45 transition hover:bg-forest-900/[0.05] hover:text-forest-900" aria-label="Close" @click="emit('close')">
                  <Icon name="lucide:x" class="h-5 w-5" />
                </button>
              </div>
              <div class="overflow-y-auto px-6 py-6">
                <slot />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
