<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {},
  setup() {
    const currentRoute = useRoute();
    return { currentRoute };
  },
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
