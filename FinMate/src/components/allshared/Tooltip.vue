<template>
  <span
    class="tooltip-wrapper"
    data-placement="bottom"
    @mouseenter="show = true"
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
  >
    <slot />
    <span
      v-if="text"
      class="tooltip-bubble"
      :class="[`tooltip--${theme}`]"
      role="tooltip"
      aria-live="polite"
      :style="{ marginTop: `${offset}px` }"
      v-show="show"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  text: { type: String, required: true },
  offset: { type: Number, default: 10 },
  theme: { type: String, default: "naver" },
});

const show = ref(false);
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip-bubble {
  --tt-border: var(--color-tooltip-green);
  position: absolute;
  z-index: 20;
  background: var(--color-white);
  color: var(--color-black);
  font-size: 0.8rem;
  white-space: nowrap;
  padding: 8px 12px;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  border: 1.5px solid var(--tt-border);
  pointer-events: none;
  transition: opacity 0.12s ease, transform 0.12s ease;
  opacity: 1;

  left: 50%;
  top: 100%;
  transform: translateX(-50%);
}

/* bottom 전용 꼬리 */
.tooltip-bubble::before,
.tooltip-bubble::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-style: solid;
}
.tooltip-bubble::before {
  bottom: 100%;
  border-width: 0 7px 9px 7px;
  border-color: transparent transparent var(--tt-border) transparent;
}
.tooltip-bubble::after {
  bottom: 100%;
  margin-bottom: -1px;
  border-width: 0 6px 8px 6px;
  border-color: transparent transparent #fff transparent;
}
</style>
