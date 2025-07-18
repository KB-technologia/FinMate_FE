<template>
  <div class="Product-Container">
    <span class="Product-Text">추천 상품</span>

    <div class="button-container">
      <button @click="prev" :disabled="currentIndex === 0">◀</button>

      <div class="CardContainer">
        <MainProductCard
          v-for="(item, index) in visibleProducts"
          :key="index"
          :product="item"
        />
      </div>

      <button @click="next" :disabled="currentIndex + 4 >= products.length">
        ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MainProductCard from './MainProductCard.vue';

const products = ref([
  {
    name: '미래성장 적립예금',
    bank: 'KB국민은행',
    type: '정기예금',
    risk: '낮음',
    return: '3.1%',
  },
  {
    name: '청년 우대 적금',
    bank: '신한은행',
    type: '적금',
    risk: '중간',
    return: '3.8%',
  },
  {
    name: '소득공제 펀드',
    bank: 'NH농협은행',
    type: '펀드',
    risk: '높음',
    return: '6.2%',
  },
  {
    name: '안심 채권',
    bank: '우리은행',
    type: '채권',
    risk: '낮음',
    return: '2.3%',
  },
  {
    name: '글로벌 ETF',
    bank: '하나은행',
    type: 'ETF',
    risk: '높음',
    return: '7.5%',
  },
  {
    name: '정기적금 24개월',
    bank: '카카오뱅크',
    type: '적금',
    risk: '중간',
    return: '3.4%',
  },
  {
    name: 'IT 성장주 펀드',
    bank: '토스뱅크',
    type: '펀드',
    risk: '매우 높음',
    return: '10.2%',
  },
  {
    name: '중소기업 채권',
    bank: 'SC제일은행',
    type: '채권',
    risk: '중간',
    return: '4.5%',
  },
]);

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
  height: 50vh;
  background-color: #2e404c;
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
}

.Product-Text {
  margin-top: 2vh;
  color: white;
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
</style>
