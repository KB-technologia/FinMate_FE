<template>
  <CharacterGachaWelcomeModal
    v-if="stage === 'welcome'"
    @next="stage = 'intro'"
    @close="emit('close')"
  />

  <CharacterGachaIntroModal
    v-else-if="stage === 'intro'"
    @next="stage = 'draw'"
    @close="emit('close')"
  />

  <CharacterGachaDrawModal
    v-else-if="stage === 'draw'"
    @confirm="handleConfirm"
    @close="emit('close')"
  />

  <CharacterGachaResultStep
    v-else-if="stage === 'result'"
    :selectedEgg="selectedEgg"
    :character="selectedCharacter"
    @close="emit('close')"
  />
</template>

<script setup>
import { ref } from "vue";
import CharacterGachaWelcomeModal from "./CharacterGachaWelcomeModal.vue";
import CharacterGachaIntroModal from "./CharacterGachaIntroModal.vue";
import CharacterGachaDrawModal from "./CharacterGachaDrawModal.vue";
import CharacterGachaResultStep from "./CharacterGachaResultStep.vue";

const emit = defineEmits(["confirm", "close"]);
const stage = ref("welcome");

const selectedEgg = ref({ url: "" });
const selectedCharacter = ref({});

const handleConfirm = (egg) => {
  selectedEgg.value = egg;

  selectedCharacter.value = {
    name: "PENGUIN",
    image: new URL("@/assets/images/animals/penguin.png", import.meta.url).href,
  };

  stage.value = "result";

  emit("confirm", egg);
};
</script>
