<template>
  <div class="gacha-modal" @click.self="emit('close')">
    <div class="modal-content">
      <GachaDrawStep @confirm="(url) => emit('confirm', url)" />
    </div>
  </div>
</template>

<script setup>
import GachaDrawStep from "./GachaDrawStep.vue";
const emit = defineEmits(["confirm", "close"]);
</script>

<style scoped>
.gacha-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  width: 90vw;
  max-width: 50vw;
  min-height: 32rem;
  padding: 1.2rem;
  border-radius: 1.5rem;
  background-color: var(--color-modal-bg);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}
</style>
