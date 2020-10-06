<template>
  <div
    ref="parent"
    class="slider"
    :style="{ '--value': asPercent + '%' }"
    @mousedown.left="mousedown"
    @keydown.left="arrowLeft"
    @keydown.right="arrowRight"
  >
    <div class="slider-left" />
    <div class="slider-right" />
    <div
      class="slider-knob"
      tabindex="0"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { clamp, compareFloat } from '@/utils/common';

type Data = {
  selected: number;
}

export default defineComponent({
  name: 'Slider',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
  },
  computed: {
    selected: {
      get(): number {
        return this.modelValue
      },
      set(value: number) {
        const newValue = clamp(0, 1, value)
        if (!compareFloat(newValue, this.selected)) {
          this.$emit('update:modelValue', newValue)
        }
      }
    },
    asPercent(this: Data) {
      return Math.round(this.selected * 100)
    }
  },
  methods: {
    mousedown(event: MouseEvent) {
      const parentEl = this.$refs.parent as HTMLElement
      const newValue = event.clientX - parentEl.offsetLeft
      const widthPerUnit = parentEl.clientWidth / 100
      this.selected = newValue / widthPerUnit / 100
    },
    arrowLeft() {
      this.selected = this.selected - 0.01
    },
    arrowRight() {
      this.selected = this.selected + 0.01
    },
  }
});
</script>

<style scoped lang="scss">
.slider {
    --value: 20%;

    display: inline-block;
    position: relative;
    margin: 0 10px;
}
.slider-left, .slider-right {
    position: absolute;
    top: 4px;
    border-top: solid 2px;
}
.slider-left {
    width: var(--value);
    border-top-color: var(--active-color);
}
.slider-right {
    right: 0;
    width: calc(100% - var(--value));
    border-top-color: var(--inactive-color);
}
.slider-knob {
    position: relative;
    left: calc(var(--value) - 5px);
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: var(--active-color);
}
</style>
