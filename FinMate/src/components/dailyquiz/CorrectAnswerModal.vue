<script setup>
defineProps({
  message: String,
});
</script>

<template>
  <div class="modal-container">
    <div class="modal-box">
      <div class="modal-title">
        <img src="@/assets/images/correctkiwi.png" class="correctkiwi-img" />
        <h2 class="info-text">정답입니다!</h2>
        <button class="close-btn" @click="$emit('close')">
          <img src="@/assets/images/modalclose.png" class="close-img" />
        </button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
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
  padding: 1rem 2.5rem;
  width: 40vw;
  height: 45vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-weight: bold;
  font-size: 2.7rem;
}

.info-text {
  margin-left: 70px;
  font-size: 2.5rem;
}
.correctkiwi-img {
  width: 180px;
  height: 180px;
}

.close-img {
  width: 30px;
  height: 30px;
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
