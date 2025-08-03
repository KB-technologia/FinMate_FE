<!-- intro 공통된 부분 분리 -->
<template>
  <div class="gacha-modal" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-bg" />

      <img
        src="@/assets/images/logos/kiwi-family2.svg"
        alt="키위새"
        class="kiwi"
      />
      <slot name="footer" />

      <div class="bubble-container">
        <p class="bubble-sender-name">FINMATE</p>
        <img
          src="@/assets/images/etc/speech.svg"
          alt="말풍선"
          class="speech-bubble"
        />
        <p class="bubble-text" v-html="visibleText" />
        <slot name="floating-buttons" />
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  fullText: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["close"]);

const visibleText = ref("");

onMounted(() => {
  let lineIndex = 0;
  let charIndex = 0;
  let currentLine = "";

  const typeLine = () => {
    if (lineIndex >= props.fullText.length) return;

    const line = props.fullText[lineIndex];
    currentLine += line[charIndex++];
    visibleText.value = (
      props.fullText.slice(0, lineIndex).join("\n") +
      (lineIndex < props.fullText.length ? currentLine : "")
    ).replace(/\n/g, "<br>");

    if (charIndex >= line.length) {
      lineIndex++;
      charIndex = 0;
      currentLine = "";
    }

    if (lineIndex < props.fullText.length) {
      setTimeout(typeLine, 60);
    }
  };

  typeLine();
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
  position: relative;
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

.modal-bg {
  position: absolute;
  inset: 0;
  background-image: url("@/assets/images/etc/sea_background.png");
  background-size: cover;
  background-position: center;
  opacity: 0.6;
}

.modal-content > *:not(.modal-bg) {
  z-index: 1;
  position: relative;
}

.kiwi {
  width: 10rem;
  height: auto;
  transform: translateY(15vh);
}

.bubble-container {
  position: relative;
  width: 90%;
  margin-top: 9vh;
}

.speech-bubble {
  width: 100%;
  display: block;
}

.bubble-text {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 92%;
  padding: 0 1rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-brown);
  white-space: normal;
  text-align: center;
  line-height: 1.5;
  word-break: keep-all;
}

.bubble-sender-name {
  position: absolute;
  top: 1.6rem;
  left: 5.2rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-brown);
  transform: rotate(-2deg);
}
</style>
