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
    <div
      v-if="selected_call_id"
      class="margin-left-auto font-size-sm"
    >
      <span class="text-upper">Matching Sensitivity</span>
      <Slider
        class="sensitivity-slider"
        v-model="sensitivity"
      />
      <span class="sensitivity-value">{{ sensitivityPct }}%</span>
    </div>
  </div>

  <div class="content">
    <div
      v-if="selected_call_id"
      class="container"
    >
      <Table
        v-if="transcript"
        title="Real"
        type="transcript"
        :script="transcript"
        :similarity="sensitivity"
      />
      <Table
        v-if="script"
        title="Expected"
        type="script"
        :script="script"
        :similarity="sensitivity"
      />
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
import { AgentData, CallData, TranscriptData } from '@/utils/types'
import { BusinessError } from '@/utils/errors'
import Agent from './Agent.vue';
import Call from './Call.vue';
import BusinessPeopleLogo from './BusinessPeopleLogo.vue';
import Table, { ScriptLine } from './Table.vue';
import Slider from './Slider.vue';

type Data = {
  agents: AgentData[];
  all_calls: CallData[];
  selected_agent_id: string | null;
  selected_call_id: string | null;
  script: ScriptLine[] | null;
  transcript: ScriptLine[] | null;
  sensitivity: number;
}

function formatTime(seconds: number) {
  const sec = seconds % 60
  return `${Math.trunc(seconds / 60)}:${(sec < 10 ? '0' : '') + sec}`
}

function formatAgent(transcript: TranscriptData, channel: number, agents: AgentData[]): string | undefined {
  const agent = transcript.agent.find(it => it.channel_no === channel)
  if (agent) {
    return agents.find(it => it.id === agent.agent_id)?.full_name
  }
}

function formatCustomer(transcript: TranscriptData, channel: number): string | undefined {
  const customer = transcript.customer.find(it => it.channel_no === channel)
  if (customer) {
    return customer.full_name
  }
}

function formatSpeaker(transcript: TranscriptData, channel: number, agents: AgentData[]): string {
  const name = formatAgent(transcript, channel, agents) || formatCustomer(transcript, channel) || ''
  return name.split(' ')[0]
}

export default defineComponent({
  name: 'Cockpit',
  components: {
    Agent,
    Call,
    BusinessPeopleLogo,
    Table,
    Slider,
  },
  data(): Data {
    return {
      agents: [],
      all_calls: [],
      selected_agent_id: null,
      selected_call_id: null,
      script: null,
      transcript: null,
      sensitivity: 0,
    }
  },
  computed: {
    calls(this: Data) {
      const agent_id = this.selected_agent_id
      return this.all_calls.filter(it => it.agent.some(ag => ag.agent_id === agent_id))
        .sort((a, b) => b.call_start_time.localeCompare(a.call_start_time))
    },
    sensitivityPct(this: Data) {
      return (this.sensitivity * 100).toFixed(0)
    },
  },
  methods: {
    parseTranscript(data: TranscriptData) {
      this.script = data.script.map(line => {
        return {
          line: line.order + 1,
          speaker: 'Rep.',
          sentence: line.sentence,
          matchingSentence: line.matching_sentence,
          similarity: line.similarity,
        }
      })
      this.transcript = data.transcript.map(line => {
        return {
          line: line.order + 1,
          time: formatTime(line.timeFrom),
          speaker: formatSpeaker(data, line.channel, this.agents),
          sentence: line.sentence,
          matchingSentence: line.matching_sentence,
          similarity: line.similarity,
        }
      })
    },
  },
  watch: {
    selected_agent_id() {
      this.selected_call_id = null
    },
    selected_call_id(value: string) {
      this.script = null
      this.transcript = null
      if (!value) {
        return
      }

      this.sensitivity = 0.38

      fetch(`/calls/${value}/transcript`)
        .then<TranscriptData | BusinessError>(response => {
          if (!response.ok) {
            return new BusinessError('Transcript not available yet')
          }
          return response.json() as Promise<TranscriptData>
        })
        .then(data => {
          if (data instanceof Error) {
            // TODO: present a message
            return
          }
          this.parseTranscript(data)
        })
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
    flex-shrink: 0;
    height: 32px;
    padding: 12px;
    align-items: center;
    text-transform: uppercase;
    background-color: hsl(188, 77%, 18%);
    color: white;
}
.filter-bar {
    display: flex;
    flex-shrink: 0;
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
  overflow: auto;
  padding: 24px 12px;
  background-color: hsl(183, 1%, 98%);
}
.container {
  height: 100%;
  background-color: hsl(183, 1%, 98%);

  > :not(:first-child) {
    margin-left: 12px;
  }

  > :not(:last-child) {
    margin-right: 12px;
  }
}
.sensitivity-slider {
  width: 200px;
}
.sensitivity-value {
  display: inline-block;
  width: 4em;
  font-weight: bold;
  text-align: right;
}
</style>
