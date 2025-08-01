<script setup>
import CloseButton from '@/components/allshared/CloseButton.vue';

defineProps({
  message: String,
});
</script>
<template>
  <div class="modal-container">
    <div class="modal-box">
      <div class="modal-title">
        <img src="@/assets/images/logos/wrongkiwi.png" class="wrongkiwi-img" />
        <h2 class="info-text">아쉽지만 오답이에요!</h2>
        <CloseButton @click="$emit('close')" class="close-btn" />
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
        <p class="info-next">다음 퀴즈도 기대해 주세요!</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-container {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: var(--color-modal-bg);
  border-radius: 30px;
  padding: 0.5rem 2.5rem;
  width: 40vw;
  height: 50vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  font-weight: var(--font-weight-bold);
  font-size: 2.7rem;
}
.info-text {
  margin-left: 1rem;
  font-size: 2.5rem;
}

.wrongkiwi-img {
  width: 170px;
  height: 170px;
}

.info-next {
  margin-top: 4rem;
  font-weight: var(--font-weight-bold);
}

.close-btn {
  all: unset;
  position: absolute;
  top: 1rem;
  right: 2.5rem;
  cursor: pointer;
}

.modal-body {
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem;
}
</style>
