<template>
  <section class="right-panel">
    <slot />
  </section>
</template>

<script setup>
// 이 컴포넌트는 내용 삽입을 위한 래퍼입니다.
</script>

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
