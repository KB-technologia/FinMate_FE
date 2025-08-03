<template>
  <div class="gacha-modal" @click.self="$emit('close')">
    <div class="modal-content result-step">
      <h2 class="title">운명처럼 만난 친구는 누구일까요?</h2>
      <img
        :src="selectedEgg.url"
        :class="['egg-img', { 'spinning-egg': !isRevealed }]"
      />

      <transition name="fade">
        <div v-if="isRevealed" class="character-wrapper" key="character">
          <img :src="character.image" class="character-img" />
          <p class="character-name">{{ character.name }}</p>
        </div>
      </transition>

      <transition name="fade">
        <button v-if="isRevealed" class="close-btn" @click="$emit('close')">
          <Rocket class="icon" />
          함께 모험 떠나기
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Rocket } from "lucide-vue-next";

defineProps({
  selectedEgg: {
    type: Object,
    required: true,
  },
  character: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

const isRevealed = ref(false);

onMounted(() => {
  setTimeout(() => {
    isRevealed.value = true;
  }, 2000);
});
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
  height: 32rem;
  padding: 1.2rem;
  border-radius: 1.5rem;
  background-color: var(--color-modal-bg);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  overflow: hidden;
}

.result-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  margin-top: 0.8rem;
  font-size: 1.7rem;
  font-weight: var(--font-weight-bold);
}

.egg-img {
  width: 8rem;
  margin: 1.5rem 0;
  animation: pop 1s ease;
}

.character-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 10rem;
  justify-content: center;
  transition: opacity 0.6s ease;
}

.character-img {
  width: 10rem;
  animation: fadeIn 1s ease, bounce 1.2s ease-in-out 1.2s infinite alternate;
}

.character-name {
  font-size: 1.3rem;
  font-weight: var(--font-weight-semibold);
}

.close-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;

  margin-top: 1.6rem;
  padding: 0.8rem 7rem;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  border-radius: 1.5rem;
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  animation: fadeIn 0.8s ease;
  animation-delay: 0.3s;
  min-height: 3rem;
  animation-fill-mode: both;
}

.icon {
  width: 1.1rem;
  height: 1.1rem;
}

.spinning-egg {
  animation: spin 2s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(360deg) scale(1.2);
  }
  100% {
    transform: rotate(720deg) scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
    animation-timing-function: ease-in;
  }
  50% {
    transform: translateY(-15px);
    animation-timing-function: ease-out;
  }
}
</style>
