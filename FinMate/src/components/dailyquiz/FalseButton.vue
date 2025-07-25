<script setup>
const emit = defineEmits(['submitAnswer']);

function falseClick() {
  emit('submitAnswer', false);
}
</script>
<template>
  <button class="FalseButton" @click="falseClick">X</button>
</template>
<style scoped>
.FalseButton {
  background-color: rgba(231, 36, 36, 0.21);
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  width: 5vw;
  height: 10vh;
}
</style>
