<template>
  <CharacterGachaBaseModal :full-text="fullText" @close="emit('close')" />
</template>

<script setup>
import CharacterGachaBaseModal from "./CharacterGachaBaseModal.vue";

const emit = defineEmits(["close"]);

const fullText = [
  "다시 알을 뽑으면 현재 동물과는 작별하고,",
  "레벨은 그대로 이어집니다.",
  "캐릭터 교환권 1장이 ",
  "소멸돼요!",
];
</script>
