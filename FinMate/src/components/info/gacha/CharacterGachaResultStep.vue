<template>
  <div class="gacha-modal" @click.self="$emit('close')">
    <div class="modal-content result-step">
      <h2 class="title">당신의 새로운 친구는 바로...</h2>

      <img :src="selectedEgg" alt="선택된 알" class="egg-img" />

      <div class="character-wrapper">
        <img :src="character.image" alt="캐릭터 이미지" class="character-img" />
        <p class="character-name">{{ character.name }}</p>
      </div>

      <button class="close-btn" @click="$emit('close')">
        함께 모험 떠나기 🚀
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedEgg: String,
  character: Object,
});
defineEmits(["close"]);
</script>

<style scoped>
.gacha-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: var(--color-bg-light, white);
  border-radius: 2rem;
  padding: 3rem 2rem;
  width: 90%;
  max-width: 32rem;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.2);
}

.result-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.title {
  margin-bottom: 1.8rem;
  font-size: 1.7rem;
  font-weight: var(--font-weight-bold);
}

.egg-img {
  width: 8rem;
  margin: 2rem 0;
  animation: pop 1s ease;
}

.character-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character-img {
  width: 10rem;
  animation: fadeIn 1s ease;
}

.character-name {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
}

.close-btn {
  margin-top: 2.5rem;
  padding: 0.8rem 3rem;
  font-size: 1rem;
  border-radius: 1.5rem;
  background-color: var(--color-primary-bluegray);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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
</style>
