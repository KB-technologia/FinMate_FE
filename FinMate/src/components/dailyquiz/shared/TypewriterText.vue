<template>
  <p v-html="visible" />
</template>

<script setup>
import { ref, watch, onUnmounted, defineExpose } from "vue";

const props = defineProps({
  lines: { type: Array, required: true },
  speed: { type: Number, default: 60 },
  startDelay: { type: Number, default: 0 },
});

const visible = ref("");
let timerId = null;
let lastLines = [];

function clearTimer() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

function play(lines) {
  clearTimer();
  visible.value = "";
  lastLines = Array.isArray(lines) ? lines : [];
  if (!lines || !lines.length) return;

  let li = 0,
    ci = 0,
    cur = "";

  const tick = () => {
    if (li >= lines.length) return;

    const line = String(lines[li] ?? "");
    cur += line[ci++] ?? "";

    visible.value = (lines.slice(0, li).join("\n") + cur).replace(
      /\n/g,
      "<br>"
    );

    if (ci >= line.length) {
      li++;
      ci = 0;
      cur = "";
    }
    if (li < lines.length) {
      timerId = setTimeout(tick, props.speed);
    }
  };

  if (props.startDelay > 0) {
    timerId = setTimeout(tick, props.startDelay);
  } else {
    tick();
  }
}

function skip() {
  clearTimer();
  const all = (lastLines || []).join("\n");
  visible.value = all.replace(/\n/g, "<br>");
}

watch(
  () => props.lines,
  (v) => play(v),
  { immediate: true, deep: true }
);

onUnmounted(clearTimer);

defineExpose({ skip });
</script>
