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
  },
  data() {
    return {
      selected: null,
    }
  },
});
</script>

<style scoped lang="scss">
</style>
