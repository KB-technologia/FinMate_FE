<template>
  <TopNavigationBar />
  <div class="mypage-container">
    <Sidebar />
    <RightPanel :scroll="true">
      <div class="panel-inner">
        <div class="my-products-header">
          <h2 class="title">{{ userName }} 님의 보유 상품</h2>
          <CategoryFilterBar
            v-model="selectedCategory"
            :categories="categories"
          />
        </div>
        <p class="subtitle-left">
          총 <span class="highlight">{{ userProductList.length }}</span
          >개의 상품을 보유 중이에요!
        </p>

        <div class="product-container">
          <UserProductCard
            v-for="(item, index) in filteredProducts"
            :key="index"
            :icon="item.icon"
            :type="item.type"
            :product="item.product"
          />
        </div>
      </div>
    </RightPanel>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import Sidebar from "@/components/info/Sidebar.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import CategoryFilterBar from "@/components/info/CategoryFilterBar.vue";
import UserProductCard from "@/components/info/UserProductCard.vue";
import depositIcon from "@/assets/images/products/deposit.png";
import savingIcon from "@/assets/images/products/saving.png";
import fundIcon from "@/assets/images/products/fund.png";

const selectedCategory = ref("all");

const userName = "홍길동";

const categories = [
  { label: "전체", value: "all" },
  { label: "예금", value: "예금" },
  { label: "적금", value: "적금" },
  { label: "펀드", value: "펀드" },
];

// TODO: api 연동(API 연동 전용 mock 데이터)
const userProductList = [
  {
    type: "예금",
    icon: depositIcon,
    product: {
      name: "스마트정기예금",
      bank: "KB 국민은행",
      amount: "1,000,000원",
      rate: "연 2.3%",
      start: "2025-05-01",
      end: "2026-05-01",
    },
  },
  {
    type: "적금",
    icon: savingIcon,
    product: {
      name: "자유적립적금",
      bank: "우리은행",
      amount: "500,000원",
      rate: "연 2.8%",
      start: "2025-04-10",
      end: "2026-04-10",
    },
  },
  {
    type: "펀드",
    icon: fundIcon,
    product: {
      name: "글로벌테크펀드",
      bank: "NH 투자증권",
      amount: "2,000,000원",
      rate: "변동수익 (최근 +5.2%)",
      start: "2025-03-20",
      end: "제한 없음",
    },
  },
  {
    type: "예금",
    icon: depositIcon,
    product: {
      name: "비대면전용예금",
      bank: "카카오뱅크",
      amount: "2,000,000원",
      rate: "연 2.45%",
      start: "2025-07-01",
      end: "2026-07-01",
    },
  },
  {
    type: "적금",
    icon: savingIcon,
    product: {
      name: "매일적금",
      bank: "IBK 기업은행",
      amount: "300,000원",
      rate: "연 3.0%",
      start: "2025-06-01",
      end: "2026-06-01",
    },
  },
];

const filteredProducts = computed(() => {
  if (selectedCategory.value === "all") return userProductList;
  return userProductList.filter((item) => item.type === selectedCategory.value);
});
</script>

<style scoped>
.mypage-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}

.my-products-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.panel-inner {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: var(--font-wanted);
}

.subtitle {
  text-align: left;
  margin-bottom: 1.8rem;
  font-family: var(--font-wanted);
  color: var(--color-dark-gray);
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: underline;
  font-style: italic;
}

.subtitle-left {
  text-align: left;
  font-family: var(--font-wanted);
  color: var(--color-dark-gray);
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: underline;
  font-style: italic;
  margin-bottom: 2rem;
  margin-left: 0.5rem; /* 적당한 좌측 정렬 느낌 주기 */
}

.highlight {
  color: var(--color-orange);
  font-weight: bold;
  font-size: 1.25rem;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
</style>
