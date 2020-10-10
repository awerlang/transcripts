<template>
  <div
    ref="parent"
    class="slider"
    :style="{ '--value': asPercent + '%' }"
    @keydown.left="arrowLeft"
    @keydown.right="arrowRight"
    @mousemove="sliderMousemove"
  >
    <div
      class="slider-left"
      @mousedown.left="sliderMousedown"
    />
    <div
      class="slider-right"
      @mousedown.left="sliderMousedown"
    />
    <div
      class="slider-knob"
      tabindex="0"
      @mousedown.left="knobMousedown"
      @mouseup.left="knobMouseup"
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
  data() {
    return {
      knobPressed: false,
    }
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
    updateFromMouse(event: MouseEvent) {
      const parentEl = this.$refs.parent as HTMLElement
      const newValue = event.clientX - parentEl.offsetLeft
      const widthPerUnit = parentEl.clientWidth / 100
      this.selected = newValue / widthPerUnit / 100
    },
    sliderMousedown(event: MouseEvent) {
      this.updateFromMouse(event)
    },
    sliderMousemove(event: MouseEvent) {
      if (this.knobPressed) {
        this.updateFromMouse(event)
      }
    },
    knobMousedown() {
      this.knobPressed = true
    },
    knobMouseup() {
      this.knobPressed = false
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
}
.slider-left, .slider-right {
    position: absolute;
    top: 4px;
    height: 1px;
    border: solid 1px var(--color);
    background-color: var(--color);
}
.slider-left {
    --color: var(--active-color);
    width: var(--value);
}
.slider-right {
    --color: var(--inactive-color);
    right: 0;
    width: calc(100% - var(--value));
}
.slider-knob {
    position: relative;
    left: calc(var(--value) - 5px);
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: var(--active-color);

    &:hover {
      background: var(--active-hover-color);
    }
}
</style>
