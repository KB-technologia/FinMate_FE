<template>
  <div>
    <router-view />
    <ToastContainer ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { setToast, setToastInstance } from "@/composables/toastManager";
import ToastContainer from "@/components/allshared/ToastContainer.vue";
import { useAuthStore } from "@/api/auth/authStore";

const router = useRouter();
const toastRef = ref(null);

onMounted(() => {
  if (toastRef.value) {
    setToastInstance(toastRef.value);
  }

  const authStore = useAuthStore();
  const isValid = authStore.initialize();

  if (!isValid) {
    setToast(
      "세션이 만료되어 로그아웃되었습니다. 다시 로그인해주세요",
      "warning"
    );
    router.replace("/login");
  }
});
</script>

<style>
@import "@/styles/reset.css";
@import "@/styles/fonts.css";

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
