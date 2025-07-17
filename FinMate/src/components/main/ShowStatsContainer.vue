<template>
  <div class="show-stats-container">
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
import { ref, onMounted } from 'vue';

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
  display: flex;
  flex-direction: column;

  align-items: center;
  background-color: #ffeab4;
  border-radius: 2vh;
  overflow: hidden;
}
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
