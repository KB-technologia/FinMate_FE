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
import TalkModalShell from "@/components/allshared/talk-modal/TalkModalShell.vue";
import ModalMascot from "@/components/allshared/talk-modal/ModalMascot.vue";
import SpeechBubble from "@/components/allshared/talk-modal/SpeechBubble.vue";
import TypewriterText from "@/components/allshared/talk-modal/TypewriterText.vue";
import FloatingChoiceButtons from "@/components/allshared/talk-modal/FloatingChoiceButtons.vue";
import quizBg from "@/assets/images/backgroundImage/quiz-bg.png";
import kiwiIntroQuiz from "@/assets/images/logos/kiwi-intro-quiz.png";
defineEmits(["next", "close"]);
</script>
