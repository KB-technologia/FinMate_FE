<!-- FinMate/src/components/dailyquiz/shared/FloatingChoiceButtons.vue -->
<template>
  <div class="btn-stack" :class="{ single: !renderSecondary }">
    <button
      ref="primaryBtnRef"
      type="button"
      class="floating-btn"
      :class="[{ inactive: renderSecondary && selected !== 'primary' }]"
      @mouseenter="selected = 'primary'"
      @focus="selected = 'primary'"
      @click.stop="$emit('primary')"
    >
      <PawPrint
        :class="[
          'icon',
          { visible: !renderSecondary || selected === 'primary' },
        ]"
      />
      {{ primaryLabel }}
    </button>

    <!-- 보조 버튼은 옵션 -->
    <button
      v-if="renderSecondary"
      ref="secondaryBtnRef"
      type="button"
      class="floating-btn"
      :class="[{ inactive: selected !== 'secondary' }]"
      @mouseenter="selected = 'secondary'"
      @focus="selected = 'secondary'"
      @click.stop="$emit('secondary')"
    >
      <PawPrint :class="['icon', { visible: selected === 'secondary' }]" />
      {{ secondaryLabel }}
    </button>
  </div>
</template>

<script setup>
import { PawPrint } from "lucide-vue-next";
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  computed,
} from "vue";

const props = defineProps({
  primaryLabel: { type: String, default: "다음으로" },
  secondaryLabel: { type: String, default: "나가기" },
  /** ✅ false면 보조 버튼 숨김 (단일 버튼 모드) */
  showSecondary: { type: Boolean, default: true },
});
const emit = defineEmits(["primary", "secondary"]);

/** secondaryLabel이 비었거나 showSecondary=false면 보조 버튼 비표시 */
const renderSecondary = computed(
  () => props.showSecondary && !!props.secondaryLabel
);

const selected = ref("primary");
const primaryBtnRef = ref(null);
const secondaryBtnRef = ref(null);

const handleKeyDown = (e) => {
  // 단일 버튼 모드: Enter만 동작
  if (!renderSecondary.value) {
    if (e.key === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      emit("primary");
    }
    return;
  }
  // 두 버튼 모드: ↑/↓로 토글 + Enter
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    selected.value = selected.value === "primary" ? "secondary" : "primary";
  }
  if (e.key === "Enter" || e.code === "NumpadEnter") {
    e.preventDefault();
    if (selected.value === "primary") emit("primary");
    else emit("secondary");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  nextTick(() => primaryBtnRef.value?.focus());
});
onBeforeUnmount(() => window.removeEventListener("keydown", handleKeyDown));

watch(selected, async (val) => {
  if (!renderSecondary.value) return; // 단일 버튼 모드면 포커스 토글 불필요
  await nextTick();
  if (val === "primary") primaryBtnRef.value?.focus();
  else secondaryBtnRef.value?.focus();
});
</script>

<style scoped>
.btn-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 기본 버튼 규격 (두 버튼 모드) */
.floating-btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.4rem;
  min-width: 6rem;
  height: 2.1rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  line-height: 1;
  border-radius: 1rem;
  white-space: nowrap;
  font-weight: var(--font-weight-bold);
  border: none;
  outline: none;
  box-shadow: none;
  cursor: pointer;
}

/* ✅ 단일 버튼 모드일 때 높이/패딩 축소 */
.btn-stack.single .floating-btn {
  height: 1.8rem;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem; /* 필요 시 0.78rem로 더 줄여도 OK */
  min-width: 5.5rem; /* 살짝 줄임 */
}

/* 아이콘은 선택/호버 시만 표시 */
.icon {
  width: 1rem;
  height: 1rem;
  visibility: hidden;
  flex: 0 0 auto;
}
.icon.visible {
  visibility: visible;
}

/* 비활성(선택 안된 쪽) 색상 톤다운 */
.floating-btn.inactive {
  color: #999;
}
</style>
