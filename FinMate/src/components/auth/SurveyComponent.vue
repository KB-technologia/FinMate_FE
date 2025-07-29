<script setup>
import { ref, computed, onMounted } from 'vue';
import surveyJson from '@/assets/signupSurvey.json'; // 설문 데이터 JSON

const surveyData = ref([]);
const currentIndex = ref(0);
const selectedAnswers = ref(Array(10).fill(null));

const currentQuestion = computed(
  () => surveyData.value[currentIndex.value] || {}
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
  if (currentIndex.value < surveyData.value.length - 1) currentIndex.value++;
};

onMounted(() => {
  surveyData.value = surveyJson;
});
</script>

<template>
  <div class="survey-wrapper">
    <!-- 진행 상태 표시 -->
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

    <!-- 질문 카드 -->
    <transition name="slide" mode="out-in">
      <div
        v-if="surveyData.length"
        :key="currentQuestion.id"
        class="survey-card"
      >
        <div class="survey-question">
          Q{{ currentQuestion.id }}. {{ currentQuestion.question }}
        </div>
        <ul class="survey-options">
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

    <!-- 이전/다음 버튼 -->
    <div class="survey-navigation">
      <button @click="prevQuestion" :disabled="currentIndex === 0">
        ◀ 이전
      </button>
      <span>{{ currentIndex + 1 }} / {{ surveyData.length }}</span>
      <button
        @click="nextQuestion"
        :disabled="currentIndex === surveyData.length - 1"
      >
        다음 ▶
      </button>
    </div>

    <!-- 제출 버튼 -->
    <div class="submit-container">
      <button :disabled="!isComplete" class="submit-button">완료</button>
    </div>
  </div>
</template>

<style scoped>
.survey-wrapper {
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

.survey-card {
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
.survey-question {
  font-weight: bold;
  margin-bottom: 1rem;
}
.survey-options li {
  list-style: none;
  margin: 0.3rem 0;
}

.survey-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2vh;
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
}
.submit-button:disabled {
  background-color: var(--color-light-gray);
  cursor: not-allowed;
}

/* 슬라이드 전환 애니메이션 */
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
