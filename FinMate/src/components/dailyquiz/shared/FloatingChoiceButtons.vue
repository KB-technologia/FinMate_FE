<template>
  <div class="btn-stack">
    <button
      ref="primaryBtnRef"
      type="button"
      class="floating-btn"
      :class="[{ inactive: selected !== 'primary' }]"
      @mouseenter="selected = 'primary'"
      @focus="selected = 'primary'"
      @click.stop="$emit('primary')"
    >
      <PawPrint :class="['icon', { visible: selected === 'primary' }]" />
      {{ primaryLabel }}
    </button>

    <button
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
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

defineProps({
  primaryLabel: { type: String, default: "다음으로" },
  secondaryLabel: { type: String, default: "나가기" },
});
const emit = defineEmits(["primary", "secondary"]);

const selected = ref("primary");
const primaryBtnRef = ref(null);
const secondaryBtnRef = ref(null);

const handleKeyDown = (e) => {
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
