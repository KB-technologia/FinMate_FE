<template>
  <div class="quiz-view">
    <TopNavigationBar />

    <div class="quiz-view-content">
      <div class="background-fade-in">
        <img
          src="@/assets/images/quiz/background.png"
          alt="intro scene"
          class="intro-image"
        />
      </div>

      <div class="text-container">
        <p class="typing-text">{{ visibleText }}</p>
      </div>

      <transition name="fade">
        <button class="next-button" @click="goNext" :disabled="!showButton">
          다음
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import TopNavigationBar from "../../components/allshared/TopNavigationBar.vue";

const router = useRouter();

const fullText =
  "트럭에 치인 당신!\n이를 불쌍하게 여긴 자연의 신이 당신을 동물로 환생시켜\n새로운 기회를 주려고 합니다.";

const visibleText = ref("");
const showButton = ref(false);

const goNext = () => {
  router.push("/quiz");
};

onMounted(() => {
  let i = 0;
  const typingInterval = 70;
  const interval = setInterval(() => {
    if (i < fullText.length) {
      visibleText.value += fullText[i];
      i++;
    } else {
      clearInterval(interval);
      showButton.value = true;
    }
  }, typingInterval);
});
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
  opacity: 0.3;
  z-index: -1;
}

.quiz-view-content {
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
  width: 100%;
  text-align: center;
  white-space: pre-line;
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
</style>
