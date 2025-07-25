<template>
  <div>
    <router-view />
    <ToastContainer ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ToastContainer from "@/components/allshared/ToastContainer.vue";
import { setToastInstance } from "@/composables/toastManager";

const currentRoute = useRoute();
const toastRef = ref(null);

onMounted(() => {
  if (toastRef.value) {
    setToastInstance(toastRef.value);
  }
});
</script>

<style>
@import "@/styles/fonts.css";

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
