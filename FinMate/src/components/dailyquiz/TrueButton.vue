<script setup>
const emit = defineEmits(['submitAnswer']);

function TrueClick() {
  emit('submitAnswer', true);
}
</script>
<template>
  <button class="TrueButton" @click="TrueClick">O</button>
</template>
<style scoped>
.TrueButton {
  background-color: rgba(173, 216, 230, 0.6);
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  width: 5vw;
  height: 10vh;
}
</style>
