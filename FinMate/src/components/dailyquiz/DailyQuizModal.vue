<script setup>
import { ref, onMounted } from "vue";
import { getDailyQuiz, getAnswerDailyQuiz } from "@/api/dailyquiz/dailyQuiz.js";
import FalseButton from "@/components/dailyquiz/FalseButton.vue";
import TrueButton from "@/components/dailyquiz/TrueButton.vue";
import CorrectAnswerModal from "@/components/dailyquiz/CorrectAnswerModal.vue";
import WrongAnswerModal from "@/components/dailyquiz/WrongAnswerModal.vue";

const emit = defineEmits(["close"]);

const quiz = ref(null);
const isAnswer = ref("");
const showCorrectModal = ref(false);
const showWrongModal = ref(false);

onMounted(async () => {
  try {
    const res = await getDailyQuiz();
    quiz.value = res.data;
    console.log(quiz.value);
  } catch (error) {
    console.error("퀴즈 가져오기 실패", error);
  }
});

async function checkAnswer(userAnswer) {
  emit("close");
  try {
    const res = await getAnswerDailyQuiz(quiz.value.id, userAnswer);
    const correctAnswer = res.data.correct;
    isAnswer.value = res.data.message;

    const correctAnswer =
      quiz.value.answer === true || quiz.value.answer === "true";

    if (correctAnswer) {
      showCorrectModal.value = true;
    } else {
      showWrongModal.value = true;
    }
  } catch (error) {
    console.error("정답 확인 실패", error);
  }
}
</script>

<template>
  <div class="quiz-modal-container">
    <div class="quiz-modal-box">
      <div class="modal-title">
        <div class="title-left">
          <img
            src="@/assets/images/quizlet.png"
            alt="문제 이미지"
            class="quizlet-img"
          />
          <span>오늘의 퀴즈</span>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <img src="@/assets/images/modalclose.png" class="close-img" />
        </button>
      </div>
      <div class="modal-body">
        {{ quiz?.quiz }}
      </div>
      <div class="btn-group">
        <TrueButton @submitAnswer="checkAnswer" />
        <FalseButton @submitAnswer="checkAnswer" />
      </div>
    </div>
  </div>
  <CorrectAnswerModal
    v-if="showCorrectModal"
    :message="isAnswer"
    @close="showCorrectModal = false"
  />
  <WrongAnswerModal
    v-if="showWrongModal"
    :message="isAnswer"
    @close="showWrongModal = false"
  />
</template>
<style scoped>
.quiz-modal-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.quiz-modal-box {
  background: var(--color-modal-bg);
  border-radius: 30px;
  padding: 2rem 2.5rem;
  width: 40vw;
  height: 45vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.modal-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2.7rem;
}

.quizlet-img {
  width: 80px;
  height: 80px;
}

.close-btn {
  all: unset;
  cursor: pointer;
}

.close-img {
  margin-bottom: 50px;
  width: 30px;
  height: 30px;
}

.modal-body {
  font-size: 1.5rem;
  margin-top: 30px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 10rem;
}
</style>
