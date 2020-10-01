<template>
  <div class="top-bar">
    Transcript Analyzer
  </div>
  <div class="filter-bar">
    <Agent
      :agents="agents"
      v-model="selected_agent_id"
    />
    <Call
      :calls="calls"
      v-model="selected_call_id"
    />
  </div>

  <div class="content">
    <div
      v-if="selected_call_id"
      class="container"
    >
      <Table title="Real" />
      <Table title="Expected" />
    </div>

    <div
      v-else
      class="container-stack-centered parent-margin-bottom-md text-center"
    >
      <BusinessPeopleLogo />
      <div><strong>Selection pending</strong></div>
      <div>Select a call from top menu and a transcript analysis will be shown here</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AgentData, CallData } from '@/utils/types'
import Agent from './Agent.vue';
import Call from './Call.vue';
import BusinessPeopleLogo from './BusinessPeopleLogo.vue';
import Table from './Table.vue';

type Data = {
  agents: AgentData[];
  all_calls: CallData[];
  selected_agent_id: string | null;
  selected_call_id: string | null;
}

export default defineComponent({
  name: 'Cockpit',
  components: {
    Agent,
    Call,
    BusinessPeopleLogo,
    Table,
  },
  data(): Data {
    return {
      agents: [],
      all_calls: [],
      selected_agent_id: null,
      selected_call_id: null,
    }
  },
  computed: {
    calls(this: Data) {
      const agent_id = this.selected_agent_id
      return this.all_calls.filter(it => it.agent.some(ag => ag.agent_id === agent_id))
    }
  },
  watch: {
    selected_agent_id() {
      this.selected_call_id = null
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
.content {
  flex-grow: 1;
  padding: 12px;
  background-color: hsl(183, 1%, 98%);
}
.container {
  height: 100%;
  background-color: hsl(183, 1%, 98%);

  > * {
    flex-grow: 1;
  }

  > :not(:first-child) {
    margin-left: 12px;
  }

  > :not(:last-child) {
    margin-right: 12px;
  }
}
</style>
