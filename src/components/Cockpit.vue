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
      class="matching-sensitivity font-size-sm"
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
        ref="transcript"
        v-if="transcript"
        title="Real"
        type="transcript"
        :script="transcript"
        :similarity="sensitivity"
        @select="transcriptSelected"
      />
      <Table
        ref="script"
        v-if="script"
        title="Expected"
        type="script"
        :script="script"
        :similarity="sensitivity"
        @select="scriptSelected"
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
import Table, { ScriptLine, TableInterface } from './Table.vue';
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
    scrollToMatchedSentence(line: number, source: ScriptLine[] | null, target: ScriptLine[] | null, table: TableInterface) {
      const sourceLine = source?.find(it => it.line === line)
      const targetLine = target?.find(it => it.matchingSentence === sourceLine?.sentence)
      if (targetLine) {
        table.scrollTo(targetLine.line)
      }
    },
    scriptSelected(line: number) {
      this.scrollToMatchedSentence(line, this.script, this.transcript, this.$refs.transcript as TableInterface)
    },
    transcriptSelected(line: number) {
      this.scrollToMatchedSentence(line, this.transcript, this.script, this.$refs.script as TableInterface)
    },
  },
  watch: {
    selected_agent_id() {
      this.selected_call_id = null
    },
    selected_call_id(value: string) {
      if (!value) {
        this.script = null
        this.transcript = null
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
          if (data instanceof BusinessError) {
            // TODO: present a message
            this.script = []
            this.transcript = []
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
    flex-wrap: wrap;
    flex-shrink: 0;
    min-height: 32px;
    padding: 4px;
    align-items: center;
    background-color: hsl(183, 1%, 86%);

    > * {
      margin: 6px 8px;
    }
}
.content {
  flex-grow: 1;
  overflow: auto;
  padding: 12px;
  background-color: hsl(183, 1%, 98%);
}
.container {
  height: 100%;
  background-color: hsl(183, 1%, 98%);

  @media (max-width: 768px - 1) {
    > * {
      margin: 8px 0;
    }
  }

  @media (min-width: 768px) {
    > * {
      margin: 0 8px;
    }
  }
}
.matching-sensitivity {
  --text-width: 4em;
}
.sensitivity-slider {
  --text-width: 4em;
  width: calc(100% - var(--text-width));
}
.sensitivity-value {
  display: inline-block;
  width: var(--text-width);
  font-weight: bold;
  text-align: right;
}
@media (max-width: 768px - 1) {
  .matching-sensitivity {
    width: 100%;
  }
}
@media (min-width: 768px) {
  .matching-sensitivity {
    margin-left: auto;
  }
  .sensitivity-slider {
    width: 150px;
    margin-left: 8px
  }
}
@media (min-width: 1024px) {
  .sensitivity-slider {
    width: 250px;
  }
}
</style>
