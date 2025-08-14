<template>
  <div class="bubble-container">
    <p v-if="sender" class="bubble-sender-name">{{ sender }}</p>
    <img :src="speechUrl" alt="말풍선" class="speech-bubble" />
    <div class="bubble-text">
      <slot />
    </div>
    <div class="floating-button-box">
      <slot name="overlay" />
    </div>
  </div>
</template>

<script setup>
import speechUrl from "@/assets/images/etc/speech.svg";
defineProps({ sender: { type: String, default: "FINMATE" } });
</script>

<style scoped>
.bubble-container {
  position: relative;
  width: 100%;
  margin: 23vh auto 0;
  overflow: visible;
}

.speech-bubble {
  width: 100%;
  display: block;
}

.bubble-text {
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 92%;
  padding: 0 1rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-brown);
  text-align: center;
  line-height: 1.5;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.bubble-sender-name {
  position: absolute;
  top: 1.7rem;
  left: 5.2rem;
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-brown);
  transform: rotate(-4deg);
}

.floating-button-box {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background-color: var(--color-primary-yellow);
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
}
</style>
