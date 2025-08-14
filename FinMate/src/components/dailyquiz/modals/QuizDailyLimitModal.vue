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
            primaryLabel="준비됐어!"
            secondaryLabel="이따가 다시 올게!"
            @primary="$emit('start')"
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

defineEmits(["close", "start"]);
</script>
