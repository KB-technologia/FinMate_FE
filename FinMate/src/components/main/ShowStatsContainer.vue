<template>
  <!-- 로그인 상태일 때: 통계 그래프 -->
  <div v-if="isLoggedIn" class="show-stats-container">
    <div class="stat-row" v-for="(stat, index) in statsLeft" :key="index">
      <span class="stat-label">{{ stat.label }}</span>
      <div class="stat-bar-outer">
        <div
          class="stat-bar-fill"
          :style="{ width: stat.percent + '%', backgroundColor: stat.color }"
        ></div>
      </div>
    </div>
    <div class="stat-row" v-for="(stat, index) in statsRight" :key="index">
      <span class="stat-label">{{ stat.label }}</span>
      <div class="stat-bar-outer">
        <div
          class="stat-bar-fill"
          :style="{ width: stat.percent + '%', backgroundColor: stat.color }"
        ></div>
      </div>
    </div>
    <button class="detail-button">자세히 보기</button>
  </div>

  <!-- 비로그인 상태일 때: 랜덤 이미지 & 문구 -->
  <div v-if="!isLoggedIn" class="show-stats-container">
    <div class="description">
      당신의 투자 성향은 어떤 동물일까요? 지금 로그인해서 확인해보세요!
    </div>
    <div class="image-wrapper">
      <img
        v-for="(img, index) in currentImages"
        :key="index"
        :src="img"
        class="animal-image"
        :class="{ 'fade-in': animate }"
        alt="animal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

// 로그인 상태일 때 보여줄 stat 데이터
const statsLeft = [
  { label: '가치관', percent: 90, color: 'red' },
  { label: '속도', percent: 70, color: 'blue' },
  { label: '운/전략', percent: 85, color: 'yellow' },
];

const statsRight = [
  { label: '재정', percent: 75, color: 'orange' },
  { label: '모험 성향', percent: 80, color: 'green' },
];

// 비로그인 상태일 때 사용할 이미지 리스트
const images = [
  new URL('@/assets/images/cat.png', import.meta.url).href,
  new URL('@/assets/images/capybara.png', import.meta.url).href,
  new URL('@/assets/images/desertfox.png', import.meta.url).href,
  new URL('@/assets/images/flyingsquirrel.png', import.meta.url).href,
  new URL('@/assets/images/kiwibird.png', import.meta.url).href,
  new URL('@/assets/images/koala.png', import.meta.url).href,
  new URL('@/assets/images/panda.png', import.meta.url).href,
  new URL('@/assets/images/penguin.png', import.meta.url).href,
  new URL('@/assets/images/redpanda.png', import.meta.url).href,
  new URL('@/assets/images/seaotter.png', import.meta.url).href,
];

const currentImages = ref([]);
const animate = ref(true);

function getRandomImages() {
  const shuffled = images.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
}

onMounted(() => {
  currentImages.value = getRandomImages();
  setInterval(() => {
    animate.value = false;
    setTimeout(() => {
      currentImages.value = getRandomImages();
      animate.value = true;
    }, 400);
  }, 2500);
});
</script>

<style scoped>
.show-stats-container {
  width: 68vw;
  height: 30vh;
  background-color: #ffeab4;
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2vh;
  overflow: hidden;
}

/* 📊 로그인 상태 - 그래프 */
.stat-row {
  width: 90%;
  display: flex;
}
.stat-label {
  width: 10vw;
  font-weight: bold;
  font-size: 1rem;
  text-align: right;
  margin-right: 1vw;
}
.stat-bar-outer {
  flex: 1;
  height: 2.5vh;
  background-color: white;
  border-radius: 2vh;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 2vh;
  transition: width 0.5s ease;
}
.detail-button {
  width: 10vw;
  height: 4vh;
  background-color: #eaddbb;
  border: none;
  border-radius: 2vh;
  font-weight: bold;
  cursor: pointer;
}

.detail-button:hover {
  box-shadow: 0 1vh 1vw rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}

/* 🐾 비로그인 상태 - 랜덤 이미지 & 설명 */
.description {
  font-size: 2rem;
  text-align: center;
  padding: 2rem;
}
.image-wrapper {
  display: flex;
  gap: 2vw;
}
.animal-image {
  height: 12vh;
  width: auto;
  opacity: 0.4;
  transform: scale(0.9);
  transition: all 0.4s ease;
}
.animal-image.fade-in {
  opacity: 1;
  transform: scale(1);
}
</style>
