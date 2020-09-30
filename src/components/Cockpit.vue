<template>
  <div class="top-bar">
    Transcript Analyzer
  </div>
  <div class="filter-bar">
    <Agent :agents="agents" />
    <Call :calls="all_calls" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AgentData, CallData } from '@/utils/types'
import Agent from './Agent.vue';
import Call from './Call.vue';

type Data = {
  agents: AgentData[];
  all_calls: CallData[];
}

export default defineComponent({
  name: 'Cockpit',
  components: {
    Agent,
    Call,
  },
  data(): Data {
    return {
      agents: [] as AgentData[],
      all_calls: [] as CallData[],
    }
  },
  created() {
    fetch('/agents')
      .then(response => response.json())
      .then(data => this.agents = data)
    fetch('/calls')
      .then(response => response.json())
      .then(data => this.all_calls = data)
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

    > * {
      margin-left: 8px;
    }
}
</style>
