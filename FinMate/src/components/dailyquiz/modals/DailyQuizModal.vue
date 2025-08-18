<template>
  <TalkModalShell
    v-show="!showResult"
    :bg-image="quizBg"
    @close="$emit('close')"
  >
    <template #bubble>
      <ModalMascot class="ask-mascot" />
      <SpeechBubble>
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

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import { updateUserData } from "@/api/mypage/level.js";
import { updateQuizSolved } from "@/api/dailyquiz/dailyQuizSolved.js";
import { getDailyQuiz, getAnswerDailyQuiz } from "@/api/dailyquiz/dailyQuiz.js";

import TalkModalShell from "@/components/dailyquiz/shared/TalkModalShell.vue";
import ModalMascot from "@/components/dailyquiz/shared/ModalMascot.vue";
import SpeechBubble from "@/components/dailyquiz/shared/SpeechBubble.vue";
import TypewriterText from "@/components/dailyquiz/shared/TypewriterText.vue";
import FloatingChoiceButtons from "@/components/dailyquiz/shared/FloatingChoiceButtons.vue";
import TalkResultModal from "@/components/dailyquiz/modals/TalkResultModal.vue";

import quizBg from "@/assets/images/backgroundImage/quiz-bg.png";
import correctKiwi from "@/assets/images/logos/correctkiwi.png";
import wrongKiwi from "@/assets/images/logos/wrongkiwi.png";

const { toast } = useToast();

const emit = defineEmits(["close", "exp-updated"]);

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
    toast("퀴즈를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.", "warning");
  }
});

async function checkAnswer(userAnswer) {
  if (!quiz.value || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const res = await getAnswerDailyQuiz(quiz.value.id, userAnswer);
    const { correct, message, exp, fillPercent } = res.data || {};

    if (correct) {
      const gainedExp = typeof exp === "number" ? exp : 500;
      try {
        const levelRes = await updateUserData({ exp: gainedExp });
        emit("exp-updated", levelRes.data);
      } catch (e) {
        toast(
          "경험치를 반영하지 못했어요. 잠시 후 다시 시도해 주세요.",
          "warning"
        );
      }
      resultLines.value = ["정답입니다!\n", message || ""];
      showExp.value = true;
      expNumber.value = gainedExp;
      expPercent.value = typeof fillPercent === "number" ? fillPercent : 50;
      resultMascot.value = correctKiwi;
    } else {
      resultLines.value = [
        "아쉽지만 오답이에요!",
        message || "",
        "\n다음 퀴즈도 기대해 주세요!",
      ];
      showExp.value = false;
      resultMascot.value = wrongKiwi;
    }
    showResult.value = true;
  } catch (e) {
    toast("정답 확인이 불가능합니다. 잠시 후 다시 시도해 주세요.", "warning");
    resultLines.value = [
      "앗, 결과를 확인하지 못했어요.",
      "그래도 오늘의 시도는 기록되었어요. 내일 다시 도전해주세요!",
    ];
    showExp.value = false;
    resultMascot.value = wrongKiwi;
  } finally {
    try {
      await updateQuizSolved();
    } catch (e) {
      toast(
        "퀴즈 완료 처리에 실패했어요.\n 잠시 후 다시 시도해 주세요.",
        "warning"
      );
    }
    // 클라이언트 가드도 같이 저장 (오프라인 대비)
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem("quizAttemptDate", today);
    } catch {}
  }
}

function closeAll() {
  showResult.value = false;
  isSubmitting.value = false;
  emit("close");
}
</script>

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

:deep(.tm-mascot.ask-mascot) {
  transform: translate(-45%, 9.5vh);
  width: clamp(9rem, 8vw + 6rem, 11rem);
}
</style>
