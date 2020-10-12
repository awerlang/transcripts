<template>
  <select v-model="selected">
    <option
      disabled
      value="null"
    >
      Call
    </option>
    <option
      v-for="item in calls"
      :key="item.id"
      :value="item.id"
    >
      {{ description(item) }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CallData } from '@/utils/types';

export default defineComponent({
  name: 'Call',
  props: {
    calls: {
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
  methods: {
    formatDate(date: Date) {
      return new Intl.DateTimeFormat('en-US').format(date)
    },

    description(item: CallData) {
      return `${this.formatDate(new Date(item.call_start_time))} - ${item.customer[0].full_name}`
    }
  },
});
</script>

<style scoped lang="scss">
</style>
