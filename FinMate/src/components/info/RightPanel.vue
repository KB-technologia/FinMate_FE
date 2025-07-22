<template>
  <section class="right-panel">
    <slot />
  </section>
</template>

<style scoped>
.right-panel {
  flex-grow: 1;
  padding: 2rem;
  border: 3px solid var(--color-primary-bluegray);
  border-radius: 4px;
  min-height: 80vh;
  background-color: var(--color-white);
}
</style>
