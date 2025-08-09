<template>
  <div
    class="stat-card stat-choice"
    @click="emit('toggle')"
    :style="{
      borderLeft: `4px solid var(--infocard-color-${(index ?? 0) + 1})`,
      '--chip-selected-bg': `var(--infocard-color-${(index ?? 0) + 1})`,
    }"
  >
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
  index: Number,
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: var(--color-black);
  padding: 0.45rem 0.8rem;
  border-radius: 40rem;
  font-weight: var(--font-weight-semibold);
  font-size: 0.95rem;
}
.chip.selected {
  background: var(--chip-selected-bg);
  color: var(--chip-selected-color, var(--color-white));
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-choice .result-icon {
  position: relative;
  top: 0.25rem;
  color: var(--color-primary-bluegray);
}
</style>
