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
        <p class="level-line">
          현재 레벨: <strong class="level-value">{{ level }}</strong>
        </p>
        <p class="detail-selected">
          <ScanSearch class="result-icon" />
          <strong class="result-text">{{ description }}</strong>
        </p>

        <p v-if="extraHint" class="hint">{{ extraHint }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import UserStatBar from "@/components/allshared/UserStatBar.vue";
import { ScanSearch } from "lucide-vue-next";

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

<style src="./styles/stat-card.css" scoped></style>
<style scoped>
.stat-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
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

.level-line,
.level-value {
  font-size: 0.8rem;
  color: var(--color-red);
}

.level-line {
  font-weight: var(--font-weight-semibold);
  margin: 0.1rem 0 0.3rem;
}

.stat-bar .result-icon {
  position: relative;
  top: 0.25rem;
  color: var(--color-primary-bluegray);
}
</style>
