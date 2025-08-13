<script setup>
import { ref, onMounted } from "vue";
import { getDailyQuiz, getAnswerDailyQuiz } from "@/api/dailyquiz/dailyQuiz.js";
// import { updateQuizSolved } from "@/api/dailyquiz/dailyQuizSolved.js";

import TalkModalShell from "@/components/allshared/talk-modal/TalkModalShell.vue";
import SpeechBubble from "@/components/allshared/talk-modal/SpeechBubble.vue";
import FloatingChoiceButtons from "@/components/allshared/talk-modal/FloatingChoiceButtons.vue";
import ModalMascot from "@/components/allshared/talk-modal/ModalMascot.vue";
import TypewriterText from "@/components/allshared/talk-modal/TypewriterText.vue";
import TalkResultModal from "@/components/allshared/talk-modal/TalkResultModal.vue";
import quizBg from "@/assets/images/backgroundImage/quiz-bg.png";

const emit = defineEmits(["close"]);

const quiz = ref(null);
const isSubmitting = ref(false);

const showResult = ref(false);
const resultLines = ref([]);
const resultMascot = ref("");
const showExp = ref(false);
const expNumber = ref(500);
const expPercent = ref(50);

onMounted(async () => {
  try {
    const res = await getDailyQuiz();
    quiz.value = res.data;
  } catch (e) {
    console.error("퀴즈 가져오기 실패", e);
  }
});

async function checkAnswer(userAnswer) {
  if (!quiz.value || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const res = await getAnswerDailyQuiz(quiz.value.id, userAnswer);
    const { correct, message, exp, fillPercent } = res.data || {};
    if (correct) {
      resultLines.value = ["정답입니다!", message || ""];
      showExp.value = true;
      expNumber.value = typeof exp === "number" ? exp : 500;
      expPercent.value = typeof fillPercent === "number" ? fillPercent : 50;
      resultMascot.value = new URL(
        "@/assets/images/logos/correctkiwi.png",
        import.meta.url
      ).href;
    } else {
      resultLines.value = [
        "아쉽지만 오답이에요!",
        message || "",
        "다음 퀴즈도 기대해 주세요!",
      ];
      showExp.value = false;
      resultMascot.value = new URL(
        "@/assets/images/logos/wrongkiwi.png",
        import.meta.url
      ).href;
    }

    showResult.value = true;
    // 테스트 끝나면 다시 사용
    // await updateQuizSolved();
  } catch (e) {
    console.error("정답 확인 실패", e);
    isSubmitting.value = false;
  }
}

function closeAll() {
  showResult.value = false;
  isSubmitting.value = false;
  emit("close");
}
</script>

<template>
  <TalkModalShell
    v-show="!showResult"
    :bg-image="quizBg"
    @close="$emit('close')"
  >
    <template #bubble>
      <ModalMascot />
      <SpeechBubble sender="FINMATE">
        <TypewriterText
          v-if="quiz?.quiz"
          class="question-text"
          :lines="[quiz.quiz]"
          :speed="60"
          :startDelay="150"
        />
        <template #overlay>
          <FloatingChoiceButtons
            :class="{ 'is-disabled': isSubmitting }"
            primaryLabel="맞아요"
            secondaryLabel="아니에요"
            @primary="checkAnswer(true)"
            @secondary="checkAnswer(false)"
          />
        </template>
      </SpeechBubble>
    </template>
  </TalkModalShell>

  <TalkResultModal
    v-if="showResult"
    :lines="resultLines"
    :mascot-src="resultMascot"
    :bg-image="quizBg"
    :show-exp="showExp"
    :exp-number="expNumber"
    :exp-percent="expPercent"
    primaryLabel="닫기"
    secondaryLabel="나가기"
    @primary="closeAll"
    @secondary="closeAll"
    @close="closeAll"
  />
</template>

<style scoped>
.question-text {
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-brown);
  text-align: center;
  line-height: 1.5;
  white-space: pre-line;
}
.is-disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
