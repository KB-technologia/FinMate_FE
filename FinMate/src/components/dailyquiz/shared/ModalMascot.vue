<template>
  <img :src="imgSrc" :alt="alt" class="tm-mascot" />
</template>

<script setup>
import { computed } from "vue";
import defaultKiwi from "@/assets/images/logos/kiwi-quiz.png";

const props = defineProps({
  src: String,
  alt: { type: String, default: "키위새" },
});

const imgSrc = computed(() => props.src || defaultKiwi);
</script>

<style scoped>
.tm-mascot {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 10vh);

  width: clamp(9rem, 8vw + 6rem, 11rem);
  height: auto;
}
</style>
