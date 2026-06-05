<script setup>
definePageMeta({ layout: 'dashboard', title: 'Module' })

const route = useRoute()
const MODULES = {
  finance: { label: 'Finance & Accounting', icon: 'lucide:wallet' },
  hr: { label: 'HR & Payroll', icon: 'lucide:users' },
  procurement: { label: 'Procurement & Supply Chain', icon: 'lucide:shopping-cart' },
  plm: { label: 'Project Lifecycle', icon: 'lucide:kanban' },
  legal: { label: 'Legal & Compliance', icon: 'lucide:scale' },
  kpis: { label: 'Executive KPI Centre', icon: 'lucide:gauge' },
}
const mod = computed(() => MODULES[route.params.key] || { label: 'Module', icon: 'lucide:box' })
useHead({ title: () => `${mod.value.label} · Group Portal` })
</script>

<template>
  <div class="mx-auto max-w-xl py-12 text-center">
    <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 text-forest-700"><Icon :name="mod.icon" class="h-8 w-8" /></span>
    <h1 class="h-display mt-6 text-2xl text-forest-950">{{ mod.label }}</h1>
    <p class="mt-3 text-forest-900/65">This module has been enabled and is being prepared for your team. Our team will complete its configuration with you during onboarding.</p>
    <NuxtLink to="/dashboard" class="btn-outline mt-7"><Icon name="lucide:arrow-left" class="h-4 w-4" /> Back to overview</NuxtLink>
  </div>
</template>
