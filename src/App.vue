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
html, 
body,
#app {height: 100%; padding: 0; margin: 0; width: 100%;}
#app {display: flex; flex-direction: column;}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.text-center {
  text-align: center;
}

.parent-margin-bottom-md > * {
  margin-bottom: 12px;
}

.container-stack-centered {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
}

.font-size-sm {
  font-size: small;
}
</style>
