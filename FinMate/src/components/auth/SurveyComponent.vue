<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupStore } from '@/stores/signup/signupStore';
import { useToast } from '@/composables/useToast';

import axios from 'axios';
import surveyJson from '@/assets/signupSurvey.json';

const { toast } = useToast();
const router = useRouter();
const signupStore = useSignupStore();
const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const surveyData = ref([]);
const currentIndex = ref(0);
const selectedAnswers = ref(Array(9).fill(null));

// 현재 질문
const currentQuestion = computed(
  () => surveyData.value[currentIndex.value] || {}
);
// 질문 완료 여부
const isComplete = computed(() =>
  selectedAnswers.value.every((answer) => answer !== null)
);

// 질문 이동 관련
const goToQuestion = (idx) => {
  currentIndex.value = idx;
};
const prevQuestion = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};
const nextQuestion = () => {
  if (currentIndex.value < surveyData.value.length - 1) currentIndex.value++;
};

// 설문 응답 -> SignupRequestDTO로 변환하는 함수
function convertAnswersToDto(answers, baseInfo) {
  return {
    isMarried: answers[0]?.includes('기혼'),
    hasJob: answers[1]?.includes('직장인'),
    usesPublicTransport: answers[2]?.includes('대중교통'),
    doesExercises: !answers[3]?.includes('운동 안 함'),
    travelsFrequently: answers[4]?.includes('자주'),
    hasChildren: !answers[5]?.includes('0명'),
    hasHouse: answers[6]?.includes('자가'),
    employedAtSme: answers[7]?.includes('중소기업'),
    usesMicroloan: !answers[8]?.includes('없어요'),
  };
}

// 선택지 선택 시 다음페이지로 이동
const handleOptionSelect = () => {
  if (currentIndex.value < surveyData.value.length - 1) {
    setTimeout(() => {
      nextQuestion();
    }, 150);
  }
};

// 제출 버튼 클릭 시 실행되는 함수
const submitSurvey = async () => {
  const surveyResult = convertAnswersToDto(selectedAnswers.value); // 설문 변환
  signupStore.$patch(surveyResult); // 스토어에 반영
  const dto = { ...signupStore }; // 서버 전송

  console.log('!!!!!!!최종 전송 DTO : ', dto);
  try {
    const res = await axios.post(`${BASE_URL}/api/member/join`, dto); // 서버 전송
    console.log('가입 완료 : ', res.data);
    toast('설문이 저장되었습니다!', 'success');
    router.push('/signup/complete'); // 회원가입 완료 페이지
  } catch (err) {
    console.error('전송 실패 : ', err);
    toast('회원가입 중 문제가 발생했습니다.', 'warning');
  }
};

onMounted(() => {
  surveyData.value = surveyJson;

  if (!signupStore.provider) {
    const savedProvider = sessionStorage.getItem('provider');
    if (savedProvider) {
      signupStore.provider = savedProvider;
    }
  }
});
</script>

<template>
  <div class="survey-wrapper">
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
            <label
              :class="{ selected: selectedAnswers[currentIndex] === option }"
            >
              <input
                type="radio"
                :name="'q' + currentQuestion.id"
                :value="option"
                v-model="selectedAnswers[currentIndex]"
                @change="handleOptionSelect"
              />
              {{ option }}
            </label>
          </li>
        </ul>
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
      </div>
    </transition>
    <!-- 제출 버튼 -->
    <div class="submit-container">
      <button
        :disabled="!isComplete"
        class="submit-button"
        @click="submitSurvey"
      >
        완료
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 전체 Wrapper */
.survey-wrapper {
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

/* 진행 상태 표시 인디케이터 */
.indicator {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
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

.survey-question {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.survey-card {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 선택지 */
.survey-options li {
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin: 0.8rem 0;
  font-size: 1.2rem;
}
.survey-options label {
  cursor: pointer;
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 2vh;
  padding: 1vh;
  display: flex;
  flex-direction: row;
  transition: all 0.2s ease;
  gap: 0.5rem;
  width: 100%;
  /* width: 32vw; */
  outline: none;
}
.survey-options label.selected {
  background-color: var(--color-primary-green);
  color: white;
  font-weight: 600;
  box-shadow: 0 0 1vh var(--color-primary-green);
  transform: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.survey-options label:hover {
  border: 0.2vh solid var(--color-primary-green);
  box-shadow: 0 0 1vh var(--color-primary-green);
}
.survey-options input[type='radio'] {
  display: none;
}

/* 질문 네비게이션 */
.survey-navigation {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 5vh;
  padding-top: 0vh;
  padding-bottom: 0vh;
  margin: 0;
}
.survey-navigation button {
  background-color: var(--color-primary-green);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 3.5vh;
  transition: all 0.2s ease;
}
.survey-navigation button:hover:enabled {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.survey-navigation button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 제출 버튼 */
.submit-container {
  text-align: center;
}
.submit-button {
  padding: 0.7rem 1.5rem;
  border: none;
  background-color: var(--color-primary-green);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 3.5vh;
  transition: all 0.2s ease;
}
.submit-button:disabled {
  background-color: var(--color-light-gray);
  cursor: not-allowed;
}
.submit-button:enabled:hover {
  transform: translateY(-2px);
}

/* 슬라이드 애니메이션 */
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
