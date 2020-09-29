<template>
  <div class="top-bar">
    Transcript Analyzer
  </div>
  <div class="filter-bar">
    <Agent :agents="agents" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Agent from './Agent.vue';

type AgentData = {
  agent_id: string;
  full_name: string;
  email: string;
}

export default defineComponent({
  name: 'Cockpit',
  components: {
    Agent,
  },
  data() {
      return {
          agents: [] as AgentData[],
      }
  },
  created() {
    fetch('/agents')
      .then(response => response.json())
      .then(data => this.agents = data)
  }
});
</script>

<style scoped lang="scss">
.top-bar {
    display: flex;
    height: 32px;
    padding: 12px;
    align-items: center;
    text-transform: uppercase;
    background-color: hsl(188, 77%, 18%);
    color: white;
}
.filter-bar {
    display: flex;
    height: 32px;
    padding: 4px;
    align-items: center;
    background-color: hsl(183, 1%, 86%);
}
</style>
