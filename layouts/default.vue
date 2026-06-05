<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <AppHeader />
    <main class="flex-1 pt-16 sm:pt-[4.75rem]">
      <slot />
    </main>
    <AppFooter />
    <CookieConsent />
  </div>
</template>
