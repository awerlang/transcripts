<template>
  <Cockpit />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cockpit from './components/Cockpit.vue';

export default defineComponent({
  name: 'App',
  components: {
    Cockpit,
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
