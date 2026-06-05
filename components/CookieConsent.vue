<script setup>
const consent = useState('cookie-consent', () => 'pending')

onMounted(() => {
  consent.value = localStorage.getItem('kyul-cookie-consent') || 'pending'
})

function set(choice) {
  consent.value = choice
  localStorage.setItem('kyul-cookie-consent', choice)
}
</script>

<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition duration-500 ease-out-expo" enter-from-class="translate-y-6 opacity-0"
      leave-active-class="transition duration-300" leave-to-class="translate-y-6 opacity-0"
    >
      <div v-if="consent === 'pending'" class="no-print fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md">
        <div class="rounded-2xl border border-ink/10 bg-white/95 p-5 shadow-card backdrop-blur">
          <div class="flex items-start gap-3">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700">
              <Icon name="lucide:cookie" class="h-5 w-5" />
            </span>
            <div>
              <p class="text-sm font-semibold text-forest-950">We value your privacy</p>
              <p class="mt-1 text-sm leading-relaxed text-forest-900/65">
                We use essential cookies to run this site and optional analytics to understand how it’s used. See our
                <NuxtLink to="/privacy#cookies" class="underline decoration-gold-400/60 underline-offset-2">cookie policy</NuxtLink>.
              </p>
            </div>
          </div>
          <div class="mt-4 flex gap-2.5">
            <button class="btn-primary flex-1 !py-2.5 text-[0.82rem]" @click="set('accepted')">Accept all</button>
            <button class="btn-outline flex-1 !py-2.5 text-[0.82rem]" @click="set('essential')">Essential only</button>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>
