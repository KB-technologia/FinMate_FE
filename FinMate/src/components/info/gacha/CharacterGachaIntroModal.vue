<template>
  <CharacterGachaBaseModal :full-text="fullText" @close="emit('close')" />
</template>

<script setup>
import CharacterGachaBaseModal from "./CharacterGachaBaseModal.vue";

const emit = defineEmits(["close"]);

const fullText = [
  "새로운 동물을 뽑으면 현재 동물과 작별하게 되며,\n레벨은 그대로 유지돼요. \n캐릭터 교환권 1장이 사용됩니다!",
];
</script>
