<template>
  <div class="quiz-wrapper">
    <!-- <div class="indicator">
      <div
        v-for="(answer, idx) in selectedAnswers"
        :key="idx"
        class="indicator-item"
        :class="{ completed: answer !== null, active: currentIndex === idx }"
        @click="goToQuestion(idx)"
      >
        {{ idx + 1 }}
      </div>
    </div> -->
    <div class="model-7 checkboxcontainer">
      <div class="checkbox">
        <input type="checkbox" id="toggle" v-model="showExtra" />
        <label for="toggle"></label>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <div
        v-if="quizData.length"
        :key="currentQuestion.id"
        class="quiz-card"
        :class="{ 'show-extra': showExtra }"
      >
        <div class="quiz-question">
          <span v-if="!showExtra">
            Q{{ currentQuestion.id }}. {{ currentQuestion.narration }}
          </span>

          <span v-if="showExtra">
            Q{{ currentQuestion.id }}. {{ currentQuestion.question }}
          </span>
        </div>
        <ul class="quiz-options">
          <li v-for="(option, idx) in currentQuestion.options" :key="idx">
            <label>
              <input
                type="radio"
                :name="'q' + currentQuestion.id"
                :value="idx"
                v-model="selectedAnswers[currentIndex]"
              />
              {{ option }}
            </label>
            <transition name="fade">
              <span v-if="showExtra" class="base-option">
                ({{ currentQuestion.baseoptions?.[idx] }})
              </span>
            </transition>
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
        :disabled="
          currentIndex === quizData.length - 1 ||
          selectedAnswers[currentIndex] === null
        "
      >
        다음 ▶
      </button>
    </div>

    <div class="submit-container">
      <button class="submit-button" :disabled="!isComplete" @click="onSubmit">
        완료
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import quizJson from '@/assets/quiz.json';

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
const showExtra = ref(false);

// const goToQuestion = (idx) => {
//   currentIndex.value = idx;
// };

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};
const nextQuestion = () => {
  if (currentIndex.value < quizData.value.length - 1) currentIndex.value++;
};

onMounted(() => {
  quizData.value = quizJson;
});

const onSubmit = () => {
  console.log('사용자 답변:', selectedAnswers.value);
};
</script>

<style scoped lang="scss">
@import '@/styles/checkbox.scss';
</style>
<style scoped>
.quiz-wrapper {
  width: 50vw;
  height: 55vh;
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
  border-radius: 2vh;
  height: 40vh;
  width: 50vw;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  border: 0.2vh solid var(--color-light-gray);
}
.quiz-card.show-extra {
  border-color: var(--color-primary-green);
  box-shadow: 0 0 1vh rgba(0, 128, 0, 0.2);
  transition: all 0.3s ease in-out;
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
.checkboxcontainer {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.toggle-text {
  font-size: 0.9rem;
  color: var(--color-light-gray);
}

.base-option {
  font-size: 0.8rem;
  color: var(--color-light-gray);
  margin-left: 0.5rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
</style>
