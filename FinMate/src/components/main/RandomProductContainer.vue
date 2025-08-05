<template>
  <div class="Product-Container">
    <span class="Product-Text">추천 상품</span>

    <div class="button-container">
      <div
        @click="prev"
        :class="['arrow-button', { disabled: currentIndex === 0 }]"
      >
        ◀
      </div>

      <div class="CardContainer">
        <MainProductCard
          v-for="(item, index) in visibleProducts"
          :key="index"
          :product="item"
        />
      </div>

      <div
        @click="next"
        :class="[
          'arrow-button',
          { disabled: currentIndex + 4 >= products.length },
        ]"
      >
        ▶
      </div>
    </div>
    <button class="detail-button" @click="goToProducts">
      <PackageSearch class="icon-large" /> 나의 추천 아이템 보러 가기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainProductCard from './MainProductCard.vue';
import { PackageSearch } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth/auth.js';
import {
  getAllRecommendations,
  getRandomRecommendation,
} from '@/api/main/main.js';

const router = useRouter();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);

const products = ref([]); // 더미 데이터 제거

onMounted(async () => {
  try {
    if (isLoggedIn.value) {
      const allResult = await getAllRecommendations();
      console.log('✅ 전체 추천 결과:', allResult);
      products.value = allResult; // 실제 응답값 사용
    } else {
      const randomResult = await getRandomRecommendation();
      console.log('✅ 랜덤 추천 결과:', randomResult);
      products.value = randomResult;
    }
  } catch (error) {
    console.error('❌ 추천 상품 요청 실패:', error);
  }
});

const goToProducts = () => {
  router.push('/products');
};

const currentIndex = ref(0);

const visibleProducts = computed(() =>
  products.value.slice(currentIndex.value, currentIndex.value + 4)
);

const prev = () => {
  if (currentIndex.value >= 4) currentIndex.value -= 4;
};

const next = () => {
  if (currentIndex.value + 4 < products.value.length) currentIndex.value += 4;
};
</script>

<style scoped>
.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.CardContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 3vh;
}

.Product-Container {
  width: 95vw;
  height: 65vh;
  border: 0.2vh solid var(--color-light-gray);
  background-color: var(--color-more-light-blue);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-wanted);
  align-items: center;
}

.Product-Text {
  margin-top: 2vh;
  color: var(--color-black);
  font-weight: var(--font-weight-bold);
  font-size: 2rem;
  text-align: center;
}

.CardContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
  gap: 2vw;
}

.detail-button {
  width: 15vw;
  height: 5vh;
  border-radius: 2vh;
  border: 0.2vh solid var(--color-light-blue);
  color: var(--color-black);
  background-color: var(--color-white);
  font-weight: var(--font-weight-medium);
  transition: all 0.1s ease;
}

.detail-button:hover {
  background-color: var(--color-light-blue);
  color: var(--color-white);
  cursor: pointer;
  box-shadow: 0 0.2vh 0.3vw var(--color-light-blue);
  transform: translateY(-0.5vh);
}

.icon-large {
  width: 2vw;
  height: 2vh;
  margin-right: 0.3rem;
}

.arrow-button {
  color: var(--color-black);
  font-size: 2rem;
  border-radius: 1vh;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.arrow-button.disabled {
  pointer-events: none;
  opacity: 0.3;
  cursor: default;
}
</style>
