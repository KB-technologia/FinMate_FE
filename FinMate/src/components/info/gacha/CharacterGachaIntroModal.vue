<template>
  <div class="gacha-modal" @click.self="emit('close')">
    <div class="modal-content">
      <CloseButton class="top-close" @click="emit('close')" />
      <img
        src="@/assets/images/animals/Gacha_egg/egg_family.png"
        alt="키위새"
        class="kiwi"
      />
      <p class="typing-text">{{ visibleText }}</p>
      <p class="warning-text">캐릭터 교환권 1장이 소멸돼요!</p>
      <button class="confirm-btn" @click="emit('next')" :disabled="!showButton">
        새로운 동물 만나러 가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CloseButton from "@/components/allshared/CloseButton.vue";

const emit = defineEmits(["next", "close"]);

const visibleText = ref("");
const showButton = ref(false);
const fullText = `다시 알을 뽑으면\n현재 동물과는 작별하고,\n레벨은 그대로 이어집니다.`;

onMounted(() => {
  let i = 0;
  const interval = setInterval(() => {
    if (i < fullText.length) {
      visibleText.value += fullText[i++];
    } else {
      clearInterval(interval);
      showButton.value = true;
    }
  }, 60);
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
  z-index: 9999;
}

.modal-content {
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

.kiwi {
  width: 10rem;
  height: auto;
}

.typing-text {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  white-space: pre-line;
  line-height: 1.6;
  min-height: 6rem;
  color: var(--color-black);
  margin-top: 1rem;
}

.warning-text {
  color: var(--color-red-alert);
  font-weight: 600;
  font-size: 1.1rem;
  font-style: italic;
  margin-top: 1.8rem;
  margin-bottom: 4.2rem;
  text-align: center;
  white-space: pre-line;
}

.confirm-btn {
  padding: 0.8rem 6rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border-radius: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.confirm-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.top-close {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  cursor: pointer;
}
</style>
