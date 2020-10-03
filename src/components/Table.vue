<template>
  <div class="chrome container-stack-centered">
    <div class="header">
      <div>{{ title }}</div>
      <div>{{ matchingPct }}</div>
    </div>
    <div class="content font-size-sm">
      <ol>
        <li class="item-container list-header">
          <div v-if="isScript">
            Line
          </div>
          <div v-if="isTranscript">
            Time
          </div>
          <div>Speaker</div>
          <div>Sentence</div>
        </li>

        <li>
          <hr>
        </li>

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
          <div>{{ item.sentence }}</div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export type ScriptLine = {
  line: number;
  time?: string;
  speaker: string;
  sentence: string;
  matchingSentence: string;
}

type Data = {
  title: string;
  script: ScriptLine[];
  type: 'script' | 'transcript';
}

function matching(script: ScriptLine[]) {
  const total = script.length
  const matches = script.reduce((count, item) => count + (item.matchingSentence ? 1 : 0), 0)
  return Math.round(matches / total * 100)
}

export default defineComponent({
  name: 'Table',
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
  },
  computed: {
    matching(this: Data) {
      return matching(this.script)
    },
    matchingPct(this: Data) {
      return `${matching(this.script)}%`
    },
    isScript(this: Data) {
      return this.type === 'script'
    },
    isTranscript(this: Data) {
      return this.type === 'transcript'
    },
  },
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
.header {
    display: flex;
    padding: 8px;
    font-weight: bold;

    :first-child {
        flex-grow: 1;
    }
}
.content {
    flex-grow: 1;
    width: 100%;
    background-color: hsl(183, 1%, 99%);

    ol {
        list-style: none;
        margin: 0;
        padding: 0;
    }
}
.item-container {
    display: grid;
    grid-template-columns: 4em 6em auto;
    padding: 8px;
}
.list-header {
    font-weight: bold;
}
</style>
