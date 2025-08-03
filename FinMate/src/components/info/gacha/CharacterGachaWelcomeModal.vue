<template>
  <CharacterGachaBaseModal
    :full-text="fullText"
    :kiwi-image="kiwiFamily"
    @close="emit('close')"
    @next="emit('next')"
  />
</template>

<script setup>
import CharacterGachaBaseModal from "./CharacterGachaBaseModal.vue";
import kiwiFamily from "@/assets/images/logos/kiwi-family.png";

const emit = defineEmits(["next", "close"]);

const fullText = [
  "동물 다시 뽑기에 온 걸 환영합니다!\n저와 함께 새로운 동물을 만나러 가보실래요?",
];
</script>
