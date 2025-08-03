<template>
  <div class="gacha-modal" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-bg" />
      <img
        src="@/assets/images/logos/kiwi-family2.svg"
        alt="키위새"
        class="kiwi"
      />

      <div class="bubble-container">
        <p class="bubble-sender-name">FINMATE</p>
        <img
          src="@/assets/images/etc/speech.svg"
          alt="말풍선"
          class="speech-bubble"
        />
        <p class="bubble-text" v-html="visibleText"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["next", "close"]);

const visibleText = ref("");
const fullText = [
  "다시 알을 뽑으면 현재 동물과는 작별하고,",
  "레벨은 그대로 이어집니다.",
  "캐릭터 교환권 1장이 ",
  "소멸돼요!",
];

onMounted(() => {
  let lineIndex = 0;
  let charIndex = 0;
  let currentLine = "";

  const typeLine = () => {
    if (lineIndex >= fullText.length) return;

    const line = fullText[lineIndex];
    currentLine += line[charIndex++];
    const lines = [...fullText.slice(0, lineIndex), currentLine];
    visibleText.value =
      fullText.slice(0, lineIndex).join("<br>") +
      (lineIndex < fullText.length ? currentLine : "");

    if (charIndex >= line.length) {
      lineIndex++;
      charIndex = 0;
      currentLine = "";
    }

    if (lineIndex < fullText.length) {
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
