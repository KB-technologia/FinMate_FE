<template>
  <div class="toast-container">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Toast from "./Toast.vue";

const toasts = ref([]);
let count = 0;

/**
 * @param {string} message - 표시할 메시지
 * @param {string} type - 'success' | 'error' | 'info' | 'warning'
 * @param {number} duration - 토스트 지속 시간(ms), 기본 4000
 */
const addToast = (message, type = "info", duration = 4000) => {
  const id = count++;
  toasts.value.push({ id, message, type });

  setTimeout(() => removeToast(id), duration);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

defineExpose({ addToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
