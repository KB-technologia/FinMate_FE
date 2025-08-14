<template>
  <TalkModalShell :bg-image="shellBg" @close="emit('close')">
    <template #bubble>
      <ConfettiRain
        v-if="showExp"
        :key="confettiKey"
        :duration="2000"
        :height-ratio="0.6"
      />
      <ModalMascot :src="mascotSrc" />

      <div v-if="showExp" class="exp-msg-header">
        <p class="exp-msg">캐릭터가 {{ expNumber }}의 경험치를 획득했어요!</p>
      </div>

      <div v-if="showExp" class="exp-footer">
        <div class="exp-track">
          <div
            ref="expFillRef"
            class="exp-fill"
            :style="{ width: expProgress + '%' }"
          ></div>
          <div v-if="showExpLabel" class="exp-badge">+{{ expNumber }}</div>
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
            primary-label="닫기"
            :show-secondary="false"
            @primary="onClose"
          />
        </template>
      </SpeechBubble>
    </template>
  </TalkModalShell>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";

import TalkModalShell from "@/components/dailyquiz/shared/TalkModalShell.vue";
import ModalMascot from "@/components/dailyquiz/shared/ModalMascot.vue";
import SpeechBubble from "@/components/dailyquiz/shared/SpeechBubble.vue";
import TypewriterText from "@/components/dailyquiz/shared/TypewriterText.vue";
import FloatingChoiceButtons from "@/components/dailyquiz/shared/FloatingChoiceButtons.vue";
import ConfettiRain from "@/components/dailyquiz/effects/ConfettiRain.vue";

import defaultBg from "@/assets/images/backgroundImage/quiz-bg.png";

const props = defineProps({
  lines: { type: Array, required: true },
  mascotSrc: { type: String, default: "" },
  bgImage: { type: String, default: "" },
  sender: { type: String, default: "FINMATE" },
  primaryLabel: { type: String, default: "닫기" },
  secondaryLabel: { type: String, default: "나가기" },
  speed: { type: Number, default: 45 },
  startDelay: { type: Number, default: 120 },
  showExp: { type: Boolean, default: false },
  expNumber: { type: Number, default: 0 },
  expPercent: { type: Number, default: 50 },
});

const emit = defineEmits(["close", "primary", "secondary"]);
const onClose = () => emit("close");

const shellBg = computed(() => props.bgImage || defaultBg);

const expProgress = ref(0);
const showExpLabel = ref(false);
const expFillRef = ref(null);

const confettiKey = ref(0);

function startExpAnimation() {
  showExpLabel.value = false;
  expProgress.value = 0;

  nextTick(() => {
    requestAnimationFrame(() => {
      const target = clampPercent(props.expPercent);
      expProgress.value = target;
    });
  });
}

function onTransitionEnd(e) {
  if (!e || e.propertyName !== "width") return;
  if (Math.round(expProgress.value) === clampPercent(props.expPercent)) {
    showExpLabel.value = true;
  }
}

function clampPercent(p) {
  const n = Number(p);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

onMounted(() => {
  if (props.showExp) {
    startExpAnimation();
  }
  expFillRef.value?.addEventListener("transitionend", onTransitionEnd);

  if (props.showExp) confettiKey.value++;
});

onBeforeUnmount(() => {
  expFillRef.value?.removeEventListener("transitionend", onTransitionEnd);
});

watch(
  () => [props.showExp, props.expPercent],
  ([v]) => {
    if (v) {
      startExpAnimation();
      confettiKey.value++;
    } else {
      expProgress.value = 0;
      showExpLabel.value = false;
    }
  }
);
</script>

<style scoped>
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
  position: relative;
  width: 100%;
  height: 2vh;
  min-height: 12px;
  background-color: var(--color-exp-track, rgba(0, 0, 0, 0.12));
  border-radius: 20px;
  overflow: visible;
  box-sizing: border-box;
}
.exp-fill {
  height: 100%;
  width: 0%;
  background-color: var(--color-exp-fill, #3ccb7f);
  border-radius: 20px;
  transition: width 0.9s ease;
}

.exp-badge {
  position: absolute;
  top: 50%;
  right: -3rem;
  transform: translateY(-50%);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  font-size: 1rem;
  white-space: nowrap;
}

:deep(.tm-mascot) {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 8vh);
}
:deep(.floating-button-box) {
  top: 1.8rem;
}
</style>
