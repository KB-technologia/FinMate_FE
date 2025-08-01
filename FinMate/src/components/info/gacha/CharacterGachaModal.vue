<template>
  <CharacterGachaIntroModal
    v-if="stage === 'intro'"
    @next="stage = 'gacha'"
    @close="emit('close')"
  />
  <CharacterGachaDrawModal
    v-else
    @confirm="(url) => emit('confirm', url)"
    @close="emit('close')"
  />
</template>

<script setup>
import { ref } from "vue";
import CharacterGachaIntroModal from "./CharacterGachaIntroModal.vue";
import CharacterGachaDrawModal from "./CharacterGachaDrawModal.vue";

const emit = defineEmits(["confirm", "close"]);
const stage = ref("intro");
</script>
