<template>
  <div class="loading-overlay">
    <div class="spinner" />
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
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 6px solid var(--color-gray-lightest);
  border-top: 6px solid var(--color-spinner-active);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: var(--color-white);
  font-size: 1.2rem;
  font-weight: var(--font-weight-bold);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
