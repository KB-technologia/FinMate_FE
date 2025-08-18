<template>
  <div class="quiz-view">
    <TopNavigationBar />

    <div class="quiz-view-content background-fade-in">
      <div @click="skipTyping" class="text-container">
        <TypewriterText
          ref="twRef"
          :lines="[dialogues[currentIndex]]"
          :speed="60"
          class="typing-text"
        />
      </div>

      <div class="floating-button-box">
        <FloatingChoiceButtons
          primaryLabel="다음으로"
          secondaryLabel="나가기"
          :showSecondary="true"
          @primary="handleClick('next')"
          @secondary="handleClick('exit')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import TopNavigationBar from "../../components/allshared/TopNavigationBar.vue";
import FloatingChoiceButtons from "@/components/dailyquiz/shared/FloatingChoiceButtons.vue";
import TypewriterText from "@/components/dailyquiz/shared/TypewriterText.vue";

const router = useRouter();

const dialogues = [
  "오… 깨어났군요!\n저는 부키, 부자 키위새입니다.",
  "당신은 방금 전 생을 마치고, 이곳에서 새롭게 태어났어요.\n이곳은 동물들이 모여 살아가는 동시에, 돈과 운명이 얽힌 세계랍니다.",
  "여기서 살아남고 부자가 되려면, 먼저 당신의 투자 성향을 알아야 해요.\n간단한 테스트니까 너무 긴장하지 말고...",
  "좋아요! 이제 테스트를 진행해 볼까요?",
];

const currentIndex = ref(0); // 현재 대사 인덱스
const twRef = ref(null);

const skipTyping = () => {
  twRef.value?.skip();
};

const handleClick = (type) => {
  if (type === "next") {
    if (currentIndex.value < dialogues.length - 1) {
      currentIndex.value++;
    } else {
      router.push("/quiz");
    }
  } else {
    router.push("/my-stats");
  }
};
</script>

<style scoped>
.quiz-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.quiz-view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/backgroundImage/background_forest.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.quiz-view-content {
  background-image: url("@/assets/images/quiz/quiznextImage.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100vw;
  height: 100vh;
}

.background-fade-in {
  opacity: 0;
  animation: fadeIn 2s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.text-container {
  font-size: 2.1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  color: var(--color-black);
  font-weight: var(--font-weight-medium);
  width: 100%;
  white-space: pre-line;
  margin-bottom: -55vh;
}

.typing-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  line-height: 1.6;
  min-height: 6rem;
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
  margin-right: 18vh;
  margin-top: 50vh;
  width: 28dvh;
  height: 13vh;
  justify-content: center;
}

:deep(.icon) {
  width: 1.2rem;
  height: 1.2rem;
}

.floating-button-box :deep(.floating-btn) {
  --fcb-font-size: 1.05rem;
  --fcb-gap: 0.8rem;
  --fcb-icon-size: 1.2rem;
}
</style>
