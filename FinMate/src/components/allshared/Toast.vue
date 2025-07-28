<template>
  <div class="toast" :class="type">
    <component :is="IconComponent" class="toast-icon" size="20" />
    <span class="message">{{ message }}</span>
    <button class="close-btn" @click="$emit('close')">✕</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CircleCheckBig, Ban, Info, TriangleAlert } from 'lucide-vue-next';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'info', 'warning'
  },
});

const iconMap = {
  success: CircleCheckBig,
  error: Ban,
  info: Info,
  warning: TriangleAlert,
};

const IconComponent = computed(() => iconMap[props.type]);
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  min-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  gap: 12px;
}

.toast-icon {
  flex-shrink: 0;
}

.toast.success {
  background-color: var(--toast-bg-success);
}
.toast.error {
  background-color: var(--toast-bg-error);
}
.toast.info {
  background-color: var(--toast-bg-info);
}
.toast.warning {
  background-color: var(--toast-bg-warning);
}

.toast.success .toast-icon {
  color: var(--toast-icon-success);
}
.toast.error .toast-icon {
  color: var(--toast-icon-error);
}
.toast.info .toast-icon {
  color: var(--toast-icon-info);
}
.toast.warning .toast-icon {
  color: var(--color-orange);
}

.message {
  flex: 1;
  font-size: 14px;
  font-family: var(--font-wanted);
  font-weight: 700;
  color: var(--color-black);
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-dark-gray);
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
}
.close-btn:hover {
  opacity: 1;
}
</style>
