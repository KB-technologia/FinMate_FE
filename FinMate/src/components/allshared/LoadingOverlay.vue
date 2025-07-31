<template>
  <div class="loading-overlay">
    <img
      class="flying-kiwi"
      src="@/assets/images/logos/flying-kiwi.png"
      alt="비행기 타고 가는 키위새"
    />
    <p class="loading-text">인증코드 발송 중...</p>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.flying-kiwi {
  position: absolute;
  top: 35%;
  left: 40%;
  width: 8rem;
  height: auto;
  animation: float-forward 4s ease-in-out infinite;
}

.loading-text {
  margin-top: 1rem;
  color: var(--color-white);
  font-size: 1.2rem;
  font-weight: var(--font-weight-bold);
}

@keyframes float-forward {
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
