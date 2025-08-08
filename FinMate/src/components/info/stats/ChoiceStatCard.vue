<template>
  <div class="stat-card stat-choice" @click="emit('toggle')">
    <div class="choice-label">{{ title }}</div>

    <div class="choice-chips" @click.stop>
      <button
        v-for="t in chips"
        :key="t"
        type="button"
        class="chip"
        :class="{ selected: modelValue === t }"
        @click="emit('update:modelValue', t)"
      >
        {{ t }}
      </button>
    </div>

    <transition name="expand">
      <div v-if="expanded" class="card-detail">
        <p class="detail-summary">{{ summary }}</p>
        <p class="detail-selected">
          선택: <strong>{{ modelValue }}</strong>
          <span v-if="rangeHint && rangeHint[modelValue]" class="hint">
            ({{ rangeHint[modelValue] }})
          </span>
        </p>
        <p class="detail-text">{{ descriptions?.[modelValue] }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  chips: { type: Array, default: () => [] },
  modelValue: String,
  summary: String,
  descriptions: Object,
  rangeHint: Object,
  expanded: Boolean,
});
const emit = defineEmits(["update:modelValue", "toggle"]);
</script>

<style scoped>
.stat-card {
  width: 100%;
  background: var(--color-white);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.stat-choice {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.choice-label {
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
}
.choice-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.chip {
  min-width: 5rem;
  border: 1px solid var(--color-gray-lightest);
  color: var(--color-black);
  padding: 0.45rem 0.8rem;
  border-radius: 40rem;
  font-weight: var(--font-weight-semibold);
  font-size: 0.95rem;
}
.chip.selected {
  background: var(--color-primary-bluegray);
  color: var(--color-white);
  border-color: transparent;
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
  margin-left: 6px;
  font-size: 0.88rem;
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
