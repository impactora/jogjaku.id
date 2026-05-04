<template>
  <div
    class="bg-parchment text-ink font-sans min-h-screen selection:bg-terra selection:text-white flex flex-col relative overflow-x-hidden"
  >
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-md focus:bg-terra focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-ink/30"
    >
      Ke isi utama
    </a>
    <AppNavbar class="print:hidden" />

    <div id="main-content" class="flex-grow relative w-full">
      <slot />
    </div>

    <AppFooter class="print:hidden" />

    <AiGuideWidget class="print:hidden" />
    <AppToast class="print:hidden" />
  </div>
</template>
