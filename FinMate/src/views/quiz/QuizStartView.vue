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
        <button
          ref="nextBtnRef"
          type="button"
          class="floating-btn"
          @click="handleClick('next')"
        >
          <!-- <PawPrint :class="['icon', { visible: selected === 'next' }]" /> -->
          다음으로
        </button>

        <button
          ref="exitBtnRef"
          type="button"
          class="floating-btn"
          @click="handleClick('exit')"
        >
          <!-- <PawPrint :class="['icon', { visible: selected === 'exit' }]" /> -->
          나가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';

const router = useRouter();

const fullText =
  '트럭에 치인 당신! \n이를 불쌍히 여긴 자연의 신이 당신을 동물로 환생시켜 \n새로운 기회를 주려 합니다.';

const visibleText = ref('');
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
  if (type === 'next') {
    router.push('/quizsecond');
  } else {
    router.push('/my-stats');
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
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/backgroundImage/background_test.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.quiz-view-content {
  background-image: url('@/assets/images/quiz/quizstartImage.png');
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
  font-size: 1.8rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  color: var(--color-black);
  font-weight: var(--font-weight-medium);
  z-index: 10;
  white-space: pre-line;
  width: 100%;
  text-align: center;
  white-space: pre-line;
  margin-bottom: -72vh;
}

.typing-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
  line-height: 1.6;
  min-height: 6rem;
}

.next-button {
  background-color: var(--color-main-button);
  width: 15vw;
  color: var(--color-black);
  border: none;
  border-radius: 2vh;
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  animation: bounce 1.2s infinite;
  transition: transform 0.2s ease;
}
.next-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  animation: none;
  transform: none;
}
.next-button:hover {
  color: var(--color-white);
  transition: all 0.2s ease-in-out;
  box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, 0.2);
  transform: translateY(-8px);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 다음으로/나가기 선택 버튼 styles */
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

.floating-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: var(--font-weight-bold);
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  transition: background-color 0.2s;
  background-color: var(--color-primary-yellow);
  width: 100%;
  justify-content: flex-start;
  margin-top: 0vh;

  background-color: var(--color-primary-yellow) !important; /* 고정 배경색 */
  color: var(--color-black) !important; /* 고정 글자색 */
  border: none !important; /* 테두리 제거 */
  transition: transform 0.2s ease; /* 애니메이션만 유지 */
  box-shadow: none !important;
}

button:hover {
  color: var(--color-white);
  transition: all 0.2s ease-in-out;
  transform: translateY(-8px);
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
</style>
