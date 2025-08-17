<template>
  <div class="quiz-view">
    <TopNavigationBar />
    <div class="quiz-view-content background-fade-in">
      <div class="quiz-start-header">
        <div class="quiz-start-header-title">
          <i class="fa-solid fa-chart-simple icon-title"></i>
          <h1>투자 성향 테스트</h1>
        </div>
        <div class="quiz-start-description">
          <span>총 6문항</span>
          <span> | </span>
          <span>약 4분 소요</span>
        </div>
      </div>

      <div @click="skipTyping" class="text-container">
        <div class="typing-text">
          {{ visibleText }}
        </div>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import TopNavigationBar from "../../components/allshared/TopNavigationBar.vue";
import FloatingChoiceButtons from "@/components/dailyquiz/shared/FloatingChoiceButtons.vue";

const router = useRouter();

const fullText =
  "트럭에 치인 당신! \n이를 불쌍히 여긴 자연의 신이 당신을 동물로 환생시켜 \n새로운 기회를 주려 합니다.";

const visibleText = ref("");
const showButton = ref(false);
let interval = null;

const skipTyping = () => {
  // 타이핑 중이면 전부 보여주고 버튼 활성화
  if (visibleText.value !== fullText) {
    clearInterval(interval);
    visibleText.value = fullText;
    showButton.value = true;
  }
};

onMounted(() => {
  let i = 0;
  const typingInterval = 50; // 속도 조절
  interval = setInterval(() => {
    if (i < fullText.length) {
      visibleText.value += fullText[i];
      i++;
    } else {
      clearInterval(interval);
      showButton.value = true;
    }
  }, typingInterval);
});

const handleClick = (type) => {
  if (type === "next") {
    router.push("/quizsecond");
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
  background-image: url("@/assets/images/backgroundImage/background_test.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.quiz-view-content {
  background-image: url("@/assets/images/quiz/quizstartImage.png");
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

.intro-image {
  width: 30vw;
  height: auto;
}

.text-container {
  font-size: 2.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-black);
  font-weight: var(--font-weight-medium);
  z-index: 10;
  white-space: pre-line;
  width: 100%;
  margin-bottom: -72vh;
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

.quiz-start-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
}

.quiz-start-header {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -120vh;
  transform: scale(0.9);
  width: 80vw;
  height: 100vh;
}

.quiz-start-description {
  font-size: 1.5rem;
}

.quiz-start-header-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-top: -15vh;
}

.icon-title {
  margin-right: 1vw;
  align-items: center;
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
