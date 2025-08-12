<template>
  <div class="Product-Container">
    <div v-if="isLoading" class="spinner-wrapper">
      <div class="loader"></div>
    </div>
    <div v-else class="Product-Container">
      <div v-if="isLoggedIn" class="Product-Text">사용자 맞춤 추천 상품</div>
      <div v-if="!isLoggedIn" class="Product-Text">랜덤 추천 상품</div>
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
            :key="`product-${item.id}-${currentIndex}-${index}`"
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

const products = ref([]);
const isLoading = ref(true);
onMounted(async () => {
  try {
    isLoading.value = true;
    if (isLoggedIn.value) {
      const allResult = await getAllRecommendations();
      console.log('✅ 전체 추천 결과:', allResult);
      products.value = allResult;
    } else {
      const randomResult = await getRandomRecommendation();
      console.log('✅ 랜덤 추천 결과:', randomResult);
      products.value = randomResult;
    }
  } catch (error) {
    console.error('❌ 추천 상품 요청 실패:', error);
  } finally {
    isLoading.value = false;
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
  margin-bottom: 1vh;
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
  height: 63vh;
  border: 0.2vh solid var(--color-light-gray);
  background-color: var(--color-product-color);
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
  border: 0.2vh solid var(--color-light-gray);
  color: var(--color-black);
  background-color: var(--color-white);
  font-weight: var(--font-weight-medium);
  transition: all 0.1s ease;
}

.detail-button:hover {
  background-color: var(--color-black);
  color: var(--color-white);
  cursor: pointer;
  box-shadow: 0 0.2vh 0.3vw var(--color-light-gray);
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

.spinner-wrapper {
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 0.8vh solid var(--color-white);
  border-top: 0.8vh solid var(--color-main-button);
  border-radius: 50%;
  width: 10vh;
  height: 10vh;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
