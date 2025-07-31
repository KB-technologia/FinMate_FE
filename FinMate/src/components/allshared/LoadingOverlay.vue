<template>
  <div class="loading-overlay">
    <img
      class="flying-kiwi"
      src="@/assets/images/logos/flying-kiwi.png"
      alt="비행기 타고 가는 키위새"
    />
    <p class="loading-text">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "로딩 중...",
  },
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.flying-kiwi {
  width: 8rem;
  height: auto;
  animation: kiwi-float-forward 4s ease-in-out infinite;
  margin-bottom: 2rem;
}

.loading-text {
  color: var(--color-white);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  transform: translateY(-2rem);
}

@keyframes kiwi-float-forward {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(5vw, -1vh);
  }
  50% {
    transform: translate(10vw, 0);
  }
  75% {
    transform: translate(15vw, 1vh);
  }
  100% {
    transform: translate(20vw, 0);
  }
}
</style>
