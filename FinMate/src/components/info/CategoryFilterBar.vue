<template>
  <div class="category-tab-bar-container">
    <div class="category-tab-bar">
      <button
        v-for="category in categories"
        :key="category.value"
        :class="{ active: modelValue === category.value }"
        @click="$emit('update:modelValue', category.value)"
      >
        {{ category.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  categories: {
    type: Array,
    required: true,
  },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.category-tab-bar-container {
  width: 100%;
  max-width: 47rem;
  border: none;
}

.category-tab-bar {
  display: flex;
  width: 100%;
  border-radius: 0.25rem;
  overflow: hidden;
}

.category-tab-bar button {
  flex: 1;
  padding: 0.8rem 0;
  font-size: 1rem;
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border: none;
  transition: background-color 0.2s ease;
  border-right: 0.0625rem solid var(--color-white);
}

.category-tab-bar button.active {
  background-color: var(--color-primary-yellow);
  color: var(--color-black);
  font-weight: var(--font-weight-bold);
}
</style>
