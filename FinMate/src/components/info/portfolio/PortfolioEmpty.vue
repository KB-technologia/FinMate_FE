<script setup>
import { ref } from 'vue';
import PortfolioModal from './PortfolioModal.vue';

const showWriteModal = ref(false);
const emit = defineEmits(['save']);

function handleSave(updatedData) {
  emit('save', updatedData);
  showWriteModal.value = false;
}
</script>

<template>
  <div class="empty-container">
    <h2 class="title">아직 포트폴리오를 작성하지 않으셨군요!</h2>
    <div class="content-wrapper">
      <div class="chart-box">
        <img src="@/assets/images/products/blurrychart.png" class="chart-img" />
        <img src="@/assets/images/icons/lock.png" class="lock-icon" />
      </div>
      <div class="kiwi-wrapper">
        <img
          src="@/assets/images/icons/portfolioinfo.png"
          class="speech-bubble"
        />
        <img src="@/assets/images/logos/infokiwi.png" class="kiwi" />
      </div>
    </div>

    <button class="create-btn" @click="showWriteModal = true">
      포트폴리오 작성하기
    </button>
    <PortfolioModal
      v-if="showWriteModal"
      :mode="'write'"
      @close="showWriteModal = false"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.empty-container {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
}

.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
}

.chart-box {
  position: relative;
  width: 40%;
  right: 15%;
}

.chart-img {
  width: 120%;
  border-radius: 10px;
}

.lock-icon {
  position: absolute;
  top: 50%;
  left: 57%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 30%;
}

.kiwi-wrapper {
  position: relative;
  width: 20vw;
  height: 60vh;
}

.kiwi,
.speech-bubble {
  max-width: 100%;
  height: auto;
  position: absolute;
}

.kiwi {
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}

.speech-bubble {
  left: 65%;
  top: 10%;
  transform: translateX(-50%, -50%);
  z-index: 999;
}

.create-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #555;
  border: none;
  border-radius: 10px;
}

.create-btn:hover {
  background-color: #333;
}
</style>
