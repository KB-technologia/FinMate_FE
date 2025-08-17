<template>
  <div class="gacha-modal" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-bg" />
      <img :src="kiwiImage" alt="키위새" class="kiwi" />
      <slot name="footer" />

      <div class="bubble-container">
        <p class="bubble-sender-name">FINMATE</p>
        <img
          src="@/assets/images/etc/speech.svg"
          alt="말풍선"
          class="speech-bubble"
        />
        <p class="bubble-text" v-html="visibleText" />

        <div class="floating-button-box">
          <button
            ref="nextBtnRef"
            type="button"
            class="floating-btn"
            :class="[
              { active: selected === 'next' },
              { inactive: selected !== 'next' },
            ]"
            @click="handleClick('next')"
          >
            <PawPrint :class="['icon', { visible: selected === 'next' }]" />
            다음으로
          </button>

          <button
            ref="exitBtnRef"
            type="button"
            class="floating-btn"
            :class="[
              { active: selected === 'exit' },
              { inactive: selected !== 'exit' },
            ]"
            @click="handleClick('exit')"
          >
            <PawPrint :class="['icon', { visible: selected === 'exit' }]" />
            나가기
          </button>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { PawPrint } from "lucide-vue-next";
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

import defaultKiwiImage from "@/assets/images/logos/kiwi-family2.svg";

const props = defineProps({
  fullText: {
    type: Array,
    required: true,
  },
  kiwiImage: {
    type: String,
    default: defaultKiwiImage,
  },
});
const emit = defineEmits(["close", "next"]);

const visibleText = ref("");
const selected = ref("next");

const nextBtnRef = ref(null);
const exitBtnRef = ref(null);

const handleKeyDown = (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    selected.value = selected.value === "next" ? "exit" : "next";
  }
  if (e.key === "Enter" || e.code === "NumpadEnter") {
    e.preventDefault();
    handleClick(selected.value);
  }
};

const handleClick = (type) => {
  if (type === "next") emit("next");
  else emit("close");
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);

  nextTick(() => {
    nextBtnRef.value?.focus();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

watch(selected, async (val) => {
  await nextTick();
  if (val === "next") nextBtnRef.value?.focus();
  else exitBtnRef.value?.focus();
});

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
  word-break: break-word;
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

.floating-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: var(--font-weight-bold);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  transition: background-color 0.2s;
  min-width: 6rem;
  justify-content: flex-start;
}

/* .floating-btn.active {
  background-color: var(--toast-bg-info);
} */

.icon {
  width: 1rem;
  height: 1rem;
  visibility: hidden;
}

.icon.visible {
  visibility: visible;
}

.floating-btn.inactive {
  color: #999;
}

.floating-btn:focus,
.floating-btn:focus-visible {
  outline: none;
}
</style>
