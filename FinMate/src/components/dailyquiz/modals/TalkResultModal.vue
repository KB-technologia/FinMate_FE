<script setup>
import { computed } from "vue";

import TalkModalShell from "@/components/allshared/talk-modal/TalkModalShell.vue";
import SpeechBubble from "@/components/allshared/talk-modal/SpeechBubble.vue";
import ModalMascot from "@/components/allshared/talk-modal/ModalMascot.vue";
import TypewriterText from "@/components/allshared/talk-modal/TypewriterText.vue";
import FloatingChoiceButtons from "@/components/allshared/talk-modal/FloatingChoiceButtons.vue";

import defaultBg from "@/assets/images/backgroundImage/quiz-bg.png";

const props = defineProps({
  // 말풍선(타자 효과)으로 보여줄 라인들
  lines: { type: Array, required: true },

  // 상단 마스코트/배경/보낸이
  mascotSrc: { type: String, default: "" },
  bgImage: { type: String, default: "" },
  sender: { type: String, default: "FINMATE" },

  // 버튼 라벨
  primaryLabel: { type: String, default: "닫기" },
  secondaryLabel: { type: String, default: "나가기" },

  // 타자 효과 옵션
  speed: { type: Number, default: 45 },
  startDelay: { type: Number, default: 120 },

  // 정답일 때 경험치 표시
  showExp: { type: Boolean, default: false },
  expNumber: { type: Number, default: 0 },
  expPercent: { type: Number, default: 50 },
});

const emit = defineEmits(["close", "primary", "secondary"]);
const shellBg = computed(() => props.bgImage || defaultBg);
</script>

<template>
  <TalkModalShell :bg-image="shellBg" @close="emit('close')">
    <template #bubble>
      <ModalMascot :src="mascotSrc" />
      <div v-if="showExp" class="exp-msg-header">
        <p class="exp-msg">캐릭터가 {{ expNumber }}의 경험치를 획득했어요!</p>
      </div>
      <div v-if="showExp" class="exp-footer">
        <div class="exp-track">
          <div class="exp-fill" :style="{ width: expPercent + '%' }"></div>
        </div>
      </div>
      <SpeechBubble :sender="sender">
        <TypewriterText
          :lines="lines"
          :speed="speed"
          :startDelay="startDelay"
        />
        <template #overlay>
          <FloatingChoiceButtons
            :primary-label="primaryLabel"
            :secondary-label="secondaryLabel"
            @primary="emit('primary')"
            @secondary="emit('secondary')"
          />
        </template>
      </SpeechBubble>
    </template>
  </TalkModalShell>
</template>

<style scoped>
:deep(.tm-mascot) {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 8vh);
}

.exp-msg-header {
  position: absolute;
  top: 5.5vh;
  left: 50%;
  transform: translateX(-50%);
  width: min(56vw, 720px);
  display: flex;
  justify-content: center;
}

.exp-msg {
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  text-align: center;
}

.exp-footer {
  position: absolute;
  top: 24vh;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(140px, 18vw, 280px);
  display: flex;
  justify-content: center;
}

.exp-track {
  width: 100%;
  height: 2vh;
  min-height: 12px;
  background-color: var(--color-exp-track, rgba(0, 0, 0, 0.12));
  border-radius: 20px;
  overflow: hidden;
  box-sizing: border-box;
}

.exp-fill {
  height: 100%;
  background-color: var(--color-exp-fill, #3ccb7f);
  border-radius: 10px;
  transition: width 0.6s ease;
}
</style>
