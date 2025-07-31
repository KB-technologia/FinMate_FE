<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <p class="modal-text">{{ text }}</p>
      <div class="modal-buttons">
        <button @click="() => emit('confirm', false)">
          {{ leftButtonText }}
        </button>
        <button @click="() => emit('confirm', true)">
          {{ rightButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  leftButtonText: { type: String, required: true },
  rightButtonText: { type: String, required: true },
});

const emit = defineEmits(['confirm']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.modal-text {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
}

.modal-buttons button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.modal-buttons button:first-child {
  background-color: #ccc;
}

.modal-buttons button:last-child {
  background-color: #4caf50;
  color: white;
}
</style>
