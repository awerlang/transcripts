<template>
  <div class="chrome container-stack-centered">
    <div class="header">
      <div>{{ title }}</div>
      <div>35%</div>
      <div>pie</div>
    </div>
    <div class="content font-size-sm">
      <ol>
        <li class="item-container list-header">
          <div>Time</div>
          <div>Speaker</div>
          <div>Sentence</div>
        </li>

        <li>
          <hr>
        </li>

        <li class="item-container">
          <div>0:15</div>
          <div>Inigo</div>
          <div>Sentence</div>
        </li>

        <li class="item-container">
          <div></div>
          <div>Rugen</div>
          <div>Hi.</div>
        </li>

        <li class="item-container">
          <div>0:20</div>
          <div>Inigo</div>
          <div>Hi.</div>
        </li>

        <li class="item-container">
          <div>0:24</div>
          <div>Rugen</div>
          <div>Yes, it's Count Rugen speaking.</div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Table',
  props: {
    title: {
      type: String,
      required: true,
    },
    script: {
      type: Array,
      required: true,
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
