<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <h2 class="welcome">
        <strong>{{ userName }}님, 환영합니다!</strong>
      </h2>

      <p class="streak">
        연속 출석 일수
        <span class="highlight">{{ attendanceDays }}</span
        >일
      </p>

      <div class="attendance-grid">
        <div v-for="day in 7" :key="day" class="day-box">
          <img
            v-if="day <= attendanceDays"
            src="@/assets/images/stamp-on.png"
            alt="출석 완료"
          />
          <img v-else src="@/assets/images/stamp-off.png" alt="출석 예정" />
          <p>{{ day }}일째</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: String,
  attendanceDays: Number,
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background-color: var(--color-modal-bg);
  border-radius: 2vh;
  padding: 3vh;
  width: 40vw;
  height: 30vh;
  max-width: 90vw;
  text-align: center;
  position: relative;
  z-index: 10000;
  opacity: 1;
  display: block;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.streak {
  font-size: 18px;
  margin-bottom: 25px;
  color: #666;
}

.highlight {
  color: var(--color-orange);
  font-weight: bold;
  font-size: 22px;
}

.attendance-grid {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.day-box {
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: var(--color-white);
  border-radius: 5px;
}

.day-box img {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.day-box p {
  font-weight: bold;
}
</style>
