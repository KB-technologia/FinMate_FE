<template>
  <teleport to="body">
    <div class="gacha-overlay" @click.self="onOverlayClick">
      <CharacterGachaWelcomeModal
        v-if="stage === 'welcome'"
        @next="stage = 'intro'"
        @close="closeAll"
      />

      <CharacterGachaIntroModal
        v-else-if="stage === 'intro'"
        @next="stage = 'draw'"
        @close="closeAll"
      />

      <CharacterGachaDrawModal
        v-else-if="stage === 'draw'"
        @confirm="handleConfirm"
        @close="closeAll"
      />

      <CharacterGachaResultStep
        v-else-if="stage === 'result'"
        :selectedEgg="selectedEgg"
        @close="closeAll"
      />
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import CharacterGachaWelcomeModal from './CharacterGachaWelcomeModal.vue';
import CharacterGachaIntroModal from './CharacterGachaIntroModal.vue';
import CharacterGachaDrawModal from './CharacterGachaDrawModal.vue';
import CharacterGachaResultStep from './CharacterGachaResultStep.vue';

const emit = defineEmits(['confirm', 'close', 'reloading']);
const stage = ref('welcome');

const selectedEgg = ref({ url: '' });

const overlayClosable = ref(true);
let overlayUnlockTimer = null;

const lockOverlayCloseBriefly = (ms = 250) => {
  overlayClosable.value = false;
  clearTimeout(overlayUnlockTimer);
  overlayUnlockTimer = setTimeout(() => (overlayClosable.value = true), ms);
};

const onOverlayClick = () => {
  if (!overlayClosable.value || stage.value === 'result') return;
  closeAll();
};

const handleConfirm = (egg) => {
  selectedEgg.value = egg;
  lockOverlayCloseBriefly();
  stage.value = 'result';
  emit('confirm', egg);
};

const closeAll = () => {
  stage.value = 'welcome';
  emit('close');
  emit('reloading');
};

onMounted(() => {
  const prev = document.body.style.overflow;
  document.body.dataset.prevOverflow = prev;
  document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = document.body.dataset.prevOverflow || '';
  delete document.body.dataset.prevOverflow;
  clearTimeout(overlayUnlockTimer);
});
</script>

<style>
.gacha-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2vh 2vw;
}
</style>
