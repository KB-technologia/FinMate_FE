<template>
  <div class="quiz-view">
    <TopNavigationBar />

    <div class="quiz-view-content background-fade-in">
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

const dialogues = [
  '오… 깨어났군요!\n저는 부키, 부자 키위새입니다.',
  '당신은 방금 전 생을 마치고, 이곳에서 새롭게 태어났어요.\n이곳은 동물들이 모여 살아가는 동시에, 돈과 운명이 얽힌 세계랍니다.',
  '여기서 살아남고 부자가 되려면, 먼저 당신의 투자 성향을 알아야 해요.\n간단한 테스트니까 너무 긴장하지 말고...',
  '좋아요! 이제 테스트를 진행해 볼까요?',
];

const currentIndex = ref(0); // 현재 대사 인덱스
const visibleText = ref(''); // 타이핑 중인 텍스트
const showButton = ref(false); // 버튼 노출 여부
let interval = null;

const typeDialogue = () => {
  visibleText.value = '';
  showButton.value = false;
  let i = 0;
  const typingInterval = 60;
  interval = setInterval(() => {
    if (i < dialogues[currentIndex.value].length) {
      visibleText.value += dialogues[currentIndex.value][i];
      i++;
    } else {
      clearInterval(interval);
      showButton.value = true;
    }
  }, typingInterval);
};

const skipTyping = () => {
  if (visibleText.value !== dialogues[currentIndex.value]) {
    clearInterval(interval);
    visibleText.value = dialogues[currentIndex.value];
    showButton.value = true;
  }
};

onMounted(() => {
  typeDialogue();
});

const handleClick = (type) => {
  if (type === 'next') {
    if (currentIndex.value < dialogues.length - 1) {
      currentIndex.value++;
      typeDialogue(); // 다음 대사 타이핑 시작
    } else {
      router.push('/quiz'); // 마지막 대사 끝나면 퀴즈 페이지로 이동
    }
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
  background-image: url('@/assets/images/backgroundImage/background_forest.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.quiz-view-content {
  background-image: url('@/assets/images/quiz/quiznextImage.png');
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
  width: 100%;
  text-align: center;
  white-space: pre-line;
  margin-bottom: -55vh;
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
</style>
