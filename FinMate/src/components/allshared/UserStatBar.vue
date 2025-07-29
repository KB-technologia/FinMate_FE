<template>
  <div class="bar-wrapper">
    <div class="bar-label">{{ label }}</div>
    <div
      class="bar-track"
      :class="{
        active: interactive && active,
        interactive: interactive,
      }"
      :style="{ borderColor: interactive && active ? color : 'transparent' }"
      @click="interactive && handleClick()"
    >
      <div
        class="bar-fill"
        :class="{ full: percent === 100 }"
        :style="{
          width: percent + '%',
          backgroundColor: color,
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: String,
  percent: Number,
  color: String,
  active: Boolean,
  interactive: Boolean, // MyPage에서는 true, MainPage에서는 false
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>

<style scoped>
.bar-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.5rem;
}

.bar-label {
  font-weight: bold;
  width: 100px;
  font-size: 1.25rem;
  white-space: nowrap;
}

.bar-track {
  flex: 1;
  height: 26px;
  background-color: var(--color-white);
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
  cursor: default;
}

.bar-track.interactive {
  cursor: pointer;
}

.bar-fill {
  height: 100%;
  border-radius: 14px 0 0 14px;
  transition: width 0.5s ease;
}

.bar-fill.full {
  border-radius: 14px;
}

.bar-track.active {
  border: 2px solid var(--color-survey-blue);
  padding: 2px;
}
</style>
