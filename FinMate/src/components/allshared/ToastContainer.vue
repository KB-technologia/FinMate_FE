<template>
  <div class="toast-container">
    <transition-group name="fade" tag="div">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        @close="removeToast(toast.id)"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 9vh;
  right: 1vw;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1vh;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
</style>

<script setup>
import { ref } from 'vue';
import Toast from './Toast.vue';

const toasts = ref([]);
let count = 0;

/**
 * @param {string} message - 표시할 메시지
 * @param {string} type - 'success' | 'error' | 'info' | 'warning'
 * @param {number} duration - 토스트 지속 시간(ms), 기본 4000
 */
const addToast = (message, type = 'info', duration = 4000) => {
  const id = count++;
  toasts.value.push({ id, message, type });

  setTimeout(() => removeToast(id), duration);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

defineExpose({ addToast });
</script>
