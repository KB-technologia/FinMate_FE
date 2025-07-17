<template>
  <div class="container">
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
