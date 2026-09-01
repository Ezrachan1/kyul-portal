<script setup>
// Decorative topographic contours — the "East African terrain" motif.
// Purely ornamental: always aria-hidden, always pointer-events-none.
defineProps({
  tone: { type: String, default: 'paper' }, // 'paper' (on dark) | 'ink' (on light)
  opacity: { type: Number, default: 0.1 },
})
</script>

<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full"
    :style="{ opacity }"
    viewBox="0 0 1440 720"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
  >
    <g :stroke="tone === 'paper' ? '#f8f5ee' : '#12201c'" stroke-width="1">
      <path d="M-60 620C140 560 260 640 430 600S700 460 900 500s330 150 470 110 210-140 190-260" />
      <path d="M-40 560C160 500 300 580 460 545S710 420 905 455s315 135 450 100 195-125 180-235" />
      <path d="M-20 500C180 445 330 520 490 490S725 385 910 415s295 120 430 90 180-110 170-210" />
      <path d="M0 440C200 390 360 460 520 435S740 350 915 375s280 105 410 80 165-95 160-185" />
      <path d="M40 380C220 340 390 400 545 380S755 315 920 335s260 90 390 70 150-80 148-160" />
      <path d="M90 320C250 290 420 340 570 325S770 280 925 295s240 75 370 60 135-65 137-135" />
      <path d="M150 265C290 245 445 285 595 272S785 245 930 258s220 60 348 48 122-52 125-112" />
      <path d="M220 215C330 202 470 232 618 222S800 212 935 222s200 47 327 38 108-40 113-92" />
    </g>
  </svg>
</template>
