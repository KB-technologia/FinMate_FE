<template>
  <TalkModalShell :bg-image="quizBg" @close="$emit('close')">
    <template #bubble>
      <ModalMascot :src="kiwiIntroQuiz" />
      <SpeechBubble sender="FINMATE">
        <TypewriterText
          :lines="['하루에 딱! 한 번만 도전할 수 있어요. \n준비되셨나요?']"
        />
        <template #overlay>
          <FloatingChoiceButtons
            primaryLabel="시작하기"
            secondaryLabel="나가기"
            @primary="$emit('start')"
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

defineEmits(["close", "start"]);
</script>
