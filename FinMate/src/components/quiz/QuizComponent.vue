<template>
  <div class="quiz-wrapper">
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
            <label
              class="label"
              :class="{ selected: selectedAnswers[currentIndex] === idx }"
            >
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
        제출
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import quizJson from '@/assets/quiz.json';
import { postAssessment } from '@/api/quiz/quiz.js';
import { useToast } from '@/composables/useToast';

const quizData = ref([]);
const currentIndex = ref(0);
const selectedAnswers = ref(Array(6).fill(null));
const { toast } = useToast();

const currentQuestion = computed(
  () => quizData.value[currentIndex.value] || {}
);
const isComplete = computed(() =>
  selectedAnswers.value.every((a) => a !== null)
);
const showExtra = ref(false);

const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};
const nextQuestion = () => {
  if (currentIndex.value < quizData.value.length - 1) currentIndex.value++;
};

onMounted(() => {
  quizData.value = quizJson;
});

import { useRouter } from 'vue-router';

const router = useRouter();

const onSubmit = async () => {
  try {
    const result = await postAssessment(selectedAnswers.value);
    console.log('Assessment 결과:', result);
    if (result?.status === 200) {
      router.push('/');
      toast('투자 테스트가 완료되었습니다. 스탯을 확인해주세요.', 'success');
    }
  } catch (error) {
    console.error('Assessment 요청 실패:', error);
    toast('투자 테스트 제출에 실패하였습니다. 다시 확인해주세요.', 'error');
  }
};
</script>

<style scoped lang="scss">
@use '@/styles/checkbox.scss';
</style>

<style scoped>
.quiz-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
  width: 70vw;
  height: 60vh;
  margin: auto;
  font-family: var(--font-wanted);
}
.quiz-card {
  border-radius: 2vh;
  width: 70vw;
  height: 60vh;
  padding: 2vh;
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
.quiz-question {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.quiz-options li {
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin: 0.8rem 0;
  font-size: 1.2rem;
}
.label {
  cursor: pointer;
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 2vh;
  padding: 1vh;
  display: flex;
  flex-direction: row;
  transition: all 0.2s ease;
  gap: 0.5rem;
}
.label:hover {
  border: 0.2vh solid var(--color-primary-green);
  box-shadow: 0 0 1vh var(--color-primary-green);
}
.label input[type='radio'] {
  display: none;
}

.label.selected {
  background-color: var(--color-primary-green);
  color: var(--color-white);
  box-shadow: 0 0 1vh var(--color-primary-green);
  font-weight: 600;
  transform: scale(1.03);
}

.base-option {
  font-size: 1rem;
  color: var(--color-light-gray);
  margin-left: 1rem;
}
.quiz-navigation {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 5vh;
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
