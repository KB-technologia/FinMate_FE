<template>
  <section class="right-panel" :class="{ scrollable: scroll }">
    <slot />
  </section>
</template>

<script setup>
defineProps({
  scroll: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.right-panel {
  flex-grow: 1;
  padding: 2rem;
  border: 3px solid var(--color-primary-bluegray);
  border-radius: 4px;
  min-height: 80vh;
  background-color: var(--color-white);
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  width: 75vw;
  max-width: 75vw;
  margin-left: 0.5rem;
}

.stats-right-panel {
  position: relative;
}

.scrollable {
  overflow-y: auto;
}
</style>
