<template>
  <div class="toast" :class="type">
    <component :is="IconComponent" class="toast-icon" size="20" />
    <span class="message">{{ message }}</span>
    <button class="close-btn" @click="$emit('close')">✕</button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  CircleCheckBig,
  Ban,
  Info,
  TriangleAlert,
  Siren,
} from "lucide-vue-next";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "info", // 'success', 'error', 'info', 'warning', 'high-risk'
  },
});

const iconMap = {
  success: CircleCheckBig,
  error: Ban,
  info: Info,
  warning: TriangleAlert,
  highRisk1: Siren,
  highRisk2: Siren,
  highRisk3: Siren,
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
.toast.highRisk1 {
  background-color: var(--toast-bg-high-risk-1);
  border-color: var(--toast-icon-error);
}
.toast.highRisk2 {
  background-color: var(--toast-bg-high-risk-2);
  border-color: var(--toast-icon-error);
}
.toast.highRisk3 {
  background-color: var(--toast-bg-high-risk-3);
  border-color: var(--toast-icon-error);
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
.toast.highRisk1 .toast-icon,
.toast.highRisk2 .toast-icon,
.toast.highRisk3 .toast-icon,
.toast.highRisk .toast-icon {
  color: var(--toast-icon-high-risk);
}

.message {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-black);
  font-weight: 500;
  white-space: pre-line;
  line-height: 1.4;
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
