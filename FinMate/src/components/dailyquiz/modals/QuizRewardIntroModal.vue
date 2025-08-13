<template>
  <TalkModalShell :bg-image="quizBg" @close="$emit('close')">
    <template #bubble>
      <ModalMascot :src="kiwiIntroQuiz" />
      <SpeechBubble sender="FINMATE">
        <TypewriterText :lines="['오늘의 퀴즈를 풀면 경험치를 드려요!']" />
        <template #overlay>
          <FloatingChoiceButtons
            primaryLabel="다음으로"
            secondaryLabel="나가기"
            @primary="$emit('next')"
            @secondary="$emit('close')"
          />
        </template>
      </SpeechBubble>
    </template>
  </TalkModalShell>
</template>

<script setup>
import TalkModalShell from "@/components/dailyquiz/shared/TalkModalShell.vue";
import ModalMascot from "@/components/dailyquiz/shared/ModalMascot.vue";
import SpeechBubble from "@/components/dailyquiz/shared/SpeechBubble.vue";
import TypewriterText from "@/components/dailyquiz/shared/TypewriterText.vue";
import FloatingChoiceButtons from "@/components/dailyquiz/shared/FloatingChoiceButtons.vue";

import quizBg from "@/assets/images/backgroundImage/quiz-bg.png";
import kiwiIntroQuiz from "@/assets/images/logos/kiwi-intro-quiz.png";
defineEmits(["next", "close"]);
</script>
