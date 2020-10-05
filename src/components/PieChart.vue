<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
  >
    <circle
      r="25%"
      cx="50%"
      cy="50%"
      fill="transparent"
      stroke="black"
      stroke-width="32"
      :stroke-dasharray="asPercent + ' 100'"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type Data = {
  value: number;
}

export default defineComponent({
  name: 'PieChart',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    asPercent(this: Data) {
      return Math.round(this.value * 100)
    }
  },
});
</script>

<style scoped lang="scss">
svg {
  border-radius: 50%;
  background: silver;
  transform: rotate(-90deg);
}
 </style>
