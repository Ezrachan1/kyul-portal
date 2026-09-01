<script setup>
// The signature "Kyul line": a hairline that stands for the value chain
// (origin → design → capital → construction → operation). Reused for
// timelines, journeys, dividers and milestones.
defineProps({
  tone: { type: String, default: 'ink' }, // 'ink' on light, 'paper' on dark
  node: { type: Number, default: 10 }, // % position of the node; pass -1 to hide
})
</script>

<template>
  <div class="kyul-line relative" :class="tone === 'paper' && 'kyul-line--paper'" aria-hidden="true">
    <span v-if="node >= 0" class="kyul-line__node" :style="{ left: node + '%' }" />
  </div>
</template>
