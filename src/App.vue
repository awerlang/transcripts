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

  --active-color: hsl(188, 77%, 18%);
  --active-hover-color: hsl(188, 77%, 36%);
  --inactive-color: darkgray;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #777;
}

.text-center {
  text-align: center;
}

.parent-margin-bottom-md > * {
  margin-bottom: 12px;
}

.margin-left-auto {
  margin-left: auto !important;
}

.container-stack-centered {
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-basis: 100%;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  flex-wrap: wrap;
}

.flex-grow {
  flex-grow: 1;
}

.font-size-sm {
  font-size: small;
}

.text-upper {
  text-transform: uppercase;
}
</style>
