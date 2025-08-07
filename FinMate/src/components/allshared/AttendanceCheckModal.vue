<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <h2 class="welcome">
        <strong>{{ userName }}님, 환영합니다!</strong>
      </h2>

      <p class="streak">
        연속 출석 일수
        <span class="highlight">{{ currentAttendance }}</span
        >일
      </p>

      <div class="attendance-grid">
        <div v-for="day in 7" :key="day" class="day-box">
          <img
            v-if="day <= currentAttendance"
            src="@/assets/images/icons/stamp-on.png"
            alt="출석 완료"
          />
          <img
            v-else
            src="@/assets/images/icons/stamp-off.png"
            alt="출석 예정"
          />
          <p>{{ day }}일째</p>
        </div>
      </div>

      <button class="attend-button" @click="handleAttendance">출석하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { postAttendance } from '@/api/main/main.js';

const props = defineProps({
  userName: String,
  attendanceDays: Number,
});

const currentAttendance = ref(props.attendanceDays);

const handleAttendance = async () => {
  try {
    const result = await postAttendance();
    console.log('✅ 출석 성공:', result);

    if (result === 200) {
      console.log('🎯 조건 통과!');
      currentAttendance.value++;
    }
  } catch (error) {
    console.error('❌ 출석 실패:', error);
  }
};
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
  width: 60vw;
  height: 40vh;
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

.attend-button {
  margin-top: 3vh;
  width: 15vw;
  height: 5vh;
  border: 0.3vh solid #ccc;
  border-radius: 2vh;
  transition: all 0.1s ease;
}

.attend-button:hover {
  border: none;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-white);
  background-color: var(--color-main-button);
  box-shadow: 0 0.2vh 0.3vw #ccc;
  transform: translateY(-0.5vh);
}
</style>
