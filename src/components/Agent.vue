<template>
  <select v-model="selected">
    <option
      disabled
      value="null"
    >
      Agent
    </option>
    <option
      v-for="item in agents"
      :key="item.id"
      :value="item.id"
    >
      {{ item.full_name }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Agent',
  props: {
    agents: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    selected: {
      get(): string {
        return this.modelValue
      },
      set(value: string) {
        this.$emit('update:modelValue', value)
      }
    },
  },
});
</script>

<style scoped lang="scss">
</style>
