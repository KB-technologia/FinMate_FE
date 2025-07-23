<template>
  <div class="quiz-wrapper">
    <div class="quiz-navigation">
      <button @click="prevQuestion" :disabled="currentIndex === 0">
        ◀ 이전
      </button>
      <span>{{ currentIndex + 1 }} / {{ quizData.length }}</span>
      <button
        @click="nextQuestion"
        :disabled="currentIndex === quizData.length - 1"
      >
        다음 ▶
      </button>
    </div>

    <transition name="slide" mode="out-in">
      <div v-if="quizData.length" :key="currentQuestion.id" class="quiz-card">
        <div class="quiz-narration">📜 {{ currentQuestion.narration }}</div>
        <div class="quiz-question">
          Q{{ currentQuestion.id }}. {{ currentQuestion.question }}
        </div>
        <ul class="quiz-options">
          <li v-for="(option, idx) in currentQuestion.options" :key="idx">
            <label>
              <input type="radio" :name="'q' + currentQuestion.id" />
              {{ option }}
            </label>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import quizJson from '@/assets/quiz.json';

const quizData = ref([]);
const currentIndex = ref(0);

onMounted(() => {
  quizData.value = quizJson;
});

const currentQuestion = computed(
  () => quizData.value[currentIndex.value] || {}
);

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

const nextQuestion = () => {
  if (currentIndex.value < quizData.value.length - 1) currentIndex.value++;
};
</script>

<style scoped>
.quiz-wrapper {
  width: 50vw;
  height: 45vh;
  margin: auto;
  padding: 2rem;
}

.quiz-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.quiz-card {
  background-color: #f8f9fa;
  border-radius: 2vh;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-height: 20vh;
}

.quiz-narration {
  font-style: italic;
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

/* 슬라이드 효과 */
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
