<template>
  <div
    class="tm-overlay"
    role="dialog"
    aria-modal="true"
    @click.self="$emit('close')"
  >
    <div class="tm-modal">
      <div class="tm-bg" :style="bgStyle" />
      <div class="tm-content">
        <slot name="bubble" />
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  bgImage: String,
  bgOpacity: { type: Number, default: 0.6 },
  bgSize: { type: String, default: "cover" },
  bgPosition: { type: String, default: "center" },
});
defineEmits(["close"]);

const bgStyle = computed(() => ({
  backgroundImage: props.bgImage ? `url('${props.bgImage}')` : "none",
  backgroundSize: props.bgSize,
  backgroundPosition: props.bgPosition,
  opacity: props.bgOpacity,
}));
</script>

<style scoped>
.tm-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100000;
  padding: 2vh 2vw;
}
.tm-modal {
  position: relative;
  width: 90vw;
  max-width: 50vw;
  height: 32rem;

  padding: 1.2rem;
  border-radius: 1.5rem;
  background: var(--color-modal-bg);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);

  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tm-overlay {
  background: rgba(0, 0, 0, 0.4);
}
.tm-bg {
  position: absolute;
  inset: 0;
}
.tm-modal > *:not(.tm-bg) {
  position: relative;
}
.tm-content {
  width: 90%;
  margin-top: 2rem;
}
</style>
