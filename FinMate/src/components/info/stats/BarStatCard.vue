<template>
  <div class="stat-card stat-bar" @click="emit('toggle')">
    <UserStatBar
      :label="label"
      :percent="percent"
      :color="color"
      :active="expanded"
      :interactive="true"
    />
    <transition name="expand">
      <div v-if="expanded" class="card-detail">
        <p class="detail-summary">{{ summary }}</p>
        <p class="detail-selected">
          현재 레벨: <strong>{{ level }}</strong>
          <span v-if="percentByLevel" class="hint">
            허용 손실 약 {{ percentByLevel[level] }}%
          </span>
        </p>
        <p class="detail-text">{{ description }}</p>
        <p v-if="extraHint" class="hint">{{ extraHint }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import UserStatBar from "@/components/allshared/UserStatBar.vue";

const props = defineProps({
  label: String,
  percent: Number,
  color: String,
  summary: String,
  level: [Number, String],
  description: String,
  percentByLevel: Object,
  extraHint: String,
  expanded: Boolean,
});
const emit = defineEmits(["toggle"]);
</script>

<style scoped>
.stat-card {
  width: 100%;
  background: var(--color-white);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.stat-bar :deep(.bar-wrapper) {
  margin: 0;
}
.stat-bar :deep(.bar-label) {
  width: 5.5rem;
  font-size: 1.1rem;
}
.stat-bar :deep(.bar-track) {
  background-color: var(--color-bar-track);
}
.card-detail {
  margin-top: 0.6rem;
  border-top: 1.5px dashed var(--color-light-gray);
  padding-top: 0.6rem;
}
.detail-summary {
  color: var(--color-dark-gray);
  font-size: 0.92rem;
  margin-bottom: 0.25rem;
}
.detail-selected {
  margin: 0.1rem 0 0.3rem;
}
.detail-text {
  line-height: 1.5;
}
.hint {
  color: var(--color-red);
  margin-left: 0.3rem;
  font-size: 0.8rem;
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.22s ease, opacity 0.22s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 12.5rem;
  opacity: 1;
}
</style>
