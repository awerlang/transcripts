<template>
  <select v-model="selected">
    <option disabled>Agent</option>
    <option v-for="item in agents" :key="item.agent_id" :value="item.agent_id">{{item.full_name}}</option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Agent',
  props: {
    agents: Array,
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
