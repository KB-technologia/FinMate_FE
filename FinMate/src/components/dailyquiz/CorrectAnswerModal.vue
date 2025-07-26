<script setup>
defineProps({
  message: String,
});
const expnumber = 10;
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
        <p class="info-exptext">
          캐릭터가 {{ expnumber }}의 경험치를 획득했어요!
        </p>
      </div>
      <div class="exp-bar">
        <div class="exp-label">+{{ expnumber }}</div>
        <div class="exp-track">
          <div class="exp-fill" :style="{ width: 30 + '%' }"></div>
        </div>
        <!--TODO : width, expnumber 값 조절 -->
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
  padding: 0.5rem 1.5rem;
  width: 40vw;
  height: 50vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 3rem;
  font-weight: bold;
  font-size: 2.7rem;
}

.modal-body {
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.info-text {
  margin-left: 8%;
  font-size: 2.5rem;
}
.info-exptext {
  font-weight: bold;
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

.exp-info {
  position: absolute;
  top: -30px;
  left: 0;
  color: var(--color-primary-green);
  font-size: 1.4rem;
  font-weight: bold;
  z-index: 3;
}

.exp-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0 2rem;
}

.exp-label {
  color: #3ccb7f;
  font-size: 1.6rem;
  font-weight: bold;
}

.exp-track {
  width: 250px;
  height: 25px;
  background-color: #e6f8ee;
  border-radius: 20px;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background-color: #3ccb7f;
  width: 0%;
  border-radius: 10px;
}
</style>
