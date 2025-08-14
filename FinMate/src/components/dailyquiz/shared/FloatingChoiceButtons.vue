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
  showSecondary: { type: Boolean, default: true },
});
const emit = defineEmits(["primary", "secondary"]);

const renderSecondary = computed(
  () => props.showSecondary && !!props.secondaryLabel
);

const selected = ref("primary");
const primaryBtnRef = ref(null);
const secondaryBtnRef = ref(null);

const handleKeyDown = (e) => {
  if (!renderSecondary.value) {
    if (e.key === "Enter" || e.code === "NumpadEnter") {
      e.preventDefault();
      emit("primary");
    }
    return;
  }
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
  if (!renderSecondary.value) return;
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
}

.btn-stack.single .floating-btn {
  height: 1.8rem;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  min-width: 5.5rem;
  justify-content: center;
}

.icon {
  width: 1rem;
  height: 1rem;
  visibility: hidden;
  flex: 0 0 auto;
}
.icon.visible {
  visibility: visible;
}

.floating-btn.inactive {
  color: #999;
}
</style>
