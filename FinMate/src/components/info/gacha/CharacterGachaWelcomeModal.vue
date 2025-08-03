<template>
  <CharacterGachaBaseModal :full-text="fullText" @close="emit('close')">
    <template #floating-buttons>
      <div class="floating-button-box">
        <button
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
    </template>
  </CharacterGachaBaseModal>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import CharacterGachaBaseModal from "./CharacterGachaBaseModal.vue";
import { PawPrint } from "lucide-vue-next";

const emit = defineEmits(["next", "close"]);

const fullText = [
  "동물 다시 뽑기에 온 걸 환영합니다!\n저와 함께 새로운 동물을 만나러 가보실래요?",
];

const selected = ref("next");

const handleKeyDown = (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    selected.value = selected.value === "next" ? "exit" : "next";
  }
  if (e.key === "Enter") {
    handleClick(selected.value);
  }
};

const handleClick = (type) => {
  if (type === "next") emit("next");
  else emit("close");
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
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
  z-index: 2;
}

.floating-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: var(--font-weight-bold);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 6rem;
  justify-content: flex-start;
}

.floating-btn.active {
  background-color: var(--color-yellow);
}

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
</style>
