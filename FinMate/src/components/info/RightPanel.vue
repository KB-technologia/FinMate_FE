<template>
  <section
    class="right-panel"
    :class="{ scrollable: scroll, 'no-padding': noPadding }"
  >
    <slot />
  </section>
</template>

<script setup>
defineProps({
  scroll: { type: Boolean, default: true },
  noPadding: { type: Boolean, default: false },
});
</script>

<style scoped>
.right-panel {
  flex-grow: 1;
  padding: 2rem;
  border-radius: 4px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  width: 75vw;
  max-width: 75vw;
  margin-left: 0.5rem;
}

.right-panel.no-padding {
  padding: 0;
}

.scrollable {
  overflow-y: auto;
}
</style>
