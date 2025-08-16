<template>
  <div class="Product-Container">
    <div v-if="isLoading" class="spinner-wrapper">
      <div class="loader"></div>
    </div>
    <div v-else>
      <div v-if="!random && products.length > 0" class="Product-Text">
        사용자 맞춤 추천 상품
      </div>
      <div v-if="random && products.length > 0" class="Product-Text">
        랜덤 추천 상품
      </div>

      <div class="button-wrapper" v-if="products.length > 0">
        <button class="detail-button" @click="goToProducts">
          <PackageSearch class="icon-large" /> 나의 추천 아이템 보러 가기
        </button>
      </div>

      <div v-if="isLoggedIn && products.length == 0" class="Product-Text"></div>
      <div class="foodstuffs">
        <img
          v-if="products.length == 0"
          class="moving-image"
          src="@/assets/images/etc/flying.png"
          alt="moving"
        />
        <!-- <div v-if="products.length == 0">
          <div class="no-products" @click="handleClick">
            <p class="no-proudcts-text">
              사용자 맞춤 추천 상품을 위해 테스트를 진행해주세요!
            </p>
          </div>
        </div> -->
        <div class="button-container" v-if="products.length > 0">
          <div
            @click="prev"
            :class="['arrow-button', { disabled: currentIndex === 0 }]"
          >
            ◀
          </div>
          <div class="mainbody">
            <div class="CardContainer">
              <MainProductCard
                v-for="(item, index) in visibleProducts"
                :key="index"
                :product="item"
              />
            </div>
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
      </div>
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
const random = ref(false);
const products = ref([]);
const isLoading = ref(true);
onMounted(async () => {
  try {
    isLoading.value = true;
    if (isLoggedIn.value) {
      const allResult = await getAllRecommendations();
      console.log('✅ 전체 추천 결과:', allResult.data);
      products.value = allResult.data;
    } else {
      const randomResult = await getRandomRecommendation();
      console.log('✅ 랜덤 추천 결과:', randomResult.data);
      products.value = randomResult.data;
      random.value = true;
    }
  } catch (error) {
    console.error('❌ 추천 상품 요청 실패:', error.status);
    if (error.status == 500) {
      const randomResult = await getRandomRecommendation();
      console.log('✅ 랜덤 추천 결과:', randomResult.data);
      products.value = randomResult.data;
      random.value = true;
    }
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
  gap: 10vh;
}

.CardContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 3vh;
  padding: 3vh;
}

.Product-Container {
  width: 200vh;
  height: 75vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-wanted);
  align-items: center;
}

.Product-Text {
  margin-top: 2vh;
  color: var(--color-black);
  font-weight: var(--font-weight-bold);
  font-size: 3rem;
  text-align: center;
}

.foodstuffs {
  background: url('@/assets/images/etc/soil.png') no-repeat center;
  background-size: 100% 100%;
  width: 200vh;
  height: 75vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-wanted);
  align-items: center;
  margin-top: 1vh;
}
.mainbody {
  margin-top: 4vh;
}
.CardContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 95%;
  transform: scale(1.1);
}

.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.detail-button {
  width: 15vw;
  height: 5vh;
  border-radius: 3.5vh;
  border: 0.2vh solid var(--color-light-gray);
  color: var(--color-black);
  background-color: var(--color-white);
  font-weight: var(--font-weight-medium);
  transition: all 0.1s ease;
  margin-top: 3.5vh;
  align-items: center;
  justify-content: center;
  display: flex;
}

.detail-button:hover {
  background: var(--btn-gradient);
  border: 0.2vh solid var(--btn-gradient);
  color: var(--color-white);
  cursor: pointer;
  box-shadow: 0 0.2vh 0.3vw var(--color-light-gray);
  transform: translateY(-0.5vh);
  opacity: 1;
  background-clip: padding-box;
}

.icon-large {
  width: 2vw;
  height: 2vh;
}

.arrow-button {
  color: var(--color-black);
  font-size: 3.5rem;
  border-radius: 1vh;
  cursor: pointer;
  user-select: none;
  margin-top: 5vh;
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

.no-products {
  width: 17vw;
  height: 40vh;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;
  transform: scale(1.1);
  font-family: var(--font-wanted);
  margin-top: 12vh;
}

.no-products:hover {
  cursor: pointer;
  transform: translateY(-0.8vh);
}

.no-proudcts-text {
  width: 10vw;
  margin-bottom: 10vh;
  text-align: center;
  font-weight: var(--font-weight-bold);
}

.moving-image {
  position: relative;
  display: block;
  width: 20vw;
  margin-top: 8vh;
  z-index: -1;
  animation: moveLeftToRight 8s linear infinite;
  will-change: transform;
}

/* translateX로 좌→우 이동 */
@keyframes moveLeftToRight {
  0% {
    transform: translateX(-60vw);
  }
  100% {
    transform: translateX(60vw);
  }
}
</style>
