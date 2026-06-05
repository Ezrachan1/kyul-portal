<script setup>
// The Kyul emblem — a keystone monogram. Crisp at any size.
const gid = useId()
</script>

<template>
  <svg viewBox="0 0 64 64" role="img" aria-label="Kyul" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient :id="gid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1c5c4b" />
        <stop offset="1" stop-color="#0a221d" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="15" :fill="`url(#${gid})`" />
    <rect x="6" y="6" width="52" height="52" rx="11" fill="none" stroke="#c8a454" stroke-width="1.25" opacity="0.85" />
    <text
      x="32" y="34" text-anchor="middle" dominant-baseline="central"
      font-family="Fraunces, Georgia, serif" font-size="38" font-weight="600" fill="#d3ab51"
    >K</text>
  </svg>
</template>
