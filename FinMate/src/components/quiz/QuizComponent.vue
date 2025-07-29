<template>
  <div class="quiz-wrapper">
    <div class="indicator">
      <div
        v-for="(answer, idx) in selectedAnswers"
        :key="idx"
        class="indicator-item"
        :class="{ completed: answer !== null, active: currentIndex === idx }"
        @click="goToQuestion(idx)"
      >
        {{ idx + 1 }}
      </div>
    </div>

    <transition name="slide" mode="out-in">
      <div v-if="quizData.length" :key="currentQuestion.id" class="quiz-card">
        <div class="quiz-question">
          Q{{ currentQuestion.id }}. {{ currentQuestion.narration }}
          <div
            class="tooltip-wrapper"
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
          >
            <i class="fa-solid fa-circle-info icon-info"></i>
            <div v-if="showTooltip" class="tooltip-box">
              {{ currentQuestion.question }}
            </div>
          </div>
        </div>
        <ul class="quiz-options">
          <li v-for="(option, idx) in currentQuestion.options" :key="idx">
            <label>
              <input
                type="radio"
                :name="'q' + currentQuestion.id"
                :value="option"
                v-model="selectedAnswers[currentIndex]"
              />
              {{ option }}
            </label>
          </li>
        </ul>
      </div>
    </transition>

    <div class="quiz-navigation">
      <button
        class="nav-button"
        @click="prevQuestion"
        :disabled="currentIndex === 0"
      >
        ◀ 이전
      </button>
      <span>{{ currentIndex + 1 }} / {{ quizData.length }}</span>
      <button
        class="nav-button"
        @click="nextQuestion"
        :disabled="currentIndex === quizData.length - 1"
      >
        다음 ▶
      </button>
    </div>

    <div class="submit-container">
      <button class="submit-button" :disabled="!isComplete">완료</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import quizJson from "@/assets/quiz.json";

const quizData = ref([]);
const currentIndex = ref(0);
const selectedAnswers = ref(Array(7).fill(null));
const showTooltip = ref(false);

const currentQuestion = computed(
  () => quizData.value[currentIndex.value] || {}
);

const isComplete = computed(() =>
  selectedAnswers.value.every((answer) => answer !== null)
);

const goToQuestion = (idx) => {
  currentIndex.value = idx;
};

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};
const nextQuestion = () => {
  if (currentIndex.value < quizData.value.length - 1) currentIndex.value++;
};

onMounted(() => {
  quizData.value = quizJson;
});
</script>

<style scoped>
.quiz-wrapper {
  width: 50vw;
  height: 45vh;
  margin: auto;
  font-family: var(--font-wanted);
}

.indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.indicator-item {
  width: 2rem;
  height: 2rem;
  background-color: var(--color-light-gray);
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.indicator-item:hover {
  transform: scale(1.1);
}
.indicator-item.completed {
  background-color: var(--color-primary-green);
  color: white;
}
.indicator-item.active {
  outline: 2px solid var(--color-primary-green);
  font-weight: 700;
}

.quiz-card {
  background-color: #f8f9fa;
  border-radius: 2vh;
  padding: 1.5rem;
  height: 30vh;
  width: 50vw;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
}
.quiz-narration {
  margin-bottom: 0.5rem;
  color: #555;
}
.quiz-question {
  font-weight: bold;
  margin-bottom: 1rem;
}
.quiz-options li {
  list-style: none;
  margin: 0.3rem 0;
}

.quiz-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2vh;
}
.nav-button {
  background-color: var(--color-primary-green);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.nav-button:hover:enabled {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.nav-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-container {
  text-align: center;
}
.submit-button {
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-primary-green);
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.submit-button:disabled {
  background-color: var(--color-light-gray);
  cursor: not-allowed;
}
.submit-button:enabled:hover {
  transform: translateY(-2px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.icon-info {
  color: var(--color-black);
  margin-left: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
}
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.tooltip-box {
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: 0.95;
}
</style>
