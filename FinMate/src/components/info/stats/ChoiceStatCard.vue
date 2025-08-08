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
        :disabled="readonly"
        @click="emit('update:modelValue', t)"
      >
        {{ t }}
      </button>
    </div>

    <transition name="expand">
      <div v-if="expanded" class="card-detail">
        <p class="detail-summary">{{ summary }}</p>
        <p class="detail-selected">
          <ScanSearch class="result-icon" />
          <strong class="result-text">{{ resultText }}</strong>
          <span v-if="rangeHint && rangeHint[modelValue]" class="hint">
            ({{ rangeHint[modelValue] }})
          </span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ScanSearch } from "lucide-vue-next";

const props = defineProps({
  title: String,
  chips: { type: Array, default: () => [] },
  modelValue: String,
  summary: String,
  descriptions: Object,
  rangeHint: Object,
  expanded: Boolean,
  readonly: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "toggle"]);

const resultText = computed(
  () => props.descriptions?.[props.modelValue] ?? props.modelValue
);
</script>

<style src="./styles/stat-card.css" scoped></style>
<style scoped>
.stat-card {
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

.stat-choice .result-icon {
  position: relative;
  top: 0.25rem;
  color: var(--color-primary-bluegray);
}
</style>
