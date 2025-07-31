<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <img class="modal-image" v-if="images" :src="images" alt="Modal Image" />
      <p class="modal-text">{{ firsttext }}</p>
      <p class="modal-text2" v-if="secondtext">{{ secondtext }}</p>
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
  firsttext: { type: String, required: true },
  secondtext: { type: String, required: false, default: '' },
  leftButtonText: { type: String, required: true },
  rightButtonText: { type: String, required: true },
  images: { type: String, required: false, default: '' },
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
  background-color: var(--color-modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 50vw;
  height: 50vh;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  background: var(--color-modal-bg);
  padding: 2rem;
  border-radius: 2vh;
  text-align: center;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}
.modal-image {
  width: 10vw;
  height: 10vw;
  margin-bottom: 1rem;
}

.modal-text {
  white-space: pre-line;
  font-size: 1.8rem;
}
.modal-text2 {
  white-space: pre-line;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: var(--color-red);
}

.modal-buttons {
  width: 100%;
  display: flex;
  justify-content: space-around;
  gap: 5rem;
}

.modal-buttons button {
  width: 12rem;
  height: 4rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 1vh;
  cursor: pointer;
  font-weight: bold;
  color: var(--color-black);
  transition: transform 0.2s ease;
}

.modal-buttons button:first-child {
  background-color: var(--color-modal-bg);
  border: 0.3vh solid var(--color-light-gray);
}
.modal-buttons button:hover {
  background-color: var(--color-light-gray);
  color: var(--color-white);
  transform: translateY(-0.2rem);
}

.modal-buttons button:last-child {
  background-color: var(--color-red);
}
.modal-buttons button:last-child:hover {
  color: var(--color-white);
  transform: translateY(-0.2rem);
}
</style>
