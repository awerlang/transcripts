<template>
  <div class="chrome container-stack-centered">
    <div class="header">
      <div class="flex-grow">
        {{ title }}
      </div>
      <div>{{ matchingPct }}</div>
      <PieChart
        class="pie-chart"
        :value="matching"
      />
    </div>

    <div class="content font-size-sm">
      <div class="item-container list-header">
        <div v-if="isScript">
          Line
        </div>
        <div v-if="isTranscript">
          Time
        </div>
        <div>Speaker</div>
        <div>Sentence</div>
      </div>

      <ol class="scrollable-area">
        <li
          class="item-container"
          v-for="item in script"
          :key="item.order"
        >
          <div v-if="isScript">
            {{ item.line }}
          </div>
          <div v-if="isTranscript">
            {{ item.time }}
          </div>
          <div>{{ item.speaker }}</div>
          <div
            class="sentence-column"
            :class="{ 'sentence-highlight': isSimilar(item) }"
            :title="getTooltip(item)"
          >
            {{ item.sentence }}
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import PieChart from './PieChart.vue';

export type ScriptLine = {
  line: number;
  time?: string;
  speaker: string;
  sentence: string;
  matchingSentence: string;
  similarity: number;
}

type Data = {
  title: string;
  script: ScriptLine[];
  type: 'script' | 'transcript';
  similarity: number;
}

function isSimilar(line: ScriptLine, threshold: number): boolean {
  return line.matchingSentence ? line.similarity >= threshold : false
}

function matching(script: ScriptLine[], threshold: number): number {
  const total = script.length
  const matches = script.reduce((count, item) => count + (isSimilar(item, threshold) ? 1 : 0), 0)
  return matches / total
}

export default defineComponent({
  name: 'Table',
  components: {
    PieChart,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['script', 'transcript'].includes(value),
    },
    script: {
      type: Array,
      required: true,
    },
    similarity: {
      type: Number,
      default: 0.38,
    },
  },
  computed: {
    matching(this: Data) {
      return matching(this.script, this.similarity)
    },
    matchingPct(this: Data) {
      const value = Math.round(matching(this.script, this.similarity) * 100)
      return `${value}%`
    },
    isScript(this: Data) {
      return this.type === 'script'
    },
    isTranscript(this: Data) {
      return this.type === 'transcript'
    },
  },
  methods: {
    isSimilar(item: ScriptLine): boolean {
      return isSimilar(item, this.similarity)
    },
    getTooltip(item: ScriptLine): string {
      if (!this.isSimilar(item)) {
        return ''
      }
      return `${item.similarity * 100}% matching with line "${item.matchingSentence}"`
    },
  }
});
</script>

<style scoped lang="scss">
.chrome {
    --color: hsl(183, 1%, 85%);
    border: solid 2px var(--color);
    border-radius: 4px;
    box-shadow: 2px 2px 2px var(--color);
    background-color: var(--color);

    > * {
        width: 100%;
    }
}
.pie-chart {
  width: 24px;
}
.header {
    display: flex;
    padding: 4px 0;
    font-weight: bold;

    > *:first-child {
      margin-left: 18px;
    }

    > *:last-child {
      margin-left: 8px;
      margin-right: 18px;
    }
}
.content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    background-color: hsl(183, 1%, 99%);
}
.item-container {
    display: grid;
    grid-template-columns: 4em 6em auto;
    margin: 0 16px 16px;

    > * {
      padding: 4px;
    }
}
.list-header {
    font-weight: bold;
    border-bottom: solid 1px #ccc;
    margin-top: 12px;
    padding-bottom: 8px;
}
.scrollable-area {
    flex: 1;
    overflow: auto;
    list-style: none;
    margin: 0;
    padding: 0;
}
.sentence-highlight {
    background-color: var(--color);
}
</style>
